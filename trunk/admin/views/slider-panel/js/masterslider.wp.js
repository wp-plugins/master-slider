//js\mspanel\MSpanel.js 
 
/*!
 * @overview  Master Slider Lite Wordpress Panel
 * @copyright Copyright 2014 Averta Ltd.
 * @version   1.0
 * http://www.averta.net
 */

window.MSPanel = Ember.Application.create({	rootElement : "#msp-root" });
MSPanel.version = '1.0';
MSPanel.SliderID = parseQueryString(window.location.search).slider_id || __MSP_SLIDER_ID || '100';

/**
 * Adds new function to String object 'jfmt' it's like Ember.fmt but first replaces '%s' or '%d' to '%@'
 * @example 'Hi, %s'.jfmt('John');
 */
String.prototype.jfmt = function(){ return ''.fmt.apply(this.replace(/%s|%d/, '%@') ,arguments); };

$ = jQuery.noConflict();
jQuery.ui.dialog.prototype._focusTabbable = function(){};

// Setup Application Router
MSPanel.Router.map(function() {
	this.resource('settings' );
	this.resource('slides', {path: '/'});
	this.resource('controls');
	this.resource('callbacks');
	this.resource('error');
});
MSPanel.Router.reopen({ location: 'none' });

// Application route
MSPanel.ApplicationRoute = Ember.Route.extend({
	model: function() {
		var setting = MSPanel.Settings.find();
		if( setting.get('length') === 0){
			 MSPanel.Settings.create().save();
		}
	}
});

MSPanel.SettingsRoute = Ember.Route.extend({
	model: function() { 
		return MSPanel.Settings.find(1);
	},
	setupController: function(controller, model) {
		controller.set('model', model);
		controller.setup();
	}
});

MSPanel.SlidesRoute = Ember.Route.extend({
	model: function(){
		return MSPanel.Slide.find();
	},

	setupController: function(controller, model) {
		controller.set('model', model);
		controller.set('sliderSettings' , MSPanel.Settings.find(1)/*this.store.find('settings' , 1)*/);
		controller.setup();
	}

});

MSPanel.ControlsRoute = Ember.Route.extend({
	model: function() {
		return MSPanel.Control.find();
	},

	setupController: function(controller, model) {
		controller.set('model', model);
		controller.setup();
		this.activate();
	},

	activate: function() {
		var controller = this.get('controller');
		if(controller){
			controller.set('controlOptions', 'empty-template')
		}
	}

});

MSPanel.CallbacksRoute = Ember.Route.extend({
	model: function() {
		return MSPanel.Callback.find();
	},

	setupController: function(controller, model) {
		controller.set('model', model);
		controller.setup();
	}
});//js\mspanel\models\SliderModel.js 
 
/**
 * Master Slider Panel Model
 * @package MSPanel
 * @author averta
 */

