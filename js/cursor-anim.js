let cursor = document.querySelector('.cursor');
let cursorOn = document.querySelector("#sectionthree");
let contentOn = document.querySelectorAll('.content-inc');
let screens = document.querySelectorAll('.screen');

window.addEventListener('mousemove', cursorAnimation);

function cursorAnimation(e) {
    cursor.style.top = e.pageY + 'px';
    cursor.style.left = e.pageX + 'px';
}

cursorOn.addEventListener('mouseleave', () => {
    cursor.classList.remove('cursor-grow');
});

cursorOn.addEventListener('mouseover', () => {
    cursor.classList.add('cursor-grow');
});

screens.forEach((screen) => {
    screen.addEventListener('mouseover', () => {
        cursor.classList.remove('cursor-color-change');
    });

    screen.addEventListener('mouseleave', () => {
        cursor.classList.add('cursor-color-change');
    });
});

contentOn.forEach((cont) => {
    cont.addEventListener('mouseover', () => {
        cont.classList.add('font-size-inc');
    });

    cont.addEventListener('mouseleave', () => {
        cont.classList.remove('font-size-inc');
    });
});