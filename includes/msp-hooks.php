<?php


function msp_body_class( $classes ) {
	// add master slider spesific class to $classes array
	$classes[]      = '_masterslider';
	$classes['msl'] = '_ms_version_' . MSWP_AVERTA_VERSION;
	
	return $classes;
}

add_filter( 'body_class', 'msp_body_class' );