;(function(){

	var attr = Ember.attr,
		hasMany = Ember.hasMany,
		belongsTo = Ember.belongsTo;

	// custom data type, converts absolute paths to relative
	var regp = /https\:|http\:/;
	var WPPath = {

		// convert to relative
		serialize: function(path){
			if ( path == undefined ){
				return path;
			} 
			
			if( regp.test(path) ) { // is it absolute?
				return path.replace(__MS.upload_dir, '');
			} else {
				return path;
			}
		},

		// covert to absolute
		deserialize: function(path){
			if ( path == undefined ) {
				return path; 
			}

			if( regp.test(path) ) { // is it absolute?
				return path;
			} else {
				return __MS.upload_dir + path;
			}
		}

	};	

	/**
	 * Slider Settings Model
	 */
	MSPanel.Settings = Ember.Model.extend({

		/*	Internal Options */
		// -------------------------------------------------------------------
		id 				: attr('number'), 	// settings record id (not slider id)
		snapping    	: attr('boolean', {defaultValue : true}),
		bgImageThumb	: attr(WPPath),
		disableControls : attr('boolean', {defaultValue: false}),
		// -------------------------------------------------------------------

		// General 
		name 			 : attr('string' , {defaultValue: __MSP_LAN.sm_001}),
		width			 : attr('number' , {defaultValue: 1000}),
		height 			 : attr('number' , {defaultValue: 500}),
		wrapperWidth 	 : attr('number'),
		wrapperWidthUnit : attr('string' , {defaultValue: 'px'}),
		autoCrop		 : attr('boolean', {defaultValue: false}),
		type 			 : attr('string'),
		sliderId 	 	 : attr('string'),
		
		/**
		 * Slider sizing methods
		 * Values:
		 * 		boxed,
		 * 		fullwidth,
		 * 		fullscreen,
		 * 		fillwidth,
		 * 		autofill,
		 * 		partialview
		 */
		layout		: attr('string' , {defaultValue: 'boxed'}),
		autoHeight	: attr('boolean', {defaultValue: false}),

		// navigation and appearance
		trView		: attr('string' , {defaultValue: 'basic'}),
		speed		: attr('number' , {defaultValue: 20}),
		space 		: attr('number' , {defaultValue: 0}),
		start		: attr('number' , {defaultValue: 1}),
		grabCursor	: attr('boolean', {defaultValue: true}),  
		swipe		: attr('boolean', {defaultValue: true}),
		mouse		: attr('boolean', {defaultValue: true}),
		wheel		: attr('boolean', {defaultValue: false}),
		autoplay	: attr('boolean', {defaultValue: false}),
		loop		: attr('boolean', {defaultValue: false}),
		shuffle		: attr('boolean', {defaultValue: false}),
		preload		: attr('string' , {defaultValue: '-1'}),
		overPause	: attr('boolean', {defaultValue: true}),
		endPause	: attr('boolean', {defaultValue: false}),
		hideLayers  : attr('boolean', {defaultValue: false}),
		dir			: attr('string' , {defaultValue: 'h'}),
		parallaxMode: attr('srting' , {defaultValue: 'swipe'}),
		centerControls		: attr('boolean', {defaultValue: true}),
		instantShowLayers	: attr('boolean', {defaultValue: false}),
		fullscreenMargin	: attr('number'),

		// misc
		inlineStyle	: attr('string'),
		className	: attr('string'),
		bgColor		: attr('string'),
		bgImage		: attr(WPPath),

		skin			: attr('string' , {defaultValue: 'ms-skin-default'}),
		msTemplate		: attr('string' , {defaultValue: 'custom'}),
		msTemplateClass	: attr('string' , {defaultValue: ''}),
		usedFonts 		: attr('string'),

		// Flickr/Facebook Settings
		apiKey 			: attr('string'),
		setId 			: attr('string'),
		setType 		: attr('string'),
		imgCount	 	: attr('number'),
		thumbSize 		: attr('srting'),
		imgSize			: attr('string'),

		// Posts Settings
		postType 		: attr('string'),
		postCats		: attr(Array),
		postTags		: attr(Array),
		postCount		: attr('number'),
		postImageType	: attr('string'),
		postOrder 		: attr('string'),
		postOrderDir 	: attr('string'),
		postExcerptLen	: attr('number'),
		postExcludeIds	: attr('string'),
		postOffset		: attr('number'),
		postLinkSlide	: attr('boolean'),
		postLinkTarget 	: attr('string'),
		postSlideBg		: attr('string'),
		postSlideBgthumb: attr('string'), // internal

		// woocommmerce settings
		wcOnlyInstock   : attr('boolean'),
  		wcOnlyFeatured  : attr('boolean'),
  		wcOnlyOnsale    : attr('boolean')
	})
	
	/**
	 * Slider Slide Model
	 */
	MSPanel.Slide = Ember.Model.extend({
		
		/*	Internal Options */
		// -------------------------------------------------------------------
		id 			: attr('number'),
		timeline_h	: attr('number' , {defaultValue: 200}),
		bgThumb 	: attr(WPPath),
		thumbOrginal : attr(WPPath),
		// -------------------------------------------------------------------
		
		// General
		order			: attr('number'),
		ishide			: attr('boolean'),
		bg				: attr(WPPath),
		duration		: attr('number', {defaultValue : 3}),
			
		fillMode		: attr('string', {defaultValue : 'fill'}),
		thumb			: attr(WPPath),
		info			: attr('string'),
		link			: attr('string'),
		linkTarget		: attr('string'),
		video			: attr('string'),
		bgColor 		: attr('string'),
		
		bgv_mp4			: attr('string'),
		bgv_ogg			: attr('string'),
		bgv_webm		: attr('string'),
		bgv_fillmode	: attr('string' , {defaultValue: 'fill'}),
			
		bgv_loop		: attr('boolean', {defaultValue: true}),
		bgv_mute		: attr('boolean', {defaultValue: true}),
		bgv_autopause 	: attr('boolean', {defaultValue: false}),

		cssId			: attr('string'),
		cssClass 		: attr('string'),
		bgAlt 			: attr('string'),

		/**
		 * Slide Layers
		 * Object format: layer_ids:[1,2,3,...]
		 */
		layers 		: hasMany('MSPanel.Layer', {key: 'layer_ids'})
		
	});
	
	/**
	 * Slide Layer Model
	 */
	MSPanel.Layer = Ember.Model.extend({
		
		/*	Internal Options */
		// -------------------------------------------------------------------
		id 				: attr('number'),
		name 			: attr('string'),
		isLocked		: attr('boolean' , {defaultValue: false}),
		isHided			: attr('boolean' , {defaultValue: false}),
		isSoloed		: attr('boolean' , {defaultValue: false}),
		slide 			: belongsTo('MSPanel.Slide', {key: 'slide'}),
		styleModel		: belongsTo('MSPanel.Style', {key: 'styleModel', embedded:false}),

		showEffect 		: belongsTo('MSPanel.Effect', {key: 'showEffect', embedded:false} ),
		showTransform 	: attr('string' , {defaultValue: ''}), // tranform style
		showOrigin		: attr('string' , {defaultValue: ''}), // transform origin
		showFade		: attr('boolean', {defaultValue: true}),

		hideEffect		: belongsTo('MSPanel.Effect', {key: 'hideEffect', embedded:false}),
		hideTransform 	: attr('string' , {defaultValue: ''}), // transform style
		hideOrigin		: attr('string' , {defaultValue: ''}),
		hideFade		: attr('boolean', {defaultValue: true}),
		imgThumb 		: attr(WPPath),

		stageOffsetX 	: attr('number', {defaultValue: 0}),
		stageOffsetY	: attr('number', {defaultValue: 0}),
			

		// -------------------------------------------------------------------

		// General
		order		: attr('number'),
		type		: attr('string'), // values: text, video, image, hotspot
		
		// misc
		cssClass	: attr('string'), // custom css class name
		cssId 		: attr('string'), // custom css id
		title		: attr('string'), // title attribute 
		rel 		: attr('string'), // rel attribute

		// layer content
		content 	: attr('string' , {defaultValue : 'Lorem Ipsum'}), // for text, hotspot
		img 		: attr(WPPath), // for image and video
		imgAlt		: attr('string'),
		video 		: attr('string', {defaultValue: 'http://player.vimeo.com/video/11721242'}), // video iframe path

		align 		: attr('string', {defaultValue: 'top'}),

		useAction 	: attr('boolean', {defaultValue: false}),
		action 		: attr('string'),
		toSlide 	: attr('number'), // gotoSlide action parameter
		link 		: attr('string'), 
		linkTarget	: attr('string'),
		
		// Position
		offsetX		: attr('number' , {defaultValue : 0}),
		offsetY		: attr('number' , {defaultValue : 0}),
		width 		: attr('number'), 
		height 		: attr('number'), 
		resize 		: attr('boolean', {defaultValue : true}),
		fixed 		: attr('boolean', {defaultValue : false}),
		widthlimit	: attr('number' , {defaultValue : '0'}),
		origin 		: attr('string' , {defaultValue : 'tl'}),

		stayHover 	: attr('boolean', {defaultValue: true}), // hotspot only

		// layer style class name
		className	: attr('string'), 
		
		// layer parallax effect
		parallax 	: attr('string'),

		// Show Effect
		showDuration	: attr('number' , {defaultValue : 1}),
		showDelay		: attr('number' , {defaultValue : 0}),
		showEase		: attr('string' , {defaultValue : 'easeOutQuint'}),
		showEffFunc		: attr('string'), // used by master slider
		
		// Hide Effect
		useHide 		: attr('boolean', {defaultValue : false}),
		hideDuration	: attr('number' , {defaultValue : 1}),
		hideDelay		: attr('number' , {defaultValue : 1}),
		hideEase		: attr('string' , {defaultValue : 'easeOutQuint'}),
		hideEffFunc		: attr('string'), // used by master slider
		
		// btn layer only
		btnClass		: attr('string', {defaultValue : 'ms-default-btn'})

		//style 		: attr('string' , {defaultValue: ''}),
	});

	/**
	 * Layer Styles Model
	 */
	MSPanel.Style = Ember.Model.extend({

		/*	Internal Options */
		// -------------------------------------------------------------------
		id 				: attr('number'),
		name 			: attr('string'),
		// -------------------------------------------------------------------
		
		/**
		 * style type
		 * values:
		 * 		preset,  preset style
		 * 		copy,    on copy of preset style used in mspanel
		 * 		custom,  layer custom style
		 */	
		type 			: attr('string'),
		
		/**
		 * style class name
		 * format:
		 * 		preset->  msp-preset-{{presetID}}
		 * 		custom->  msp-cn-{{sliderID}}-{{layer-ID}}
		 */	
		className		: attr('string'),
		//css 			: attr('string'),

		backgroundColor	: attr('string'),

		// padding
		paddingTop		: attr('number'),
		paddingRight	: attr('number'),
		paddingBottom	: attr('number'),
		paddingLeft 	: attr('number'),
		
		// border
		borderTop		: attr('number'),
		borderRight		: attr('number'),
		borderBottom	: attr('number'),
		borderLeft 		: attr('number'),

		borderColor		: attr('string'),
		borderRadius	: attr('number'),
		borderStyle		: attr('string'),
		
		//Typography
		fontFamily		: attr('string'),
		fontWeight		: attr('string' , {defaultValue: 'normal'}),
		fontSize		: attr('number'),
	
		textAlign		: attr('string'),
		letterSpacing	: attr('number'),
		lineHeight		: attr('string' , {defaultValue: 'normal'}),
		whiteSpace		: attr('string'),
		color			: attr('string'),
	
		// custom style
		custom				: attr('string')
	});
	
	MSPanel.PresetStyle = MSPanel.Style.extend({});
	
	/**
	 * Layer Effect Model
	 */
	MSPanel.Effect = Ember.Model.extend({

		/*	Internal Options */
		// -------------------------------------------------------------------
		id 				: attr('number'),
		name 			: attr('string'),
		// -------------------------------------------------------------------
		
		type 			: attr('string'), // preset or null

		fade 			: attr('boolean', {defaultValue: true}),

		translateX		: attr('number'),
		translateY		: attr('number'),
		translateZ		: attr('number'),

		scaleX			: attr('number'),
		scaleY			: attr('number'),

		rotate			: attr('number'),
		rotateX			: attr('number'),
		rotateY			: attr('number'),
		rotateZ			: attr('number'),

		skewX			: attr('number'),
		skewY			: attr('number'),

		originX			: attr('number'),
		originY			: attr('number'),
		originZ			: attr('number')
		
		// effect function for master slider
		//msEffect		: attr('string'),
		
	});

	MSPanel.PresetEffect = MSPanel.Effect.extend({});

	/**
	 * Slider control model
	 */
	MSPanel.Control = Ember.Model.extend({

		/*	Internal Options */
		// -------------------------------------------------------------------
		id 			: attr('number'),
		label		: attr('string'),
		// -------------------------------------------------------------------

		// general
		name 		: attr('string'),

		autoHide	: attr('boolean', {defaultValue: true}), // in JS autohide
		overVideo	: attr('boolean', {defaultValue: true}),

		// misc
		cssClass	: attr('string'),
		cssId		: attr('string'),

		// align and margin
		//align 		: attr('string'), // values : t, r, b, l \ tl,tr,bl,br (for circle timer)
		//inset 		: attr('boolean'), // in slider or out of slider
		margin		: attr('number'), // element margin from top ,...

		// used for bullets, scrollbar and thumbs/tabs
		dir			: attr('string'), // h or v

		// circle timer options
		color 		: attr('string'), // also scrollbar | timebar
		radius 		: attr('number'),
		stroke 		: attr('number'), 

		// thumbs/tabs
		speed		: attr('number'),
		space 		: attr('number'),
		type 		: attr('string'), // tab or thumb

		width 		: attr('number'), /// thumblist | scrollbar | timebar 
 		height  	: attr('number'), // thumbelist

 		align 		: attr('string'), // thumblist | scrollbar | bullets | timebar | slideinfo
 		inset 		: attr('boolean'), // thumblist | scrollbar | timebar | slideinfo

 		size 		: attr('number'), // slide info 

 		hideUnder 	: attr('number'),

 		fillMode 	: attr('string')

	});	

	/**
	 * Slider Callback functions
	 */
	MSPanel.Callback = Ember.Model.extend({

		/*	Internal Options */
		// -------------------------------------------------------------------
		id 			: attr('number'),
		label		: attr('string'),
		// -------------------------------------------------------------------
		
		name 		: attr('string'),
		content 	: attr('string', {defaultValue: 'function(event){\n  var api = event.target;\n}'})

	});

	/**
	 * Button Class Names
	 * @since 1.9.0
	 */

	 MSPanel.ButtonStyle = Ember.Model.extend({

	 	/*	Internal Options */
		// -------------------------------------------------------------
		id 			: attr('number'),
		// -------------------------------------------------------------
		
		className 	: attr('string'),
		normal		: attr('string'),
		hover 		: attr('string'),
		active		: attr('string')

	 });


	var decodeFix = function(str){
		var decoded = B64.decode(str);
		return decoded.slice(0, decoded.lastIndexOf('}')+1);
	}

	window.__MSP_PRESET_BUTTON = null;

	MSPanel.data   = __MSP_DATA ? JSON.parse(decodeFix(__MSP_DATA)) : {meta:{}};
	MSPanel.PSData = __MSP_PRESET_STYLE  ? JSON.parse(decodeFix(__MSP_PRESET_STYLE))  : {meta:{}};
	MSPanel.PEData = __MSP_PRESET_EFFECT ? JSON.parse(decodeFix(__MSP_PRESET_EFFECT)) : {meta:{}};
	MSPanel.PBData = __MSP_PRESET_BUTTON ? JSON.parse(decodeFix(__MSP_PRESET_BUTTON)) : {meta:{}};

	MSPanel.Settings.adapter = Ember.OfflineAdapter.create({applicationData:MSPanel.data});
	MSPanel.Slide.adapter = Ember.OfflineAdapter.create({applicationData:MSPanel.data});
	MSPanel.Layer.adapter = Ember.OfflineAdapter.create({applicationData:MSPanel.data});
	MSPanel.Style.adapter = Ember.OfflineAdapter.create({applicationData:MSPanel.data});
	MSPanel.Effect.adapter = Ember.OfflineAdapter.create({applicationData:MSPanel.data});
	MSPanel.Control.adapter = Ember.OfflineAdapter.create({applicationData:MSPanel.data});
	MSPanel.Callback.adapter = Ember.OfflineAdapter.create({applicationData:MSPanel.data});
	MSPanel.PresetStyle.adapter = Ember.OfflineAdapter.create({applicationData:MSPanel.PSData});
	MSPanel.PresetEffect.adapter = Ember.OfflineAdapter.create({applicationData:MSPanel.PEData});
	MSPanel.ButtonStyle.adapter = Ember.OfflineAdapter.create({applicationData:MSPanel.PBData});
	
})();//js\mspanel\models\SliderTemplates.js 
 
