<?php 

function msp_get_general_post_template_tags() {

  $tags = array(

      array( 'name'   => 'title',
           'label'    => __( 'The post title', 'master-slider' ),
           'type'   => '_general',
           'callback'   => ''
    ),

      array( 'name'   => 'content',
           'label'    => __( 'The post content', 'master-slider' ),
           'type'   => '_general',
           'callback'   => ''
    ),

      array( 'name'   => 'excerpt',
           'label'    => __( 'The post excerpt', 'master-slider' ),
           'type'   => '_general',
           'callback'   => ''
    ),
      
      array( 'name'   => 'categories',
           'label'    => __( 'The post categories', 'master-slider' ),
           'type'   => '_general',
           'callback'   => ''
    ),

    array( 'name'   => 'tags',
           'label'    => __( 'The post tags', 'master-slider' ),
           'type'   => '_general',
           'callback'   => ''
    ),

    array( 'name'   => 'permalink',
           'label'    => __( 'The post link', 'master-slider' ),
           'type'   => '_general',
           'callback'   => ''
    ),

    array( 'name'   => 'author',
           'label'    => __( 'The author name', 'master-slider' ),
           'type'   => '_general',
           'callback'   => ''
    ),

    array( 'name'   => 'post_id',
           'label'    => __( 'The unique ID of the post', 'master-slider' ),
           'type'   => '_general',
           'callback'   => ''
    ),

    array( 'name'   => 'image',
           'label'    => __( 'Post image', 'master-slider' ),
           'type'   => '_general',
           'callback'   => ''
    ),

    array( 'name'   => 'image-url',
           'label'    => __( 'Post image source', 'master-slider' ),
           'type'   => '_general',
           'callback'   => ''
    ),

    array( 'name'   => 'year',
           'label'    => __( 'The year of the post', 'master-slider' ),
           'type'   => '_general',
           'callback'   => ''
    ),

    array( 'name'   => 'monthnum',
           'label'    => __( 'Numeric Month', 'master-slider' ),
           'type'   => '_general',
           'callback'   => ''
    ),

    array( 'name'   => 'month',
           'label'    => __( 'Month name', 'master-slider' ),
           'type'   => '_general',
           'callback'   => ''
    ),

    array( 'name'   => 'daynum',
           'label'    => __( 'Day of the month', 'master-slider' ),
           'type'   => '_general',
           'callback'   => ''
    ),

    array( 'name'   => 'day',
           'label'    => __( 'Weekday name', 'master-slider' ),
           'type'   => '_general',
           'callback'   => ''
    ),

    array( 'name'   => 'time',
           'label'    => __( 'Hour:Minutes', 'master-slider' ),
           'type'   => '_general',
           'callback'   => ''
    ),

    array( 'name'   => 'date-published',
           'label'    => __( 'The publish date', 'master-slider' ),
           'type'   => '_general',
           'callback'   => ''
    ),

    array( 'name'   => 'date-modified',
           'label'    => __( 'The last modified date', 'master-slider' ),
           'type'   => '_general',
           'callback'   => ''
    ),

    array( 'name'   => 'commentnum',
           'label'    => __( 'Number of comments', 'master-slider' ),
           'type'   => '_general',
           'callback'   => ''
    )
  );

  return apply_filters( 'masterslider_post_slider_tags_list', $tags );
}



function msp_get_woocommerce_template_tags() {

  $tags = array(

      array( 'name'   => 'wc_price',
           'label'    => __( 'Price', 'master-slider' ),
           'type'   => 'product',
           'callback'   => ''
    ),

      array( 'name'   => 'wc_regular_price',
           'label'    => __( 'Regular Price', 'master-slider' ),
           'type'   => 'product',
           'callback'   => ''
    ),

      array( 'name'   => 'wc_sale_price',
           'label'    => __( 'Sale Price', 'master-slider' ),
           'type'   => 'product',
           'callback'   => ''
    ),

    array( 'name'   => 'wc_stock_status',
           'label'    => __( 'In Stock Status', 'master-slider' ),
           'type'   => 'product',
           'callback'   => ''
    ),

    array( 'name'   => 'wc_stock_quantity',
           'label'    => __( 'Stock Quantity', 'master-slider' ),
           'type'   => 'product',
           'callback'   => ''
    ),

    array( 'name'   => 'wc_weight',
           'label'    => __( 'Weight', 'master-slider' ),
           'type'   => 'product',
           'callback'   => ''
    ),

    array( 'name'   => 'wc_product_cats',
           'label'    => __( 'Product Categories', 'master-slider' ),
           'type'   => 'product',
           'callback'   => ''
    ),

    array( 'name'   => 'wc_product_tags',
           'label'    => __( 'Product Tags', 'master-slider' ),
           'type'   => 'product',
           'callback'   => ''
    ),

    array( 'name'   => 'wc_total_sales',
           'label'    => __( 'Total Sales', 'master-slider' ),
           'type'   => 'product',
           'callback'   => ''
    ),

    array( 'name'   => 'wc_average_rating',
           'label'    => __( 'Average Rating', 'master-slider' ),
           'type'   => 'product',
           'callback'   => ''
    ),

    array( 'name'   => 'wc_rating_count',
           'label'    => __( 'Rating Count', 'master-slider' ),
           'type'   => 'product',
           'callback'   => ''
    )
  );

  return apply_filters( 'masterslider_woocommerce_product_slider_tags_list', $tags );
}



function get_post_template_tags_value( $post = null, $args = null ){
  $post = get_post( $post );

  $template_tags = msp_get_general_post_template_tags();

  if ( msp_is_plugin_active( 'woocommerce/woocommerce.php' ) )
    $template_tags = array_merge( $template_tags, msp_get_woocommerce_template_tags() );
  
  $tags_dictionary = array();

  foreach ( $template_tags as $template_tag ) {
    $tags_dictionary[ $template_tag['name'] ] = msp_get_template_tag_value( $template_tag['name'], $post, $args );
  }

  return $tags_dictionary;
}