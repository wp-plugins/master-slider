<?php
/**
 * Master Slider Admin Scripts Class.
 *
 * @package   MasterSlider
 * @author    averta [averta.net]
 * @license   LICENSE.txt
 * @link      http://masterslider.com
 * @copyright Copyright © 2014 averta
 */

/**
 *  Class to load and print master slider panel scripts
 */
class MSP_Admin_Assets {
  

  /**
   * __construct
   */
  function __construct() {

  }


  public function enqueue_panel_assets (){

    // general assets
    $this->load_general_styles();
    $this->load_panel_styles();

    $this->add_general_variables();
    $this->add_general_script_localizations();
    $this->load_general_scripts();

    // panel spesific assets
    if( isset( $_REQUEST['action'] ) && in_array( $_REQUEST['action'], array( 'edit', 'add' ) ) ) {

      $this->load_panel_scripts();
      $this->add_panel_variables();
      $this->add_panel_script_localizations();
    }
    
  }


  public function enqueue_global_assets(){

    $this->load_global_styles();
    $this->add_global_variables();
  }
  

  public function load_global_styles(){
    // load global style - loads on all admin area
    wp_enqueue_style( MSWP_SLUG .'-global-styles',  MSWP_AVERTA_ADMIN_URL . '/assets/css/global.css', array(), MSWP_AVERTA_VERSION );
  }


  public function add_global_variables(){
    // load global variables about Master Slider
    wp_localize_script( 'jquery', '__MS_GLOBAL', array(
      'ajax_url'       => admin_url( 'admin-ajax.php' ),
      'admin_url'      => admin_url(),
      'menu_page_url'  => menu_page_url( MSWP_SLUG, false ),
      'plugin_url'   => MSWP_AVERTA_URL,
      'plugin_name'  => esc_js( __( 'Master Slider', 'master-slider' ) )
    ));
  }

  
  /**
   * Load scripts for master slider admin panel
   * @return void
   */
  public function load_panel_scripts() {

    // Load wp media uploader
    wp_enqueue_media();

    // Master Slider Panel Scripts
    wp_enqueue_script( MSWP_SLUG . '-handlebars'   ,  MSWP_AVERTA_ADMIN_URL . '/views/slider-panel/js/handlebars.min.js',       array( 'jquery' ), MSWP_AVERTA_VERSION, true );
    wp_enqueue_script( MSWP_SLUG . '-ember-js'     ,  MSWP_AVERTA_ADMIN_URL . '/views/slider-panel/js/ember.min.js',          array( 'jquery' ), MSWP_AVERTA_VERSION, true );
    wp_enqueue_script( MSWP_SLUG . '-ember-model'  ,  MSWP_AVERTA_ADMIN_URL . '/views/slider-panel/js/ember-model.min.js',        array( 'jquery' ), MSWP_AVERTA_VERSION, true );
    wp_enqueue_script( MSWP_SLUG . '-msp-required'   ,  MSWP_AVERTA_ADMIN_URL . '/views/slider-panel/js/msp.required.js',  
      array( 
        'jquery', 'jquery-ui-core', 'jquery-ui-dialog', 'jquery-ui-draggable', 
        'jquery-ui-sortable', 'jquery-ui-slider', 'jquery-ui-spinner' 
      ), 
      MSWP_AVERTA_VERSION, true 
    );

    wp_enqueue_script( MSWP_SLUG . '-masterslider-wp',  MSWP_AVERTA_ADMIN_URL . '/views/slider-panel/js/masterslider.wp.js',        array( MSWP_SLUG . '-msp-required' ), MSWP_AVERTA_VERSION, true );
  }