MSPanel.SliderTemplates = [
	
	{
		name:'Custom Template',
		value:'custom',
		className: '',
		img: __MSP_PATH + 'images/templates/custom.gif',
		controls: null
	},
	
	{	
		name:'3D Flow Carousel',
		value:'3d-flow-carousel',
		className:'ms-caro3d-template',
		img: __MSP_PATH + 'images/templates/3d-flow-carousel.png',
		settings: {
			space:0,
			loop:true,
			trView:'flow',
			layout:'partialview',
			dir:'h',
			wheel:false
		},
		controls: null
	},

	{	
		name:'3D Wave Carousel',
		value:'3d-wave-carousel',
		className:'ms-caro3d-template',
		img: __MSP_PATH + 'images/templates/3d-wave-carousel.png',
		settings: {
			space:0,
			loop:true,
			trView:'flow',
			layout:'partialview',
			dir:'h',
			wheel:false
		},
		controls: null
	},

	{	
		name:'Image Gallery with Thumbs',
		value:'image-gallery',
		className:'ms-gallery-template',
		img: __MSP_PATH + 'images/templates/image-gallery.png',
		settings: {
			space:0,
			trView:'basic',
			skin:'ms-skin-black-2 round-skin'
		},
		controls: null,
		disableControls: true
	},

	{	
		name:'Slider with Bottom Aligned Thumbs',
		value:'slider-horizontal-thumbs',
		className:'ms-thumbs-template',
		img: __MSP_PATH + 'images/templates/slider-bottom-thumbs.png',
		settings: {
			trView:'scale',
			space:0
		},
		controls: {
			arrows: {},
			scrollbar: {dir:'h'},
			thumblist: {autohide:false ,dir:'h',arrows:false, align:'bottom', width:127, height:137, margin:5, space:5}
		}
	},

	{	
		name:'Slider with Top Aligned Thumbs',
		value:'slider-top-thumbs',
		className:'ms-thumbs-template',
		img: __MSP_PATH + 'images/templates/slider-top-thumbs.png',
		settings: {
			trView:'scale',
			space:0
		},
		controls: {
			arrows: {},
			scrollbar: {dir:'h'},
			thumblist: {autohide:false ,dir:'h',arrows:false, align:'top', width:127, height:137, margin:5, space:5}
		}
	},

	{	
		name:'Slider with Right Aligned Thumbs',
		value:'slider-vertical-thumbs',
		className:'ms-thumbs-template',
		img: __MSP_PATH + 'images/templates/slider-right-thumbs.png',
		settings: null,
		controls: {
			arrows: {},
			scrollbar: {dir:'v'},
			thumblist: {autohide:false ,dir:'v',arrows:false, align:'right', width:127, height:137, margin:5, space:5}
		}
	},

	{	
		name:'Slider with Left Aligned Thumbs',
		value:'slider-left-thumbs',
		className:'ms-thumbs-template',
		img: __MSP_PATH + 'images/templates/slider-left-thumbs.png',
		settings: null,
		controls: {
			arrows: {},
			scrollbar: {dir:'v'},
			thumblist: {autohide:false ,dir:'v',arrows:false, align:'left', width:127, height:137, margin:5, space:5}
		}
	},

	{	
		name:'Slider with Horizontal Tabs',
		value:'slider-horizontal-tabs',
		className:'ms-tabs-template',
		img: __MSP_PATH + 'images/templates/slider-horizontal-tabs.png',
		settings: null,
		controls: {
			arrows: {},
			circletimer: {color:"#FFFFFF" , stroke:9},
			thumblist: {autohide:false ,dir:'h', type:'tabs',width:240,height:120, align:'bottom', space:0 , margin:-12, hideUnder:400}
		}
	},

	{	
		name:'Slider with Vertical Tabs',
		value:'slider-vertical-tabs',
		className:'ms-tabs-template',
		img: __MSP_PATH + 'images/templates/slider-vertical-tabs.png',
		settings: null,
		controls: {
			arrows: {},
			circletimer: {color:"#FFFFFF" , stroke:9},
			thumblist: {autohide:false ,dir:'v', type:'tabs', align:'right', margin:-12, space:0, width:229, height:100, hideUnder:550}
		}
	},

	{	
		name:'Partial View Slider V1',
		value:'partial-1',
		className:'ms-partialview-template',
		img: __MSP_PATH + 'images/templates/partial-1.png',
		settings: {
			space:10,
	        loop:true,
	        trView:'partialWave',
	        layout:'partialview',
	        dir:'h'
		},
		controls: {
			arrows: {},
			circletimer: {color:"#FFFFFF" , stroke:9},
			slideinfo: {autohide:false, align:'bottom', size:160}
		}
	},

	{	
		name:'Partial View Slider V2',
		value:'partial-2',
		className:'ms-partialview-template',
		img: __MSP_PATH + 'images/templates/partial-2.png',
		settings: {
			space:10,
	        loop:true,
	        trView:'fadeWave',
	        layout:'partialview',
	        dir:'h'
		},
		controls: {
			arrows: {},
			circletimer: {color:"#FFFFFF" , stroke:9},
			slideinfo: {autohide:false, align:'bottom', size:160}
		}
	},

	{	
		name:'Partial View Slider V3',
		value:'partial-3',
		className:'ms-partialview-template',
		img: __MSP_PATH + 'images/templates/partial-3.png',
		settings: {
			space:10,
	        loop:true,
	        trView:'fadeFlow',
	        layout:'partialview',
	        dir:'h'
		},
		controls: {
			arrows: {},
			circletimer: {color:"#FFFFFF" , stroke:9},
			slideinfo: {autohide:false, align:'bottom', size:160}
		}
	},

	{	
		name:'Slider in Display',
		value:'display',
		className:'ms-display-template',
		img: __MSP_PATH + 'images/templates/display.png',
		settings: {
			width:507,
	        height:286,
	        speed:20,
	        space:2,
	        trView:'flow',
	        dir:'h',
	        layout:'boxed'
		},
		controls: {
			arrows: {},
			circletimer: {color:"#FFFFFF" , stroke:9},
			bullets: {autohide:false}
		},
		disableControls: true
	},

	{	
		name:'Slider in Flat Display',
		value:'flat-display',
		className:'ms-display-template',
		img: __MSP_PATH + 'images/templates/flat-display.png',
		settings: {
			width:507,
	        height:286,
	        speed:20,
	        space:2,
	        trView:'flow',
	        dir:'h',
	        layout:'boxed'
		},
		controls: {
			arrows: {},
			circletimer: {color:"#FFFFFF" , stroke:9},
			bullets: {autohide:false}
		},
		disableControls: true
	},

	{	
		name:'Slider in Laptop',
		value:'laptop',
		className:'ms-laptop-template',
		img: __MSP_PATH + 'images/templates/laptop.png',
		settings: {
			width:492,
	        height:309,
	        speed:20,
	        space:2,
	        trView:'mask',
	        dir:'h',
	        layout:'boxed'
		},
		controls: {
			arrows: {},
			circletimer: {color:"#FFFFFF" , stroke:9},
			bullets: {autohide:false}
		},
		disableControls: true
	},

	{	
		name:'Slider in Flat Laptop',
		value:'flat-laptop',
		className:'ms-laptop-template',
		img: __MSP_PATH + 'images/templates/flat-laptop.png',
		settings: {
			width:492,
	        height:309,
	        speed:20,
	        space:2,
	        trView:'mask',
	        dir:'h',
	        layout:'boxed'
		},
		controls: {
			arrows: {},
			circletimer: {color:"#FFFFFF" , stroke:9},
			bullets: {autohide:false}
		},
		disableControls: true
	},

	{	
		name:'Slider in Tablet',
		value:'tablet',
		className:'ms-tablet-template',
		img: __MSP_PATH + 'images/templates/tablet.png',
		settings: {
			width:400,
	        height:534,
	        speed:20,
	        space:2,
	        trView:'wave',
	        dir:'h',
	        layout:'boxed'
		},
		controls: {
			arrows: {},
			circletimer: {color:"#FFFFFF" , stroke:9},
			bullets: {autohide:false}
		},
		disableControls: true
	},

	{	
		name:'Slider in Flat Tablet',
		value:'flat-tablet',
		className:'ms-tablet-template',
		img: __MSP_PATH + 'images/templates/flat-tablet.png',
		settings: {
			width:400,
	        height:534,
	        speed:20,
	        space:2,
	        trView:'basic',
	        dir:'h',
	        layout:'boxed'
		},
		controls: {
			arrows: {},
			circletimer: {color:"#FFFFFF" , stroke:9},
			bullets: {autohide:false}
		},
		disableControls: true
	},

	{	
		name:'Slider in Landscape Tablet',
		value:'tablet-land',
		className:'ms-tablet-template ms-tablet-land',
		img: __MSP_PATH + 'images/templates/tablet-land.png',
		settings: {
			width:632,
	        height:476,
	        speed:20,
	        space:2,
	        trView:'mask',
	        dir:'h',
	        layout:'boxed'
		},
		controls: {
			arrows: {},
			circletimer: {color:"#FFFFFF" , stroke:9},
			bullets: {autohide:false}
		},
		disableControls: true
	},

	{	
		name:'Slider in Flat Landscape Tablet',
		value:'flat-tablet-land',
		className:'ms-tablet-template ms-tablet-land',
		img: __MSP_PATH + 'images/templates/flat-tablet-land.png',
		settings: {
			width:632,
	        height:476,
	        speed:20,
	        space:2,
	        trView:'mask',
	        dir:'h',
	        layout:'boxed'
		},
		controls: {
			arrows: {},
			circletimer: {color:"#FFFFFF" , stroke:9},
			bullets: {autohide:false}
		},
		disableControls: true
	},

	{	
		name:'Slider in Smart Phone',
		value:'phone',
		className:'ms-phone-template',
		img: __MSP_PATH + 'images/templates/phone.png',
		settings: {
			width:258,
	        height:456,
	        speed:20,
	        space:2,
	        trView:'wave',
	        dir:'h',
	        layout:'boxed'
		},
		controls: {
			arrows: {},
			circletimer: {color:"#FFFFFF" , stroke:9},
			bullets: {autohide:false}
		},
		disableControls: true
	},

	{	
		name:'Slider in Flat Smart Phone',
		value:'flat-phone',
		className:'ms-phone-template',
		img: __MSP_PATH + 'images/templates/flat-phone.png',
		settings: {
			width:258,
	        height:456,
	        speed:20,
	        space:2,
	        trView:'basic',
	        dir:'h',
	        layout:'boxed'
		},
		controls: {
			arrows: {},
			circletimer: {color:"#FFFFFF" , stroke:9},
			bullets: {autohide:false}
		},
		disableControls: true
	},

	{	
		name:'Slider in Landscape Smart Phone',
		value:'phone-land',
		className:'ms-phone-template ms-phone-land',
		img: __MSP_PATH + 'images/templates/phone-land.png',
		settings: {
			width:456,
	        height:258,
	        speed:20,
	        space:2,
	        trView:'mask',
	        dir:'h',
	        layout:'boxed'
		},
		controls: {
			arrows: {},
			circletimer: {color:"#FFFFFF" , stroke:9},
			bullets: {autohide:false}
		},
		disableControls: true
	},

	{	
		name:'Slider in Flat Landscape Smart Phone',
		value:'flat-phone-land',
		className:'ms-phone-template ms-phone-land',
		img: __MSP_PATH + 'images/templates/flat-phone-land.png',
		settings: {
			width:456,
	        height:258,
	        speed:20,
	        space:2,
	        trView:'mask',
	        dir:'h',
	        layout:'boxed'
		},
		controls: {
			arrows: {},
			bullets: {autohide:false}
		},
		disableControls: true
	},

	{	
		name:'Vertical Slider',
		value:'vertical-slider',
		className:'ms-vertical-template',
		img: __MSP_PATH + 'images/templates/vertical-slider.png',
		settings: {
			space:5,
	        dir:'v'
		},
		controls: {
			arrows: {},
			scrollbar: {dir:'v'},
			circletimer: {color:"#FFFFFF" , stroke:9},
			thumblist : {autohide:false ,dir:'v',space:5,margin:5,align:'right'}
		}
	},

	{	
		name:'Staff Carousel V1',
		value:'staff-1',
		className:'ms-staff-carousel',
		img: __MSP_PATH + 'images/templates/staff-1.png',
		settings: {
			loop:true,
	        width:240,
	        height:240,
	        speed:20,
	        trView:'focus',
	        layout:'partialview',
	        space:0,
	        wheel:true,
	        dir:'h'
		},
		controls: {
			arrows: {},
			slideinfo: {autohide:false, align:'bottom', size:160}
		}
	},

	{	
		name:'Staff Carousel V2',
		value:'staff-2',
		className:'ms-staff-carousel',
		img: __MSP_PATH + 'images/templates/staff-2.png',
		settings: {
			loop:true,
	        width:240,
	        height:240,
	        speed:20,
	        trView:'fadeBasic',
	        layout:'partialview',
	        space:0,
	        dir:'h'
		},
		controls: {
			arrows: {},
			slideinfo: {autohide:false, align:'bottom', size:160}
		}
	},

	{	
		name:'Staff Carousel V3',
		value:'staff-3',
		className:'ms-staff-carousel ms-round',
		img: __MSP_PATH + 'images/templates/staff-3.png',
		settings: {
			loop:true,
	        width:240,
	        height:240,
	        speed:20,
	        trView:'focus',
	        layout:'partialview',
	        space:0,
	        space:35,
	        dir:'h'
		},
		controls: {
			arrows: {},
			slideinfo: {autohide:false, align:'bottom', size:160}
		}
	},

	{	
		name:'Staff Carousel V4',
		value:'staff-4',
		className:'ms-staff-carousel ms-round',
		img: __MSP_PATH + 'images/templates/staff-4.png',
		settings: {
			loop:true,
	        width:240,
	        height:240,
	        speed:20,
	        trView:'fadeBasic',
	        layout:'partialview',
	        space:0,
	        space:45,
	        dir:'h'
		},
		controls: {
			arrows: {},
			slideinfo: {autohide:false, align:'bottom', size:160}
		}
	},

	{	
		name:'Staff Carousel V5',
		value:'staff-5',
		className:'ms-staff-carousel',
		img: __MSP_PATH + 'images/templates/staff-5.png',
		settings: {
			loop:true,
	        width:240,
	        height:240,
	        speed:20,
	        trView:'wave',
	        layout:'partialview',
	        space:0,
	        wheel:true,
	        dir:'h'
		},
		controls: {
			arrows: {},
			slideinfo: {autohide:false, align:'bottom', size:160}
		}
	},

	{	
		name:'Staff Carousel V6',
		value:'staff-6',
		className:'ms-staff-carousel',
		img: __MSP_PATH + 'images/templates/staff-6.png',
		settings: {
			loop:true,
	        width:240,
	        height:240,
	        speed:20,
	        trView:'flow',
	        layout:'partialview',
	        space:0,
	        wheel:true,
	        dir:'h'
		},
		controls: {
			arrows: {},
			slideinfo: {autohide:false, align:'bottom', size:160}
		}
	},
];
//js\mspanel\views\UIViews.js 
 
