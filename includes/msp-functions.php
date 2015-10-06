<?php 
/**
 *
 * @package   MasterSlider
 * @author    averta [averta.net]
 * @license   LICENSE.txt
 * @link      http://masterslider.com
 * @copyright Copyright © 2014 averta
 */



/**
 * Displays master slider markup for specific slider ID
 * 
 * @param  int      $slider_id   the slider id
 * @return void
 */
if( ! function_exists( 'masterslider' ) ) {

    function masterslider( $slider_id, $args = NULL ){
        echo get_masterslider( $slider_id, $args = NULL );
    }

}


/**
 * Get master slider markup for specific slider ID
 * 
 * @param  int      $slider_id   the slider id
 * @return string   the slider markup
 */
if( ! function_exists( 'get_masterslider' ) ) {

    function get_masterslider( $slider_id, $args = NULL ){
        global $msp_instances;
        
        // through an error if slider id is not valid number
        if( ! is_numeric( $slider_id ) ) 
            return __( 'Invalid slider id. Master Slider ID must be a valid number.', 'master-slider' );

        // load masterslider script
        wp_enqueue_style ( 'masterslider-main');
        wp_enqueue_script( 'masterslider-core');

        $is_cache_enabled = ( 'on' == msp_get_setting( '_enable_cache', 'msp_general_setting', 'off' ) );
        
        // try to get cached copy of slider transient output
        if( ! $is_cache_enabled || false === ( $slider_output = msp_get_slider_transient( $slider_id ) ) || empty( $slider_output ) ) {
            $slider_output = msp_generate_slider_output( $slider_id, $is_cache_enabled );
            
        } elseif( $is_cache_enabled ) {
            $msp_instances = is_array( $msp_instances ) ? $msp_instances : array();
            $msp_instances[ $slider_id ][] = $slider_id; 
            // if there was same slider on one page generate new ones
            if( count( $msp_instances[ $slider_id ] ) > 1 ){
                $slider_output = msp_generate_slider_output( $slider_id );
            }
        }

        return apply_filters( 'masterslider_slider_content', $slider_output, $slider_id );
    }
}


/**
 * Convert panel data to ms_slider shortcode and return it
 * 
 * @param  string    $panel_data   a serialized string containing panel data object
 * @return string    ms_slider shortcode or empty string
 */
function msp_panel_data_2_ms_slider_shortcode( $panel_data, $slider_id = null ){
    if ( ! $panel_data ) 
        return '';

    $parser = msp_get_parser();
    $parser->set_data( $panel_data, $slider_id );
    $results = $parser->get_results();  

    // shortcode generation
    $sf = msp_get_shortcode_factory();
    $sf->set_data( $results );
    $shortcodes = $sf->get_ms_slider_shortcode();
    return $shortcodes;
}


/**
 * Convert panel data to ms_slider shortcode and return it
 * 
 * @param  int      $slider_id   The ID of the slider you'd like to get its shortcode
 * @return string   ms_slider shortcode or empty string
 */
function msp_get_ms_slider_shortcode_by_slider_id( $slider_id ){
    // get slider panel data from database
    global $mspdb;
    $panel_data = $mspdb->get_slider_field_val( $slider_id, 'params' );
    $shortcode = msp_panel_data_2_ms_slider_shortcode( $panel_data, $slider_id );
    return $shortcode;
}


/**
 * Convert panel data to ms_slider shortcode and return it
 * 
 * @param  int      $slider_id   The ID of the slider you'd like to get its output
 * @param  bool     $cache_output Whether to store output in cache or not
 * @return string   The slider output
 */
function msp_generate_slider_output( $slider_id, $cache_output = false ){
    $ms_slider_shortcode = msp_get_ms_slider_shortcode_by_slider_id( $slider_id );
    $slider_output = do_shortcode( $ms_slider_shortcode );
    if( $cache_output )
        msp_set_slider_transient( $slider_id, $slider_output );

    return $slider_output;
}


/**
 * Flush and re-cache slider output if slider cache is enabled
 * 
 * @param  int      $slider_id   The ID of the slider you'd like to flush the cache
 * @return bool     True if the cache is flushed and false otherwise
 */
function msp_flush_slider_cache( $slider_id ){
    
    $is_cache_enabled = ( 'on' == msp_get_setting( '_enable_cache', 'msp_general_setting', 'off' ) );
    if( $is_cache_enabled ){
        msp_generate_slider_output( $slider_id, true );
        return true;
    }
    return false;
}