  /**
   * Print required variable for master slider panel
   */
  public function add_panel_variables() {
    
    $slider_skins = array(
          array( 'class' => 'ms-skin-default', 'label' => 'Default' ),
          array( 'class' => 'ms-skin-light-2', 'label' => 'Light 2' ),
          array( 'class' => 'ms-skin-light-3', 'label' => 'Light 3' ),
          array( 'class' => 'ms-skin-light-4', 'label' => 'Light 4' ),
          array( 'class' => 'ms-skin-light-5', 'label' => 'Light 5' ),
          array( 'class' => 'ms-skin-light-6', 'label' => 'Light 6' ),
          array( 'class' => 'ms-skin-light-6 round-skin', 'label' => 'Light 6 Round' ),

          array( 'class' => 'ms-skin-contrast', 'label' => 'Contrast' ),
          array( 'class' => 'ms-skin-black-1' , 'label' => 'Black 1' ),
          array( 'class' => 'ms-skin-black-2' , 'label' => 'Black 2' ),
          array( 'class' => 'ms-skin-black-2 round-skin', 'label' => 'Black 2 Round' ),
          array( 'class' => 'ms-skin-metro'   , 'label' => 'Metro' )
      );

    wp_localize_script( 'jquery', '__MSP_SKINS', apply_filters( 'masterslider_skins', $slider_skins ) );

    // get and print slider id
    if ( isset( $_REQUEST['slider_id'] ) ) {

      $slider_id  = $_REQUEST['slider_id'];
    
    } else {
      global $mspdb;
      $slider_id = 0;

      if ( isset( $_REQUEST['action'] ) && 'add' == $_REQUEST['action'] ) {
        $slider_id = $mspdb->add_slider( array( 'status' => 'draft' ) );
        wp_localize_script( 'jquery', '__MSP_SLIDER_ID', (string) $slider_id );
      }
    }
    
    // Get and print panel data
    if ( $slider_id ) {

      global $mspdb;
      $slider_data = $mspdb->get_slider( $slider_id );

      $slider_type = isset( $slider_data[ 'type' ] ) ? $slider_data[ 'type' ] : 'custom';
      $slider_type = empty( $slider_type ) ? 'custom' : $slider_type;

      $msp_data = isset( $slider_data[ 'params' ] ) ? $slider_data[ 'params' ] : NULL;
      $msp_data = empty( $slider_data[ 'params' ] ) ? NULL : $slider_data[ 'params' ];

      $msp_preset_style  = msp_get_option( 'preset_style' , NULL );
      $msp_preset_effect = msp_get_option( 'preset_effect', NULL );
      $msp_buttons_style = msp_get_option( 'buttons_style', NULL );

      $msp_preset_style  = empty( $msp_preset_style  ) ? NULL : $msp_preset_style;
      $msp_preset_effect = empty( $msp_preset_effect ) ? NULL : $msp_preset_effect;
      $msp_buttons_style = empty( $msp_buttons_style ) ? NULL : $msp_buttons_style;

      wp_localize_script( 'jquery', '__MSP_DATA'      , $msp_data    );
      wp_localize_script( 'jquery', '__MSP_PRESET_STYLE'  , $msp_preset_style  );
      wp_localize_script( 'jquery', '__MSP_PRESET_EFFECT' , $msp_preset_effect );
      wp_localize_script( 'jquery', '__MSP_TYPE'      , $slider_type );
      wp_localize_script( 'jquery', '__MSP_PRESET_BUTTON' , $msp_buttons_style );
    }


    // define panel directory path
    wp_localize_script( 'jquery', '__MSP_PATH', MSWP_AVERTA_ADMIN_URL . '/views/slider-panel/' );

    $slider_panel_default_setting = array(

          'width'         => 1000, 
          'height'        => 500, 

          'autoCrop'    => false,
          'autoplay'      => false,
          'layout'    => 'boxed',
          'autoHeight'    => false,
          'transition'  => 'basic',
          'speed'         => 20,
          'className'   => '',


          'start'         => 1,
          'space'         => 0,

          'grabCursor'    => true, 
          'swipe'         => true,

          'wheel'         => false,
          'mouse'         => true,

          'loop'          => false, 
          'shuffle'       => false,
          'preload'       => '-1',

          'overPause'     => true,
          'endPause'      => false,

          'hideLayers'    => false,
          'dir'       => 'h',
          'parallaxMode'  => 'swipe',
          'centerControls'=> true,
          'instantShowLayers' => false,

          'skin'          => 'ms-skin-default',
          'duration'    => 3,
          'slideFillMode' => 'fill',
          'sliderVideoFillMode' => 'fill',
          'slideVideoLoop'=> true,
          'slideVideoMute'=> true,
          'slideVideoAutopause'=> false,
          'layerContent'  => 'Lorem Ipsum'
      );
    
    wp_localize_script( 'jquery', '__MSP_DEF_OPTIONS', apply_filters( 'masterslider_panel_default_setting', $slider_panel_default_setting ) );

    do_action( 'masterslider_admin_add_panel_variables', $slider_type );
  }