/* ---------------------------------------------------------
						Slideframe
------------------------------------------------------------*/
MSPanel.SlideFrame = Ember.View.extend({
	classNames	: ['msp-slideframe'],
	classNameBindings: ['selected:active'],
	selected 	: false,
	thumb_src 	: '',
	showbtnclass : 'msp-ico msp-ico-whitehide',

	template 	: Ember.Handlebars.compile('<div class="msp-img-cont">'+
												'{{#if view.hasImg}}'+
													'<div class="msp-imgselect-preview" {{bind-attr style=view.preview}})"></div>'+
												'{{/if}}'+
											'</div>'+
										  	'<span class="msp-frame-slideorder">#{{view.order}}</span>'+
										  '<div class="msp-framehandle">'+
											'<ul>'+
											  '<li><a title="'+__MSP_LAN.ui_001+'" href="#" {{action "hideswitch" target=view}}><span {{bind-attr class=view.showbtnclass}}></span></a></li>'+
											  '<li><a title="'+__MSP_LAN.ui_002+'" href="#" {{action "duplicate" target=view}}><span class="msp-ico msp-ico-whiteduplicate"></span></a></li>'+
											  '<li><a title="'+__MSP_LAN.ui_003+'" href="#" {{action "remove" target=view}}><span class="msp-ico msp-ico-whiteremove"></span></a></li>'+
											'</ul>'+
										  '</div>'),

	click : function(event){
		this.get('controller').send('select' , this.get('slide'));
	},

	onValueChanged: function(){
		var hasImg = !Ember.isEmpty(this.get('slide.bg'));
		this.beginPropertyChanges();		
		this.set('hasImg' ,hasImg);
		if(hasImg){
			this.set('preview', 'background-image:url(' + this.get('slide.bgThumb') + ');');
		}
		this.endPropertyChanges();
	}.observes('slide.bg').on('didInsertElement'),

	onSelect : function(){
		var slide = this.get('slide');
		
		this.set('selected' , slide === this.get('controller.currentSlide'));

	}.observes('controller.currentSlide').on('init'),

	hideChange : function(){
		if(this.get('slide.ishide'))
			this.set('showbtnclass' , 'msp-ico msp-ico-whitehide msp-ico-whiteshow');
		else
			this.set('showbtnclass' , 'msp-ico msp-ico-whitehide');

	}.observes('slide.ishide').on('init'),

	order: function(){
		return this.get('slide.order') + 1;
	}.property('slide.order'),

	actions : {
		duplicate : function(){	
			this.get('controller').duplicateSlide(this.get('slide'));		
		},

		hideswitch : function(){
			this.set('slide.ishide' , !this.get('slide.ishide'));
		},

		remove : function(){
			if(confirm(__MSP_LAN.ui_004)) 
				 this.get('controller').removeSlide(this.get('slide'));
		}
	}
});

/* ---------------------------------------------------------
						SlideList
------------------------------------------------------------*/
MSPanel.SlideList = Ember.View.extend({
	tagName : 'ul',
	classNames : ['msp-slides'],

	template : Ember.Handlebars.compile(
			'{{#each item in controller}}'+
				'<li class="msp-slideframe-item" {{bind-attr data-id=item.id}}>{{view MSPanel.SlideFrame slide=item}}</li>'+
			'{{/each}}'+
			'<li class="msp-addslide-cont">'+
			  '<div class="msp-addslide" {{action "newSlide"}}>'+
					'<span class="msp-ico msp-ico-grayaddlarge"></span>'+
					'<span class="msp-addslide-label">Add Slide</span>'+
			  '</div>'+
			'</li>'),

	didInsertElement : function(){
		
		var that = this;

		this.$().sortable({
			placeholder: "msp-frames-srtplaceholder",
			items: ">li:not(.msp-addslide-cont)",
			delay: 100,
			update : function(event , ui){that.updateSort();},
			create: function(event, ui){that.updateSort();}
		});

	},

	updateSort: function(){
		var indexes = {};
		$('.msp-slideframe-item').each(function(index) {
		  indexes[$(this).data('id')] = index;
		});
		this.$().sortable('cancel');
		this.get('controller').updateSlidesSort(indexes);
	}
});


/* ---------------------------------------------------------
						ImgSelect
------------------------------------------------------------*/


/*
var frame; // to store already used upload frame

$upload_btn.on( 'click', function() {
	var $this  = $(this);
	// get input field (the image src field)
	var $input = $this.siblings('input[type="text"]');
	
	// If the frame already exists, re-open it.
	if ( frame ) {
		frame.open();
		return;
	}
	
	var frame = wp.media.frames.frame = wp.media({
		title: "Select Image", // the select button label in media uploader
		multiple: false,	   // use single image upload or multiple?
		frame: 'select',
		library: { type: 'image' },
		button : { text : 'Add Image' }
	});
	
	// on "Add Image" button clicked in media uploader
	frame.on( 'select', function() {
		var attachment = frame.state().get('selection').first().toJSON();
		$input.val(attachment.url).trigger('change'); // insert attachment url in our input field
	});

	// open media uploader
	frame.open();
});
 */


MSPanel.ImgSelect = Ember.View.extend({
	classNames : ['msp-imgselect'],
	value : '',
	hasImg : false,
	frame: null,
	template : Ember.Handlebars.compile('<div class="msp-img-cont">'+
											'{{#if view.hasImg}}'+
												'<div class="msp-imgselect-preview" {{bind-attr style=view.preview}})"></div>'+
											'{{/if}}'+
										'</div>'+
										'{{#if view.hasImg}}'+
										 	'<button {{action removeImg target="view"}} class="msp-img-btn"><span class="msp-ico msp-ico-grayremove"></span></button>'+
										'{{else}}'+
										 	'<button {{action addImg target="view"}} class="msp-img-btn"><span class="msp-ico msp-ico-grayadd"></span></button>'+
										'{{/if}}'),

	willDestroyElement: function(){
		var frame = this.get('frame');

		if(frame){
			frame.detach();
			frame.remove();
			frame = null;
			this.set('frame', null);
		}
	},

	onValueChanged: function(){
		this.beginPropertyChanges();
		this.set('hasImg' , !Ember.isEmpty(this.get('value')));
		this.set('preview', 'background-image:url(' + this.get('thumb') + ');') ;
		this.endPropertyChanges();
	}.observes('value').on('didInsertElement'),

	actions : {
		removeImg : function(){
			this.beginPropertyChanges();
			this.set('value' , undefined);
			this.set('thumb' , undefined);
			this.endPropertyChanges();
		},

		addImg : function(){
			if( typeof wp === 'undefined'){
				return;
			} 

			var that = this,
				frame = this.get('frame');

			if ( frame ) {
				frame.open();
				
				return;
			}
			
			var frame = wp.media.frames.frame = wp.media({
				title: "Select Image", // the select button label in media uploader
				multiple: false,	   // use single image upload or multiple?
				frame: 'select',
				library: { type: 'image' },
				button : { text : 'Add Image' }
			});
			
			// on "Add Image" button clicked in media uploader
			frame.on( 'select', function() {
				var attachment = frame.state().get('selection').first().toJSON();
				//console.log(attachment)
				that.set('thumb', (attachment.sizes.thumbnail || attachment.sizes.full).url);
				that.set('value', attachment.url);
			});

			// open media uploader
			frame.open();
			this.set('frame', frame);
		}
	}
});

/* ---------------------------------------------------------
						Selectbox
------------------------------------------------------------*/

MSPanel.Select = Ember.Select.extend({
	tagName: 'div',
	classNames: ['msp-ddlist'],
	layout: Ember.Handlebars.compile('<select>{{yield}}</select>'),
	value: null,
	width: 100,

	didInsertElement: function(){
		var that = this;
		this.$('select').on('change', function(){
			var option = that.$('select option:selected');
			that.set('value', option.attr('value'));
		}).width(this.get('width'));

		this.onValueChanged();
	},

	onValueChanged: function(){
		if( !Ember.isEmpty(this.get('value')) ){
			this.$('select').val(this.get('value'));	
		}
	}.observes('value')
	
	/*classNames:['msp-selectbox'],
	tagName:'div',
	layout: Ember.Handlebars.compile('<select>{{yield}}</select>'),
	width:100,
	didInsertElement: function() {
		var that = this,
			isFirst = true;
		var ddslick = this.$('select').ddslick({width:this.get('width') , onSelected: function(selectedData){ 
				!isFirst && that.set('value' , selectedData.selectedData.value);
				isFirst = false;
		} });
		this.onValueChanged();
  	},

  	onValueChanged: function(){
  		var that = this,
  			cindex = 0;
   		this.$('.dd-option-value').each(function(){
  			var $this = $(this);

			if( $this.attr('value') === that.get('value') ){
  				that.$('.dd-container').ddslick('select' , {index:cindex});
  				return false;
  			}
  			cindex ++;
  		});	

  	}.observes('value')*/
});


