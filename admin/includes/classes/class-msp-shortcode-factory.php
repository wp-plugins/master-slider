<?php

/**
* 
*/
class MSP_Shortcode_Factory {
	
	public  $parsed_slider_data = array();
	private $post_id;
	private $post_slider_args   = array();

	function __construct() {
		
	}

	public function set_data( $parsed_data ) {
		
		$this->parsed_slider_data = $parsed_data;
	}

	/**
	 * Get generated ms_slider shortcode
	 * 
	 * @return string  [ms_slider] shortcode or empty string on error
	 */
	public function get_ms_slider_shortcode( $the_content = '' ){

		if( ! isset( $this->parsed_slider_data['setting'] ) )
			return '';

		$shortcode_name = 'ms_slider';

		// get the parsed slider setting
		$setting = $this->parsed_slider_data['setting'];

		// create ms_slider shortcode
		$attrs = '';
		foreach ( $setting as $attr => $attr_value ) {
			$attrs .= sprintf( '%s="%s" ', $attr, esc_attr( $attr_value ) );
		}

		// get ms_slides shortcodes(s)
		$the_content = $this->get_ms_slides_shortcode();

		return sprintf( '[%1$s %2$s]%3$s%4$s[/%1$s]', $shortcode_name, $attrs, "\n", $the_content );
	}



	public function get_ms_slide_shortcode( $slide ){

		if( ! isset( $slide ) || empty( $slide ) )
			return '';

		$shortcode_name = 'ms_slide';

		// stores shortcode attributes
		$attrs = '';

		foreach ( $slide as $attr => $attr_value ) {
			if( 'layers' == $attr || 'layer_ids' == $attr || 'ishide' == $attr )
				continue;

			if( 'src' == $attr && in_array( $this->parsed_slider_data['setting']['slider_type'], array( "flickr", "facebook", "instagram" ) ) ) {
				$attrs .= sprintf( '%s="%s" ', $attr, '{{image}}' );

			} elseif( 'alt' == $attr && in_array( $this->parsed_slider_data['setting']['slider_type'], array( "flickr", "facebook", "instagram" ) ) ) {
				$attrs .= sprintf( '%s="%s" ', $attr, '{{title}}' );

			} elseif( 'title' == $attr && in_array( $this->parsed_slider_data['setting']['slider_type'], array( "flickr", "facebook", "instagram" ) ) ) {
				$attrs .= sprintf( '%s="%s" ', $attr, '{{title}}' );

			} elseif( 'thumb' == $attr && ! empty( $attr_value ) && in_array( $this->parsed_slider_data['setting']['slider_type'], array( "flickr", "facebook", "instagram" ) ) ) {
				$attrs .= sprintf( '%s="%s" ', $attr, '{{thumb}}' );

			} else {
				$attrs .= sprintf( '%s="%s" ', $attr, esc_attr( $attr_value ) );
			}
		}

		if( 'true' == $this->parsed_slider_data['setting']['crop'] ){
			$attrs .= sprintf( '%s="%s" ', 'crop_width' , esc_attr( $this->parsed_slider_data['setting']['width']  ) );
			$attrs .= sprintf( '%s="%s" ', 'crop_height', esc_attr( $this->parsed_slider_data['setting']['height'] ) );
		}

		// collect all shortcode output
		$the_content = '';

		// generate slide_info shortcode if slideinfo control is added
		if( 'image-gallery' == $this->parsed_slider_data['setting']['template'] || 
		    ( isset( $this->parsed_slider_data['setting']['slideinfo'] ) && 'true' == $this->parsed_slider_data['setting']['slideinfo'] ) 
		   ){
			if( ! empty( $slide['info'] ) )
				$the_content .= $this->get_ms_slide_info_shortcode( $slide['info'] );
			else
				$the_content .= $this->get_ms_slide_info_shortcode( "&nbsp;" );
		}

		return sprintf( '[%1$s %2$s]%4$s%3$s[/%1$s]%4$s', $shortcode_name, $attrs, $the_content, "\n" );
	}



	public function get_ms_slides_shortcode() {

		if( ! isset( $this->parsed_slider_data['slides'] ) )
			return '';

		$slides = $this->parsed_slider_data['slides'];

		$shortcodes = '';

		foreach ( $slides as $slide ) {
			if( 'true' != $slide['ishide'] )
				$shortcodes .= $this->get_ms_slide_shortcode( $slide );
		}

		return $shortcodes;
	}



	public function get_ms_slide_info_shortcode( $the_content = '' ){

		if( empty( $the_content ) )
			return '';

		return sprintf( '[%1$s]%2$s[/%1$s]', 'ms_slide_info', $the_content )."\n";
	}


	public function do_template_tag( $matches ){
		if( ! isset( $matches['0'] ) )
			return $matches;

		$tag_name = preg_replace('/[{}]/', '', $matches['0'] );
		$tag_name = msp_get_template_tag_value( $tag_name, $this->post_id, $this->post_slider_args );
		
		return is_array( $tag_name ) ? implode( ',', $tag_name ) : $tag_name;
	}

}