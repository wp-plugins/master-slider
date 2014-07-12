<?php

// define( 'IFRAME_REQUEST', true );


echo '<div id="ms-preview-wrapper">';

if( isset( $_REQUEST['slider_params'] ) && ! empty( $_REQUEST['slider_params'] ) ) {

	$slider_params = $_REQUEST['slider_params'];
	$slider_shortcodes = msp_panel_data_2_ms_slider_shortcode( $slider_params );
	echo do_shortcode( $slider_shortcodes );

	// print slider custom css inline in live preview
	$parser = msp_get_parser();
    $parser->set_data( $slider_params );
    $slider_custom_css = $parser->get_styles();
    printf( "<!-- Custom slider styles -->\n<style>%s</style>", $slider_custom_css );

} elseif ( isset( $_REQUEST['slider_id'] ) && ! empty( $_REQUEST['slider_id'] ) ) {
	$slider_id = $_REQUEST['slider_id'];
	$slider_shortcodes = msp_get_ms_slider_shortcode_by_slider_id( $slider_id );
	echo do_shortcode( $slider_shortcodes );
	// print slider custom css inline in live preview
	printf( "<!-- Custom slider styles -->\n<style>%s</style>", msp_get_slider_custom_css( $slider_id ) );

} else {
	_e( 'Not found.', MSWP_TEXT_DOMAIN );
}


echo "</div>\n";






if ( isset( $_REQUEST['strip_wp'] ) ) {
?>
<style>
#adminmenuwrap,
#wpadminbar,
#adminmenuback,
#screen-meta,
#screen-meta-links,
#wpadminbar,
#querylist,
#wpfooter,
#wpbody-content > * {
	display:none;
}
#wpbody-content {
	padding-bottom: 0;
}

#wpcontent {
	margin-left:0;
}
html.wp-toolbar { 
	padding-top:0; 
}
#msp-main-wrapper { 
	margin:0; 
	display:block; 
}

</style>
<?php 
}