/* ---------------------------------------------------------
						URLTarget
------------------------------------------------------------*/
MSPanel.URLTarget = MSPanel.Select.extend({

	onInit : function(){
		var contents = [{lable:__MSP_LAN.ui_005 , value:"_self"},
						{lable:__MSP_LAN.ui_006 , value:"_blank"},
						{lable:__MSP_LAN.ui_007 , value:"_parent"},
						{lable:__MSP_LAN.ui_008 , value:"_top"}];

		this.set('content' , contents);
		this.set('optionValuePath' , "content.value");
		this.set('optionLabelPath' , "content.lable");
		
		this.set('width' , 200);

	}.on('init')
/*
	didInsertElement: function(){
		//this.$().css('vertical-align', 'top');
		this._super();
	}*/
});


/* ---------------------------------------------------------
						Fillmode
------------------------------------------------------------*/
MSPanel.Fillmode = Ember.View.extend({
	classNames : ['msp-fill-dd'],
	type : 'slide', // video
	value: 'fill',
	index: 1,
	template   : Ember.Handlebars.compile('<select>{{#each item in view.contents}}'+
	  										'<option {{bind-attr value=item.value data-imagesrc=item.img}}>{{item.text}}</option>'+
										 '{{/each}}</select>'),
	didInsertElement : function(){
		var that = this,
			isFirst = true;
		this.$('select').ddslick({width:154 , onSelected: function(selected){ 
			!isFirst && that.set('value' , selected.selectedData.value);
			isFirst = false;
		} });

		this.onValueChanged();
	},

	onValueChanged : function(){
		if( Ember.isEmpty(this.get('value')) ){
			return;
		}
		this.$('.dd-container').ddslick('select', {index:this.get('valuedic')[this.get('value')]});
	}.observes('value'),

	onInit : function(){
		var contents , valuedic;
		if(this.get('type') === 'slide'){

			contents = [{value:'fill'	 , text:__MSP_LAN.ui_009 , img: __MSP_PATH + 'images/fill.png'		},
						{value:'fit' 	 , text:__MSP_LAN.ui_010 , img: __MSP_PATH + 'images/fit.png'  		},
						{value:'center'	 , text:__MSP_LAN.ui_011 , img: __MSP_PATH + 'images/center.png'	},
						{value:'stretch' , text:__MSP_LAN.ui_012 , img: __MSP_PATH + 'images/stretch.png'	},
						{value:'tile'	 , text:__MSP_LAN.ui_013 , img: __MSP_PATH + 'images/tile.png'		}];	

			valuedic = {fill:0 , fit:1 , center:2 , stretch:3 , tile:4};

		}else if(this.get('type') === 'video'){

			contents = [{value:'fill'	 , text:__MSP_LAN.ui_009 , img: __MSP_PATH + 'images/fill.png'		},
						{value:'fit' 	 , text:__MSP_LAN.ui_010 , img: __MSP_PATH + 'images/fit.png'   	}
						//{value:'none'	 , text:__MSP_LAN.ui_013 , img:'images/none.png'		}
						];	

			valuedic = {fill:0 , fit:1 , none:2};
		}

		this.set('contents' , contents);
		this.set('valuedic' , valuedic);
	}.on('init')

});

/* ------------------------------------------------------- *\
					SimpleCodeBlock
\* --------------------------------------------------------*/
MSPanel.SimpleCodeBlock = Ember.View.extend({
	classNames: ['msp-shortcode-box'],
	template: Ember.Handlebars.compile('<input type="text" readonly {{bind-attr value=view.value}}>' ),
	width:150,
	didInsertElement: function(){
		this.$('input').on('click',function(){
			$(this).select();
		}).width(this.get('width'));
	}
});//js\mspanel\views\SettingsView.js 
 
/**
 * Settings Page View
 * @package MSPanel
 * @extends {Ember.View}
 */

MSPanel.SettingsView = Ember.View.extend({
	didInsertElement: function(){
		this.set('controller.mainView' , this);
	}
});//js\mspanel\views\SlidesView.js 
 
/**
 * Slides Page View
 * @package MSPanel
 * @extends {Ember.View}
 */

MSPanel.SlidesView = Ember.View.extend({
	didInsertElement: function(){
		this.set('controller.mainView' , this);
	}
});//js\mspanel\views\StageView.js 
 
/* ---------------------------------------------------------
						Stage View
------------------------------------------------------------*/
MSPanel.StageArea = Ember.View.extend({
	classNames : ['msp-stage-area'],
	template : Ember.Handlebars.compile('{{view MSPanel.Stage}}'+
										'{{#if noticeMsg}}<div class="msp-stage-msg"><span class="msp-ico msp-ico-notice"></span>{{{noticeMsg}}}</div>{{/if}}'),
});


MSPanel.Stage = Ember.View.extend({

	classNames : ['msp-slide-stage'],
	attributeBindings : ['style'],
	template : Ember.Handlebars.compile('<div id="stage-bg" class="msp-stage-bg"></div>'),

	resize : function(){

		var w = this.get('controller.sliderSettings.width'),
			h = this.get('controller.sliderSettings.height');
			
		this.set('width' , w);
		this.set('height' , h);

		this.$().css({
			width  : w,
			height : h
		});

	}.observes('controller.sliderSettings.width' , 'controller.sliderSettings.height').on('didInsertElement'),

	didInsertElement : function(){
		var BG = this.$('#stage-bg'),
			BGImage = $('<img/>');

		BGImage.css('visibelity' , 'hidden').each($.jqLoadFix);

		var aligner = new MSAligner(this.get('controller.currentSlide.fillMode') , BG , BGImage);

		this.set('bgAligner' , aligner);
		this.set('bgImg', BGImage);
		this.onBGChange();
	},

	onBGColorChange: function(){

		var color = this.get('controller.currentSlide.bgColor');

		if( !Ember.isEmpty(color) ){
			this.$('#stage-bg').css('background-color', color);
		} else {
			this.$('#stage-bg').css('background-color', '');
		}

	}.observes('controller.currentSlide.bgColor'),

	onBGChange: function(){
		var alinger = this.get('bgAligner');
		if(alinger){
			alinger.reset();
		}

		var bg = this.get('controller.currentSlide.bg'),
			bgImg = this.get('bgImg');

		if( !Ember.isEmpty(bg) ){
			var that = this;
			bgImg.appendTo(this.$('#stage-bg'));
			bgImg.preloadImg(bg , function(event) {that._onBGLoad(event);});
			bgImg.attr('src', bg);
			//alinger.align();
		} else {
			bgImg.detach();
		}
	}.observes('controller.currentSlide.bg'),

	_onBGLoad: function(event){
		var aligner = this.get('bgAligner');

		if( !aligner ) {
			return;
		}

		aligner.init(event.width , event.height);
		aligner.align();
		this.get('bgImg').css('visibelity' , '');
	},

	onFillModeChanged : function(){
		var aligner = this.get('bgAligner');
		aligner.changeType(this.get('controller.currentSlide.fillMode'));
	}.observes('controller.currentSlide.fillMode'),

	willDestroyElement: function(){
   		this.set('bgAligner' , null);
 	}
});//js\mspanel\views\ControlsView.js 
 
/*MSPanel.ControlsView = Ember.View.extend({
	didInsertElement: function(){
		this.get('controller').send('showControlOptions');
	}
});
*/
MSPanel.ControlBtn = Ember.View.extend({
	control: null,
	tagName: 'div',
	active:false,
	classNames: ['msp-control-btn'],
	classNameBindings: ['active:msp-blue-btn'],

	template : Ember.Handlebars.compile('<span class="msp-control-label">{{view.control.label}}</span>'+
										'<a href="#" {{action "removeControl" target=view bubbles=false}}><span class="msp-control-removes msp-ico msp-ico-whiteremove"></span></a>'),

	
	didInsertElement: function() {
		
	},

	onActiveChange: function(){
		this.set('active', this.get('controller.currentControl') === this.get('control'));
		
		if( this.get('active') ){
			this.get('controller').send('showControlOptions');
		}

	}.observes('controller.currentControl').on('init'),

	click: function(){
		if( this.get('active') ) {
			return;
		}
		this.set('controller.currentControl', this.get('control'));
		//this.get('controller').send('showControlOptions');
	},

	actions: {
		removeControl: function(){
			if( confirm('Are you sure want to remvoe "' + this.get('control.label') + '" control?')){
				this.get('controller').send('removeControl', this.get('control'));
			}
		}
	}

});
//js\mspanel\components\UIComponents.js 
 
/**
	MSPanel UI Components
	Version 1.0b
*/

/* ---------------------------------------------------------
						Metabox
------------------------------------------------------------*/

MSPanel.MetaBoxComponent = Ember.Component.extend({
	tagName: 'div',
	classNames: ['msp-metabox'],
	layout: Ember.Handlebars.compile('<div class="msp-metabox-handle">'+
									 	'<h3 class="msp-metabox-title">{{title}}</h3>'+
										'<div class="msp-metabox-toggle"></div>'+
									'</div>'+
									'{{yield}}'+
			 						'<div class="clear"> </div>')
});


/* ---------------------------------------------------------
						Tabs
------------------------------------------------------------*/

Ember.TEMPLATES['components/tabs-panel'] =	Ember.Handlebars.compile('{{yield}}');
MSPanel.TabsPanelComponent = Ember.Component.extend({
	tagName: 'div',
	attributeBindings: ['id'],
	classNames: ['msp-metabox msp-metabox-tabs'],
	didInsertElement: function() {
		this.$().avertaLiveTabs();
	}
});


/* ---------------------------------------------------------
						Switchbox
------------------------------------------------------------*/

MSPanel.SwitchBoxComponent = Ember.Component.extend({
	classNames	: ['msp-switchbox'],
	offlable	: 'OFF',
	onlable 	: 'ON',
	value	: false,

	layout	: Ember.Handlebars.compile('<div class="msp-switch-cont">'+
												'<span class="msp-switch-off">{{view.offlable}}</span>'+
												'<div class="msp-switch-handle"></div>'+
												'<span class="msp-switch-on">{{view.onlable}}</span>'+
											'</div>'),
	
	click:function(){
		var that = this;
		that.set('value' , !that.get('value'));
	},
	
	update: function(){

		if(this.get('value')) 	this.$().addClass('switched');
		else 		 				this.$().removeClass('switched');

	}.observes('value').on('didInsertElement')

});


