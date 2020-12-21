//Was facing some problem while loading jquery to page, so created a separate one
jQuery(document).ready(function () {
    jQuery("#includedContent").load("landingPage.html"); 
    jQuery('#includeImageSlider').load("imgSliders.html");

    setTimeout(() => {
      jQuery('.doc-loader').remove();
    }, 10000);
});