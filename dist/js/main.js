'use strict';jQuery(document).ready(function($){$('.js-menutoggle').on('click',function(){$('.js-site-header').toggleClass('menuopen');});});
'use strict';jQuery(document).ready(function($){// Select all links with hashes
$('a[href*="#"]')// Remove links that don't actually link to anything
.not('[href="#"]').not('[href="#0"]').click(function(event){// On-page links
if(location.pathname.replace(/^\//,'')==this.pathname.replace(/^\//,'')&&location.hostname==this.hostname){// Figure out element to scroll to
var target=$(this.hash);target=target.length?target:$('[name='+this.hash.slice(1)+']');// Does a scroll target exist?
if(target.length){// Only prevent default if animation is actually gonna happen
event.preventDefault();$('html, body').animate({scrollTop:target.offset().top-60},1000,function(){// Callback after animation
// Must change focus!
var $target=$(target);$target.focus();if($target.is(":focus")){// Checking if the target was focused
return false;}else{$target.attr('tabindex','-1');// Adding tabindex for elements not focusable
$target.focus();// Set focus again
};});}}});});
'use strict';(function($){// $(document).foundation();
})(jQuery);jQuery(document).ready(function($){/*
	* Initialize Foundation Sites plugins
	*/// $(document).foundation();
/*
	* SVG 4 everybody
	*/// svg4everybody({
//     polyfill: true // polyfill <use> elements for External Content
// });
});/* Masonry gallery TODO move to sep file */// init Masonry
var $grid=$('.gallery').masonry({itemSelector:'.gallery__item',// use element for option
columnWidth:'.grid-sizer',percentPosition:true});// layout Masonry after each image loads
$grid.imagesLoaded().progress(function(){$grid.masonry('layout');});