/* ---------------------------------------------------------
						WP TinyMCE Editor
------------------------------------------------------------*/
var hiddenEditor = jQuery('#mspHiddenEditor')[0].outerHTML;
function WPEditorTemplate(id){
	var newEditor = $(hiddenEditor);
	newEditor.find('link').remove(); // remove all css files init
	return newEditor.html().replace(/msp-hidden/g, id);
}
var __tmc_msp_id = 0;

MSPanel.WPEditor = Ember.View.extend({
	classNames : ['msp-wp-editor'],
	_id : null,
	template : null, 
	tab: null,
	tabs: null,

	onInit: function(){
		var id = 'msp-wpeditor-' + __tmc_msp_id;
		this.set('_id', id );
		this.set('template', Ember.Handlebars.compile( WPEditorTemplate(id)));

		__tmc_msp_id++;

	}.on('init'),

	didInsertElement: function(){
		var tabs = this.get('tabs');
		if( Ember.isEmpty(tabs) ) {
			this.createEditor();
			return;
		}

		// is in tabs
		$('#'+tabs).bind('avtTabChange', {that:this}, this.refreshEditor);
	}, 

	refreshEditor: function(event , tab){
		var that = event.data.that;

		if( that.get('tab') === tab ){
			that.createEditor();
		} 
	},

	createEditor: function(){
		if( this.get('inited') === true ){
			return;
		}

		this.set('inited', true);
		var id = this.get('_id'),
			that = this;

		// tinymce
		if( window.tinymce ){
			var settings = $.extend({}, window.tinyMCEPreInit.mceInit['msp-hidden'] || {});
			settings.forced_root_block = ""; 
			settings.force_br_newlines = true;
			settings.force_p_newlines = false;
			settings.wpautop = false;

			if( tinyMCE.majorVersion == '3' ){
				settings.body_class = settings.elements = id;
				tinymce.init(settings);	
				setTimeout(function(){
					that.initEditor(tinyMCE.getInstanceById(id));
				}, 50);
			} else if ( tinyMCE.majorVersion == '4' ){
				settings.body_class = "content post-type-post post-status-auto-draft post-format-standard";
				settings.selector = '#'+id;
				tinymce.init(settings);	
				setTimeout(function(){
					that.initEditor(tinyMCE.get(id));
				}, 50);
			}
			settings.setup = function(ed) {
				//that.initEditor(ed);
			}
		
		}

		var qtagSettings = $.extend({}, window.tinyMCEPreInit.qtInit['msp-hidden'] || {}),
			qtags;

		qtagSettings.id = id;

		if ( typeof(QTags) === 'function' ) {
			qtags = quicktags(qtagSettings);
			QTags.buttonsInitDone = false;
			QTags._buttonsInit();
			that.set('qtags', qtags );
			switchEditors.go(id, 'html');

			this.$('textarea#'+this.get('_id')).on('change keyup paste', function(e){
				that.set('internalChange', true);
				that.set('value', $(this).val());
			});
		}
	},

	initEditor: function(mce){
		var id = this.get('_id'),
			value = this.get('value'),
			that = this;
		
		this.$('.wp-editor-wrap').on('mousedown', function(){
			wpActiveEditor = id;
		});

		function updateValue(ed,e){	
			that.set('value', mce.getContent());
		}

		function internalUpdate(ed,e){
			that.set('internalChange', true);
			that.set('value', mce.getContent());
			that.set('internalChange', false);
		}

		// register events
		if( tinyMCE.majorVersion == '3' ){
			mce.onChange.add(internalUpdate);
			mce.onKeyUp.add(internalUpdate);
		} else if ( tinyMCE.majorVersion == '4' ){
			mce.on('change', internalUpdate);
			mce.on('keyup', internalUpdate);
		}

		this.$().click(internalUpdate);
		
		setTimeout(function(){
			switchEditors.go(id, 'html');
			switchEditors.go(id, 'tmce');
		}, 100);

		this.set('mce', mce);

		this.onValueChanged();
	},

	onValueChanged: function(){

		if( !this.get('inited') ){
			return;
		}

		var value = this.get('value');
		
		this.$('textarea#'+this.get('_id')).val(value);

		if( this.get('internalChange') ){
			this.set('internalChange', false);
			return;
		}

		var mce = this.get('mce');
		if( !Ember.isEmpty(mce) && value != null){
			mce.setContent(value);
		} else if( value == null ){
			mce.setContent(' ');
		}

	}.observes('value'),

	willDestroyElement: function(){
		if( !this.get('inited') ){
			return;
		}

		if( window.tinymce ){
			tinymce.remove(this.get('_id'));	
		} 

		var qtags = this.get('qtags');
		if( qtags ){
			$(qtags.toolbar).remove();
			qtags.toolbar = null;
			qtags = null;

			if( QTags.instances[this.get('_id')] ) {
				delete QTags.instances[this.get('_id')];
			}

			this.$('textarea#'+this.get('_id')).remove();
		}

		var tabs = this.get('tabs');
		if( !Ember.isEmpty(tabs) ){
			$('#' + tabs).unbind('avtTabChange', this.refreshEditor);
		}
	}
});


/* ---------------------------------------------------------
						CKEditor
------------------------------------------------------------*/
/*MSPanel.HTMLTextArea = Ember.TextArea.extend({
	didInsertElement: function() {
		this._super();
		var that = this;

		var cke = CKEDITOR.replace( that.get('elementId'), {	
			uiColor: '#f1f1f1',
			removeButtons: 'Underline,Subscript,Superscript',
			entities  : false,
			htmlEncodeOutput: true,
			forcePasteAsPlainText: true,
			enterMode : CKEDITOR.ENTER_BR,
			shiftEnterMode: CKEDITOR.ENTER_P ,
			toolbarGroups : [
			    { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
			    { name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
			    { name: 'links' },
			    { name: 'insert' },
			     { name: 'tools' },
			    
			    { name: 'document',    groups: [ 'mode', 'document', 'doctools' ] },
			    '/',
			    { name: 'styles' },
			    { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
			    { name: 'paragraph',   groups: [ 'blocks', 'align','list', 'indent'  ] },
			   { name: 'others' }
			    
			]

		});
		
		var update = function(e){
			//if (e.editor.checkDirty()) {
				that.set('internalChange' , true);
				that.set('value', cke.getData());
				//console.log('changes', that.get('value'));

			//}
		}

		//cke.on( 'contentDom', function() {
		//    var editable = cke.editable();

		//    editable.attachListener( editable, 'keyup', function() {
		    //    console.log( 'Editable has been clicked' );
		//        update();
		//    });
		//});

		cke.on('key', update);
		cke.on('blur', update);
		cke.on('paste', update);

		this.set('cke' , cke);
	},

	willDestroyElement: function(){
		this.get('cke').destroy();
		//CKEDITOR.remove(this.get('cke'));
		this.set('cke', null);
	},

	onValueChanged : function(){
		if(this.get('internalChange')){
			this.set('internalChange' , false);
			return;
		}

		var cke = this.get('cke');
		cke.setData(this.get('value'));
	}.observes('value')
});*/

/* ---------------------------------------------------------
					Number Input
------------------------------------------------------------*/

/* Fixed jQuery UI Spinner changing value without focus bug.  */
if( jQuery.ui && jQuery.ui.spinner ){
	jQuery.ui.spinner.prototype._events.mousewheel = function ( event, delta ) {

		if ( !delta || !this.element.is(':focus') ) {
			return;
		}
		if ( !this.spinning && !this._start( event ) ) {
			return false;
		}

		this._spin( (delta > 0 ? 1 : -1) * this.options.step, event );
		clearTimeout( this.mousewheelTimer );
		this.mousewheelTimer = this._delay(function() {
			if ( this.spinning ) {
				this._stop( event );
			}
		}, 100 );
		event.preventDefault();
	} 
}

MSPanel.NumberInputView = Ember.View.extend({
	step : 1,
	min: 0,
	tagName: 'input',
	attributeBindings:['type'],
	lastValue: null,
	type: 'text',

	didInsertElement : function(){

		var that = this,
			input = this.$();
		var updateValue = function(event, ui){
			var value = input.spinner('value');
			that.set('internalChange', true);

			if( isNaN(value) || value == null  ){
				that.set('value', undefined);
			}else{
				that.set('value', parseFloat(value));
			}
		}

		input.on('change',updateValue).spinner({ 
			step: this.get('step'),
			numberFormat: "n",
			min:this.get('min'),
			max:this.get('max'),
			spin: updateValue,
			stop: updateValue
		}).spinner('value', this.get('value'));
		
	},

	onValueChanged : function(){

		if(this.get('internalChange')){
			this.set('internalChange', false);
			return;
		}

		//this.$().val(this.get('value'));

		this.$().spinner('value',  this.get('value'));


		/*if(this.get('internalChange')){
			this.set('internalChange', false);
			return;
		}*/
		//var value = Number(this.get('value'));
			
			//this.$().val(value);

		/*
		if(value == this.get('lastValue')){
			return;
		}
		// convert to number always 		
		if(value === '' || isNaN(value)){
			this.set('value', undefined);
			return;
		}

		if( typeof value !== 'number') {
			this.set('value', Number(this.get('value')));
		}
		
		if(!Ember.isEmpty(value) && value < this.get('min')){
			value = this.get('min');
			this.set('value' , value);
		}

		

		*/
	}.observes('value')

});

Ember.Handlebars.helper('number-input' , MSPanel.NumberInputView);

/**
 * Color Picker
 * @package MSPanel
 * @requires spectrum color picker
 */
MSPanel.ColorPickerComponent = Ember.Component.extend({
	tagName: 'input',
	classNames: 'msp-color-picker',
	value: null,

	didInsertElement: function(){
		var that = this;
		this.$().spectrum({
			color: this.get('value'),
		    allowEmpty:true,
		    showInput: true,
		    showAlpha: true,
		    clickoutFiresChange:true,
		    preferredFormat: "hex6",
		    change: function(color) {
		        if( color === null) {
		        	that.set('value' , null);
		        } else {
		        	that.set('value', color.toString());
		        }
		    }
		})
	},

	willDestroyElement: function(){
		this.$().spectrum("destroy");
	},
	onValueChanged: function(){
		this.$().spectrum("set", this.get('value'));
	}.observes('value')

});

/**
* Dropdwon list 
* @package MSPanel
*/
MSPanel.DropdwonListComponent = Ember.Component.extend({
	tagName: 'div',
	classNames: ['msp-ddlist'],
	layout: Ember.Handlebars.compile('<select>{{yield}}</select>'),
	value: null,
	width: 100,

	didInsertElement: function(){
		var that = this;
		this.$('select').on('change', function(){
			var option = that.$('select option:selected');
			that.set('value', option.attr('value'));
		}).width(this.get('width'));

		this.onValueChanged();
	},

	onValueChanged: function(){
		if( !Ember.isEmpty(this.get('value')) ){
			this.$('select').val(this.get('value'));	
		}
	}.observes('value')
});


/**
 * CodeMirror Component
 * @package MSPanel
 * @requires Codemirror
 */
