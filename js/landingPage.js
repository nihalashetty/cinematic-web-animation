{

    //This whole file deals about animation on hover and on load and on scroll.
    //for all maths i referd one artical but forgot the link and name. ones i get ill update here
    const body = document.body;

    //Couldnt add random numbers in css so used this trick
    const randomDegreeArray = [10,30,-10,-50,25,0,20,-20];

    const MathUtils = {
        lerp: (a, b, n) => (1 - n) * a + n * b,
        distance: (x1,y1,x2,y2) => Math.hypot(x2-x1, y2-y1),
        getRandomFloat: (min, max) => (Math.random() * (max - min) + min).toFixed(2)
    }

    let winsize;
    const calcWinsize = () => winsize = {width: window.innerWidth, height: window.innerHeight};
    calcWinsize();
    window.addEventListener('resize', calcWinsize);

    const getMousePos = (ev) => {
        let posx = 0;
        let posy = 0;
        if (!ev) ev = window.event;
        if (ev.pageX || ev.pageY) {
            posx = ev.pageX;
            posy = ev.pageY;
        }
        else if (ev.clientX || ev.clientY) 	{
            posx = ev.clientX + body.scrollLeft + docEl.scrollLeft;
            posy = ev.clientY + body.scrollTop + docEl.scrollTop;
        }
        return {x: posx, y: posy};
    }

    let mousePos = lastMousePos = cacheMousePos = {x: 0, y: 0};
    
    window.addEventListener('mousemove', ev => mousePos = getMousePos(ev));
    
    const getMouseDistance = () => MathUtils.distance(mousePos.x,mousePos.y,lastMousePos.x,lastMousePos.y);

    class Image {
        constructor(el) {
            this.DOM = {el: el};
            this.defaultStyle = {
                rotation: 0,
                x: 0,
                y: 0,
                opacity: 0
            };
            this.getRect();
            this.initEvents();
        }
        initEvents() {
            window.addEventListener('resize', () => this.resize());
        }
        resize() {
            TweenMax.set(this.DOM.el, this.defaultStyle);
            this.getRect();
        }
        getRect() {
            this.rect = this.DOM.el.getBoundingClientRect();
        }
        isActive() {
           //I just forgot why i added this
        }
        setRatio() {
            this.DOM.el.style.setProperty('--img-maxwidth', `${MathUtils.getRandomFloat(150,350)}px`);
            this.getRect();
        }
    }

    class ImageTrail {
        constructor() {
            this.DOM = {content: document.querySelector('.content')};
            this.images = [];
            [...this.DOM.content.querySelectorAll('img')].forEach(img => this.images.push(new Image(img)));
            this.imagesTotal = this.images.length;
            this.imgPosition = 0;
            this.zIndexVal = 1;
            this.threshold = 80;
            requestAnimationFrame(() => this.render());
        }
        render() {
            let distance = getMouseDistance();
            cacheMousePos.x = MathUtils.lerp(cacheMousePos.x || mousePos.x, mousePos.x, 0.1);
            cacheMousePos.y = MathUtils.lerp(cacheMousePos.y || mousePos.y, mousePos.y, 0.1);

            if ( distance > this.threshold ) {
                this.showNextImage();

                ++this.zIndexVal;
                this.imgPosition = this.imgPosition < this.imagesTotal-1 ? this.imgPosition+1 : 0;
                
                lastMousePos = mousePos;
            }

            let isIdle = true;
            for (let img of this.images) {
                if ( img.isActive() ) {
                    isIdle = false;
                    break;
                }
            }
            if ( isIdle && this.zIndexVal !== 1 ) {
                this.zIndexVal = 1;
            }

            requestAnimationFrame(() => this.render());
        }
        showNextImage() {
            const img = this.images[this.imgPosition];
            img.setRatio();
            TweenMax.killTweensOf(img.DOM.el);

            new TimelineMax()
            .set(img.DOM.el, {
                startAt: {opacity: 0},
                opacity: 1,
                rotation: randomDegreeArray[Math.floor(Math.random()*randomDegreeArray.length)],
                width: 100,
                height: 100,
                zIndex: this.zIndexVal,
                x: cacheMousePos.x - img.rect.width/2,
                y: cacheMousePos.y - img.rect.height/2
            }, 0)
            .to(img.DOM.el, 1.6, {
                ease: Expo.easeOut,
                x: mousePos.x - img.rect.width/2,
                y: mousePos.y - img.rect.height/2,
                scale: Math.random() * 1,
            }, 0)
            .to(img.DOM.el, 0.8, {
                ease: Power1.easeOut,
                opacity: 0
            }, 0.6)
            .to(img.DOM.el, 1, {
                ease: Quint.easeOut,
                x: `+=${MathUtils.getRandomFloat(-1*(winsize.width + img.rect.width/2), winsize.width + img.rect.width/2)}`,
                y: `+=${MathUtils.getRandomFloat(-1*(winsize.height + img.rect.height/2), winsize.height + img.rect.height/2)}`,
                rotation: MathUtils.getRandomFloat(-40,40)
            }, 0.6);
        }
    }

    const preloadImages = () => {
        return new Promise((resolve, reject) => {
            imagesLoaded(document.querySelectorAll('.content__img'), resolve);
        });
    };
    
    preloadImages().then(() => {
        document.body.classList.remove('loading');
        new ImageTrail();
    });
}

gsap.from('#sectionone h1', 2, {
    y: 1000,
    delay: 8.5
});

gsap.from('.content__title', 2, {
    y: 1000,
    delay: 9
});

gsap.from("#glassoMorphism-img", 2, {
    y: 1000,
    delay: 10
});


//Added one cool image changing effect, but it was not looking good so i just comented, in html you may not find the code, just check the loop, you will understand why i added
// gsap.to("#glassoMorphism-img", 2, {
//     y: 0,
//     repeat: 1,
//     yoyo: true,
//     delay: 12
// });

// setTimeout(() => {
//     let count = 1;
//     let refreshIntervalId = setInterval(() => {
//         if (count > 7) {
//             clearInterval(refreshIntervalId);
//         }

//         document.getElementById("glassoMorphism-img").src=`images/ToyFace${count++}.png`;
//     }, 4000);
// }, 10100);
