<?php

/*----------------------------------------------------------------------------*
 * Compatibility for Visual Composer Plugin
 *----------------------------------------------------------------------------*/

if ( defined('WPB_VC_VERSION') ) {

	wpb_map( 
	    array(
			'name' 			=> __( 'Master Slider', MSWP_TEXT_DOMAIN ),
			'base' 			=> 'masterslider_pb',
			'class' 		=> '',
			'controls' 		=> 'full',
			'icon' 			=> 'icon-vc-msslider-el',
			'category' 		=> __( 'Content', MSWP_TEXT_DOMAIN ),
			'description' 	=> __( 'Add Master Slider', MSWP_TEXT_DOMAIN ),
			
			'params' => array(
				array(
			    	'type' 			=> 'textfield',
			    	'heading' 		=> __( 'Title ', MSWP_TEXT_DOMAIN ),
			    	'param_name' 	=> 'title',
			    	'value' 		=> '',
			    	'description' 	=> __( 'What text use as slider title. Leave blank if no title is needed', MSWP_TEXT_DOMAIN )
			    ),
			    array(
			    	'type' 			=> 'dropdown',
			    	'heading' 		=> __('Master Slider', MSWP_TEXT_DOMAIN ),
			    	'param_name' 	=> 'id',
			    	'value' 		=> get_masterslider_names( false ),
			    	'description' 	=> __( 'Select slider from list', MSWP_TEXT_DOMAIN )
			    ),
			    array(
			    	'type' 			=> 'textfield',
			    	'heading' 		=> __( 'Extra CSS Class Name', MSWP_TEXT_DOMAIN ),
			    	'param_name' 	=> 'class',
			    	'value' 		=> '',
			    	'description' 	=> __( 'If you wish to style particular element differently, then use this field to add a class name and then refer to it in your css file.', MSWP_TEXT_DOMAIN )
			    )
			)
		)
	);

}

/*----------------------------------------------------------------------------*/