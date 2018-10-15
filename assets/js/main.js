(function ($) {
	// $(document).foundation();
})(jQuery);

jQuery(document).ready(function($) {

	/*
	* Initialize Foundation Sites plugins
	*/

	// $(document).foundation();

	/*
	* SVG 4 everybody
	*/

	// svg4everybody({
	//     polyfill: true // polyfill <use> elements for External Content
	// });

});


/* Masonry gallery TODO move to sep file */
// init Masonry
var $grid = $('.gallery').masonry({
  itemSelector: '.gallery__item',
  // use element for option
  columnWidth: '.grid-sizer',
  percentPosition: true
});
// layout Masonry after each image loads
$grid.imagesLoaded().progress( function() {
  $grid.masonry('layout');
});