/**
 * Flush and re-cache all slideres if slider cache is enabled
 * 
 * @return bool     True if the cache is flushed and false otherwise
 */
function msp_flush_all_sliders_cache(){
    
    $is_cache_enabled = ( 'on' == msp_get_setting( '_enable_cache', 'msp_general_setting', 'off' ) );
    if( ! $is_cache_enabled ){ return false; }

    $all_sliders = get_masterslider_names();
    foreach ( $all_sliders as $slider_id => $slider_name ) {
        msp_generate_slider_output( $slider_id, true );
    }
        
    return true;
}


/**
 * Takes a slider ID and returns slider's parsed data in an array
 * You can use this function to access slider data (setting, slides, layers, styles)
 *  
 * @param  int        $slider_id   The ID of the slider you'd like to get its parsed data
 * @return array      array containing slider's parsed data
 */
function get_masterslider_parsed_data( $slider_id ){
    // get slider panel data from database
    global $mspdb;
    $panel_data = $mspdb->get_slider_field_val( $slider_id, 'params' );

    if ( ! $panel_data ) 
        return array();

    $parser = msp_get_parser();
    $parser->set_data( $panel_data, $slider_id );
    return $parser->get_results();
}


/**
 * Load and init parser class on demand
 * 
 * @return Object instance of MSP_Parser class
 */
function msp_get_parser() {
    include_once( MSWP_AVERTA_ADMIN_DIR . '/includes/classes/class-msp-parser.php' );
    
    global $msp_parser;
    if ( is_null( $msp_parser ) )
        $msp_parser = new MSP_Parser();
    
    return $msp_parser;
}


/**
 * Load and init shortcode_factory class on demand
 * 
 * @return Object instance of MSP_Shortcode_Factory class
 */
function msp_get_shortcode_factory () {
    include_once( MSWP_AVERTA_ADMIN_DIR . '/includes/classes/class-msp-shortcode-factory.php' );
    
    global $mspsf;
    if ( is_null( $mspsf ) )
        $mspsf = new MSP_Shortcode_Factory();
    
    return $mspsf;
}


/**
 * Load and init post_slider class on demand
 * 
 * @return Object instance of MSP_Post_Slider class
 */
function msp_get_post_slider_class() {
    include_once( MSWP_AVERTA_ADMIN_DIR . '/includes/classes/class-msp-post-sliders.php' );
    
    global $msp_post_slider;
    if ( is_null( $msp_post_slider ) )
        $msp_post_slider = new MSP_Post_Slider();
    
    return $msp_post_slider;
}


/**
 * Load and init wc_product_slider class on demand
 * 
 * @return Object instance of MSP_WC_Product_Slider class
 */
function msp_get_wc_slider_class() {
    include_once( MSWP_AVERTA_ADMIN_DIR . '/includes/classes/class-msp-wc-product-slider.php' );
    
    global $msp_wc_slider;
    if ( is_null( $msp_wc_slider ) )
        $msp_wc_slider = new MSP_WC_Product_Slider();
    
    return $msp_wc_slider;
}


/**
 * Update custom_css, custom_fonts and slide num fields in sliders table
 * 
 * @param int $slider_id the slider id that is going to be updated             
 * @return int|false The number of rows updated, or false on error.
 */
function msp_update_slider_custom_css_and_fonts( $slider_id ) {

    if( ! isset( $slider_id ) || ! is_numeric( $slider_id ) )
        return false;

    // get database tool
    global $mspdb;

    $slider_params = $mspdb->get_slider_field_val( $slider_id, 'params' );

    if( ! $slider_params )
        return false;

    // load and get parser and start parsing data
    $parser = msp_get_parser();
    $parser->set_data( $slider_params, $slider_id );
    
    // get required parsed data
    $slider_setting       = $parser->get_slider_setting();
    $slides               = $parser->get_slides();
    $slider_custom_styles = $parser->get_styles();

    $fields = array(
        'slides_num'    => count( $slides ),
        'custom_styles' => $slider_custom_styles,
        'custom_fonts'  => $slider_setting[ 'gfonts' ]
    );
    
    msp_save_custom_styles();

    $mspdb->update_slider( $slider_id, $fields );
}


