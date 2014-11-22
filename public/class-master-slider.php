<?php
/**
 * Master Slider.
 *
 * @package   MasterSlider
 * @author    averta [averta.net]
 * @license   LICENSE.txt
 * @link      http://masterslider.com
 * @copyright Copyright © 2014 averta
 */

if ( ! class_exists( 'Master_Slider' ) ) :

/**
 * Plugin class. This class should ideally be used to work with the
 * public-facing side of the WordPress site.
 */
class Master_Slider {

	/**
	 * Instance of this class.
	 *
	 * @since    1.0.0
	 *
	 * @var      object
	 */
	protected static $instance = null;


	/**
	 * Instance of Master_Slider_Admin class.
	 *
	 * @since    1.0.0
	 *
	 * @var      object
	 */
	public $admin = null;



	/**
	 * Initialize the plugin
	 *
	 * @since     1.0.0
	 */
	private function __construct() {

		$this->includes();

		add_action( 'init', array( $this, 'init' ) );

		// Activate plugin when new blog is added
		add_action( 'wpmu_new_blog', array( $this, 'activate_new_site' ) );

		// Loaded action
		do_action( 'masterslider_loaded' );
	}


	/**
	 * 
	 * @return [type] [description]
	 */
	private function includes() {

		// load common functionalities
		include_once( MSWP_AVERTA_INC_DIR . '/index.php' );
			

		// Dashboard and Administrative Functionality
		if ( is_admin() ) {

			// Load AJAX spesific codes on demand 
			if ( defined('DOING_AJAX') && DOING_AJAX ){
				include_once( MSWP_AVERTA_ADMIN_DIR . '/includes/classes/class-msp-admin-ajax.php');
				include_once( MSWP_AVERTA_ADMIN_DIR . '/includes/msp-admin-functions.php');
			}
			
			// Load admin spesific codes 
			else {
				$this->admin = include( MSWP_AVERTA_ADMIN_DIR . '/class-master-slider-admin.php' );
			}

		// Load Frontend Functionality
		} else {

			include_once( 'includes/class-msp-frontend-assets.php' );
		}

	}


	/**
	 * Init Masterslider when WordPress Initialises.
	 * 	
	 * @return void
	 */
	public function init(){

		// Before init action
		do_action( 'before_masterslider_init' );

		// Load plugin text domain
		$this->load_plugin_textdomain();

		// Init action
		do_action( 'masterslider_init' );
	}


	/**
	 * Return an instance of this class.
	 *
	 * @since     1.0.0
	 *
	 * @return    object    A single instance of this class.
	 */
	public static function get_instance() {

		// If the single instance hasn't been set, set it now.
		if ( null == self::$instance ) {
			self::$instance = new self;
		}
		
		return self::$instance;
	}

	/**
	 * Fired when the plugin is activated.
	 *
	 * @since    1.0.0
	 *
	 * @param    boolean    $network_wide    True if WPMU superadmin uses
	 *                                       "Network Activate" action, false if
	 *                                       WPMU is disabled or plugin is
	 *                                       activated on an individual blog.
	 */
	public static function activate( $network_wide ) {
		
		if ( function_exists( 'is_multisite' ) && is_multisite() ) {

			if ( $network_wide  ) {

				// Get all blog ids
				$blog_ids = self::get_blog_ids();

				foreach ( $blog_ids as $blog_id ) {

					switch_to_blog( $blog_id );
					self::single_activate();
				}

				restore_current_blog();

			} else {
				self::single_activate();
			}

		} else {
			self::single_activate();
		}
		
	}

	/**
	 * Fired when the plugin is deactivated.
	 *
	 * @since    1.0.0
	 *
	 * @param    boolean    $network_wide    True if WPMU superadmin uses
	 *                                       "Network Deactivate" action, false if
	 *                                       WPMU is disabled or plugin is
	 *                                       deactivated on an individual blog.
	 */
	public static function deactivate( $network_wide ) {

		if ( function_exists( 'is_multisite' ) && is_multisite() ) {

			if ( $network_wide ) {

				// Get all blog ids
				$blog_ids = self::get_blog_ids();

				foreach ( $blog_ids as $blog_id ) {

					switch_to_blog( $blog_id );
					self::single_deactivate();

				}

				restore_current_blog();

			} else {
				self::single_deactivate();
			}

		} else {
			self::single_deactivate();
		}

	}

	/**
	 * Fired when a new site is activated with a WPMU environment.
	 *
	 * @since    1.0.0
	 *
	 * @param    int    $blog_id    ID of the new blog.
	 */
	public function activate_new_site( $blog_id ) {

		if ( 1 !== did_action( 'wpmu_new_blog' ) ) {
			return;
		}

		switch_to_blog( $blog_id );
		self::single_activate();
		restore_current_blog();

	}

