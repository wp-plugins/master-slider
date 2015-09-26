<?php 

if( ! class_exists( 'MSP_Screen_Help' ) ) :

/**
 * Class to add help tabs on master slider admin pages
 */
class MSP_Screen_Help extends Axiom_Screen_Help {

    /**
     * __construct
     */
  function __construct() {

    // define tabs data
      $tabs = array (
          
          array('id'    => 'msp-how-use-tab',
              'title'     => __( 'Display Sliders on pages', 'master-slider' ),
              'callback'  => array( $this, 'display_masterslider' ) // callback to display tab content @km!
          ),
          array('id'    => 'msp-supp-tab',
              'title'     => __( 'Master Slider Support', 'master-slider' ),
              'callback'  => array( $this, 'display_support' ) // callback to display tab content @km!
          )
    );

        parent::__construct( $tabs, msp_get_screen_ids(), 'masterslider_help_tab_' );
  }


  public function display_masterslider(){
    ?>
    <h2>How to Display Sliders on Pages</h2>
    <p>You can display Master Slider on your website with using one of the three ways that are explained below.</p>
    <hr />

    <div class="row-fluid">
      
      <div>
        <h3>1 - Inserting the slider with shortcode (Easiest way)</h3>
        <p>You can place your sliders into pages and posts with their shortcodes.</p>
        <p>You can find the shortcode for each slider in Master Slider admin page next to their names in the list view.</p>

                <img  src="<?php echo MSWP_AVERTA_ADMIN_URL. '/assets/images/misc/where-is-ms-shortcode.png'; ?>" />
                <p>To insert the slider, edit a page or post and insert its shortcode into the WordPress text editor like following screenshot. </p>
                <p>In this example the shortcode is <code>[masterslider id="1"]</code></p>
                <img  src="<?php echo MSWP_AVERTA_ADMIN_URL. '/assets/images/misc/shortcode-in-editor.png'; ?>" />
            </div>
        </div>

    <hr>

    <div class="row-fluid">
      <div >
        <h3>2 - Inserting the slider with the Master Slider WP widget</h3>
        <p>
          MasterSlider WP supports widgets, so you can place your slider in your front-end page just by a drag n' drop. To do that, navigate to the Appearance menu on your left sidebar and select "Widgets". Grab the MasterSlider WP Widget and drop it into one of your widget area. 

          Please note that some themes may not support a widget area what you need. In this case, you can create a new widget area by editing your theme files.
                </p>
            </div>
        </div>
    
    <hr>

    <div class="row-fluid">
      <div>
        <h3>3 - Calling the slider from your theme files (For Advanced users)</h3>
        <p>
          Because a slider can be an integral part of your site, you may want to place it into your theme files. There are some PHP function which you can call for example from the header.php file of your theme and it inserts your slider into your home page or certail other pages. Here they are :
        </p>
        <br />

        <h5>Description</h5>
        <p>Displays Master Slider markup for specific slider ID</p>

        <h5>Usage :</h5>
        <p><code>&lt;?php masterslider( $id ); ?&gt;</code></p>It's equal to : 
        <p><code>&lt;?php echo get_masterslider( $id ); ?&gt;</code></p>
        
        <h5>Parameters :</h5>
        <dl>
          <dt><tt>$id</tt></dt>
          <dd> (int) The slider ID that can be found on the plugin page in the slider list view at the first table column. Default: <i>Null</i></dd>
        </dl><br />

        <h5>Example :</h5>
        <p>If you've created a slider and the slider ID is equal to <code>1</code> you can use the following code to display the slider on your website.</p>
        <p><code>&lt;?php masterslider ( 1 ); ?&gt;</code></p>OR
        <p><code>&lt;?php echo get_masterslider ( 1 ); ?&gt;</code></p><br />
        
        <hr>

        <p>
          It is important when you want to insert a slider to check its ID on the MasterSlider WP slider list page. When you remove some sliders, their IDs won't be re-indexed and the sequence may broke up. This is important to keep persistent your sliders preventing unwanted changes on the already inserted ones.
                </p>
            </div>
        </div>
        
    <?php
  }

  public function display_support(){
    ?>
    <h3><strong>Support</strong></h3>
    <hr />

    <h4>If you have any questions please follow these steps:</h4>
    <ol>
      <li>Please read item's <a href="http://masterslider.com/doc/wp/free" target="_blank">Documentation </a> </li>
      <li>Take a look in our <a href="http://wordpress.org/plugins/master-slider/faq/" target="_blank">FAQ</a> page</li>
      <li>Search plugin's support forum using <a href="https://www.google.com/search?q=site:wordpress.org+%22master+slider%22+%22support%22+your+question+here" target="_blank">this link</a> for finding already asked or similar questions.</li>
      <li>If you did not find your answer, please post new topic in <a href="http://wordpress.org/support/plugin/master-slider" target="_blank">support forum</a></li>
    </ol>
    <br />


    <strong>Why support forum?</strong>
    <ul>
      <li>It is organized and searchable (that makes support easier and faster)</li>
    </ul>
    <br />

    <strong>Supporting our Items INCLUDES</strong>:
    <ul>
      <li>Responding to questions or problems regarding our item and its features</li>
      <li>Fixing bugs and reported issues</li>
      <li>Providing updates to ensure compatibility with new software versions</li>
    </ul>
    <br/>

    <strong>Item support does NOT include</strong>:
    <ul>
      <li>Customization and installation services</li>
      <li>Support for third party software and plug-ins</li>
    </ul>
    <br/>
    
    <p><span class="label label-info">Note</span> We <strong>CANNOT</strong> provide support via email, Please ask your support related questions only in <a href="http://wordpress.org/support/plugin/master-slider/" target="_blank">support forum</a>.</p>
    <br />
    <p><span class="label label-info">Important Note</span> For the fast troubleshooting, please send us detailed informations about the issue and make sure that you don't forget to send us your site url where you are using or want to use the item. Please note, that we cannot troubleshoot from screencast videos or screenshots.</p>

    <?php
  }
    
    
}

endif;

new MSP_Screen_Help();