  /**
   * Print required variable for master slider admin page
   */
  public function add_general_variables() {

    $uploads = wp_upload_dir();

    // define admin ajax address and master slider page
    wp_localize_script( 'jquery', '__MS', array(
      'ajax_url'       => admin_url( 'admin-ajax.php' ),
      'msp_menu_page'  => menu_page_url( MSWP_SLUG, false ),
      'msp_plugin_url' => MSWP_AVERTA_URL,
      'upload_dir'     => $uploads['baseurl'],
      'importer'     => admin_url( 'admin.php?import=masterslider-importer' )
    ));
  }


  /**
   * Add script localizations 
   */
  public function add_panel_script_localizations() {

    wp_localize_script( 'jquery', '__MSP_LAN', apply_filters( 'masterslider_admin_localize', array(
        
      // CallbacksController.js
      'cb_001' => __( 'On slide change start', 'master-slider' ),
      'cb_002' => __( 'On slide change end', 'master-slider' ),
      'cb_003' => __( 'On slide timer change', 'master-slider' ),
      'cb_004' => __( 'On slider resize', 'master-slider' ), 
      'cb_005' => __( 'On Youtube/Vimeo video play', 'master-slider' ),
      'cb_006' => __( 'On Youtube/Vimeo video close', 'master-slider' ),
      'cb_007' => __( 'On swipe start', 'master-slider' ),
      'cb_008' => __( 'On swipe move', 'master-slider' ),
      'cb_009' => __( 'On swipe end', 'master-slider' ),
      'cb_010' => __( 'Are you sure you want to remove "%s" callback?', 'master-slider' ),
      'cb_011' => __( 'On slider Init', 'master-slider' ),

      // ControlsController.js
      'cc_001' => __( 'Arrows', 'master-slider' ),
      'cc_002' => __( 'Line Timer', 'master-slider' ),
      'cc_003' => __( 'Bullets', 'master-slider' ),
      'cc_004' => __( 'Circle Timer', 'master-slider' ),
      'cc_005' => __( 'Scrollbar', 'master-slider' ),
      'cc_006' => __( 'Slide Info', 'master-slider' ),
      'cc_007' => __( 'Thumblist/Tabs', 'master-slider' ),

      // EffectsController
      'ec_001' => __( 'Please enter name for new preset effect', 'master-slider' ),
      'ec_002' => __( 'Custom effect', 'master-slider' ),
      
      // LayersController.js
      'lc_001' => __( 'Text Layer', 'master-slider' ),
      'lc_002' => __( 'Image Layer', 'master-slider' ),
      'lc_003' => __( 'Video Layer', 'master-slider' ),
      'lc_004' => __( 'Hotspot', 'master-slider' ),
      'lc_006' => __( 'Button Layer', 'master-slider' ),

      // StylesController.js
      'sc_001' => __( 'Please enter name for new preset style', 'master-slider' ),
      'sc_002' => __( 'Custom style', 'master-slider' ),

      //SliderModel.js
      'sm_001' => __( 'Untitled Slider', 'master-slider' ),

      // EffectEditorView.js
      'ee_001' => __( 'Preset Transitions', 'master-slider' ),
      'ee_002' => __( 'Apply transition', 'master-slider' ),
      'ee_003' => __( 'Save as preset', 'master-slider' ),
      'ee_006' => __( 'Transition Editor', 'master-slider' ),

      // StageView.js
      'sv_001' => __( 'Align to stage :', 'master-slider' ),
      'sv_002' => __( 'Snapping :', 'master-slider' ),
      'sv_003' => __( 'Zoom :', 'master-slider' ),
      'sv_010' => __( 'Layer position origin : ', 'master-slider' ),

      //StyleEditorView.js
      'se_001' => __( 'Apply style', 'master-slider' ),
      'se_002' => __( 'Save as preset', 'master-slider' ),
      'se_003' => __( 'Preset Styles', 'master-slider' ),
      'se_004' => __( 'By deleting preset style it also will be removed from other sliders in your website. Are you sure you want to delete "%s"?', 'master-slider' ),
      'se_006' => __( 'Style Editor', 'master-slider' ),

      //TemplatesView.js
      'tv_001' => __( 'Master Slider Templates', 'master-slider' ),
      'tv_002' => __( 'Changing template will reset all slider controls and will change some slider settings. Continue?', 'master-slider'),
      //TimelineView.js
      'tl_001' => __( 'Show/Hide all', 'master-slider' ),
      'tl_002' => __( 'Solo All', 'master-slider' ),
      'tl_003' => __( 'Lock/Unlock all', 'master-slider' ),
      'tl_004' => __( 'Exit preview', 'master-slider' ),
      'tl_005' => __( 'Preview slide', 'master-slider' ),
      'tl_006' => __( 'Show/Hide', 'master-slider' ),
      'tl_007' => __( 'Solo', 'master-slider' ),
      'tl_008' => __( 'Lock/Unlock', 'master-slider' ),
      'tl_009' => __( 'Are you sure you want to remove this layer?', 'master-slider' ),
      'tl_010' => __( 'Start delay :', 'master-slider' ),
      'tl_011' => __( 'Show duration :', 'master-slider' ),
      'tl_012' => __( 'Waiting duration :', 'master-slider' ),
      'tl_013' => __( 'Hide duration :', 'master-slider' ),

      //UIViews.js
      'ui_001' => __( 'Show/Hide slide', 'master-slider' ),
      'ui_002' => __( 'Duplicate slide', 'master-slider' ),
      'ui_003' => __( 'Remove slide', 'master-slider' ),
      'ui_004' => __( 'Are you sure you want to delete this slide?', 'master-slider' ),
      'ui_005' => __( 'Open on the same page', 'master-slider' ),
      'ui_006' => __( 'Open on new page', 'master-slider' ),
      'ui_007' => __( 'Open in parent frame', 'master-slider' ),
      'ui_008' => __( 'Open in main frame', 'master-slider' ),
      'ui_009' => __( 'Fill', 'master-slider' ),
      'ui_010' => __( 'Fit', 'master-slider' ),
      'ui_011' => __( 'Center', 'master-slider' ),
      'ui_012' => __( 'Stretch', 'master-slider' ),
      'ui_013' => __( 'Tile', 'master-slider' ),
      'ui_014' => __( 'None', 'master-slider' ),
      'ui_015' => __( 'Align top', 'master-slider' ),
      'ui_016' => __( 'Align vertical center', 'master-slider' ),
      'ui_017' => __( 'Align bottom', 'master-slider' ),
      'ui_018' => __( 'Align left', 'master-slider' ),
      'ui_019' => __( 'Align horizontal center', 'master-slider' ),
      'ui_020' => __( 'Align right', 'master-slider' ),
      
      'ui_030' => __( 'Scroll to an element in page :', 'master-slider' ),
      'ui_031' => __( 'Target element :', 'master-slider' ),
      
      // ApplicationController.js
      'ap_001' => __( 'Sending data...', 'master-slider' ),
      'ap_002' => __( 'An Error accorded, please try again.', 'master-slider' ),
      'ap_003' => __( 'Data saved successfully.', 'master-slider' ),

      'flk_001' => __( 'Photo title', 'master-slider' ),
      'flk_002' => __( 'Photo owner name', 'master-slider' ),
      'flk_003' => __( 'Date taken', 'master-slider' ),
      'flk_004' => __( 'Photo description', 'master-slider' ),

      'fb_001' => __( 'Photo name', 'master-slider' ),
      'fb_002' => __( 'Photo owner name', 'master-slider' ),
      'fb_003' => __( 'Photo link', 'master-slider' ),

      'ui_021' => __( 'Goto next slide', 'master-slider' ),
      'ui_022' => __( 'Goto previous slide', 'master-slider' ),
      'ui_022' => __( 'Goto slide', 'master-slider' ),
      'ui_023' => __( 'Pause timer', 'master-slider' ),
      'ui_024' => __( 'Resume timer', 'master-slider' ),

      'be_001' => __( 'Update Button Style', 'master-slider' ),
      'be_002' => __( 'Save As New Button', 'master-slider' ),
      'be_003' => __( 'Are you sure you want to delete this button?', 'master-slider' ),
      'be_004' => __( 'Buttons', 'master-slider' ),
      'be_005' => __( 'Button Editor', 'master-slider' ),
      'be_006' => __( 'By updating a button it will be changed in all of your sliders. Are you sure you want to update this button?', 'master-slider' )
      
    ) ) );
  
  }