/**
 * Set/update the value of a slider output transient.
 * 
 * @param  int   $slider_id     The slider id
 * @param  mixed $value         Slider transient output
 * @param  int   $cache_period  Time until expiration in hours, default 12
 * @return bool                 False if value was not set and true if value was set.
 */
function msp_set_slider_transient( $slider_id, $value, $cache_period = null ) {
    $cache_period = is_numeric( $cache_period ) ? (float)msp_get_setting( '_cache_period', 'msp_general_setting', 12 ) : $cache_period;
    return set_transient( 'master_slider_output_' . $slider_id , $value, (int)$cache_period * HOUR_IN_SECONDS );
}


/**
 * Get the value of a slider output transient.
 * 
 * @param  int     $slider_id     The slider id
 * @return mixed   Value of transient or False If the transient does not exist or does not have a value
 */
function msp_get_slider_transient( $slider_id ) {
    return get_transient( 'master_slider_output_' . $slider_id );
}


/**
 * Whether it's absolute url or not
 * 
 * @param  string $url  The URL
 * @return bool   TRUE if the URL is absolute
 */
function msp_is_absolute_url( $url ){
    return preg_match( "~^(?:f|ht)tps?://~i", $url );
}


/**
 * Whether the URL contains upload directory path or not
 * 
 * @param  string $url  The URL
 * @return bool   TRUE if the URL is absolute
 */
function msp_contains_upload_dir( $url ){
    $uploads_dir = wp_upload_dir();
    return strpos( $url, $uploads_dir['baseurl'] ) !== false;
}


/**
 * Print absolute URL for media file event if the URL is relative
 * 
 * @param  string $url  The link to media file
 * @return void
 */
function msp_the_absolute_media_url( $url ){
    echo msp_get_the_absolute_media_url( $url );
}

    /**
     * Get absolute URL for media file event if the URL is relative
     * 
     * @param  string $url  The link to media file
     * @return string   The absolute URL to media file
     */
    if( ! function_exists( 'msp_get_the_absolute_media_url' ) ){

        function msp_get_the_absolute_media_url( $url ){
            if( ! isset( $url ) || empty( $url ) )    return '';
            
            if( msp_is_absolute_url( $url ) || msp_contains_upload_dir( $url ) ) return $url;
            
            $uploads = wp_upload_dir();
            return set_url_scheme( $uploads['baseurl'] . $url );
        }

    }


/**
 * Print relative URL for media file event if the URL is absolute
 * 
 * @param  string $url  The link to media file
 * @return void
 */
function msp_the_relative_media_url( $url ){
    echo msp_get_the_relative_media_url( $url );
}

    /**
     * Get relative URL for media file event if the URL is absolute
     * 
     * @param  string $url  The link to media file
     * @return string   The absolute URL to media file
     */
    if( ! function_exists( 'msp_get_the_relative_media_url' ) ){

        function msp_get_the_relative_media_url($url){
            if( ! isset( $url ) || empty( $url ) )     return '';
            
            // if it's not internal absolute url 
            if( ! msp_contains_upload_dir( $url ) ) return $url;
            
            $uploads_dir = wp_upload_dir();
            return str_replace( $uploads_dir['baseurl'], '', $url );
        }

    }


/*-----------------------------------------------------------------------------------*/
/*  Custom functions for resizing images 
/*-----------------------------------------------------------------------------------*/


// get resized image by image src ////////////////////////////////////////////////////


function msp_the_resized_image( $img_url = "", $width = null , $height = null, $crop = null , $quality = 100 ) {
    echo msp_get_the_resized_image( $img_url , $width , $height , $crop , $quality );
}
    
    function msp_get_the_resized_image( $img_url = "", $width = null , $height = null, $crop = null , $quality = 100 ) {
        return '<img src="'.msp_aq_resize( $img_url, $width, $height, $crop, $quality ).'" alt="" />';
    }
        /**
         * Get resized image by image URL
         * 
         * @param  string   $img_url  The original image URL
         * @param  integer  $width    New image Width
         * @param  integer  $height   New image height
         * @param  bool     $crop     Whether to crop image to specified height and width or resize. Default false (soft crop).
         * @param  integer  $quality  New image quality - a number between 0 and 100
         * @return string   new image src
         */
        if( ! function_exists( 'msp_get_the_resized_image_src' ) ){

            function msp_get_the_resized_image_src( $img_url = "", $width = null , $height = null, $crop = null , $quality = 100 ) {
                $resized_img_url = msp_aq_resize( $img_url, $width, $height, $crop, $quality );
                if( empty( $resized_img_url ) ) 
                    $resized_img_url = $img_url;
                return apply_filters( 'msp_get_the_resized_image_src', $resized_img_url, $img_url );
            }

        }