MSPanel.CodeMirrorComponent = Ember.Component.extend({
	classNames: ['msp-codemirror'],
	width: 250,
	height: 200,
	mode: 'css',
	tab: null,
	tabs: null,
	layout: Ember.Handlebars.compile('<textarea>{{yield}}</textarea>'),

	didInsertElement: function(){

		this.$().width(this.get('width'))
				.height(this.get('height'));

		var that = this,
			editor = CodeMirror.fromTextArea(this.$('>textarea')[0], {
			lineNumbers:true,
			mode:this.get('mode')
		});

		editor.on('change', function(){ 
			that.set('internalChange', true);
			that.set('value', editor.getValue());
		})

		this.set('editor', editor);

		var value = this.get('value');
		if( !Ember.isEmpty(value) ) {
			editor.setValue(value);
		}

		// is in tabs
		var tabs = this.get('tabs');
		if( !Ember.isEmpty(tabs) ){
			$('#'+tabs).bind('avtTabChange', {that:this}, this.refreshEditor);
		}
	},

	onValueChanged: function(){	
		if( this.get('internalChange') === true) {
			this.set('internalChange', false);
			return;
		}
		
		this.get('editor').setValue(this.get('value'));
		this.set('internalChange', false);
		
	}.observes('value'),

	refreshEditor: function(event , tab){
		var that = event.data.that;

		if( that.get('tab') === tab ) {
			that.get('editor').refresh();
		}
	},

	willDestroyElement: function(){
		var tabs = this.get('tabs');
		if( !Ember.isEmpty(tabs) ){
			$('#' + tabs).unbind('avtTabChange', this.refreshEditor);
		}

		var editor = this.get('editor');
		editor.toTextArea();
		editor = null;
		this.set('editor', null);
	}

});//js\mspanel\controllers\ApplicationController.js 
 
/*
 * Application controller 
 * @package MSPanel
 */

MSPanel.pushData = null;
MSPanel.ApplicationController = Ember.Controller.extend({

	sliderId 	: MSPanel.SliderID,

	// if true save button will be disabled
	isSending: false,

	// the status message that appears after save button
	statusMsg: '',

	hasError: false,


	onInit: function(){
		// fetch all data
		
		//setting
		MSPanel.Settings.find();
		// slides
		MSPanel.Slide.find();
		// layer
		//MSPanel.Layer.find();
		// style
		//MSPanel.Style.find();
		// effect 
		//MSPanel.Effect.find();
		// style
		//MSPanel.PresetStyle.find();
		// effect 
		//MSPanel.PresetEffect.find();
		//control
		MSPanel.Control.find();
		//callback
		MSPanel.Callback.find();
		//buttonClass
		//MSPanel.ButtonStyle.find();

		//this.set('useCustomTemplate', MSPanel.Settings.find(0).get('msTemplate') === 'custom');
		this.set('disableControls', MSPanel.Settings.find(0).get('disableControls'));
		
		var that = this;
		MSPanel.pushData = function(){
			that.prepareData();	
		};

		// redirect if woocommerce not installed
		if ( __MSP_TYPE === 'wc-product' && __MSP_POST == null && __WC_INSTALL_URL != null ){
			this.set('hasError', true);
			this.set('errorTemplate', 'wooc-error');
			this.set('wooLink', __WC_INSTALL_URL);
		}

		// generate buttons style element
		this.generateButtonStyles();

		this.set('shortCode', '[masterslider id='+this.get('sliderId')+']');
		this.set('phpFunction', '<?php masterslider('+this.get('sliderId')+'); ?>');

		jQuery('#panelLoading').remove();

	}.on('init'),

	prepareData: function(){
		// Generate used fonts
		var fonts = {},
			font_str = '';
		MSPanel.Style.find().forEach(function(record){
			var font = record.get('fontFamily'),
				weight = record.get('fontWeight');

			if( !Ember.isEmpty(font) ){

				if( !fonts[font] ){
					fonts[font] = [];
				}

				if( weight === 'normal' ){
					weight = 'regular';
				}

				if( !Ember.isEmpty(weight) && fonts[font].indexOf(weight) === -1 ) {
					fonts[font].push(weight);
				}
			}
		});

		for(var font in fonts){
			font_str += font.replace(/\s/, '+') + ':' + fonts[font].join(',') + '|';
		}

		MSPanel.Settings.find(1).set('usedFonts', font_str.slice(0,-1));

		// save all models

		// settings
		this.saveRecords(MSPanel.Settings.find());
		// slides
		this.saveRecords(MSPanel.Slide.find());
		/*// layer
		this.saveRecords(MSPanel.Layer.find());
		// style
		this.saveRecords(MSPanel.Style.find());
		// effect 
		this.saveRecords(MSPanel.Effect.find());
		// preset style
		this.saveRecords(MSPanel.PresetStyle.find());
		// preset effect 
		this.saveRecords(MSPanel.PresetEffect.find());*/
		// control
		this.saveRecords(MSPanel.Control.find());
		// callback functions
		this.saveRecords(MSPanel.Callback.find());
		// button classes
		//this.saveRecords(MSPanel.ButtonStyle.find());

		//console.log('saving data');
	},

	generateButtonStyles: function(){
		var styles = MSPanel.ButtonStyle.find(),
			css = '',
			$styleElement = $('#msp-buttons');
		
		styles.forEach(function(style){
			css += '.' + style.get('className') + ' {'+
							 style.get('normal')+
					'}\n'+

			'.' + style.get('className') + ':hover {'+
							style.get('hover')+
					'}\n'+
			'.' + style.get('className') + ':active {'+
							style.get('active')+
					'}\n';
		});

		if( $styleElement.length === 0 ) {
			$styleElement = $('<style id="msp-buttons"></style>').text(css).appendTo($('head'));
		} else {
			$styleElement.text(css);
		}
	},

	actions: {
		saveAll: function(){
			this.prepareData();
			this.sendData();
		},

		showPreview: function(event){
			if(window.lunchMastersliderPreview){
				lunchMastersliderPreview(event);
			}
		}
	},

	saveRecords: function(records){
		records.forEach(function(record){ record.save(); });
	},

	/**
	 * Send Data to WP Admin
	 * @since  1.0.0
	 * @return {null}
	 */
	sendData: function(){

		this.set('statusMsg', __MSP_LAN.ap_001);
		this.set('isSending', true);
		var that = this;


		jQuery.post(
			__MS.ajax_url,
			{
		        action    		: 'msp_panel_handler', // the handler
		        nonce     		: jQuery('#msp-main-wrapper').data('nonce'), // the generated nonce value
		        msp_data  		: B64.encode(JSON.stringify(MSPanel.data)),
		        preset_style  	: B64.encode(JSON.stringify(MSPanel.PSData)),
		        preset_effect 	: B64.encode(JSON.stringify(MSPanel.PEData)),
		        buttons      	: B64.encode(JSON.stringify(MSPanel.PBData)),
		        slider_id 		: MSPanel.SliderID,
		    },
			function(res){
				that.set('statusMsg', res.message);
				that.set('isSending', false);
				/*if( res.success === true ){
					that.set('statusMsg', __MSP_LAN.ap_003);
					that.set('isSending', false);
				}else{
					that.set('isSending', false);
					that.set('statusMsg', __MSP_LAN.ap_002);
				}*/
			}
		);
	}

});


//js\mspanel\controllers\SettingsController.js 
 

/**
 * Master Slider Settings Controller
 * @package MSPanel
 * @extends {Ember.Controller}
 */
MSPanel.SettingsController = Ember.ObjectController.extend({

	customSlider	: window.__MSP_TYPE && window.__MSP_TYPE === 'custom',
	templateSlider	: window.__MSP_TYPE && ( window.__MSP_TYPE === 'flickr' || window.__MSP_TYPE === 'post' || window.__MSP_TYPE === 'wc-product' || window.__MSP_TYPE === 'facebook'),

	sliderSkins 	: __MSP_SKINS,


	needs: ['application', 'controls'],
	msTemplateName: null,
	msTemplateImg: null,
	draftMSTemplate:null,
	templates: MSPanel.SliderTemplates,

	showAutoHeight: false,
	showNearbyNum: false,
	showWrapperWidth: false,
	preloadMethod: null,
	
	/**
	 * Setup controller init values 
	 * It called from ember router in MSPanel.js
	 */
	setup: function(){
		// read preload valu from model and setup preload select list
		var preload = this.get('preload');
		if( preload === 'all' || preload === '-1' ){
			this.set('preloadMethod' , preload);
		} else {
			this.set('preloadMethod' , 'nearby');
		}

		this.set('draftMSTemplate', this.get('msTemplate'));
		this.updateTemplate(true);
	},
	
	/**
	 * Remove autoheight option if layout style is fullscreen or autofill
	 */
	sliderLayoutChanged: function(){
		var layout = this.get('layout');
		if( layout === 'fullscreen' || layout === 'autofill' ) {
			this.set('showAutoHeight' , false);
			this.set('autoHeight' , false);
		} else {
			this.set('showAutoHeight' , true);
		}

		this.set('showWrapperWidth', layout === 'boxed' || layout === 'partialview');

	/*	if( layout === 'boxed' && Ember.isEmpty(this.get('wrapperWidth')) ){
			this.set('wrapperWidth', this.get('width'));
			this.set('wrapperWidthUnit', 'px');
		}
	
		if( layout === 'partialview' && Ember.isEmpty(this.get('wrapperWidth')) ){
			this.set('wrapperWidth', '100');
			this.set('wrapperWidthUnit', '%');
		}*/

		this.set('showFSMargin', layout === 'fullscreen');
	
	}.observes('layout').on('setup'),

	/**
	 * controll preloading method
	 */
	preloadSetup: function(){
		var preloadMethod = this.get('preloadMethod');

		if( preloadMethod === 'nearby' ) {
			this.set('showNearbyNum' , true);
			var preload = this.get('preload');
			if(preload === 'all' || preload === '-1'){
				this.set('preload' , '0');
			}
		} else {
			this.set('showNearbyNum' , false);
			this.set('preload' , preloadMethod);
		}

	}.observes('preloadMethod').on('setup'),

	updateTemplate: function(init){
		var templateObject,
			msTemplate = this.get('msTemplate');

		this.get('templates').forEach(function(template){
			if( template.value === msTemplate ) {
				templateObject = template;
				return;
			}
		});

		if( templateObject ){
			this.set('msTemplateName', templateObject.name);
			this.set('msTemplateImg', templateObject.img);
			this.set('msTemplateClass', templateObject.className);
			this.set('controllers.application.disableControls', templateObject.disableControls );
			this.set('disableControls', templateObject.disableControls );
			
			if(!init){
				var controllController = this.get('controllers.controls'),
					controlObj,
					control;
				// remove added controls
				var controls = MSPanel.Control.find();

				while(controls.get('firstObject')){
					var control = controls.get('firstObject');
					
					controllController.findControlObj(control.get('name')).used = false;
					control.deleteRecord();
				}

				// create template controls
				for (var controlName in templateObject.controls){
					controlObj = controllController.findControlObj(controlName);
					control = MSPanel.Control.create($.extend(true, controllController.getDefaultValues(controlName), templateObject.controls[controlName]));
					control.set('label', controlObj.label);
					controlObj.used = true;
					control.save();
				}

				// update slider settings
				for(var option in templateObject.settings){
					this.set(option, templateObject.settings[option]);
				}
			}

		} else { // template not found! so lets select custom template
			this.set('draftMSTemplate', 'custom');
			this.updateTemplate();
		}
		
		
	},

	actions: {

		openTemplates: function(){
			var templatesView = MSPanel.TemplatesView.create({
				controller: this
			});

			this.get('mainView').createChildView(templatesView);
			this.set('templatesView', templatesView);

			templatesView.appendTo(MSPanel.rootElement);
		},

		closeTemplates: function(){
			this.get('templatesView').destroy();

			// rollback to current template
			this.set('draftMSTemplate', this.get('msTemplate'));
		},

		saveTemplate: function(){
			if( this.get('draftMSTemplate') === this.get('msTemplate') ){
				this.send('closeTemplates');
				return;
			}

			if( confirm(__MSP_LAN.tv_002) ){	
				// update msTemplate
				this.set('msTemplate', this.get('draftMSTemplate'));
				this.send('closeTemplates');
				this.updateTemplate();
			}
		}
	}
});
//js\mspanel\controllers\SlidesController.js 
 