  /**
   * Add general script localizations 
   */
  public function add_general_script_localizations() {

    wp_localize_script( 'jquery', '__MSP_GEN_LAN', apply_filters( 'masterslider_admin_general_localize', array(
      
      'genl_001' => __( 'The changes you made will be lost if you navigate away from this page. To exit preview mode click on close (X) button.', 'master-slider' ),
      'genl_002' => __( 'Master Slider Preview', 'master-slider' ),
      'genl_003' => __( 'Loading Slider ..', 'master-slider' ),
      'genl_004' => __( 'Creating The Slider ..', 'master-slider' ), 
      'genl_005' => __( 'Select a Starter', 'master-slider' ),
      'genl_006' => __( 'No slider is selected to export.', 'master-slider' ),
      'genl_007' => __( 'Import', 'master-slider' )

    ) ) );
  
  }



  /**
   * Panel spesific styles
   * 
   * @return void
   */
  public function load_panel_styles() {

    // Master Slider Panel styles
    wp_enqueue_style( MSWP_SLUG .'-reset',      MSWP_AVERTA_ADMIN_URL . '/views/slider-panel/css/reset.css',          array(), MSWP_AVERTA_VERSION );
    wp_enqueue_style( MSWP_SLUG .'-jq-ui',      MSWP_AVERTA_ADMIN_URL . '/views/slider-panel/css/jquery-ui-1.10.4.min.css', array(), MSWP_AVERTA_VERSION );
    wp_enqueue_style( MSWP_SLUG .'-spectrum',     MSWP_AVERTA_ADMIN_URL . '/views/slider-panel/css/spectrum.css',       array(), MSWP_AVERTA_VERSION );
    wp_enqueue_style( MSWP_SLUG .'-codemirror',   MSWP_AVERTA_ADMIN_URL . '/views/slider-panel/css/codemirror.css',       array(), MSWP_AVERTA_VERSION );
    wp_enqueue_style( MSWP_SLUG .'-jscrollpane',  MSWP_AVERTA_ADMIN_URL . '/views/slider-panel/css/jquery.jscrollpane.css',   array(), MSWP_AVERTA_VERSION );
    wp_enqueue_style( MSWP_SLUG .'-main-style',   MSWP_AVERTA_ADMIN_URL . '/views/slider-panel/css/msp-style.css',        array(), MSWP_AVERTA_VERSION );
    wp_enqueue_style( MSWP_SLUG .'-components',   MSWP_AVERTA_ADMIN_URL . '/views/slider-panel/css/msp-components.css',     array(), MSWP_AVERTA_VERSION );

  }

  /**
   * Master slider general/common styles
   * 
   * @return void
   */
  public function load_general_styles() {
    // gnereal styles for masterslider admin page
    wp_enqueue_style( MSWP_SLUG .'-admin-styles',   MSWP_AVERTA_ADMIN_URL . '/assets/css/msp-general.css', array(), MSWP_AVERTA_VERSION );
  }


  public function load_general_scripts() {
    // disable wp autosave on master slider panel 
    wp_dequeue_script( 'autosave' );
    wp_enqueue_script( MSWP_SLUG .'-admin-scripts', MSWP_AVERTA_ADMIN_URL . '/assets/js/admin.js', array('jquery', 'jquery-ui-core', 'jquery-ui-dialog'), MSWP_AVERTA_VERSION, true );
  }

}