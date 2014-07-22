<?php

function after_master_slider_row_meta( $plugin_meta, $plugin_file, $plugin_data, $status ){
	if( MSWP_AVERTA_BASE_NAME == $plugin_file ) {
		$plugin_meta[] = '<a href="http://wordpress.org/support/view/plugin-reviews/' . MSWP_SLUG . '?rating=5#postform" target="_blank" title="' . esc_attr__( 'Rate this plugin', MSWP_TEXT_DOMAIN ) . '">' . __( 'Rate this plugin', MSWP_TEXT_DOMAIN ) . '</a>';
		$plugin_meta[] = '<a href="http://masterslider.com/doc/wp/free/#donate" target="_blank" title="' . esc_attr__( 'Donate', MSWP_TEXT_DOMAIN ) . '">' . __( 'Donate', MSWP_TEXT_DOMAIN ) . '</a>';		
	}
	return $plugin_meta;
}

add_filter( "plugin_row_meta", 'after_master_slider_row_meta', 10, 4 );