MSPanel.SlidesController = Ember.ArrayController.extend({

	customSlider	: window.__MSP_TYPE && window.__MSP_TYPE === 'custom',

	_order : -1,

	sortProperties: ['order'],
	mainView: null, // main view object which will be setted by MSPanel.SlidesView
	
	currentSlide: null,

	setup: function(){
		if( this.get('length') === 0 ){
			this.send('newSlide');
		} else {
			var slide = this.get('firstObject');
			this.set('currentSlide' , slide);
		}

		// slider type
		if( Ember.isEmpty(this.get('sliderSettings.type')) ){
			this.set('sliderSettings.type', __MSP_TYPE);
		} 

		this.set('sliderSettings.sliderId', MSPanel.SliderID);

		this.updateOrder();
		//this.set('_order', this.get('lastObject.order'));
	},

	duplicateSlide : function(slide){
		var slideProp = slide.toJSON();
		delete slideProp.id;
		delete slideProp.layers;

		var newSlide = MSPanel.Slide.create(slideProp);

		// insert after
		newSlide.set('order' , slide.get('order') + 1);
		
		// update order
		this.forEach(function(_slide){
			var slide_order = _slide.get('order'),
					nslide_order = newSlide.get('order');

			if(slide_order >= nslide_order && _slide !== newSlide)
				_slide.set('order' , slide_order + 1);
		});

		newSlide.save();
		this.updateOrder();
	},

	updateSlidesSort : function(indexes) {
		this.beginPropertyChanges();

		this.forEach(function(slide) {
			slide.set('order',	indexes[slide.get('id')]);
		}, this);
		this.endPropertyChanges();
		this.set('_order', this.get('lastObject.order'));
	},

	updateOrder: function(){
		var i = 0;
		this.forEach(function(slide){
			slide.set('order', i++);
		});

		this.set('_order', i - 1);
	},
	
	removeSlide : function(slide){
		
		slide.deleteRecord();

		if(this.get('length') === 0){
			this.send('newSlide');
		}else{
			this.send('select' , this.get('firstObject'));
		}

		this.updateOrder();
	},

	actions: {

		newSlide : function(){
			var slide = MSPanel.Slide.create({order: this.get('_order') + 1});
			this.set('currentSlide' , slide);
			this.set('_order' , this.get('_order') + 1);
			slide.save();
		},

		select : function(slide){
			if(slide === this.get('currentSlide')) return;
			this.set('currentSlide' , slide);
		}
	} 
});
//js\mspanel\controllers\ControlsController.js 
 
/**
 * Master Slider Panel, Slider Controls controller
 * @package MSPanel
 * @author Averta
 * @version 1.0b
 */
MSPanel.ControlsController = Ember.ArrayController.extend({

	needs: 'application',

	controls: [
		{used:false, label:__MSP_LAN.cc_001, value:'arrows'},
		{used:false, label:__MSP_LAN.cc_002, value:'timebar'},
		{used:false, label:__MSP_LAN.cc_003, value:'bullets'},
		{used:false, label:__MSP_LAN.cc_004, value:'circletimer'},
		{used:false, label:__MSP_LAN.cc_005, value:'scrollbar'},
		{used:false, label:__MSP_LAN.cc_006, value:'slideinfo'},
		{used:false, label:__MSP_LAN.cc_007, value:'thumblist'}
	],

	selectedControl: null, // selected control in combo box

	availableControls: [], // already added to slider

	noMore: false,

	currentControl: null, // current active control

	setup: function(){
		var that = this;
		this.forEach(function(control){
			that.findControlObj(control.get('name')).used = true;
		});
		this.set('availableControls', this.findAvailableControls());
	},

	actions: {

		addControl: function(){

			var controlName = this.get('selectedControl'),
				controlObj = this.findControlObj(controlName),
				control;

			// create control object
			control = MSPanel.Control.create(this.getDefaultValues(controlName));
			control.set('label', controlObj.label);

			controlObj.used = true;
			this.set('availableControls', this.findAvailableControls());
			control.save();

			this.set('currentControl', control);
		},

		removeControl: function(control){
			this.findControlObj(control.get('name')).used = false;
			this.set('availableControls', this.findAvailableControls());
			control.deleteRecord();

			this.set('currentControl', this.get('firstObject'));
			this.send('showControlOptions');
		},

		showControlOptions: function(){
			var currentControl = this.get('currentControl');

			if( Ember.isEmpty(currentControl) ){
				this.set('controlOptions', 'empty-template');
			} else {
				this.set('controlOptions', currentControl.get('name') + '-options');
			}
		}

	},

	/**
	 * Find selected control from controls
	 * @param  {string} control 
	 * @return {object} 
	 */
	findControlObj: function(control){
		var controls = this.get('controls');
		for(var i=0,l=controls.length; i!==l; i++){
			if( controls[i].value === control ){
				return controls[i];	
			} 
		}

		return null;
	},

	findAvailableControls: function(){
		var avc = [],
			controls = this.get('controls');
		for(var i=0,l=controls.length; i!==l; i++){
			if( !controls[i].used ){
				avc.push(controls[i]);
			}
		}
		
		this.set('noMore', avc.length === 0);
		this.set('selectedControl', avc[0]?avc[0].value:null);

		return avc;
	},

	/**
	 * creates an object of default values for new control
	 * @param  {Control} control 
	 * @return {Object}         
	 */
	getDefaultValues: function(control){
		var values = {name:control};

		values.inset = !(control === 'slideinfo' || control === 'thumblist');

		switch(control){
			case 'timebar':
				values.align = 'bottom';
				values.color = '#FFFFFF';
				values.autoHide = false;
				values.width = 4;
				break;
			case 'bullets':
				values.align = 'bottom';
				values.dir = 'h';
				values.margin = 10;
				break;
			case 'circletimer':
				//values.align = 'tl';
				values.color = '#A2A2A2';
				values.stroke = 10;
				values.radius = 4;
				values.autoHide = false;
				break;
			case 'scrollbar':
				values.align = 'top';
				values.dir = 'h';
				values.color = '#3D3D3D';
				values.margin = 10;
				values.autoHide = false;
				values.width = 4;
				break;
			case 'slideinfo':
				values.align = 'bottom';
				values.margin = 10;
				values.autoHide = false;
				break;
			case 'thumblist':
				values.align = 'bottom';
				values.space = 5;
				values.width = 100;
				values.height = 80;
				values.margin = 10;
				values.fillMode = 'fill';
				values.autoHide = false;
				break;
		}

		return values;
	}

});
//js\mspanel\controllers\CallbacksController.js 
 
/**
 * Master Slider Panel Callbacks controller
 * @package MSPanel
 * @version 1.0
 * @author Averta
 */

MSPanel.CallbacksController = Ember.ArrayController.extend({

	callbacks: [
		{used: false, label:__MSP_LAN.cb_011, value:'INIT'},
		{used: false, label:__MSP_LAN.cb_001, value:'CHANGE_START'},
		{used: false, label:__MSP_LAN.cb_002, value:'CHANGE_END'},
		{used: false, label:__MSP_LAN.cb_003, value:'WAITING'},
		{used: false, label:__MSP_LAN.cb_004, value:'RESIZE'},
		{used: false, label:__MSP_LAN.cb_005, value:'VIDEO_PLAY'},
		{used: false, label:__MSP_LAN.cb_006, value:'VIDEO_CLOSE'},
		{used: false, label:__MSP_LAN.cb_007, value:'SWIPE_START'},
		{used: false, label:__MSP_LAN.cb_008, value:'SWIPE_MOVE'},
		{used: false, label:__MSP_LAN.cb_009, value:'SWIPE_END'}
	],

	availableCallbacks: [],
	noMore: false,
	selectedCallback: null, // selected callback in combo box

	setup: function(){
		var that = this;
		this.forEach(function(callback){
			that.findCallbackObj(callback.get('name')).used = true;
		});
		this.set('availableCallbacks', this.findAvailableCallbacks());
	},

	actions: {
		addCallback: function(){
			var callbackName = this.get('selectedCallback'),
				callbackObj = this.findCallbackObj(callbackName),
				callback;

			// create callback object
			callback = MSPanel.Callback.create({
				name:callbackObj.value,
				label:callbackObj.label
			});
			
			callbackObj.used = true;
			this.set('availableCallbacks', this.findAvailableCallbacks());
			callback.save();
		},

		removeCallback: function(callback){
			if( confirm(__MSP_LAN.cb_010.jfmt(callback.get('label'))) ){
				this.findCallbackObj(callback.get('name')).used = false;
				this.set('availableCallbacks', this.findAvailableCallbacks());
				callback.deleteRecord();	
			}
		}

	},

	/**
	 * Find selected callback from callbacks
	 * @param  {string} callback 
	 * @return {object} 
	 */
	findCallbackObj: function(callback){
		var callbacks = this.get('callbacks');
		for(var i=0,l=callbacks.length; i!==l; i++){
			if( callbacks[i].value === callback ){
				return callbacks[i];	
			} 
		}
		return null;
	},

	findAvailableCallbacks: function(){
		var avc = [],
			callbacks = this.get('callbacks');
		for(var i=0,l=callbacks.length; i!==l; i++){
			if( !callbacks[i].used ){
				avc.push(callbacks[i]);
			}
		}
		
		this.set('noMore', avc.length === 0);
		this.set('selectedCallback', avc[0]?avc[0].value:null);
		return avc;
	},

});
