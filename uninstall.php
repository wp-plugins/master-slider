<?php
/**
 * Fired when the plugin is uninstalled.
 *
 * Uninstalling MasterSlider deletes tables(sliders), user roles and options.
 *
 * @package   MasterSlider
 * @author    averta [averta.net]
 * @license   LICENSE.txt
 * @link      http://masterslider.com
 * @copyright Copyright © 2014 averta
 */

// If uninstall not called from WordPress, then exit
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit( 'No Naughty Business Please !' );
}

if ( ! defined( 'MS_UNINSTALL_PLUGIN' ) ) {
	exit();
}

global $wpdb;

// MasterSlider Tables
$wpdb->query( "DROP TABLE IF EXISTS " . $wpdb->prefix . "masterslider_sliders" );
$wpdb->query( "DROP TABLE IF EXISTS " . $wpdb->prefix . "masterslider_options" );

// MasterSlider user roles
$roles = array( 'administrator', 'editor' );

foreach ( $roles as $role ) {
	$role = get_role( $role );
	$role->remove_cap( 'access_masterslider'  ); 
	$role->remove_cap( 'publish_masterslider' ); 
	$role->remove_cap( 'delete_masterslider'  ); 
	$role->remove_cap( 'create_masterslider'  );
	$role->remove_cap( 'export_masterslider'  );
	$role->remove_cap( 'duplicate_masterslider'  );
}

// Delete Masterslider related options
$wpdb->query("DELETE FROM $wpdb->options WHERE option_name LIKE 'masterslider_%';");
$wpdb->query("DELETE FROM $wpdb->options WHERE option_name LIKE 'master_slider_%';");