// get resized image by attachment id /////////////////////////////////////////////////


// echo resized image tag
function msp_the_resized_attachment( $attach_id = null, $width = null , $height = null, $crop = null , $quality = 100 ) {
    echo msp_get_the_resized_attachment( $attach_id, $width , $height, $crop, $quality );
}

    // return resized image tag
    function msp_get_the_resized_attachment( $attach_id = null, $width = null , $height = null, $crop = null , $quality = 100 ) {
        $image_src = msp_get_the_resized_attachment_src( $attach_id, $width , $height, $crop, $quality );
        
        return $image_src ? '<img src="'.$image_src.'" alt="" />': '';
    }

        /**
         * Get resized image by attachment id
         * 
         * @param  string   $attach_id  The attachment id
         * @param  integer  $width    New image Width
         * @param  integer  $height   New image height
         * @param  bool     $crop     Whether to crop image to specified height and width or resize. Default false (soft crop).
         * @param  integer  $quality  New image quality - a number between 0 and 100
         * @return string   new image src
         */
        if( ! function_exists( 'msp_get_the_resized_attachment_src' ) ){
            
            function msp_get_the_resized_attachment_src( $attach_id = null, $width = null , $height = null, $crop = null , $quality = 100 ) {
                if( is_null( $attach_id ) ) return '';
                
                $img_url = wp_get_attachment_url( $attach_id ,'full'); //get img URL                     
                return ! empty( $img_url ) ? msp_aq_resize( $img_url, $width, $height, $crop, $quality ) : false;
            }

        }

// get resized image featured by post id ///////////////////////////////////////////////


// echo resized image tag
function msp_the_post_thumbnail( $post_id = null, $width = null , $height = null, $crop = null , $quality = 100 ) {
    echo msp_get_the_post_thumbnail( $post_id, $width , $height, $crop, $quality);
}
    
    // return resized image tag
    function msp_get_the_post_thumbnail( $post_id = null, $width = null , $height = null, $crop = null , $quality = 100 ) {
        $image_src = msp_get_the_post_thumbnail_src( $post_id, $width , $height, $crop, $quality);
        return $image_src ? '<img src="'.$image_src.'" alt="" />' : '';
    }

        /**
         * Get resized image by post id
         * 
         * @param  string   $post_id  The post id
         * @param  integer  $width    New image Width
         * @param  integer  $height   New image height
         * @param  bool     $crop     Whether to crop image to specified height and width or resize. Default false (soft crop).
         * @param  integer  $quality  New image quality - a number between 0 and 100
         * @return string   new image src
         */
        if( ! function_exists( 'msp_get_the_post_thumbnail_src' ) ){
        
            function msp_get_the_post_thumbnail_src( $post_id = null, $width = null , $height = null, $crop = null , $quality = 100 ) {
                $post_id = is_null( $post_id ) ? get_the_ID() : $post_id;
                $post_thumbnail_id = get_post_thumbnail_id( $post_id );
                
                $img_url = wp_get_attachment_url( $post_thumbnail_id, 'full' ); //get img URL
                
                $resized_img = $post_thumbnail_id ? aq_resize( $img_url, $width, $height, $crop, $quality ) : false;

                return apply_filters( 'msp_get_the_post_thumbnail_src', $resized_img, $img_url, $width, $height, $crop, $quality );
            }
        
        }

        /**
         * Get full URI of an featured image for a post id
         *
         * @param  integer $post_id  The post id to get featured image of
         * @return string  Returns a full URI for featured image or false on failure.
         */
        if( ! function_exists( 'msp_get_the_post_thumbnail_full_src' ) ){
        
            function msp_get_the_post_thumbnail_full_src( $post_id = null ) {
                $post_id = is_null( $post_id ) ? get_the_ID() : $post_id;
                $post_thumbnail_id = get_post_thumbnail_id( $post_id );
                
                return wp_get_attachment_url( $post_thumbnail_id, 'full' );
            }
        
        }

        /**
         * Get full URI of a post image (featured image or first image in content) for a post id
         *
         * @param  integer $post_id  The post id to get post image of
         * @param  string  $image_from   where to look for post image. possible values are : auto, featured, first. Default to 'auto'
         * 
         * @return string  Returns a full URI for post image or empty string on failure.
         */
        if( ! function_exists( 'msp_get_auto_post_thumbnail_src' ) ){
        
            function msp_get_auto_post_thumbnail_src( $post_id = null, $image_from = 'auto' ) {

                $post = get_post( $post_id );
                $img_src = '';

                if( ! isset( $post ) ) return '';

        if ( 'auto' == $image_from ) {
          $img_src = has_post_thumbnail( $post->ID ) ? msp_get_the_post_thumbnail_full_src( $post->ID ) : '';

          if( empty( $img_src ) ) {
            $content   = get_the_content();
            $img_src = msp_get_first_image_src_from_string( $content );
          }

        } elseif( 'featured' == $image_from ) {
          $img_src = has_post_thumbnail( $post->ID ) ? msp_get_the_post_thumbnail_full_src( $post->ID ) : '';

        } elseif ( 'first' == $image_from ) {

          $content = get_the_content();
          $img_src = msp_get_first_image_src_from_string( $content );
        }
                
                return $img_src;
            }
        
        }


