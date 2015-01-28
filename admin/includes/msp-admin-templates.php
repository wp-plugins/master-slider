<?php

function msp_get_panel_header(){
?>
	<div id="msp-header">
        <div class="msp-logo">
        	<a href="<?php echo admin_url( 'admin.php?page='.MSWP_SLUG ); ?>">
        		<img src="<?php echo MSWP_AVERTA_ADMIN_URL; ?>/views/slider-panel/images/masterslider.gif">
        	</a>
        </div>
        <?php if( isset( $_GET['action'] ) && 'edit' == $_GET['action'] ) { ?>
        <a class="upgrade-pro" href="http://avt.li/mslpan" title="<?php _e( "Upgrade to PRO version to unlock more features. Click to see the list of features." ); ?>" target="_blank"><?php _e( "Upgrade to PRO Version", MSWP_TEXT_DOMAIN ); ?></a>
    	<?php } ?>
    </div>
<?php
}