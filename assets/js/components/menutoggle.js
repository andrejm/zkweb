jQuery(document).ready(function($) {
	$( '.js-menutoggle').on( 'click', function() {
		$( '.js-site-header' ).toggleClass( 'menuopen' );
	});
});