///// extract image from content ////////////////////////////////////////////////////

/**
 * Get first image tag from string
 * 
 * @param  string $content  The content to extract image from
 * @return string           First image tag on success and empty string if nothing found
 */
function msp_get_first_image_from_string( $content ){
    $images = msp_extract_string_images( $content );
    return ( $images && count( $images[0]) ) ? $images[0][0] : '';
}

/**
 * Get first image src from content
 * 
 * @param  string $content  The content to extract image from
 * @return string           First image URL on success and empty string if nothing found
 */
function msp_get_first_image_src_from_string( $content ){
    $images = msp_extract_string_images( $content );
    return ( $images && count( $images[1]) ) ? $images[1][0] : '';
}
    
    /**
     * Extract all images from content
     * 
     * @param  string $content   The content to extract images from
     * @return array             List of images in array
     */
    if( ! function_exists( 'msp_extract_string_images' ) ){
        
        function msp_extract_string_images( $content ){
            preg_match_all( '|<img.*?src=[\'"](.*?)[\'"].*?>|i', $content, $matches );
            return isset( $matches ) && count( $matches[0] ) ? $matches : false;
        }
    
    }


/*-----------------------------------------------------------------------------------*/


/**
 * Get list of created slider IDs and names in an array
 * 
 * @param  bool    $id_as_key   If <code>true</code> returns slider ID as array key and slider name as value , reverse on <code>false</code>
 * @param  int     $limit       Maximum number of sliders to return - 0 means no limit
 * @param  int     $offset      The offset of the first row to return
 * @param  string  $orderby     The field name to order results by
 * @param  string  $sort        The sort type. 'DESC' or 'DESC'
 * 
 * @return array   An array containing sliders ID as array key and slider name as value
 *
 * @example   $id_as_key = true :
 *            array(
 *                '12' => 'Slider sample title 1', 
 *                '13' => 'Slider sample title 2'
 *            )
 *
 *            $id_as_key = false :
 *            array(
 *                'Slider sample title 1' => '12', 
 *                'Slider sample title 2' => '13' 
 *            )
 */
function get_masterslider_names( $id_as_key = true, $limit = 0, $offset  = 0, $orderby = 'ID', $sort = 'DESC' ){
    global $mspdb;

    // replace 0 with max numbers od records you need
    if ( $sliders_data = $mspdb->get_sliders_list( $limit = 0, $offset  = 0, $orderby = 'ID', $sort = 'DESC' ) ) {
        // stores sliders 'ID' and 'title'
        $sliders_name_list = array();

        foreach ( $sliders_data as $slider_data ) {
            if( $id_as_key )
                $sliders_name_list[ $slider_data['ID'] ]    = $slider_data['title'];
            else
                $sliders_name_list[ $slider_data['title'] ] = $slider_data['ID'];
        }

        return $sliders_name_list;
    }

    return array();
}


/**
 * Get an array containing row results (unserialized) from sliders table (with all slider table fields)
 * 
 * @param  int $limit       Maximum number of records to return
 * @param  int $offset      The offset of the first row to return
 * @param  string $orderby  The field name to order results by
 * @param  string $sort     The sort type. 'DESC' or 'ASC'
 * @param  string $where    The sql filter to get results by
 * @return array            Slider data in array
 */