	/**
	 * Get all blog ids of blogs in the current network that are:
	 * - not archived
	 * - not spam
	 * - not deleted
	 *
	 * @since    1.0.0
	 *
	 * @return   array|false    The blog ids, false if no matches.
	 */
	private static function get_blog_ids() {

		global $wpdb;

		// get an array of blog ids
		$sql = "SELECT blog_id FROM $wpdb->blogs
			WHERE archived = '0' AND spam = '0'
			AND deleted = '0'";

		return $wpdb->get_col( $sql );

	}

	/**
	 * Fired for each blog when the plugin is activated.
	 *
	 * @since    1.0.0
	 */
	private static function single_activate() {

		global $mspdb;
		$mspdb->create_tables();

		// add masterslider custom caps
		self::assign_custom_caps();
		do_action( 'masterslider_activated', get_current_blog_id() );
	}

	/**
	 * Assign masterslider custom capabilities to main roles
	 * @return void
	 */
	public static function assign_custom_caps( $force_update = false ){

		// check if custom capabilities are added before or not
		$is_added = get_option( 'masterslider_capabilities_added', 0 );

		// add caps if they are not already added
		if( ! $is_added || $force_update ) {

			// assign masterslider capabilities to following roles
			$roles = array( 'administrator', 'editor' );

			foreach ( $roles as $role ) {
				if( ! $role = get_role( $role ) ) 
					continue;
				$role->add_cap( 'access_masterslider'  ); 
				$role->add_cap( 'publish_masterslider' ); 
				$role->add_cap( 'delete_masterslider'  ); 
				$role->add_cap( 'create_masterslider'  );
				$role->add_cap( 'export_masterslider'  );
				$role->add_cap( 'duplicate_masterslider'  );
			}

			update_option( 'masterslider_capabilities_added', 1 );
		}
	}


	/**
	 * Set default options
	 *
	 * @since    1.0.0
	 */
	public static function set_default_options( $force_update = false ){
		
	}


	/**
	 * Fired for each blog when the plugin is deactivated.
	 *
	 * @since    1.0.0
	 */
	private static function single_deactivate() {
		do_action( 'masterslider_deactivated' );
	}

	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		$locale = apply_filters( 'plugin_locale', get_locale(), MSWP_TEXT_DOMAIN );
		load_textdomain( MSWP_TEXT_DOMAIN, trailingslashit( WP_LANG_DIR ) . MSWP_TEXT_DOMAIN . '/' . MSWP_TEXT_DOMAIN . '-' . $locale . '.mo' );
		load_plugin_textdomain( MSWP_TEXT_DOMAIN, FALSE, basename( MSWP_AVERTA_DIR ) . '/languages/' );
	}

}

endif;

function MSP(){ return Master_Slider::get_instance(); } 
MSP();


class MSP_AttachmentFields {
	
    private $fields = array();
    
	function __construct($fields = null) {
		if(isset($fields) && is_array($fields))
		  $this->$fields = $fields;
	}
    
    public function add($field){
        if(is_array($field))
            $this->fields[] = $field;
    }
    
    public function init(){
        add_filter( 'attachment_fields_to_edit', array( $this, 'addFields'  ), 11, 2 );
        add_filter( 'attachment_fields_to_save', array( $this, 'saveFields' ), 11, 2 );
    }
    
    public function addFields( $form_fields, $post ){

        $form_fields['image_rating'] = array(
	        'label'       => __( 'rating', "default" ),
	        'input'       => 'radio',
	        'options' => array(
	            '1' => 1,
	            '2' => 2,
	            '3' => 3,
	            '4' => 4,
	            '5' => 5
	        ),
	        'application' => 'image',
	        'exclusions'   => array( 'audio', 'video' )
	    );

        return $form_fields;
    }
    
    public function saveFields($post, $attachment) {
        return $post;
    }
}

$attach_fields = new MSP_AttachmentFields();
$attchments_options = array(
    'image_copyright' => array(
        'label'       => '',
        'input'       => 'text',
        'helps'       => '',
        'application' => 'image',
        'exclusions'  => array( 'audio', 'video' ),
        'required'    => true,
        'error_text'  => __( 'Field is required', "default" )
    ),
    'image_rating' => array(
        'label'       => __( 'rating', "default" ),
        'input'       => 'radio',
        'options' => array(
            '1' => 1,
            '2' => 2,
            '3' => 3,
            '4' => 4,
            '5' => 5
        ),
        'application' => 'image',
        'exclusions'   => array( 'audio', 'video' )
    )
);
$attach_fields->init();
