<?php // load admin related classes & functions

// load admin related functions
include_once( 'msp-admin-functions.php' );
include_once( 'msp-admin-templates.php' );
include_once( 'msp-sample-sliders.php' );

// load admin related classes
include_once( 'classes/class-axiom-list-table.php'  );
include_once( 'classes/class-msp-list-table.php'    );
include_once( 'classes/class-axiom-screen-help.php' );
include_once( 'classes/class-msp-screen-help.php'   );
include_once( 'classes/class-msp-admin-assets.php'  );
include_once( 'classes/class-msp-admin-editor.php'  );
// include_once( 'classes/class-msp-pointers.php'      );
include_once( 'classes/class-msp-importer.php' 		);


if( isset( $_REQUEST['action'] ) && 'preview' ==  $_REQUEST['action'] ) {
	$frontend_assets = include_once( MSWP_AVERTA_PUB_DIR.'/includes/class-msp-frontend-assets.php' );
	$frontend_assets->admin_hooks();
}

do_action( 'masterslider_admin_classes_loaded' );

// load admin related functions
include_once( 'msp-compatibility.php' );
include_once( 'msp-hooks.php' );