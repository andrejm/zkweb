jQuery(document).ready(function($) {
	$('.gallery__item').magnificPopup({
		type: 'image',
		gallery: {
			enabled:true
		}
	});
});

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