function get_mastersliders( $limit = 0, $offset = 0, $orderby = 'ID', $sort = 'DESC', $where = "status='published'" ) {
    global $mspdb;

    $sliders_array = $mspdb->get_sliders( $limit, $offset, $orderby, $sort, $where );
    return is_null( $sliders_array ) ? array() : $sliders_array;
}


/**
 * Get option value
 * 
 * @param   string  $option_name a unique name for option
 * @param   string  $default_value  a value to return by function if option_value not found
 * @return  string  option_value or default_value
 */
function msp_get_option( $option_name, $default_value = '' ) {
    global $mspdb;
    return $mspdb->get_option( $option_name, $default_value );
}


/**
 * Update option value in options table, if option_name does not exist then insert new option
 * 
 * @param   string $option_name a unique name for option
 * @param   string $option_value the option value
 *                  
 * @return int|false ID number for new inserted row or false if the option can not be updated.
 */
function msp_update_option( $option_name, $option_value = '' ) {
    global $mspdb;
    return $mspdb->update_option( $option_name, $option_value );
}


/**
 * Remove a specific option name from options table
 * 
 * @param   string $option_name a unique name for option
 * @return bool True, if option is successfully deleted. False on failure.
 */
function msp_delete_option( $option_name ) {
    global $mspdb;
    return $mspdb->delete_option( $option_name );
}


/**
 * Get the value of a settings field
 *
 * @param string  $option  settings field name
 * @param string  $section the section name this field belongs to
 * @param string  $default default text if it's not found
 * @return string
 */
function msp_get_setting( $option, $section, $default = '' ) {

    $options = get_option( $section );

    if ( isset( $options[$option] ) ) {
        return $options[$option];
    }

    return $default;
}

/*-----------------------------------------------------------------------------------*/
/*  Get trimmed string
/*-----------------------------------------------------------------------------------*/

function msp_the_trimmed_string( $string, $max_length = 1000, $more = ' ...' ){
    echo msp_get_trimmed_string( $string, $max_length, $more );
}
    
    /**
     * Trim string by character length
     *
     * @param string  $string  The string to trim
     * @param integer $max_length  The width of the desired trim.
     * @param $string $more  A string that is added to the end of string when string is truncated.
     * @return string The trimmed string
     */
    if( ! function_exists( 'msp_get_trimmed_string') ){

        function msp_get_trimmed_string( $string, $max_length = 1000, $more = ' ...' ){
            return function_exists( 'mb_strimwidth' ) ? mb_strimwidth( $string, 0, $max_length, $more ) : substr( $string, 0, $max_length ) . $more;
        }

    }

/*-----------------------------------------------------------------------------------*/
/*  Shortcode enabled excerpts trimmed by character length
/*-----------------------------------------------------------------------------------*/

function msp_the_trim_excerpt( $post_id = null, $char_length = null, $exclude_strip_shortcode_tags = null ){
    echo msp_get_the_trim_excerpt( $post_id, $char_length, $exclude_strip_shortcode_tags );
}

    if( ! function_exists( 'msp_get_the_trim_excerpt' ) ){
        
        // make shortcodes executable in excerpt
        function msp_get_the_trim_excerpt( $post_id = null, $char_length = null, $exclude_strip_shortcode_tags = null ) {
            $post = get_post( $post_id );
            if( ! isset( $post ) ) return "";
            
    
            $excerpt = $post->post_content;
            $raw_excerpt = $excerpt;
            $excerpt = apply_filters( 'the_content', $excerpt );
            // If char length is defined use it, otherwise use default char length
            $char_length  = empty( $char_length ) ? apply_filters( 'masterslider_excerpt_char_length', 250 ) : $char_length;
            $excerpt_more = apply_filters('excerpt_more', ' ...');
            // Clean post content
            $excerpt = strip_tags( msp_strip_shortcodes( $excerpt, $exclude_strip_shortcode_tags ) );
            $text = msp_get_trimmed_string( $excerpt, $char_length, $excerpt_more );

            return apply_filters( 'wp_trim_excerpt', $text, $raw_excerpt );
        }
        
    }

/*-----------------------------------------------------------------------------------*/
/*  Remove just shortcode tags from the given content but keep content of shortcodes
/*-----------------------------------------------------------------------------------*/

