<?php //

class MSP_List_Table extends Axiom_List_Table {


	function __construct(){
                
        //Set parent defaults
        parent::__construct( array(
            'singular'  => 'slider',     // singular name of the listed records
            'plural'    => 'sliders',    // plural name of the listed records
            'ajax'      => false        // does this table support ajax?
        ) );
        
    }


	function get_columns(){
	  $columns = array(
	    'ID' 			=> 'ID',
	    'title' 		=> 'Name',
	    'shortcode'    	=> 'Shortcode',
	    'slides_num'	=> 'Slides',
	    'date_modified' => 'Last Modify',
	    'date_created' 	=> 'Date Created',
	    'action' 		=> 'Action'
	  );
	  return $columns;
	}



	function get_sortable_columns() {
	  $sortable_columns = array(
	    'ID'  			=> array('ID',false),
	    'date_created'  => array('date_created',false),
	    'date_modified' => array('date_created',false)
	  );
	  return $sortable_columns;
	}



	function column_title($item) {
		return sprintf('<a href="?page=%s&action=%s&slider_id=%s">%s</a>',$_REQUEST['page'],'edit', $item['ID'], $item['title'] );
	}

	function column_action( $item ) {
		$paged = $this->get_pagenum();
		$paged_arg = (int)$paged > 1 ? '&paged=' . $paged : '';

		$buttons  = '';

		if( current_user_can( 'duplicate_masterslider' ) || apply_filters( 'masterslider_admin_display_duplicate_btn', 0 ) )
			$buttons .= sprintf( '<a class="action-duplicate msp-ac-btn msp-btn-gray msp-iconic" href="?page=%s&action=%s&slider_id=%s%s"><span></span>%s</a>',$_REQUEST['page'],'duplicate'	,$item['ID'], $paged_arg, __('duplicate') );
	    
		if( current_user_can( 'delete_masterslider' ) || apply_filters( 'masterslider_admin_display_delete_btn', 0 ) ) {
	    	$buttons .= sprintf( '<a class="action-delete msp-ac-btn msp-btn-red msp-iconic" href="?page=%s&action=%s&slider_id=%s%s" onClick="return confirm(\'%s\');" ><span></span>%s</a>', $_REQUEST['page'],'delete' ,$item['ID'], 
	    	                     $paged_arg, wp_slash( apply_filters( 'masterslider_admin_delete_btn_alert_message', __( 'Are you sure you want to delete this slider?' , MSWP_TEXT_DOMAIN ) ) ), 
	    	                     __('delete') 
	    	            );
		}
	    
	    $buttons .= sprintf( '<a class="action-preview msp-ac-btn msp-btn-blue msp-iconic" href="?page=%s&action=%s&slider_id=%s" onClick="lunchMastersliderPreviewBySliderID(%s);return false;" ><span></span>%s</a>',$_REQUEST['page'],'preview' ,$item['ID'], $item['ID'], __('preview') );
	    
	  	return $buttons;
	}



    function process_bulk_action() {
        
        $slider_id = isset( $_REQUEST['slider_id'] ) ? $_REQUEST['slider_id'] : '';

        // check if a delete request recieved
        if( current_user_can( 'delete_masterslider' ) && 'delete' === $this->current_action() ) {
        
            global $mspdb;
			$mspdb->delete_slider($slider_id);
			// echo "Slider id ($slider_id) Removed";
        
        } else {
        	add_action( 'admin_notices', array( $this, 'delete_error_notice' ) );
        }

        // check if a duplicate request recieved
        if( current_user_can( 'duplicate_masterslider' ) && 'duplicate' === $this->current_action() ) {

        	global $mspdb;
			$mspdb->duplicate_slider($slider_id);
			// echo "Slider id ($slider_id) duplicated";
			
		} else {
			add_action( 'admin_notices', array( $this, 'duplicate_error_notice' ) );
		}
        
    }


    function delete_error_notice () {
    	printf( '<div class="error" style="display:block;" ><p>%s</p></div>', 
				apply_filters( 'masterslider_delete_insufficient_permissions_notice', __( "Sorry, You don't have enough permission to delete slider.", MSWP_TEXT_DOMAIN ) ) 
		);
    }


    function duplicate_error_notice () {
    	printf( '<div class="error" style="display:block;" ><p>%s</p></div>', 
				apply_filters( 'masterslider_duplicate_insufficient_permissions_notice', __( "Sorry, You don't have enough permission to duplicate slider.", MSWP_TEXT_DOMAIN ) ) 
		);
    }


	function no_items() {
	  _e( 'No slider found.', MSWP_TEXT_DOMAIN );
	}


	function column_default( $item, $column_name ) {
		global $mspdb;
		
		switch( $column_name ) {
	    	case 'shortcode':
	    		return sprintf('[masterslider id="%s"]', $item['ID']);
	    	case 'date_modified':

	    		$orig_time = isset( $item['date_modified'] ) ? strtotime($item['date_modified']) : '';
	    		$time = date_i18n( 'Y/m/d @ g:i:s A', $orig_time );
	    		$human = human_time_diff( $orig_time );
	    		return sprintf( '<abbr title="%s">%s</abbr>', $time, $human . __(' ago', MSWP_TEXT_DOMAIN) ) ;
	    	case 'date_created':
		    	$orig_time = isset( $item['date_created'] ) ? strtotime($item['date_created']) : '';
		    	$date = date_i18n( 'Y/m/d', $orig_time );
		    	$time = date_i18n( 'Y/m/d @ g:i:s A', $orig_time );
		    	return sprintf( '<abbr title="%s">%s</abbr>', $time, $date );
		    case 'slides_num':
		    	global $mspdb;
		    	return $mspdb->get_slider_field_val( $item['ID'], 'slides_num' );
		    case 'ID':
		    case 'title':
		      return $item[ $column_name ];
		    default:
		    	return;
	      		//return print_r( $item, true ) ; //Show the whole array for troubleshooting purposes
		}
	}


	function get_records( $perpage = 20, $paged  = 1, $orderby = 'ID', $sort = 'DESC'  ){
		global $mspdb;
		
		$offset  = ( (int)$paged - 1 ) * $perpage;
		$orderby = isset( $_REQUEST['orderby'] ) ? $_REQUEST['orderby'] : 'ID';
		$sort 	 = isset( $_REQUEST['order'] ) ? $_REQUEST['order'] : 'ASC';
		
		return $mspdb->get_sliders( $perpage, $offset, $orderby, $sort );
	}


	function get_total_count(){
		global $mspdb;
		return $mspdb->get_total_sliders_count();
	}



	function prepare_items() {

		$columns 	= $this->get_columns();
		$hidden 	= array();
		$sortable 	= $this->get_sortable_columns();
	  
		$this->_column_headers = array( $columns, $hidden, $sortable );
		
		$this->process_bulk_action();

		$perpage 		= (int) apply_filters( 'masterslider_admin_sliders_per_page', 10 );
		$current_page 	= $this->get_pagenum();
		$orderby 		= 'ID';
		$sort 			= 'DESC';
		$total_items 	=  $this->get_total_count();


		$this->items 	= $this->get_records( $perpage, $current_page, $orderby, $sort );
		// echo '<pre>'; print_r( $this->items ); echo '</pre>';

		// tell the class the total number of items and how many items to show on a page
		$this->set_pagination_args( array(
		    'total_items' => $total_items,
			'per_page'    => $perpage
		));
	}

}


// global $master_list_table;
// $master_list_table = new Master_List_Table();
// $master_list_table->prepare_items(); 

