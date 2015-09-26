<?php

function msp_filter_masterslider_admin_menu_title( $menu_title ){
  $current = get_site_transient( 'update_plugins' );

    if ( ! isset( $current->response[ MSWP_AVERTA_BASE_NAME ] ) )
    return $menu_title;
  
  return $menu_title . '&nbsp;<span class="update-plugins"><span class="plugin-count">1</span></span>';
}

add_filter( 'masterslider_admin_menu_title', 'msp_filter_masterslider_admin_menu_title');


function after_master_slider_row_meta( $plugin_meta, $plugin_file, $plugin_data, $status ){
  if( MSWP_AVERTA_BASE_NAME == $plugin_file ) {
    $plugin_meta[] = '<a href="http://wordpress.org/support/view/plugin-reviews/' . MSWP_SLUG . '?rating=5#postform" target="_blank" title="' . esc_attr__( 'Rate this plugin', 'master-slider' ) . '">' . __( 'Rate this plugin', 'master-slider' ) . '</a>';
    $plugin_meta[] = '<a href="http://masterslider.com/doc/wp/free/#donate" target="_blank" title="' . esc_attr__( 'Donate', 'master-slider' ) . '">' . __( 'Donate', 'master-slider' ) . '</a>';   
  }
  return $plugin_meta;
}

add_filter( "plugin_row_meta", 'after_master_slider_row_meta', 10, 4 );


// Check to make sure the user "rich_editing" is enabled

function msp_admin_notice_rich_editing(){
    printf('<div class="update-nag">%s</div>', __( 'Warning: the [rich editing] capability is disabled for this user which might lead to some potential issues. Please enable it.', 'default' ) );
}

function msp_check_vital_user_capabilities(){
    $current_user = wp_get_current_user();
    if( ! get_user_meta( $current_user->ID, 'rich_editing', true ) ){
        add_action( 'admin_notices', 'msp_admin_notice_rich_editing' );
    }
}
add_action( 'admin_init', 'msp_check_vital_user_capabilities' );