function msp_strip_shortcodes( $content, $exclude_strip_shortcode_tags = null ) {
    if( ! $content ) return $content;
    
    if( ! $exclude_strip_shortcode_tags )
        $exclude_strip_shortcode_tags = msp_exclude_strip_shortcode_tags();
    
    if( empty( $exclude_strip_shortcode_tags ) || !is_array( $exclude_strip_shortcode_tags ) )
        return preg_replace( '/\[[^\]]*\]/', '', $content );
    
    $exclude_codes = join( '|', $exclude_strip_shortcode_tags );
    return preg_replace( "~(?:\[/?)(?!(?:$exclude_codes))[^/\]]+/?\]~s", '', $content );
}


/*-----------------------------------------------------------------------------------*/
/*  The list of shortcode tags that should not be removed in msp_strip_shortcodes
/*-----------------------------------------------------------------------------------*/

function msp_exclude_strip_shortcode_tags(){
    return apply_filters( 'msp_exclude_strip_shortcode_tags', array() );
}

/**
 * Get all custom post types
 * @return array  List of all custom post types
 */
function msp_get_custom_post_types(){
  $custom_post_types = get_post_types( array( '_builtin' => false ), 'objects' );
  return apply_filters( 'masterslider_get_custom_post_types', $custom_post_types );
}


/**
 * Whether a plugin is active or not 
 * @param  string $plugin_basename  plugin directory name and mail file address
 * @return bool                  True if plugin is active and FALSE otherwise
 */
function msp_is_plugin_active( $plugin_basename ){
    include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
    return is_plugin_active( $plugin_basename );
}


