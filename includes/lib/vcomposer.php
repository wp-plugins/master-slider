<?php

/*----------------------------------------------------------------------------*
 * Compatibility for Visual Composer Plugin
 *----------------------------------------------------------------------------*/

if ( defined('WPB_VC_VERSION') ) {

	wpb_map(
	    array(
			'name' 			=> __( 'Master Slider', 'master-slider' ),
			'base' 			=> 'masterslider_pb',
			'class' 		=> '',
			'controls' 		=> 'full',
			'icon' 			=> 'icon-vc-msslider-el',
			'category' 		=> __( 'Content', 'master-slider' ),
			'description' 	=> __( 'Add Master Slider', 'master-slider' ),

			'params' => array(
				array(
			    	'type' 			=> 'textfield',
			    	'heading' 		=> __( 'Title ', 'master-slider' ),
			    	'param_name' 	=> 'title',
			    	'value' 		=> '',
			    	'description' 	=> __( 'What text use as slider title. Leave blank if no title is needed', 'master-slider' )
			    ),
			    array(
			    	'type' 			=> 'dropdown',
			    	'heading' 		=> __('Master Slider', 'master-slider' ),
			    	'param_name' 	=> 'id',
			    	'value' 		=> get_masterslider_names( false ),
			    	'description' 	=> __( 'Select slider from list', 'master-slider' )
			    ),
			    array(
			    	'type' 			=> 'textfield',
			    	'heading' 		=> __( 'Extra CSS Class Name', 'master-slider' ),
			    	'param_name' 	=> 'class',
			    	'value' 		=> '',
			    	'description' 	=> __( 'If you wish to style particular element differently, then use this field to add a class name and then refer to it in your css file.', 'master-slider' )
			    )
			)
		)
	);

}

/*----------------------------------------------------------------------------*/
