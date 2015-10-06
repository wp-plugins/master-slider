<?php // 

/**
*  
*/
class MSP_Admin_Ajax {
  


  function __construct () {
    
    // get and save data on ajax data post
    add_action( 'wp_ajax_msp_panel_handler'   , array( $this, 'save_panel_ajax'     ) );
    add_action( 'wp_ajax_msp_create_new_handler', array( $this, 'create_new_slider'   ) );
  }



  /**
   * Save ajax handler for main panel data
   *
   * @since    1.0.0
   */
  public function save_panel_ajax() {
      
    header( "Content-Type: application/json" );
    
    // verify nonce
    if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], "msp_panel") ) {
      echo json_encode( array( 'success' => false, 'message' => __("Authorization failed!", 'master-slider' ) ) );
      exit();
    }
    
    // ignore the request if the current user doesn't have sufficient permissions
      if ( ! current_user_can( 'publish_masterslider' ) ) {
        echo json_encode( array( 'success' => false,
                             'message' => apply_filters( 'masterslider_insufficient_permissions_to_publish_message', __( "Sorry, You don't have enough permission to publish slider!", 'master-slider' ) ) 
                            ) 
        );
        exit();
    }

    /////////////////////////////////////////////////////////////////////////////////////////

    // Get the slider id
    $slider_id    = isset( $_REQUEST['slider_id']     ) ? $_REQUEST['slider_id']     : '';

    if ( empty( $slider_id ) ) {
       echo json_encode( array( 'success' => false, 'type' => 'save' , 'message' => __( "Slider id is not defined.", 'master-slider' )  ) );
       exit;
    }

    // get the slider type
    $slider_type  = isset( $_REQUEST['slider_type']   ) ? $_REQUEST['slider_type']   : 'custom';

    // get panel data
    $msp_data   = isset( $_REQUEST['msp_data']      ) ? $_REQUEST['msp_data']      : NULL;

    
    // get parse and database tools
    global $mspdb;

    // load and get parser and start parsing data
    $parser = msp_get_parser();
    $parser->set_data( $msp_data, $slider_id );
    
    // get required parsed data
    $slider_setting       = $parser->get_slider_setting();
    $slides             = $parser->get_slides();
    $slider_custom_styles = $parser->get_styles();

    $fields = array(
      'title'     => $slider_setting[ 'title' ], 
      'type'      => $slider_setting[ 'slider_type' ],
      'slides_num'  => count( $slides ),
      'params'    => $msp_data,
      'custom_styles' => $slider_custom_styles,
      'custom_fonts'  => $slider_setting[ 'gfonts' ],
      'status'    => 'published'
    );

    // store slider data in database
    $is_saved = $mspdb->update_slider( $slider_id, $fields );

      msp_save_custom_styles();


      // flush slider cache if slider cache is enabled
      msp_flush_slider_cache( $slider_id );
      
      
    // create and output the response
    if( isset( $is_saved ) )
      $response = json_encode( array( 'success' => true, 'type' => 'save' , 'message' => __( "Saved Successfully.", 'master-slider' )  ) );
      else
        $response = json_encode( array( 'success' => true, 'type' => 'save' , 'message' => __( "No Data Recieved."  , 'master-slider' )  ) );
      
      echo $response;
    
      exit;// IMPORTANT
  }



  /**
   * Create new slider by type
   *
   * @since    1.0.0
   */
  public function create_new_slider() {
      
    header( "Content-Type: application/json" );
    
    // verify nonce
    if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], "msp_panel") ) {
      echo json_encode( array( 'success' => false, 'message' => __("Authorization failed!", 'master-slider' ) ) );
      exit();
    }
    
    // ignore the request if the current user doesn't have sufficient permissions
      if ( ! current_user_can( 'create_masterslider' ) && ! current_user_can( 'publish_masterslider' ) ) {
        echo json_encode( array( 'success' => false,
                             'message' => apply_filters( 'masterslider_create_slider_permissions_message', __( "Sorry, You don't have enough permission to create slider!", 'master-slider' ) ) 
                            ) 
        );
        exit();
    }


    /////////////////////////////////////////////////////////////////////////////////////////
    
    // Get the slider id
    $slider_type = isset( $_REQUEST['slider_type'] ) ? $_REQUEST['slider_type'] : '';


    // Get new slider id
    global $mspdb;
    $slider_id = $mspdb->add_slider( array( 'status' => 'draft', 'type' => $slider_type ) );
      
      
    // create and output the response
    if( false !== $slider_id )
      $response = json_encode( array( 'success' => true, 'slider_id' => $slider_id , 'redirect' => admin_url( 'admin.php?page='.MSWP_SLUG.'&action=edit&slider_id='.$slider_id.'&slider_type='.$slider_type ), 'message' => __( "Slider Created Successfully.", 'master-slider' )  ) );
      else
        $response = json_encode( array( 'success' => true, 'slider_id' => '' , 'redirect' => '', message => __( "Slider can not be created."  , 'master-slider' )  ) );
      
      echo $response;
    
      exit;// IMPORTANT
  }


}

new MSP_Admin_Ajax();