function msp_get_template_tag_value( $tag_name, $post = null, $args = null ){
  $post  = get_post( $post );
  $value = '{{' . $tag_name . '}}';
  
  switch ( $tag_name ) {

    case 'title':
      $value = $post->post_title;
      break;

    case 'content':
      $value = $post->post_content;
      break;

    case 'excerpt':
      $value = $post->post_excerpt;
      if ( empty( $value ) ) {
        $excerpt_length = isset( $args['excerpt_length'] ) ? (int)$args['excerpt_length'] : 80;
        $value = msp_get_the_trim_excerpt( $value, $excerpt_length );
      }
      break;

    case 'permalink':
      $value = $post->guid;
      break;

    case 'author':
      $value = get_the_author_meta( 'display_name', (int)$post->post_author );
      break;

    case 'post_id':
      $value = $post->ID;
      break;

        case 'categories':
            $taxonomy_objects = get_object_taxonomies( $post, 'objects' );
            $value = '';
            foreach ( $taxonomy_objects as $tax_name => $tax_info ) {
                if( 1 == $tax_info->hierarchical ){
                    $term_list = wp_get_post_terms($post->ID, $tax_name, array("fields" => "names") );
                    $value .= implode( ' / ' , $term_list );
                }
            }
            $value = rtrim( $value, ' / ' );
            break;

        case 'tags':
            $taxonomy_objects = get_object_taxonomies( $post, 'objects' );
            $value = '';
            foreach ( $taxonomy_objects as $tax_name => $tax_info ) {
                if( 1 !== $tax_info->hierarchical ){
                    $term_list = wp_get_post_terms($post->ID, $tax_name, array("fields" => "names") );
                    $value .= implode( ' / ' , $term_list ) . ' / ';
                }
            }
            $value = rtrim( $value, ' / ' );
            break;

    case 'image':
      $value = msp_get_auto_post_thumbnail_src( $post, 'featured' );

      if( ! empty( $value ) )
        $value = sprintf( '<img src="%s" alt="%s" />', $value, $post->post_title );
      break;

    case 'image-url':
        case 'slide-image-url':
            $value = msp_get_auto_post_thumbnail_src( $post, 'auto' );
            break;

    case 'year':
      $value = strtotime( $post->post_date );
      $value = date_i18n( 'Y', $value );
      break;

    case 'daynum':
      $value = strtotime( $post->post_date );
      $value = date_i18n( 'j', $value );
      break;

    case 'day':
      $value = strtotime( $post->post_date );
      $value = date_i18n( 'l', $value );
      break;

    case 'monthnum':
      $value = strtotime( $post->post_date );
      $value = date_i18n( 'm', $value );
      break;

    case 'month':
      $value = strtotime( $post->post_date );
      $value = date_i18n( 'F', $value );
      break;

    case 'time':
      $value = strtotime( $post->post_date );
      $value = date_i18n( 'g:i A', $value );
      break;

    case 'date-published':
      $value = $post->post_date;
      break;

    case 'date-modified':
      $value = $post->post_modified;
      break;

    case 'commentnum':
      $value = $post->comment_count;
      break;

    case 'wc_price':
      if ( ! msp_is_plugin_active( 'woocommerce/woocommerce.php' ) ) break;
      $product = get_product( $post );
      $value = wc_format_decimal( $product->get_price(), 2 );
      break;

    case 'wc_regular_price':
      if ( ! msp_is_plugin_active( 'woocommerce/woocommerce.php' ) ) break;
      $product = get_product( $post );
      $value = wc_format_decimal( $product->get_regular_price(), 2 );
      break;

    case 'wc_sale_price':
      if ( ! msp_is_plugin_active( 'woocommerce/woocommerce.php' ) ) break;
      $product = get_product( $post );
      $value = $product->get_sale_price() ? wc_format_decimal( $product->get_sale_price(), 2 ) : '';
      break;

    case 'wc_stock_status':
      if ( ! msp_is_plugin_active( 'woocommerce/woocommerce.php' ) ) break;
      $product = get_product( $post );
      $value = $product->is_in_stock() ? __( 'In Stock', 'master-slider' ) : __( 'Out of Stock', 'master-slider' );
      break;

    case 'wc_stock_quantity':
      if ( ! msp_is_plugin_active( 'woocommerce/woocommerce.php' ) ) break;
      $product = get_product( $post );
      $value = (int) $product->get_stock_quantity();
      break;

    case 'wc_weight':
      if ( ! msp_is_plugin_active( 'woocommerce/woocommerce.php' ) ) break;
      $product = get_product( $post );
      $value = $product->get_weight() ? wc_format_decimal( $product->get_weight(), 2 ) : '';
      break;

    case 'wc_product_cats':
      if ( ! msp_is_plugin_active( 'woocommerce/woocommerce.php' ) ) break;
      $product = get_product( $post );
      $value = wp_get_post_terms( $product->id, 'product_cat', array( 'fields' => 'names' ) );
      break;

    case 'wc_product_tags':
      if ( ! msp_is_plugin_active( 'woocommerce/woocommerce.php' ) ) break;
      $product = get_product( $post );
      $value = wp_get_post_terms( $product->id, 'product_tag', array( 'fields' => 'names' ) );
      break;

    case 'wc_total_sales':
      if ( ! msp_is_plugin_active( 'woocommerce/woocommerce.php' ) ) break;
      $product = get_product( $post );
      $value = metadata_exists( 'post', $product->id, 'total_sales' ) ? (int) get_post_meta( $product->id, 'total_sales', true ) : 0;
      break;

    case 'wc_average_rating':
      if ( ! msp_is_plugin_active( 'woocommerce/woocommerce.php' ) ) break;
      $product = get_product( $post );
      $value = wc_format_decimal( $product->get_average_rating(), 2 );
      break;

    case 'wc_rating_count':
      if ( ! msp_is_plugin_active( 'woocommerce/woocommerce.php' ) ) break;
      $product = get_product( $post );
      $value = (int) $product->get_rating_count();
      break;

    default:
            $value = get_post_meta(  $post->ID, $tag_name, true );
      break;
  }

  return apply_filters( 'masterslider_get_template_tag_value', $value, $tag_name, $post, $args );
}


function msp_maybe_base64_decode ( $data ) {
    $decoded_data = base64_decode( $data );
    return base64_encode( $decoded_data ) === $data ? $decoded_data : $data;
}


function msp_maybe_base64_encode ( $data ) {
    $encoded_data = base64_encode( $data );
    return base64_decode( $encoded_data ) === $data ? $encoded_data : $data;
}


function msp_escape_tag( $tag_name ){
    return tag_escape( $tag_name ); 
}


function msp_is_true($value) {
  return strtolower( $value ) === 'true' ? 'true' : 'false';
}


function msp_is_true_e( $value ) {
  echo msp_is_true( $value );
}


function msp_is_key_true( $array, $key, $default = 'true' ) {
    if( isset( $array[ $key ] ) ) {
        return $array[ $key ] ? 'true' : 'false';
    } else {
        return $default;
    }
}