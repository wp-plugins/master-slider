<?php
/**
 * Master Slider WordPress Plugin.
 *
 * @package   MasterSlider
 * @author    averta [averta.net]
 * @license   LICENSE.txt
 * @link      http://masterslider.com
 * 
 *
 * Plugin Name:       Master Slider
 * Plugin URI:        https://wordpress.org/plugins/master-slider/
 * Description:       Master Slider is the most advanced responsive HTML5 WordPress slider plugin with touch swipe navigation that works smoothly on devices too.
 * Version:           1.4.4
 * Author:            averta
 * Author URI:        http://averta.net
 * Text Domain:       master-slider
 * License URI:       license.txt
 * Domain Path:       /languages
 * Tested up to: 	  4.1.0
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die('No Naughty Business Please !');
}

// Abort loading if WordPress is upgrading
if ( defined( 'WP_INSTALLING' ) && WP_INSTALLING ) {
    return;
}

function msp_two_instance_notice() {
    echo '<div class="error"><p>' . __( 'You are using two instances of MasterSlider plugin at same time, please deactive one of them.', 'master-slider' ) . '</p></div>';
}

if( defined( 'MSWP_AVERTA_VERSION' ) ){
	add_action( 'admin_notices', 'msp_two_instance_notice' );
	return;
}

/*----------------------------------------------------------------------------*/

require_once( plugin_dir_path( __FILE__ ) . 'includes/init/define.php' 		 );
require_once( plugin_dir_path( __FILE__ ) . 'public/class-master-slider.php' );

// Register hooks that are fired when the plugin is activated or deactivated.
register_activation_hook  ( __FILE__, array( 'Master_Slider', 'activate'   ) );
register_deactivation_hook( __FILE__, array( 'Master_Slider', 'deactivate' ) );

/*----------------------------------------------------------------------------*/

