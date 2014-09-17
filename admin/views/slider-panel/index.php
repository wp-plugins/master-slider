<?php
/**
 * Represents the view for slider panel.
 *
 * @package   MasterSlider Lite
 * @author    averta [averta.net]
 * @license   LICENSE.txt
 * @link      http://masterslider.com
 * @copyright Copyright © 2014 averta
 */

?>

<!-- markup for slider panel page here. -->
<?php msp_get_panel_header(); ?>
<div id="panelLoading" class="msp-loading">
    <img src="<?php echo MSWP_AVERTA_ADMIN_URL . '/views/slider-panel'; ?>/images/loading.gif">
    <?php _e('Loading data...', MSWP_TEXT_DOMAIN); ?>
</div>
<div id="msp-root" class="msp-container"> </div>
<div id="mspHiddenEditor" style="display:none">
    <?php wp_editor( '', 'msp-hidden' , array( 'textarea_rows' => 8 ) );  ?>
</div>

<!-- Application Template -->
<script type="text/x-handlebars">
    {{#if hasError}}
        <div class="msp-error-cont">
            {{partial errorTemplate}}
        </div>
    {{else}}
        <nav class="msp-main-nav">
            <ul>
                <li>{{#link-to 'settings'}} <?php _e('Slider Settings', MSWP_TEXT_DOMAIN); ?> <span class="msp-ico msp-ico-settings"></span>{{/link-to}}</li>
                <li>{{#link-to 'slides'}} <?php _e('Slides', MSWP_TEXT_DOMAIN); ?> <span class="msp-ico msp-ico-slides"></span>{{/link-to}}</li>
                <li>{{#link-to 'controls'}} <?php _e('Slider Controls', MSWP_TEXT_DOMAIN); ?> <span class="msp-ico msp-ico-controls"></span>{{/link-to}}</li>
                <li>{{#link-to 'callbacks'}} <?php _e('Slider Callbacks', MSWP_TEXT_DOMAIN); ?> <span class="msp-ico msp-ico-api"></span>{{/link-to}}</li>
            </ul>
        </nav>
        <div class="clear"></div>
        {{outlet}}
        <div class="msp-shortcode-cont">
            <span><?php _e('Shortcode :', MSWP_TEXT_DOMAIN); ?> </span> {{view MSPanel.SimpleCodeBlock value=shortCode width=120}}
            <span><?php _e('PHP function :', MSWP_TEXT_DOMAIN); ?> </span> {{view MSPanel.SimpleCodeBlock value=phpFunction width=160}}
        </div>
        <button id="msp-preview-btn" {{action showPreview}} class="msp-blue-btn msp-save-changes"> <?php _e('Preview', MSWP_TEXT_DOMAIN); ?></button>
        {{#if isSending}}
            <button class="msp-blue-btn msp-save-changes disabled"> <?php _e('Saving...', MSWP_TEXT_DOMAIN); ?></button>
        {{else}}
            <button class="msp-blue-btn msp-save-changes" {{action "saveAll"}}> <?php _e('Save Changes', MSWP_TEXT_DOMAIN); ?></button>
        {{/if}}
        <span class="msp-save-status">{{statusMsg}}</span>
    {{/if}}
</script>

<!-- Slider Settings Page -->
<script type="text/x-handlebars" id="settings">

    {{#meta-box title="<?php _e('General Settings', MSWP_TEXT_DOMAIN); ?>"}}

        <div class="msp-metabox-row">

            <h4><?php _e('Slider name and dimentions', MSWP_TEXT_DOMAIN); ?></h4>

            <div class="msp-metabox-indented">
                <label><?php _e('Slider name :', MSWP_TEXT_DOMAIN); ?> </label> {{input value=name size="40"}}
            </div>
            <div class="msp-metabox-indented">
                 <label><?php _e('Slider width :', MSWP_TEXT_DOMAIN); ?> </label> {{number-input value=width}} px
                <span class="msp-form-space"></span>
                <label><?php _e('Slider height :', MSWP_TEXT_DOMAIN); ?> </label> {{number-input value=height}} px
            </div>

            <div class="msp-metabox-indented">
               {{switch-box value=autoCrop}}<label><?php _e('Automatically crop and resize slider images based on above size.', MSWP_TEXT_DOMAIN); ?></label>
            </div>

            <h4><?php _e('Slider sizing method', MSWP_TEXT_DOMAIN); ?></h4>

            <div class="msp-metabox-indented">
                {{#view MSPanel.Select value=layout width="400" }}
                    <option value="boxed"><?php _e('Boxed layout', MSWP_TEXT_DOMAIN); ?></option>
                    <option value="fullwidth"><?php _e('Full-width', MSWP_TEXT_DOMAIN); ?></option>
                {{/view}}
                {{#if showAutoHeight}}
                    <span class="msp-form-space"></span>
                    {{switch-box value=autoHeight}}<label><?php _e('Auto-height slider', MSWP_TEXT_DOMAIN); ?></label>
                {{/if}}
            </div>
            {{#if showWrapperWidth}}
               <div class="msp-metabox-indented">
                    <label><?php _e('Slider wrapper width :', MSWP_TEXT_DOMAIN); ?> </label>{{number-input value=wrapperWidth}}
                    {{#view MSPanel.Select value=wrapperWidthUnit width="40" }}
                        <option value="px">px</option>
                        <option value="%">%</option>
                    {{/view}}
                </div>
            {{/if}}

        </div>

    {{/meta-box}} 

    {{#meta-box title="<?php _e('Slider transition', MSWP_TEXT_DOMAIN); ?>"}}

        <div class="msp-metabox-row">
            <h4><?php _e('Change slider transition, transition speed and space between slides', MSWP_TEXT_DOMAIN); ?></h4>

            <div class="msp-metabox-indented">
                <label><?php _e('Transition :', MSWP_TEXT_DOMAIN); ?> </label> 
                {{#view MSPanel.Select value=trView width=150}}
                    <option value="basic">Normal</option>
                    <option value="fade">Fade</option>
                {{/view}}
                <span class="msp-form-space"></span>
                <label><?php _e('Transition speed :', MSWP_TEXT_DOMAIN); ?> </label> {{number-input value=speed}}
            </div>
            <div class="msp-metabox-indented">
                <label><?php _e('Direction :', MSWP_TEXT_DOMAIN); ?> </label> 
                {{#view MSPanel.Select value=dir width="120"}}
                    <option value="h"><?php _e('Horizontal', MSWP_TEXT_DOMAIN); ?></option>
                    <option value="v"><?php _e('Vertical', MSWP_TEXT_DOMAIN); ?></option>
                {{/view}}
                <span class="msp-form-space"></span>
                <label><?php _e('Slide space :', MSWP_TEXT_DOMAIN); ?> </label> {{number-input value=space}} px
            </div>
        </div>
    {{/meta-box}} 

    {{#meta-box title="<?php _e('Navigation', MSWP_TEXT_DOMAIN); ?>"}}

        <div class="msp-metabox-row">
            <h4><?php _e('Slideshow behavior and sorting slides', MSWP_TEXT_DOMAIN); ?></h4>
            <div class="msp-metabox-indented"> 
                {{switch-box value=autoplay}}<label><?php _e('Slideshow', MSWP_TEXT_DOMAIN); ?></label>
                <span class="msp-form-space"></span>
                {{switch-box value=loop}}<label><?php _e('Loop navigation', MSWP_TEXT_DOMAIN); ?> </label>
                <span class="msp-form-space"></span>
                {{switch-box value=endPause}}<label><?php _e('Pause at end slide', MSWP_TEXT_DOMAIN); ?></label>
            </div>
            <div class="msp-metabox-indented"> 
                {{switch-box value=overPause}}<label><?php _e('Pause on hover', MSWP_TEXT_DOMAIN); ?></label>
                <span class="msp-form-space"></span>
                {{switch-box value=shuffle}}<label><?php _e('Random order', MSWP_TEXT_DOMAIN); ?></label>
            </div>
            <div class="msp-metabox-indented"> 
                <label><?php _e('Start with slide', MSWP_TEXT_DOMAIN); ?> </label> {{number-input value=start min=1}}
            </div>
            <h4><?php _e('Slider navigation methods', MSWP_TEXT_DOMAIN); ?></h4>
            <div class="msp-metabox-indented"> 
                {{switch-box value=swipe}}<label><?php _e('Touch swipe navigation', MSWP_TEXT_DOMAIN); ?></label>
                <span class="msp-form-space"></span>
                {{switch-box value=mouse}}<label><?php _e('Mouse swipe navigation', MSWP_TEXT_DOMAIN); ?></label>
                <span class="msp-form-space"></span>
                {{switch-box value=grabCursor}}<label><?php _e('Use grab mouse cursor', MSWP_TEXT_DOMAIN); ?></label>
            </div>
            <div class="msp-metabox-indented"> 
                {{switch-box value=wheel}}<label><?php _e('Mouse wheel navigation', MSWP_TEXT_DOMAIN); ?></label>
            </div>
            <h4><?php _e('Slide preloading', MSWP_TEXT_DOMAIN); ?></h4>
            <div class="msp-metabox-indented"> 
                {{#view MSPanel.Select value=preloadMethod width="200" }}
                    <option value="nearby"><?php _e('Load nearby slides', MSWP_TEXT_DOMAIN); ?></option>
                    <option value="-1"><?php _e('Load slides in sequence', MSWP_TEXT_DOMAIN); ?></option>
                    <option value="all"><?php _e('Load all slides before init', MSWP_TEXT_DOMAIN); ?></option>
                {{/view}}
                {{#if showNearbyNum}}
                    <span class="msp-form-space"></span>
                   <?php _e('Number of slides :', MSWP_TEXT_DOMAIN); ?> {{number-input value=preload }}
                {{/if}}
            </div>
        </div>
    
    {{/meta-box}} 
    
    {{#meta-box title="<?php _e('Appearance', MSWP_TEXT_DOMAIN); ?>"}}

        <div class="msp-metabox-row">
            <h4><?php _e('Slider Skin', MSWP_TEXT_DOMAIN); ?></h4>
            <div class="msp-metabox-indented"> 
                <label><?php _e('Skin :', MSWP_TEXT_DOMAIN); ?> </label>
                {{#dropdwon-List value=skin width=180}}
                    {{#each skin in sliderSkins}}
                        <option {{bind-attr value=skin.class}}>{{skin.label}}</option>
                    {{/each}}
                {{/dropdwon-List}}
            </div>
            <div class="msp-metabox-indented"> 
                <label><?php _e('Align center slider controls :', MSWP_TEXT_DOMAIN); ?> </label> {{switch-box value=centerControls}}
            </div>
            <h4><?php _e('Slider background settings', MSWP_TEXT_DOMAIN); ?></h4>
            <div class="msp-metabox-indented"> 
                <label><?php _e('Background image :', MSWP_TEXT_DOMAIN); ?> </label> {{view MSPanel.ImgSelect value=bgImage thumb=bgImageThumb}} 
                <span class="msp-form-space"></span> 
                <label><?php _e('Background color :', MSWP_TEXT_DOMAIN); ?> </label> {{color-picker value=bgColor}}
            </div>
            <h4><?php _e('Slider custom class name and inline style', MSWP_TEXT_DOMAIN); ?></h4>
            <div class="msp-metabox-indented"> 
                <label><?php _e('Class name :', MSWP_TEXT_DOMAIN); ?> </label> {{input value=className}}
            </div>
            <div class="msp-metabox-indented">
                <label><?php _e('Inline style :', MSWP_TEXT_DOMAIN); ?> </label> {{input value=inlineStyle size="50"}}
            </div>
        </div>
    
    {{/meta-box}} 
</script>

<!-- Slides Page -->
<script type="text/x-handlebars" id="slides">
    <!-- Slides List -->
    {{#meta-box title="<?php _e('Slides', MSWP_TEXT_DOMAIN); ?>"}}
    <div class="msp-metabox-row">
     {{view MSPanel.SlideList}}
    </div>
    {{/meta-box}} 

    {{partial "slide-settings"}}  
</script>

<!-- Slide Settings Partial -->
<script type="text/x-handlebars" id="slide-settings">

    {{#tabs-panel id="slide-settings"}}
        <div class="msp-metabox-handle">

            <ul class="tabs">
                <li class="active"><a href="#sl-bg"><?php _e('Background', MSWP_TEXT_DOMAIN); ?></a></li>
                <li><a href="#sl-val"><?php _e('Video and Link', MSWP_TEXT_DOMAIN); ?></a></li>
                <li><a href="#sl-inf"><?php _e('Slide Info', MSWP_TEXT_DOMAIN); ?></a></li>
                <li><a href="#sl-misc"><?php _e('Misc', MSWP_TEXT_DOMAIN); ?></a></li>
            </ul>

            <div class="msp-metabox-toggle"></div>
        </div>

        <ul class="tabs-content">
            <li id="sl-bg">{{partial 'slide-background'}}</li>
            <li id="sl-val">{{partial 'slide-video-and-link'}}</li>
            <li id="sl-inf">{{partial 'slide-info'}}</li>
            <li id="sl-misc">{{partial 'slide-misc'}}</li>
        </ul> 
    {{/tabs-panel}} 

     {{#meta-box title="Slide"}}
        <div class="msp-metabox-row">
           <div class="msp-metabox-indented">
             <label><?php _e('Slide duration :', MSWP_TEXT_DOMAIN); ?> </label> {{number-input class="msp-number-input" min=0 max=300 step="0.1" value=currentSlide.duration}} s
            </div>
        </div>
        <hr class="msp-metabox-hr">   
        {{view MSPanel.StageArea}}
    {{/meta-box}} 
    
</script>

<!-- Slide Background Settings Partial -->
<script type="text/x-handlebars" id="slide-background">
    <div class="msp-metabox-row">
        <h4><?php _e('Choose slide background and thumbnail', MSWP_TEXT_DOMAIN); ?></h4>
        <div class="msp-metabox-indented">
            <label><?php _e('Background :', MSWP_TEXT_DOMAIN); ?> </label> {{view MSPanel.ImgSelect value=currentSlide.bg thumb=currentSlide.bgThumb}}
            <span class="msp-form-space"></span>
            <label><?php _e('Fillmode :', MSWP_TEXT_DOMAIN); ?> </label> {{view MSPanel.Fillmode value=currentSlide.fillMode}}
            <span class="msp-form-space"></span>
            <label><?php _e('Thumbnail :', MSWP_TEXT_DOMAIN); ?> </label> {{view MSPanel.ImgSelect value=currentSlide.thumbOrginal thumb=currentSlide.thumb}}
        </div>
    </div>
</script>

<!-- Slide Embeded Video and Link -->
<script type="text/x-handlebars" id="slide-video-and-link">
    <div class="msp-metabox-row">
        <h4><?php _e('Link this slide', MSWP_TEXT_DOMAIN); ?> </h4>
        <div class="msp-metabox-indented">
            <label><?php _e('URL :', MSWP_TEXT_DOMAIN); ?> </label> {{input class="msp-path-input" value=currentSlide.link}}
            {{view MSPanel.URLTarget  value=currentSlide.linkTarget }}
        </div>
        <h4><?php _e('Youtube or Vimeo video as slide', MSWP_TEXT_DOMAIN); ?></h4>
        <div class="msp-metabox-indented">
            <label><?php _e('Video embed url :', MSWP_TEXT_DOMAIN); ?> </label> {{input size=60 value=currentSlide.video}}
            <span class="msp-form-space"></span>
            <label><?php _e('Autoplay video :', MSWP_TEXT_DOMAIN); ?> </label>  {{switch-box value=currentSlide.autoplayVideo}}
        </div>
        <div class="msp-metabox-indented">
            <a href="http://masterslider.com/doc/wp/#embed-url" target="_blank"><?php _e('Where to find the Youtube/Vimeo embed URL.', MSWP_TEXT_DOMAIN); ?></a>
        </div>
    </div>
</script>

<!-- Slide Info -->
<script type="text/x-handlebars" id="slide-info"> 
    <div class="msp-metabox-row">
        <div class="msp-metabox-indented">
            <label><?php _e('This info will show beside of slider when slider reaches the slide or it can represent as tab in a tabs control. It is relative to selected slider template.', MSWP_TEXT_DOMAIN); ?></label>
        </div>

        {{#if MSPanel.dynamicTags}}
            <div class="msp-metabox-indented">
                <label><?php _e('Insert dynamic content : ', MSWP_TEXT_DOMAIN); ?></label>
                {{view MSPanel.AddDynamicTag editorId=infoEditor}}
            </div>
        {{/if}}
        <div class="msp-metabox-indented">
            {{view MSPanel.WPEditor tabs="slide-settings" tab="sl-inf" _id=infoEditor value=currentSlide.info}}
            {{!-- {{view MSPanel.HTMLTextArea value=currentSlide.info}} --}}
        </div>
    </div>
</script>

<!-- Slide Misc -->
<script type="text/x-handlebars" id="slide-misc">
    <div class="msp-metabox-row">
        <h4><?php _e('Custom class name and id for slide element', MSWP_TEXT_DOMAIN); ?> </h4>
        <div class="msp-metabox-indented">
            <label><?php _e('Class name :', MSWP_TEXT_DOMAIN); ?> </label> {{input size=30 value=currentSlide.cssClass}}
             <span class="msp-form-space"></span> 
            <label><?php _e('CSS id :', MSWP_TEXT_DOMAIN); ?> </label> {{input size=30 value=currentSlide.cssId}}
        </div>
        <h4><?php _e('Background color and slide background alt text ', MSWP_TEXT_DOMAIN); ?></h4>
        <div class="msp-metabox-indented">
            <label><?php _e('Background color :', MSWP_TEXT_DOMAIN); ?> </label> {{color-picker value=currentSlide.bgColor}}
             <span class="msp-form-space"></span> 
            <label><?php _e('Alt text :', MSWP_TEXT_DOMAIN); ?> </label> {{input size=30 value=currentSlide.bgAlt}}
        </div>
    </div>
</script>

<!-- Slider Controls -->
<script type="text/x-handlebars" id="controls">
{{#if controllers.application.disableControls}}
     {{#meta-box title="Slider Controls"}}
        <div class="msp-metabox-row">
            <div class="msp-metabox-indented"> 
                <?php _e('The selected tempalte for slider does not support custom controls.', MSWP_TEXT_DOMAIN); ?>
            </div>
        </div>
    {{/meta-box}}
{{else}}
    {{#meta-box title="Slider Controls"}}
        <div class="msp-metabox-row">

            <h4><?php _e('Here you can add or remove controls to slider', MSWP_TEXT_DOMAIN); ?></h4>

            <div class="msp-metabox-indented">
                <label><?php _e('Add new control', MSWP_TEXT_DOMAIN); ?></label> 
                {{#if noMore}}
                    <button class="msp-add-btn disabled"><span class="msp-ico msp-ico-whiteadd"></span></button>
                {{else}}
                    <button {{action addControl}} class="msp-add-btn"><span class="msp-ico msp-ico-whiteadd"></span></button>
                {{/if}}
                
                {{#dropdwon-List value=selectedControl width=200}}
                    {{#each control in availableControls}}
                        <option {{bind-attr value=control.value}}>{{control.label}}</option>
                    {{else}}
                        <option><?php _e('-- All controls are used --', MSWP_TEXT_DOMAIN); ?></option>
                    {{/each}}       
                {{/dropdwon-List}}
            </div>
        </div>
        <hr class="msp-metabox-hr">
        <div class="msp-metabox-row">
            <h4><?php _e('Used controls:', MSWP_TEXT_DOMAIN); ?></h4>
            <div class="msp-metabox-indented">
                {{#each control in controller}}
                    {{view MSPanel.ControlBtn control=control}}
                {{/each}}
            </div>
        </div>
    {{/meta-box}}

    {{partial controlOptions}}
{{/if}}    
</script>
    
<script type="text/x-handlebars" id="arrows-options">
    {{#meta-box title="Arrows Control Options"}}
        <div class="msp-metabox-row">
            <div class="msp-metabox-indented">
                {{switch-box value=currentControl.autoHide}} <label><?php _e('Hide arrows when mouse leaves slider', MSWP_TEXT_DOMAIN); ?></label>
                <div class="msp-form-space-med"></div>
                {{switch-box value=currentControl.overVideo}} <label><?php _e('Show arrows over Youtube/Vimeo video player', MSWP_TEXT_DOMAIN); ?></label>
            </div>
            <div class="msp-metabox-indented">
                <label><?php _e('Hide arrows under this window width :', MSWP_TEXT_DOMAIN); ?> </label> {{number-input value=currentControl.hideUnder}} px
            </div>

            {{!--<div class="msp-metabox-indented">
                {{switch-box value=currentControl.inset}} <label><?php _e('Insert arrows inside slider', MSWP_TEXT_DOMAIN); ?></label>
            </div>
            <div class="msp-metabox-indented">
                <label><?php _e('Arrows margin :', MSWP_TEXT_DOMAIN); ?> </label> {{number-input value=currentControl.margin min=null}} px
            </div>--}}
        </div>
    {{/meta-box}}
</script>

<script type="text/x-handlebars" id="timebar-options">
    {{#meta-box title="Line Timer Control Options"}}
        <div class="msp-metabox-row">
            <div class="msp-metabox-indented">
                {{switch-box value=currentControl.autoHide}} <label><?php _e('Hide line timer when mouse leaves slider', MSWP_TEXT_DOMAIN); ?></label>
                <div class="msp-form-space-med"></div>
                {{switch-box value=currentControl.overVideo}} <label><?php _e('Show line timer over Youtube/Vimeo video player', MSWP_TEXT_DOMAIN); ?></label>
            </div>
            <div class="msp-metabox-indented">
                <?php _e('Align control :', MSWP_TEXT_DOMAIN); ?> 
                {{#dropdwon-List value=currentControl.align width=100}}
                    <option value="top"><?php _e('Top', MSWP_TEXT_DOMAIN); ?></option>        
                    <option value="bottom"><?php _e('Bottom', MSWP_TEXT_DOMAIN); ?></option>   
                {{/dropdwon-List}}
                <div class="msp-form-space-med"></div>
                <label><?php _e('Hide line timer under this window width :', MSWP_TEXT_DOMAIN); ?> </label> {{number-input value=currentControl.hideUnder}} px
            </div>
            <div class="msp-metabox-indented">
                <label><?php _e('Line timer color :', MSWP_TEXT_DOMAIN); ?> </label> {{color-picker value=currentControl.color}}
                <div class="msp-form-space-med"></div>
                <label><?php _e('Line timer width :', MSWP_TEXT_DOMAIN); ?> </label> {{number-input value=currentControl.width}} px
            </div>
        </div>
    {{/meta-box}}
</script>

<script type="text/x-handlebars" id="bullets-options">
    {{#meta-box title="Bullets Control Options"}}
        <div class="msp-metabox-row">
            <div class="msp-metabox-indented">
                {{switch-box value=currentControl.autoHide}} <label><?php _e('Hide bullets when mouse leaves slider', MSWP_TEXT_DOMAIN); ?></label>
                <div class="msp-form-space-med"></div>
                {{switch-box value=currentControl.overVideo}} <label><?php _e('Show bullets over Youtube/Vimeo video player', MSWP_TEXT_DOMAIN); ?></label>
            </div>
           {{!-- <div class="msp-metabox-indented">
                {{switch-box value=currentControl.inset}} <label><?php _e('Insert bullets inside slider', MSWP_TEXT_DOMAIN); ?></label>
            </div> --}}
            <div class="msp-metabox-indented">
                <?php _e('Align control :', MSWP_TEXT_DOMAIN); ?> 
                {{#dropdwon-List value=currentControl.align width=100}}
                    <option value="top"><?php _e('Top', MSWP_TEXT_DOMAIN); ?></option>        
                    <option value="right"><?php _e('Right', MSWP_TEXT_DOMAIN); ?></option>        
                    <option value="left"><?php _e('Left', MSWP_TEXT_DOMAIN); ?></option>   
                    <option value="bottom"><?php _e('Bottom', MSWP_TEXT_DOMAIN); ?></option>  
                {{/dropdwon-List}}
                <div class="msp-form-space-med"></div>
                <label><?php _e('Bullets margin :', MSWP_TEXT_DOMAIN); ?> </label> {{number-input value=currentControl.margin min=null}} px
                <div class="msp-form-space-med"></div>
                <label><?php _e('Space between bullets :', MSWP_TEXT_DOMAIN); ?> </label> {{number-input value=currentControl.space min=null}} px
            </div>
            <div class="msp-metabox-indented">
                <label><?php _e('Hide bullets under this window width :', MSWP_TEXT_DOMAIN); ?> </label> {{number-input value=currentControl.hideUnder}} px
            </div>
        </div>
    {{/meta-box}}
</script>

<script type="text/x-handlebars" id="scrollbar-options">
    {{#meta-box title="Scrollbar Control Options"}}
        <div class="msp-metabox-row">
            <div class="msp-metabox-indented">
                {{switch-box value=currentControl.autoHide}} <label><?php _e('Hide scrollbar when mouse leaves slider', MSWP_TEXT_DOMAIN); ?></label>
                 <div class="msp-form-space-med"></div>
                {{switch-box value=currentControl.overVideo}} <label><?php _e('Show scrollbar over Youtube/Vimeo video player', MSWP_TEXT_DOMAIN); ?></label>
            </div>
            <div class="msp-metabox-indented">
                {{switch-box value=currentControl.inset}} <label><?php _e('Insert scrollbar inside slider', MSWP_TEXT_DOMAIN); ?></label>
            </div>

            {{!--<div class="msp-metabox-indented">
                <label><?php _e('Scrollbar direction :', MSWP_TEXT_DOMAIN); ?> </label>
                {{#dropdwon-List value=currentControl.dir width=100}}
                    <option value="h"><?php _e('Horizontal', MSWP_TEXT_DOMAIN); ?></option>        
                    <option value="v"><?php _e('Vertical', MSWP_TEXT_DOMAIN); ?></option>   
                {{/dropdwon-List}}
                <div class="msp-form-space-med"></div>
            </div>--}}

            <div class="msp-metabox-indented">
               <label><?php _e('Scrollbar handle color :', MSWP_TEXT_DOMAIN); ?> </label> {{color-picker value=currentControl.color}}
               <div class="msp-form-space-med"></div>
               <label><?php _e('Hide scrollbar under this window width :', MSWP_TEXT_DOMAIN); ?> </label> {{number-input value=currentControl.hideUnder}} px
            </div>
            <div class="msp-metabox-indented">
                <?php _e('Align control :', MSWP_TEXT_DOMAIN); ?> 
                {{#dropdwon-List value=currentControl.align width=100}}
                    <option value="top"><?php _e('Top', MSWP_TEXT_DOMAIN); ?></option>        
                    <option value="right"><?php _e('Right', MSWP_TEXT_DOMAIN); ?></option>        
                    <option value="left"><?php _e('Left', MSWP_TEXT_DOMAIN); ?></option>   
                    <option value="bottom"><?php _e('Bottom', MSWP_TEXT_DOMAIN); ?></option>    
                {{/dropdwon-List}}
                <div class="msp-form-space-med"></div>
                <label><?php _e('Scrollbar width :', MSWP_TEXT_DOMAIN); ?> </label> {{number-input value=currentControl.width}} px
                <div class="msp-form-space-med"></div>
                <label><?php _e('Scrollbar margin :', MSWP_TEXT_DOMAIN); ?> </label> {{number-input value=currentControl.margin min=null}} px
            </div>
        </div>
    {{/meta-box}}
</script>

<script type="text/x-handlebars" id="circletimer-options">
    {{#meta-box title="Circle Timer Control Options"}}
        <div class="msp-metabox-row">
            <div class="msp-metabox-indented">
                {{switch-box value=currentControl.autoHide}} <label><?php _e('Hide cricle timer when mouse leaves slider', MSWP_TEXT_DOMAIN); ?></label>
                <div class="msp-form-space-med"></div>
                {{switch-box value=currentControl.overVideo}} <label><?php _e('Show circle timer over Youtube/Vimeo video player', MSWP_TEXT_DOMAIN); ?></label>
            </div>
             {{!--<div class="msp-metabox-indented">
                <?php _e('Align control :', MSWP_TEXT_DOMAIN); ?> 
                {{#dropdwon-List value=currentControl.align width=100}}
                    <option value="tl"><?php _e('Top Left', MSWP_TEXT_DOMAIN); ?></option>        
                    <option value="tr"><?php _e('Top Right', MSWP_TEXT_DOMAIN); ?></option>        
                    <option value="bl"><?php _e('Bottom Left', MSWP_TEXT_DOMAIN); ?></option>   
                    <option value="br"><?php _e('Bottom Right', MSWP_TEXT_DOMAIN); ?></option>   
                {{/dropdwon-List}}
            </div>--}}
            <div class="msp-metabox-indented">
                <label><?php _e('Hide circle timer under this window width :', MSWP_TEXT_DOMAIN); ?> </label> {{number-input value=currentControl.hideUnder}} px
            </div>
            <div class="msp-metabox-indented">
                {{!--<label><?php _e('Circle timer margin :', MSWP_TEXT_DOMAIN); ?> </label> {{number-input value=currentControl.margin min=null}} px
                <div class="msp-form-space-med"></div>--}}
                <label><?php _e('Circle stroke :', MSWP_TEXT_DOMAIN); ?> </label> {{number-input value=currentControl.stroke}} px
                <div class="msp-form-space-med"></div>
                <label><?php _e('Circle radius :', MSWP_TEXT_DOMAIN); ?> </label> {{number-input value=currentControl.radius}} px
                <div class="msp-form-space-med"></div>
                <label><?php _e('Circle color :', MSWP_TEXT_DOMAIN); ?> </label> {{color-picker value=currentControl.color}}
            </div>
        </div>
    {{/meta-box}}
</script>

<script type="text/x-handlebars" id="slideinfo-options">
    {{#meta-box title="Slide Info Control Options"}}
        <div class="msp-metabox-row">
            <div class="msp-metabox-indented">
                {{switch-box value=currentControl.autoHide}} <label><?php _e('Hide slide info when mouse leaves slider', MSWP_TEXT_DOMAIN); ?></label>
                <div class="msp-form-space-med"></div>
                {{switch-box value=currentControl.overVideo}} <label><?php _e('Show slide info over Youtube/Vimeo video player', MSWP_TEXT_DOMAIN); ?></label>
            </div>
            <div class="msp-metabox-indented">
                {{switch-box value=currentControl.inset}} <label><?php _e('Insert slide info inside slider', MSWP_TEXT_DOMAIN); ?></label>
            </div>
            <div class="msp-metabox-indented">
                <?php _e('Align control :', MSWP_TEXT_DOMAIN); ?> 
                {{#dropdwon-List value=currentControl.align width=100}}
                    <option value="top"><?php _e('Top', MSWP_TEXT_DOMAIN); ?></option>        
                    <option value="right"><?php _e('Right', MSWP_TEXT_DOMAIN); ?></option>        
                    <option value="left"><?php _e('Left', MSWP_TEXT_DOMAIN); ?></option>   
                    <option value="bottom"><?php _e('Bottom', MSWP_TEXT_DOMAIN); ?></option>   
                {{/dropdwon-List}}
                <div class="msp-form-space-med"></div>
                <label><?php _e('Slide info margin :', MSWP_TEXT_DOMAIN); ?> </label> {{number-input value=currentControl.margin min=null}} px
            </div>
            <div class="msp-metabox-indented">              
                <label><?php _e('Slide info width :', MSWP_TEXT_DOMAIN); ?> </label> {{number-input value=currentControl.width}} px
                <div class="msp-form-space-med"></div>
                <label><?php _e('Slide info height :', MSWP_TEXT_DOMAIN); ?> </label> {{number-input value=currentControl.height}} px
            </div>
        </div>
            <div class="msp-metabox-indented">              
                <label><?php _e('Hide slide info under this window width :', MSWP_TEXT_DOMAIN); ?> </label> {{number-input value=currentControl.hideUnder}} px
            </div>
        </div>
    {{/meta-box}}
</script>

<script type="text/x-handlebars" id="thumblist-options">
    {{#meta-box title="Thumblist/Tabs Control Options"}}
        <div class="msp-metabox-row">
            <div class="msp-metabox-indented">
                {{switch-box value=currentControl.autoHide}} <label><?php _e('Hide thumblist/tabs when mouse leaves slider', MSWP_TEXT_DOMAIN); ?></label>
                <div class="msp-form-space-med"></div>
                {{switch-box value=currentControl.overVideo}} <label><?php _e('Show thumblist/tabs over Youtube/Vimeo video player', MSWP_TEXT_DOMAIN); ?></label>
            </div>
            <div class="msp-metabox-indented">
                {{switch-box value=currentControl.inset}} <label><?php _e('Insert thumblist/tabs inside slider', MSWP_TEXT_DOMAIN); ?></label>
          <div class="msp-form-space-med"></div>
                <?php _e('Thumb background fill mode :', MSWP_TEXT_DOMAIN); ?>
                {{view MSPanel.Fillmode value=currentControl.fillMode}}                
            </div>
            <div class="msp-metabox-indented">
                <?php _e('Align control :', MSWP_TEXT_DOMAIN); ?> 
                {{#dropdwon-List value=currentControl.align width=100}}
                    <option value="top"><?php _e('Top', MSWP_TEXT_DOMAIN); ?></option>        
                    <option value="right"><?php _e('Right', MSWP_TEXT_DOMAIN); ?></option>        
                    <option value="left"><?php _e('Left', MSWP_TEXT_DOMAIN); ?></option>   
                    <option value="bottom"><?php _e('Bottom', MSWP_TEXT_DOMAIN); ?></option>   
                {{/dropdwon-List}}
                <div class="msp-form-space-med"></div>
                <label><?php _e('Thumblist/Tabs margin :', MSWP_TEXT_DOMAIN); ?> </label> {{number-input value=currentControl.margin min=null}} px
            </div>
            <div class="msp-metabox-indented">
                <?php _e('Appearance :', MSWP_TEXT_DOMAIN); ?> 
                {{#dropdwon-List value=currentControl.type width=100}}
                    <option value="thumbs"><?php _e('Thumblist', MSWP_TEXT_DOMAIN); ?></option>        
                    <option value="tabs"><?php _e('Tabs', MSWP_TEXT_DOMAIN); ?></option>        
                {{/dropdwon-List}}
                <div class="msp-form-space-med"></div>
                <label><?php _e('Hide thumblist/tabs under this window width :', MSWP_TEXT_DOMAIN); ?> </label> {{number-input value=currentControl.hideUnder}} px
            </div>

            {{!--<div class="msp-metabox-indented">
                <label><?php _e('Thumblist/Tabs direction :', MSWP_TEXT_DOMAIN); ?> </label>
                {{#dropdwon-List value=currentControl.dir width=100}}
                    <option value="h"><?php _e('Horizontal', MSWP_TEXT_DOMAIN); ?></option>        
                    <option value="v"><?php _e('Vertical', MSWP_TEXT_DOMAIN); ?></option>   
                {{/dropdwon-List}}
            </div>--}}
            <div class="msp-metabox-indented">
                <label><?php _e('Thumb/Tab width :', MSWP_TEXT_DOMAIN); ?> </label> {{number-input value=currentControl.width}} px
                <div class="msp-form-space-med"></div>
                <label><?php _e('Thumb/Tab height :', MSWP_TEXT_DOMAIN); ?> </label> {{number-input value=currentControl.height}} px
                <div class="msp-form-space-med"></div>
                <label><?php _e('Space between thumbs/tabs :', MSWP_TEXT_DOMAIN); ?> </label> {{number-input value=currentControl.space}} px
            </div>

        </div>
    {{/meta-box}}
</script>

<!-- Slider Apis -->
<script type="text/x-handlebars" id="callbacks">
    {{#meta-box title="Slider Callbacks"}}
        <div class="msp-metabox-row">

            <h4><?php _e('Here you can add or remove callbacks to slider', MSWP_TEXT_DOMAIN); ?></h4>

            <div class="msp-metabox-indented">
                <label><?php _e('Add new callback', MSWP_TEXT_DOMAIN); ?></label> 
                {{#if noMore}}
                    <button class="msp-add-btn disabled"><span class="msp-ico msp-ico-whiteadd"></span></button>
                {{else}}
                    <button {{action addCallback}} class="msp-add-btn"><span class="msp-ico msp-ico-whiteadd"></span></button>
                {{/if}}
                
                {{#dropdwon-List value=selectedCallback width=250}}
                    {{#each callback in availableCallbacks}}
                        <option {{bind-attr value=callback.value}}>{{callback.label}}</option>
                    {{else}}
                        <option><?php _e('-- All callbacks are added --', MSWP_TEXT_DOMAIN); ?></option>
                    {{/each}}       
                {{/dropdwon-List}}
            </div>
        </div>
        {{#each callback in controller}}
            <hr class="msp-metabox-hr">
            <div class="msp-metabox-row">
                <h4>{{callback.label}} : </h4>
                <div class="msp-metabox-indented">
                    {{#code-mirror width="100%" height="auto" mode="javascript" value=callback.content}}{{/code-mirror}}
                </div>
                <div class="msp-metabox-indented">
                    <button {{action "removeCallback" callback}} class="msp-blue-btn msp-remove-btn-med"><?php _e('Remove', MSWP_TEXT_DOMAIN); ?></button>
                </div>
            </div>
        {{/each}} 
    {{/meta-box}}
</script>

<!-- empty template -->
<script type="text/x-handlebars" id="empty-template"></script>