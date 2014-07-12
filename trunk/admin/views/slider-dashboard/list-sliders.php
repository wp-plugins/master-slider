<?php
    msp_get_panel_header();

    // Display sliders list
	$slider_table_list = new MSP_List_Table();
	$slider_table_list->prepare_items(); 
	$slider_table_list->display(); 


	// Display action buttons
	echo '<div class="action-btns-list">';

	if( current_user_can( 'create_masterslider' ) )
		printf( '<a id="msp-add-slider" class="action-add-new msp-ac-btn msp-btn-blue msp-iconic-big" href="%s"><span></span>%s</a>', admin_url( 'admin.php?page='.MSWP_SLUG.'&action=add' ), __( 'Create New Slider', MSWP_TEXT_DOMAIN )  );
	
	if( current_user_can( 'export_masterslider' ) || apply_filters( 'masterslider_admin_display_export_import', 0 ) )
		printf( '<a class="action-import-export msp-ac-btn" href="%s" onClick="lunchMastersliderImportExport(); return false;">%s</a>', admin_url( 'admin.php?page='.MSWP_SLUG ), __( 'Import & Export', MSWP_TEXT_DOMAIN )  );
	
	echo '</div>';
	
	

	if( current_user_can( 'create_masterslider' ) ) { ?>

	<div id="msp-slider-type-select" >

	    <div class="msp-templates-list">

	    	<?php
	    	sanitize_title( '' );
	    	$starter_sections = msp_get_slider_starter_sections();
	    	$starter_fields   = msp_get_slider_starter_fields();

	    	foreach ( $starter_sections as $starter_section ) {
		    	?>
		    	<div class="msp-dialog-inner-title ui-helper-clearfix">
		    		<span><?php echo $starter_section['title']; ?></span>
		    	</div>
		    	<?php

		    	$section_id = $starter_section['id'];
	    		$section_fields = isset( $starter_fields[ $section_id ] ) ? $starter_fields[ $starter_section['id'] ] : array();

	    		foreach ( $section_fields as $starter_data ) {

	    			$selected_attr  = ( 'true' == $starter_data['selected'] ) ? 'selected' : '';
	    			$is_unavailable = isset( $starter_data['disable'] ) && 'true' == $starter_data['disable'] ? ' is-unavailable' : '';
	    			$disabled_msg   = isset( $starter_data['disabled_msg'] ) && ! empty( $starter_data['disabled_msg'] ) ? $starter_data['disabled_msg'] : '';
	    			
	    			?>
					<div class="msp-template-figure <?php echo $selected_attr . $is_unavailable; ?>" data-slider-type="<?php echo $starter_data['slidertype']; ?>" 
							data-starter-uid="<?php echo $starter_data['id']; ?>" data-starter-section="<?php echo $section_id; ?>" data-disabled-msg="<?php echo $disabled_msg; ?>"  >
				        <div class="msp-templte-selected"></div> 
				        <img src="<?php echo $starter_data['screenshot']; ?>" />
				        <div class="msp-template-caption"><?php echo $starter_data['label']; ?><span></span></div>
			        </div>
	    			<?php
		    		
		    	}

		    	?>
		    	<div class="section-divider"></div>
		    	<?php
	    	}
	    	
	    ?>
	    </div>

	    <div class="msp-templates-bottom">
	        <button id="msp-slider-type-create" class="msp-blue-btn msp-applyeffect"><?php _e( 'Create', MSWP_TEXT_DOMAIN ); ?></button>
	    </div>
	</div>

<?php } ?>



<?php if( current_user_can( 'export_masterslider' ) || apply_filters( 'masterslider_admin_display_export_import', 0 ) ) { ?>

	<div class="msp-import-export-wrapper" >
		
		<?php do_action( 'masterslider_before_import_dialog_content' ); ?>

	    <div class="msp-import-wrapper">

			<form action="<?php echo admin_url( 'admin.php?import=masterslider-importer&step=2' ); ?>" method="post" enctype="multipart/form-data" class="msp-import-form msp-dialog-inner-section">

				<fieldset>
					<?php wp_nonce_field('import-msp-sliders'); ?>

					<input type="hidden" name="msp-import" value="1">

					<input type="file" name="msp-import-file" class="msp-select-file">

					<button class="button msp-ac-btn msp-btn-blue"><?php _e('Import', MSWP_TEXT_DOMAIN ) ?></button>
				</fieldset>

				<span class="msp-dialog-section-desc"><?php  _e( 'To import sliders select Masterslider Export file that you downloaded before then click import button.', MSWP_TEXT_DOMAIN ) ?></span>
			
			</form>

	    </div>

	    <div class="msp-export-wrapper">
			<h4 class="msp-dialog-inner-split-header"><?php _e('Export', MSWP_TEXT_DOMAIN ) ?></h4>

			<form action="<?php echo $_SERVER['REQUEST_URI'] ?>" method="post" class="msp-export-form msp-dialog-inner-section">
				
				<div class="msp-export-table-container">

					<table class="msp-export-table widefat fixed msp-export-sliders-table">

						<thead>
							<tr>
								<th class="export-column export-field-cb" >
									<input type="checkbox" name="export-check-all" class="export-check-all" />
								</th>
								<th class="export-column export-field-ID" >ID</th>
								<th class="export-column export-field-title" >Name</th>
								<th class="export-column export-field-type" >Type</th>
								<th class="export-column export-field-lastmodify" >Last Modify</th>	
							</tr>
						</thead>

						<tbody>
	<?php
	global $mspdb;
	$sliders = $mspdb->get_sliders_list();
	foreach ( $sliders as $slider ) {
		$orig_time = isset( $slider['date_modified'] ) ? strtotime($slider['date_modified']) : '';
	    $time = date_i18n( 'Y/m/d @ g:i:s A', $orig_time );
	    $human_time = human_time_diff( $orig_time );
	?>
							<tr>
								<th class="export-column export-field-cb" ><input type="checkbox" name="msp-export-sliders[]" class="export-slider-cb" value="<?php echo $slider['ID']; ?>" /></th>
								<th class="export-column export-field-ID" ><?php echo $slider['ID']; ?></th>
								<th class="export-column export-field-title" ><?php echo $slider['title']; ?></th>
								<th class="export-column export-field-type" ><?php echo $slider['type']; ?></th>
								<th class="export-column export-field-lastmodify" ><abbr title="<?php echo $time; ?>"><?php echo $human_time; ?></abbr></th>	
							</tr>
	<?php } ?>
						</tbody>

					</table>
				
				</div>

				<fieldset>
					<?php wp_nonce_field('export-msp-sliders'); ?>

					<input type="hidden" name="msp-export" value="1">
					
					<button id="msp-export-btn" class="button msp-ac-btn msp-btn-blue"><?php _e('Export', MSWP_TEXT_DOMAIN ) ?></button>
				</fieldset>

				<span class="msp-dialog-section-desc"><?php  _e( 'Downloads an export file that contains your selected sliders to import on your new site.', MSWP_TEXT_DOMAIN ); ?></span>
			
			</form>

	    </div>
	</div>

<?php } ?>

