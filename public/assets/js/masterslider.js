//dev\slider\header.js 
 
/*!
 * Master Slider Lite
 * @author Averta (www.averta.net)
 * Copyright © All Rights Reserved, Averta Ltd.
 *
 * @version 1.1.0
 * @date Sept 2014
 */
//dev\slider\tools\base.js 
 
window.averta = {};

;(function($){
	
	//"use strict";
	
	window.package = function(name){
		if(!window[name]) window[name] = {};
	};
	
	var extend = function(target , object){
		for(var key in object)	target[key] = object[key];
	};
	
	Function.prototype.extend = function(superclass){
		if(typeof superclass.prototype.constructor === "function"){
			extend(this.prototype , superclass.prototype);
			this.prototype.constructor = this;
		}else{
			this.prototype.extend(superclass);
			this.prototype.constructor = this;
		}	
	};
	
	// Converts JS prefix to CSS prefix
	var trans = {
		'Moz'    : '-moz-',
		'Webkit' : '-webkit-',
		'Khtml'  : '-khtml-' ,
		'O'		 : '-o-',
		'ms'	 : '-ms-',
		'Icab'   : '-icab-'
	};
	
	$(document).ready(function(){
		window._jcsspfx 		= getVendorPrefix();	   // JS CSS VendorPrefix
		window._csspfx 			= trans[window._jcsspfx];  // CSS VendorPrefix
		window._cssanim 		= supportsTransitions();
		window._css3d   		= supports3DTransforms();
		window._css2d   		= supportsTransforms();
		window._mobile			= /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
		window._touch			= 'ontouchstart' in document;
	});
	
	
	// Thanks to LEA VEROU
	// http://lea.verou.me/2009/02/find-the-vendor-prefix-of-the-current-browser/
	function getVendorPrefix() {
	
		if('result' in arguments.callee) return arguments.callee.result;
	
		var regex = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/;
	
		var someScript = document.getElementsByTagName('script')[0];
	
		for(var prop in someScript.style)
			if(regex.test(prop))
				return arguments.callee.result = prop.match(regex)[0];
	
		if('WebkitOpacity' in someScript.style) return arguments.callee.result = 'Webkit';
		if('KhtmlOpacity' in someScript.style) return arguments.callee.result = 'Khtml';
	
		return arguments.callee.result = '';
	}
	
	
	// Thanks to Steven Benner.
	// http://stevenbenner.com/2010/03/javascript-regex-trick-parse-a-query-string-into-an-object/
	window.parseQueryString = function(url){
		var queryString = {};
		url.replace(
		    new RegExp("([^?=&]+)(=([^&]*))?", "g"),
		    function($0, $1, $2, $3) { queryString[$1] = $3; }
		);
		
		return queryString;
	};
	
	function checkStyleValue(prop){
		 var b = document.body || document.documentElement;
	    var s = b.style;
	    var p = prop;
	    if(typeof s[p] == 'string') {return true; }
	
	    // Tests for vendor specific prop
	    v = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'],
	    p = p.charAt(0).toUpperCase() + p.substr(1);
	    for(var i=0; i<v.length; i++) {
	      if(typeof s[v[i] + p] == 'string') { return true; }
	    }
	    return false;
	}
	
	function supportsTransitions() {
	   return checkStyleValue('transition');
	}
	
	function supportsTransforms(){
	   return checkStyleValue('transform');
	}
	
	function supports3DTransforms(){
		if(!supportsTransforms()) return false;
	    var el = document.createElement('i'),
	    has3d,
	    transforms = {
	        'WebkitTransform':'-webkit-transform',
	        'OTransform':'-o-transform',
	        'MSTransform':'-ms-transform',
	        'msTransform':'-ms-transform',
	        'MozTransform':'-moz-transform',
	        'Transform':'transform',
	        'transform':'transform'
	    };
		
		el.style.display = 'block';

	    // Add it to the body to get the computed style
	    document.body.insertBefore(el, null);
		
	    for(var t in transforms){
	        if( el.style[t] !== undefined ){
	            el.style[t] = 'translate3d(1px,1px,1px)';
	            has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
	        }
	    }
	
	    document.body.removeChild(el);
	
	    return (has3d != null && has3d.length > 0 && has3d !== "none");
	}
	
	/**
	 * Provides requestAnimationFrame in a cross browser way.
	 * @author paulirish / http://paulirish.com/
	 */
	var fps60 = 50/3;
	
	if ( !window.requestAnimationFrame ) {
	 
		window.requestAnimationFrame = ( function() {
	 
			return window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
	 
				window.setTimeout( callback, fps60 );
	 
			};
	 
		} )();
	 
	}
	
	if (!window.getComputedStyle) {
	    window.getComputedStyle = function(el, pseudo) {
	        this.el = el;
	        this.getPropertyValue = function(prop) {
	            var re = /(\-([a-z]){1})/g;
	            if (prop == 'float') prop = 'styleFloat';
	            if (re.test(prop)) {
	                prop = prop.replace(re, function () {
	                    return arguments[2].toUpperCase();
	                });
	            }
	            return el.currentStyle[prop] ? el.currentStyle[prop] : null;
	        };
	        return el.currentStyle;
	    };
	}

	// IE8 Array indexOf fix
	if (!Array.prototype.indexOf) {
	  Array.prototype.indexOf = function(elt /*, from*/) {
	    var len = this.length >>> 0;

	    var from = Number(arguments[1]) || 0;
	    from = (from < 0)
	         ? Math.ceil(from)
	         : Math.floor(from);
	    if (from < 0)
	      from += len;

	    for (; from < len; from++)
	    {
	      if (from in this &&
	          this[from] === elt)
	        return from;
	    }
	    return -1;
	  };
	}
	
	if(jQuery){
		$.jqLoadFix = function(){
			if(this.complete){
				var that = this;
				setTimeout(function(){$(that).load();} , 1);
			}	
		};
		
		jQuery.uaMatch = jQuery.uaMatch || function( ua ) {
			ua = ua.toLowerCase();
		
			var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
				/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
				/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
				/(msie) ([\w.]+)/.exec( ua ) ||
				ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
				[];
		
			return {
				browser: match[ 1 ] || "",
				version: match[ 2 ] || "0"
			};
		};
		
		// Don't clobber any existing jQuery.browser in case it's different
		//if ( !jQuery.browser ) {
			matched = jQuery.uaMatch( navigator.userAgent );
			browser = {};
		
			if ( matched.browser ) {
				browser[ matched.browser ] = true;
				browser.version = matched.version;
			}
		
			// Chrome is Webkit, but Webkit is also Safari.
			if ( browser.chrome ) {
				browser.webkit = true;
			} else if ( browser.webkit ) {
				browser.safari = true;
			}

			// hofix for IE11 detection 
			var isIE11 = !!navigator.userAgent.match(/Trident\/7\./);
			if (isIE11) {
				browser.msie = "true";
				delete browser.mozilla;
			}

			jQuery.browser = browser;
			
		//}
		
		$.fn.preloadImg = function(src , _event){
			this.each(function(){
				var $this = $(this);
				var self  = this;
				var img = new Image();
				img.onload = function(event){
					if(event == null) event = {}; // IE8
					$this.attr('src' , src);
					event.width = img.width;
					event.height = img.height;
					setTimeout(function(){_event.call(self , event);},50);
					img = null;
				};
				img.src = src;
			});
			return this;
		};
	}
})(jQuery);
//dev\slider\tools\EventDispatcher.js 
 
;(function(){
	
	"use strict";
	
	averta.EventDispatcher = function(){
		this.listeners = {};
	};
	
	averta.EventDispatcher.extend = function(_proto){
		var instance = new averta.EventDispatcher();
		for(var key in instance)
			if(key != 'constructor') _proto[key] =  averta.EventDispatcher.prototype[key];
	};
	
	averta.EventDispatcher.prototype = {
		
		constructor : averta.EventDispatcher,
		
		addEventListener : function(event , listener , ref){
			if(!this.listeners[event]) this.listeners[event] = [];
			this.listeners[event].push({listener:listener , ref:ref});
			
		},
		
		removeEventListener : function(event , listener , ref){
			if(this.listeners[event]){
				for(var i = 0 , l = this.listeners[event].length; i < l ; ++i)
					if(listener == this.listeners[event][i].listener && ref == this.listeners[event][i].ref){	
						this.listeners[event].splice(i,0);
					}
				
				if (this.listeners[event].length == 0)
					delete this.listeners[event];
			}
		},
		
		dispatchEvent : function (event) {
			event.target = this;
			if(this.listeners[event.type])
				for(var i = 0 , l = this.listeners[event.type].length; i < l ; ++i){
					this.listeners[event.type][i].listener.call(this.listeners[event.type][i].ref , event);	
				}
		}
	};

})();
//dev\slider\tools\TouchSwipe.js 
 
;(function($){
	
	"use strict";
	
	var isTouch 	= 'ontouchstart' in document,
		isPointer 	= window.navigator.pointerEnabled,
		isMSPoiner 	= !isPointer && window.navigator.msPointerEnabled,
		usePointer  = isPointer || isMSPoiner,
	// Events	
		ev_start  = (isPointer ? 'pointerdown ' : '' ) + (isMSPoiner ? 'MSPointerDown ' : '' ) + (isTouch ? 'touchstart ' : '' ) + 'mousedown',
		ev_move   = (isPointer ? 'pointermove ' : '' ) + (isMSPoiner ? 'MSPointerMove ' : '' ) + (isTouch ? 'touchmove '  : '' ) + 'mousemove',
		ev_end    = (isPointer ? 'pointerup '   : '' ) + (isMSPoiner ? 'MSPointerUp '   : '' ) + (isTouch ? 'touchend '   : '' ) + 'mouseup', 
		ev_cancel = (isPointer ? 'pointercancel '   : '' ) + (isMSPoiner ? 'MSPointerCancel ': '' ) + 'touchcancel';
	

	averta.TouchSwipe = function($element){
		this.$element = $element;
		this.enabled = true;

		$element.bind(ev_start  , {target: this} , this.__touchStart);

		$element[0].swipe = this;
		
		this.onSwipe    = null;
		this.swipeType  = 'horizontal';
		
		this.lastStatus = {};
	
	};
	
	var p = averta.TouchSwipe.prototype;
	
 	/*-------------- METHODS --------------*/
	
	p.getDirection = function(new_x , new_y){
		switch(this.swipeType){
			case 'horizontal':
				return new_x <= this.start_x ? 'left' : 'right';
			break;
			case 'vertical':
				return new_y <= this.start_y ? 'up' : 'down';
			break;
			case 'all':
				if(Math.abs(new_x - this.start_x) > Math.abs(new_y - this.start_y))
					return new_x <= this.start_x ? 'left' : 'right';
				else
					return new_y <= this.start_y ? 'up' : 'down';
			break;
		}
	};
	
	p.priventDefultEvent = function(new_x , new_y){
		//if(this.priventEvt != null) return this.priventEvt;
		var dx = Math.abs(new_x - this.start_x);
		var dy = Math.abs(new_y - this.start_y);
		
		var horiz =  dx > dy;
		
		return (this.swipeType === 'horizontal' && horiz) ||
			   (this.swipeType === 'vertical' && !horiz);

		//return this.priventEvt;
	};
	
	p.createStatusObject = function(evt){
		var status_data = {} , temp_x , temp_y;
		
		temp_x = this.lastStatus.distanceX || 0;
		temp_y = this.lastStatus.distanceY || 0;
		
		status_data.distanceX = evt.pageX - this.start_x;
		status_data.distanceY = evt.pageY - this.start_y;
		status_data.moveX = status_data.distanceX - temp_x;
		status_data.moveY = status_data.distanceY - temp_y;
		
		status_data.distance  = parseInt( Math.sqrt(Math.pow(status_data.distanceX , 2) + Math.pow(status_data.distanceY , 2)) );
		
		status_data.duration  = new Date().getTime() - this.start_time;
		status_data.direction = this.getDirection(evt.pageX , evt.pageY);
		
		return status_data;
	};
	
	
	p.__reset = function(event , jqevt){
		this.reset = false;
		this.lastStatus = {};
		this.start_time = new Date().getTime();
		this.start_x = isTouch ? event.touches[0].pageX : (usePointer ? event.pageX : jqevt.pageX);
		this.start_y = isTouch ? event.touches[0].pageY : (usePointer ? event.pageY : jqevt.pageY);
	};
	
	p.__touchStart = function(event){
		
		var swipe = event.data.target;
		var jqevt = event;
		if(!swipe.enabled) return;
		event = event.originalEvent;
		
		if( usePointer ) {
			$(this).css('-ms-touch-action', swipe.swipeType === 'horizontal' ? 'pan-y' : 'pan-x');
		}

		if(!swipe.onSwipe) {
			$.error('Swipe listener is undefined');
			return;
		}
		
		if(swipe.touchStarted) return;
		
		swipe.start_x = isTouch ? event.touches[0].pageX : (usePointer ? event.pageX : jqevt.pageX);
		swipe.start_y = isTouch ? event.touches[0].pageY : (usePointer ? event.pageY : jqevt.pageY);
		
		swipe.start_time = new Date().getTime(); 
		
		$(document).bind(ev_end    , {target: swipe} , swipe.__touchEnd).
		 		    bind(ev_move   , {target: swipe} , swipe.__touchMove).
					bind(ev_cancel , {target: swipe} , swipe.__touchCancel);

		var evt = isTouch ? event.touches[0] : (usePointer ? event : jqevt);
		var status = swipe.createStatusObject(evt);
		status.phase = 'start';
		
		swipe.onSwipe.call(null , status);
		
		if(!isTouch)
			jqevt.preventDefault();
		
		swipe.lastStatus = status;
		swipe.touchStarted = true;
	};
	
	p.__touchMove = function(event){
		var swipe = event.data.target;
		var jqevt = event;
		event = event.originalEvent;
		
		if(!swipe.touchStarted) return;
		
		clearTimeout(swipe.timo);
		swipe.timo = setTimeout(function(){swipe.__reset(event , jqevt);} , 60);
				
		var evt = isTouch ? event.touches[0] : (usePointer ? event : jqevt);

		var status = swipe.createStatusObject(evt);
		
		if(swipe.priventDefultEvent(evt.pageX , evt.pageY))
			jqevt.preventDefault();
		
		status.phase = 'move';
		
		//if(swipe.lastStatus.direction !== status.direction) swipe.__reset(event , jqevt);
		
		swipe.lastStatus = status;
		
		swipe.onSwipe.call(null , status);
	};
	
	p.__touchEnd = function(event){
		
		var swipe = event.data.target;
		var jqevt = event;
		event = event.originalEvent;
		
		clearTimeout(swipe.timo);
		
		var evt = isTouch ? event.touches[0] : (usePointer ? event : jqevt);
		
		var status = swipe.lastStatus;
		
		if(!isTouch)
			jqevt.preventDefault();
		
		status.phase = 'end';
		
		swipe.touchStarted = false;
		swipe.priventEvt   = null;
		
		$(document).unbind(ev_end     , swipe.__touchEnd).
		 		    unbind(ev_move    , swipe.__touchMove).
					unbind(ev_cancel  , swipe.__touchCancel);
		
		status.speed = status.distance / status.duration;
				
		swipe.onSwipe.call(null , status);
		
	};
	
	p.__touchCancel = function(event){
		var swipe = event.data.target;
		swipe.__touchEnd(event);
	};
	
	p.enable = function(){
		if(this.enabled) return;
		this.enabled = true;
	};
	
	p.disable = function(){
		if(!this.enabled) return;
		this.enabled = false;
	};
	
})(jQuery);
//dev\slider\tools\Timer.js 
 
/**
 * 	Ticker Class
 * 	Author: Averta Ltd
 */

;(function(){
	"use strict";
	
	averta.Ticker = function(){};
	
	var st = averta.Ticker,
		list = [],
		len = 0,
		__stopped = true;
	
	st.add = function (listener , ref){
		list.push([listener , ref]);
		
		if(list.length === 1) st.start();
		len = list.length;
		return len;
	};
	
	st.remove = function (listener , ref) {
		for(var i = 0 , l = list.length ; i<l ; ++i){
			if(list[i] && list[i][0] === listener && list[i][1] === ref){
				list.splice(i , 1);
			}
		}

		len = list.length;

		if( len === 0 ){
			st.stop();
		}
	};
	
	st.start = function (){
		if(!__stopped) return;
		__stopped = false;
		__tick();
	};
	
	st.stop = function (){
		__stopped = true;
	};
	
	var __tick = function () {
		if(st.__stopped) return;
		var item;
		for(var i = 0; i!==len; i++){
			item = list[i];
			item[0].call(item[1]);
		}

		requestAnimationFrame(__tick);
	};
	
})();

/**
 * 	Timer Class
 * 	Author: Averta Ltd
 */
;(function(){
	"use strict";
	
	if(!Date.now){
		Date.now = function(){
			return new Date().getTime();
		};
	}
	
	averta.Timer = function(delay , autoStart) {
		this.delay = delay;
		this.currentCount = 0;
		this.paused = false;
		this.onTimer = null;
		this.refrence = null;
		
		if(autoStart) this.start();
		
	};
	
	averta.Timer.prototype = {
		
		constructor : averta.Timer,
		
		start : function(){
			this.paused = false;
			this.lastTime = Date.now();
			averta.Ticker.add(this.update , this);
		},
		
		stop : function(){
			this.paused = true;
			averta.Ticker.remove(this.update , this);
		},
		
		reset : function(){
			this.currentCount = 0;
			this.paused = true;
			this.lastTime = Date.now();
		},
		
		update : function(){
			if(this.paused || Date.now() - this.lastTime < this.delay) return;
			this.currentCount ++;
			this.lastTime = Date.now();
			if(this.onTimer)
				this.onTimer.call(this.refrence , this.getTime());

		} ,
		
		getTime : function(){
			return this.delay * this.currentCount;
		}
		
	};
})();
//dev\slider\tools\CSSTweener.js 
 
;(function(){
	
	"use strict";
	
	var evt = null;
	
	window.CSSTween = function(element , duration , delay , ease){
		
		this.$element 	= element;
		this.duration 	= duration  || 1000;
		this.delay 		= delay 	|| 0;
		this.ease 		= ease 		|| 'linear';
		
		/*if(!evt){
			if(window._jcsspfx === 'O')
				evt = 'otransitionend';
			else if(window._jcsspfx == 'Webkit')
				evt = 'webkitTransitionEnd';
			else 
				evt = 'transitionend' ;
		}*/
		
	};
	
	var p = CSSTween.prototype;
	
	/*-------------- METHODS --------------*/
	
	p.to = function(callback , target){
		this.to_cb 			= callback;
		this.to_cb_target 	= target;
		
		return this;
	};

	p.from = function(callback , target ){
		this.fr_cb 			= callback;
		this.fr_cb_target 	= target;
		
		return this;
	};
	
	p.onComplete = function(callback ,target){
		this.oc_fb 			= callback;
		this.oc_fb_target 	= target;
		
		return this;
	};
	
	p.chain = function(csstween){
		this.chained_tween = csstween;
		return this;
	};
	
	p.reset = function(){
		//this.$element[0].removeEventListener(evt , this.onTransComplete , true);
		clearTimeout(this.start_to);
		clearTimeout(this.end_to);
	};
	
	p.start = function(){
	
		clearTimeout(this.start_to);
		clearTimeout(this.end_to);
		
		this.fresh = true;
		
		if(this.fr_cb){
			this.$element.css(window._jcsspfx + 'TransitionDuration' , '0ms');
			this.fr_cb.call(this.fr_cb_target);
		}
		
		var that = this;
		
		this.onTransComplete = function(event){
			
			if(!that.fresh) return;
			
			//that.$element[0].removeEventListener(evt , this.onTransComplete, true);
			//event.stopPropagation();
			
			that.reset();
			
			this.$element.css(window._jcsspfx + 'TransitionDuration' , '').
						  css(window._jcsspfx + 'TransitionProperty' , '').
						  css(window._jcsspfx + 'TransitionTimingFunction' , '').
						  css(window._jcsspfx + 'TransitionDelay' , '');
			
			
			that.fresh = false;
			if(that.chained_tween) that.chained_tween.start();
			if(that.oc_fb)	that.oc_fb.call(that.oc_fb_target);
			
		};
			
		this.start_to = setTimeout(function(){
			
			that.$element.css(window._jcsspfx + 'TransitionDuration' , that.duration + 'ms').
						  css(window._jcsspfx + 'TransitionProperty' , 'all');
						  
			if(that.delay > 0)	that.$element.css(window._jcsspfx + 'TransitionDelay' , that.delay + 'ms');
			else				that.$element.css(window._jcsspfx + 'TransitionDelay' , '');
					
			that.$element.css(window._jcsspfx + 'TransitionTimingFunction' , that.ease);

			if(that.to_cb)	that.to_cb.call(that.to_cb_target);
			
			//that.$element[0].addEventListener(evt , that.onTransComplete , true );
			
			that.end_to = setTimeout(function(){that.onTransComplete();} , that.duration + (that.delay || 0));
		} , 100);
			
		return this;
	};
		
})();

/**
 *	Cross Tween Class
 */
;(function(){
	
	"use strict";
	
	var _cssanim = null;
	window.CTween = {};
	
	function transPos(element, properties){
		if(properties.x !== undefined || properties.y !== undefined){
			if(_cssanim){
				var trans = window._jcsspfx+"Transform";
				if(properties.x !== undefined){
					properties[trans] = (properties[trans] || '') + ' translateX('+properties.x+'px)';
					delete properties.x;
				}
				
				if(properties.y !== undefined){
					properties[trans] = (properties[trans] || '') + ' translateY('+properties.y+'px)';
					delete properties.y;
				}
			}else{
				if(properties.x !== undefined){
					var posx = element.css('right') !== 'auto' ? 'right' : 'left';
					//if(!element[0].bx) element[0].bx = parseInt(element.css(posx));
					properties[posx] = /*element[0].bx + */properties.x + 'px';
					delete properties.x;
				}
				
				if(properties.y !== undefined){
					var posy = element.css('bottom') !== 'auto' ? 'bottom' : 'top';
					//if(!element[0].by) element[0].by = parseInt(element.css(posy));
					properties[posy] = /*element[0].by + */properties.y + 'px';
					delete properties.y;
				}
			}
		}
		return properties;
	}
	
	CTween.setPos = function(element , pos){
		element.css(transPos(element , pos));
	};
	
	CTween.animate = function(element , duration , properties , options){
		if(_cssanim == null) _cssanim = window._cssanim;
		
		options = options || {};
		
		transPos(element , properties);
		
		if(_cssanim){
			var tween = new CSSTween(element , duration , options.delay , EaseDic[options.ease]);
			tween.to(function(){ element.css(properties);});	
			if(options.complete) tween.onComplete(options.complete , options.target);
			tween.start();
			tween.stop = tween.reset;
			return tween;
		}
		
		var onCl;
		
		if(options.delay) element.delay(options.delay);
		if(options.complete) 
			onCl = function(){
				options.complete.call(options.target);
			};

		element.stop(true).animate(properties , duration , options.ease || 'linear' , onCl);
				
		return element;
	};	
	
	CTween.fadeOut = function(target , duration , remove) {
		var options = {};
		if(remove) options.complete = function(){target.remove();};		
		
		CTween.animate(target , duration || 1000 , {opacity : 0} , options);
	};
	
	CTween.fadeIn = function(target , duration){
		target.css('opacity' , 0);
		CTween.animate(target , duration || 1000 , {opacity : 1});
	};
	
})();

;(function(){
	
	// Thanks to matthewlein
	// https://github.com/matthewlein/Ceaser
	
	window.EaseDic = {
		'linear'            : 'linear',
	    'ease'              : 'ease',
	    'easeIn'            : 'ease-in',
	    'easeOut'           : 'ease-out',
	    'easeInOut'         : 'ease-in-out',
	    
	    'easeInCubic'       : 'cubic-bezier(.55,.055,.675,.19)',
	    'easeOutCubic'      : 'cubic-bezier(.215,.61,.355,1)',
	    'easeInOutCubic'    : 'cubic-bezier(.645,.045,.355,1)',
	    'easeInCirc'        : 'cubic-bezier(.6,.04,.98,.335)',
	    'easeOutCirc'       : 'cubic-bezier(.075,.82,.165,1)',
	    'easeInOutCirc'     : 'cubic-bezier(.785,.135,.15,.86)',
	    'easeInExpo'        : 'cubic-bezier(.95,.05,.795,.035)',
	    'easeOutExpo'       : 'cubic-bezier(.19,1,.22,1)',
	    'easeInOutExpo'     : 'cubic-bezier(1,0,0,1)',
	    'easeInQuad'        : 'cubic-bezier(.55,.085,.68,.53)',
	    'easeOutQuad'       : 'cubic-bezier(.25,.46,.45,.94)',
	    'easeInOutQuad'     : 'cubic-bezier(.455,.03,.515,.955)',
	    'easeInQuart'       : 'cubic-bezier(.895,.03,.685,.22)',
	    'easeOutQuart'      : 'cubic-bezier(.165,.84,.44,1)',
	    'easeInOutQuart'    : 'cubic-bezier(.77,0,.175,1)',
	    'easeInQuint'       : 'cubic-bezier(.755,.05,.855,.06)',
	    'easeOutQuint'      : 'cubic-bezier(.23,1,.32,1)',
	    'easeInOutQuint'    : 'cubic-bezier(.86,0,.07,1)',
	    'easeInSine'        : 'cubic-bezier(.47,0,.745,.715)',
	    'easeOutSine'       : 'cubic-bezier(.39,.575,.565,1)',
	    'easeInOutSine'     : 'cubic-bezier(.445,.05,.55,.95)',
	    'easeInBack'        : 'cubic-bezier(.6,-.28,.735,.045)',
	    'easeOutBack'       : 'cubic-bezier(.175, .885,.32,1.275)',
	    'easeInOutBack'     : 'cubic-bezier(.68,-.55,.265,1.55)'
	};
})();

//dev\slider\tools\Aligner.js 
 
;(function(){
	
	"use strict";
	
	window.MSAligner = function(type , $container , $img ){
		
		this.$container = $container;
		this.$img	    = $img;	
	
		this.type 		= type || 'stretch'; // fill , fit , stretch , tile , center
		
		this.widthOnly = false;
		this.heightOnly = false;
	};
	
	var p = MSAligner.prototype;
	
	/*-------------- METHODS --------------*/
	
	p.init = function(w , h){
		
		this.baseWidth = w;
		this.baseHeight = h;
		this.imgRatio = w / h;
		this.imgRatio2 = h / w;

		switch(this.type){
			case 'tile':
				this.$container.css('background-image' , 'url('+ this.$img.attr('src') +')');
				this.$img.remove();
			break;
			case 'center':
				this.$container.css('background-image' , 'url('+ this.$img.attr('src') +')');
				this.$container.css({
					backgroundPosition 	: 'center center',
					backgroundRepeat	: 'no-repeat'
				});
				this.$img.remove();
			break;
			case 'stretch':
				this.$img.css({
					width	: 	'100%',
					height	: 	'100%'
				});
			break;
			case 'fill':
			case 'fit' :				
				this.needAlign = true;
				this.align();
			break;
		}
		
	};
	
	p.align = function(){
		if(!this.needAlign) return;

		var cont_w = this.$container.width();
		var cont_h = this.$container.height();

		var contRatio = cont_w / cont_h;
		
		if(this.type == 'fill'){
			if(this.imgRatio < contRatio ){
				this.$img.width(cont_w);
				this.$img.height(cont_w * this.imgRatio2);				
			}else{
				this.$img.height(cont_h);
				this.$img.width(cont_h * this.imgRatio);
			}
				
		}else if(this.type == 'fit'){
			
			if(this.imgRatio < contRatio){
				this.$img.height(cont_h);
				this.$img.width(cont_h * this.imgRatio);				
			}else{
				this.$img.width(cont_w);
				this.$img.height(cont_w * this.imgRatio2);	
			}
		}
		
		this.setMargin();
		
	};

	p.setMargin = function(){

		var cont_w = this.$container.width();
		var cont_h = this.$container.height();
		
		this.$img.css('margin-top' , (cont_h - this.$img[0].offsetHeight) / 2 + 'px');
		this.$img.css('margin-left', (cont_w - this.$img[0].offsetWidth ) / 2 + 'px');
	}
	
})();
//dev\slider\controls\controller.js 
 
/**
 *  Touch List Control
 * 	version 1.1.2
 * 	
 * 	Copyright (C) 2014, Averta Ltd. All rights reserved. 	 	
 */

;(function(){	
	
	"use strict";
		
	var _options = {
		bouncing 			: true,
		snapping			: false,
		snapsize			: null,
		friction			: 0.05,
		outFriction			: 0.05,
		outAcceleration		: 0.09,	
		minValidDist		: 0.3,
		snappingMinSpeed	: 2,
		paging				: false,
		endless				: false,
		maxSpeed			: 160
	};
	

	var Controller = function(min , max , options){
		
		if(max === null || min === null) {
			throw new Error('Max and Min values are required.');
		}
		
		this.options = options || {};
		
		for(var key in _options){
			if(!(key in this.options))
				this.options[key] = _options[key];
		}
		
		this._max_value 	= max;
		this._min_value 	= min;
				
		this.value 			= min;
		this.end_loc 		= min;
		
		this.current_snap	= this.getSnapNum(min);
		
		this.__extrStep 	= 0;
		this.__extraMove 	= 0;
		
		this.__animID	 	= -1;
	
	};
	
	var p = Controller.prototype;
	
	/*
	---------------------------------------------------
		PUBLIC METHODS
	----------------------------------------------------
	*/


	p.changeTo = function(value , animate , speed , snap_num , dispatch) {
		this.stopped = false;
		this._internalStop();
		value = this._checkLimits(value);
		speed = Math.abs(speed || 0);
		
		if(this.options.snapping){
			snap_num = snap_num || this.getSnapNum(value);
			if( dispatch !== false )this._callsnapChange(snap_num);
			this.current_snap = snap_num;
		}
		
		if(animate){
			this.animating = true;

			var self = this,
				active_id = ++self.__animID,
				amplitude = value - self.value,
				timeStep = 0,
				targetPosition = value,
				animFrict = 1 - self.options.friction,
				timeconst = animFrict + (speed - 20)  * animFrict * 1.3 / self.options.maxSpeed;

			var tick = function(){
				
				if(active_id !== self.__animID) return;
				
				var dis =  value - self.value;
				
				if( Math.abs(dis) > self.options.minValidDist && self.animating ){
					window.requestAnimationFrame(tick);
				} else {

					if( self.animating ){
						self.value = value;
						self._callrenderer();
					}

					self.animating = false;
					
					if( active_id !== self.__animID ){
						self.__animID = -1;
					}
					
					self._callonComplete('anim');
					
					return;
				}

				//self.value += dis * timeconst
				self.value = targetPosition - amplitude * Math.exp(-++timeStep * timeconst);

				self._callrenderer();
			};
		
			tick();
			
			return;
		}
				
		this.value = value;
		this._callrenderer();
	};
	
	p.drag = function(move){
		
		if(this.start_drag){
			this.drag_start_loc  = this.value;
			this.start_drag = false;
		}
		
		this.animating 		= false;
		this._deceleration 	= false;
		
		this.value -= move;
				
		if ( !this.options.endless && (this.value > this._max_value || this.value < 0)) {
			if (this.options.bouncing) {
				this.__isout = true;
				this.value += move * 0.6;
			} else if (this.value > this._max_value) {
				this.value = this._max_value;
			} else {
				this.value = 0;
			}
		}else if(!this.options.endless && this.options.bouncing){
				this.__isout = false;
		}
		
		this._callrenderer();
		
	};
	
	p.push = function(speed){
		this.stopped = false;
		if(this.options.snapping && Math.abs(speed) <= this.options.snappingMinSpeed){
			this.cancel();
			return;
		}
		
		this.__speed = speed;
		this.__startSpeed = speed;

		this.end_loc = this._calculateEnd();
		
		if(this.options.snapping){
			
			var snap_loc = this.getSnapNum(this.value),
				end_snap = this.getSnapNum(this.end_loc);

			if(this.options.paging){
				snap_loc = this.getSnapNum(this.drag_start_loc);
				
				this.__isout = false;
				if(speed > 0){
					this.gotoSnap(snap_loc + 1 , true , speed);
				}else{
					this.gotoSnap(snap_loc - 1 , true , speed);
				}
				return;	
			}else if(snap_loc === end_snap){
				this.cancel();
				return;
			}
			
			this._callsnapChange(end_snap);
			this.current_snap = end_snap;
			
		}
		
		this.animating = false;

		this.__needsSnap = this.options.endless || (this.end_loc > this._min_value && this.end_loc < this._max_value) ;
	
		if(this.options.snapping && this.__needsSnap)
			this.__extraMove = this._calculateExtraMove(this.end_loc);
		
		
		this._startDecelaration();
	};
	
	p.bounce = function(speed){
		if(this.animating) return;
		this.stopped = false;
		this.animating = false;
		
		this.__speed = speed;
		this.__startSpeed = speed;
		
		this.end_loc = this._calculateEnd();
		
		//if(this.options.paging){}
		
		this._startDecelaration();
	};
	
	p.stop = function(){
		this.stopped = true;
		this._internalStop();
	};
		
	p.cancel = function(){
		this.start_drag = true; // reset flag for next drag
		if(this.__isout){
			this.__speed = 0.0004;
			this._startDecelaration();
		}else if(this.options.snapping){
			this.gotoSnap(this.getSnapNum(this.value) , true);
		}
		
	};
		
	p.renderCallback = function(listener , ref){
		this.__renderHook = {fun:listener , ref:ref};
	};
	
	p.snappingCallback = function(listener , ref){
		this.__snapHook = {fun:listener , ref:ref};
	};
	
	p.snapCompleteCallback = function(listener , ref){
		this.__compHook = {fun:listener , ref:ref};
	};
	
	p.getSnapNum = function(value){
		return Math.floor(( value + this.options.snapsize / 2 ) / this.options.snapsize);
	};
		
	p.nextSnap = function(){
		this._internalStop();
		
		var curr_snap = this.getSnapNum(this.value);
		
		if(!this.options.endless && (curr_snap + 1) * this.options.snapsize > this._max_value){
			this.__speed = 8;
			this.__needsSnap = false;
			this._startDecelaration();
		}else{
			this.gotoSnap(curr_snap + 1 , true);
		}
	
	};
	
	p.prevSnap = function(){
		this._internalStop();
		
		var curr_snap = this.getSnapNum(this.value);
				
		if(!this.options.endless && (curr_snap - 1) * this.options.snapsize < this._min_value){
			this.__speed = -8;
			this.__needsSnap = false;
			this._startDecelaration();
		}else{
			this.gotoSnap(curr_snap - 1 , true);
		}
	
	};
	
	p.gotoSnap = function(snap_num , animate , speed){
		this.changeTo(snap_num * this.options.snapsize , animate , speed , snap_num);
	};
	
	p.destroy = function(){
		this._internalStop();
		this.__renderHook = null;
		this.__snapHook = null;
		this.__compHook = null;
	};
	
	/*
	---------------------------------------------------
		PRIVATE METHODS
	----------------------------------------------------
	*/
	
	p._internalStop = function(){
		this.start_drag = true; // reset flag for next drag
		this.animating = false;
		this._deceleration = false;
		this.__extrStep = 0;
	};
	
	p._calculateExtraMove = function(value){
		var m = value % this.options.snapsize;
		return m < this.options.snapsize / 2  ? -m : this.options.snapsize - m;
	};
	
	p._calculateEnd = function(step){
		var temp_speed = this.__speed;
		var temp_value = this.value;
		var i = 0;
		while(Math.abs(temp_speed) > this.options.minValidDist){
			temp_value += temp_speed;
			temp_speed *= this.options.friction;
			i++;
		}
		if(step) return i;
		return temp_value;
	};
	
	p._checkLimits = function(value){
		if(this.options.endless) 	return value;
		if(value < this._min_value) return this._min_value;
		if(value > this._max_value) return this._max_value;
		return value;
	};
	
	p._callrenderer = function(){
		if(this.__renderHook) this.__renderHook.fun.call(this.__renderHook.ref , this , this.value);
	};
	
	p._callsnapChange = function(targetSnap){
		if(!this.__snapHook || targetSnap === this.current_snap) return;
		this.__snapHook.fun.call(this.__snapHook.ref , this , targetSnap , targetSnap - this.current_snap);
	};

	p._callonComplete = function(type){
		if(this.__compHook && !this.stopped){
			this.__compHook.fun.call(this.__compHook.ref , this , this.current_snap , type);
		}
			
	};

	p._computeDeceleration = function(){
		
		if(this.options.snapping && this.__needsSnap){
			var xtr_move = (this.__startSpeed - this.__speed) / this.__startSpeed * this.__extraMove;
			this.value += this.__speed + xtr_move - this.__extrStep;
			this.__extrStep = xtr_move;
		}else{
			this.value += this.__speed;
		}
		
		this.__speed *= this.options.friction; //* 10;
		
		if(!this.options.endless && !this.options.bouncing){
			if(this.value <= this._min_value){
				this.value = this._min_value;
				this.__speed = 0;
			}else if(this.value >= this._max_value){
				this.value = this._max_value;
				this.__speed = 0;
			}
		}
		
		this._callrenderer();
		
		if(!this.options.endless && this.options.bouncing){
			
			var out_value = 0;
			
			if(this.value < this._min_value){
				out_value = this._min_value - this.value;
			}else if(this.value > this._max_value){
				out_value = this._max_value - this.value;
			}
			
			this.__isout =  Math.abs(out_value) >= this.options.minValidDist;
			
			if(this.__isout){
				if(this.__speed * out_value <= 0){
					this.__speed += out_value * this.options.outFriction;
				}else {
					this.__speed = out_value * this.options.outAcceleration;
				}
			}
		}
	};

	p._startDecelaration = function(){
		if(this._deceleration) return;
		this._deceleration = true;
		
		var self = this;
		
		var tick = function (){
			
			if(!self._deceleration) return;
			
			self._computeDeceleration();
			
			if(Math.abs(self.__speed) > self.options.minValidDist || self.__isout){
				window.requestAnimationFrame(tick);
			}else{
				self._deceleration = false;
				self.__isout = false;
				
				if(this.__needsSnap && self.options.snapping && !self.options.paging){
					self.value = self._checkLimits(self.end_loc + self.__extraMove);
				}else{
					self.value = Math.round(self.value);
				}
				
				self._callrenderer();
				self._callonComplete('decel');
			}
		};
		
		tick();
	};
	
	window.Controller = Controller;
	
})();//dev\slider\SliderEvent.js 
 
window.MSLSliderEvent = function (type){
	this.type = type;
};

MSLSliderEvent.CHANGE_START      	= 'changeStart';
MSLSliderEvent.CHANGE_END       		= 'changeEnd';
MSLSliderEvent.WAITING		      	= 'waiting';
MSLSliderEvent.AUTOPLAY_CHANGE   	= 'autoplayChange';
MSLSliderEvent.VIDEO_PLAY		   	= 'videoPlay';
MSLSliderEvent.VIDEO_CLOSE		   	= 'videoClose';
MSLSliderEvent.INIT					= 'init';
MSLSliderEvent.RESIZE				= 'resize';
MSLSliderEvent.RESERVED_SPACE_CHANGE = 'rsc'; // internal use
//dev\slider\Slide.js 
 
;(function($){
	
	"use strict";
	
	window.MSLSlide = function(){
		
		this.$element = null;
		
		this.$loading = $('<div></div>').addClass('ms-slide-loading');
		
		this.view 		= null;
		this.index 		= -1;
		
		this.__width 	= 0;
		this.__height 	= 0;
		
		this.preloadCount = 0;
		
		this.fillMode = 'fill'; // fill , fit , stretch , tile , center
		
		this.selected = false;
		this.pselected = false;
		this.autoAppend = true;
		this.isSleeping = true;
		
		this.moz = $.browser.mozilla;
	};
	
	var p = MSLSlide.prototype;
		
	/*-------------- METHODS --------------*/
	
	
	/* -----------------------------------------------------
	 * 				Slide Swipe Reaction
	 -----------------------------------------------------*/
	p.onSwipeStart = function(){
		//this.$layers.css(window._csspfx + 'transition-duration' , '0ms');
		if(this.link)  this.linkdis = true;
		if(this.video) this.videodis = true;
	};
		
	p.onSwipeCancel = function(){
		if(this.link) this.linkdis = false;
		if(this.video) this.videodis = false;
		//this.$layers.css(window._csspfx + 'transition-duration' , this.view.__slideDuration + 'ms');
	};


	/* -----------------------------------------------------*/
	
	p.setBG = function(img){
		this.hasBG = true;	
		var that = this;
		
		this.$imgcont = $('<div></div>').addClass('ms-slide-bgcont');
		
		this.$element.append(this.$loading)
			   		 .append(this.$imgcont);
		
		this.$bg_img = $(img).css('visibility' , 'hidden');
		this.$imgcont.append(this.$bg_img);
		
		this.bgAligner = new MSAligner(that.fillMode , that.$imgcont, that.$bg_img );
		this.bgAligner.widthOnly = this.slider.options.autoHeight;
			
		if(that.slider.options.autoHeight && (that.pselected || that.selected))
			 that.slider.setHeight(that.slider.options.height);
		
		if(this.$bg_img.data('src') !== undefined){
			this.bg_src = this.$bg_img.data('src');
			this.$bg_img.removeAttr('data-src');
		}else{
			this.$bg_img.one('load', function(event) {that._onBGLoad(event);})
						.each($.jqLoadFix);
		}
		
		this.preloadCount++;	
	};
	
	p._onBGLoad = function(event){
		this.bgNatrualWidth = event.width;
		this.bgNatrualHeight = event.height;

		this.bgLoaded = true;
		
		if($.browser.msie)
			this.$bg_img.on('dragstart', function(event) { event.preventDefault(); }); // disables native dragging
		
		this.preloadCount--;
		if(this.preloadCount === 0){
			this.___onReady();
		}
	};
	
	p.loadImages = function(){
		if(this.ls)return;

		this.ls = true;
		
		if( this.preloadCount === 0 ){
			this.___onReady();
		}

		if(this.bgvideo)
			this.bgvideo.load();

		if(this.hasBG && this.bg_src){
			var that = this;
			this.$bg_img.preloadImg(this.bg_src , function(event) {that._onBGLoad(event);});
		}

	};

	// This method will be called by the last layer after loading all of layers.
	p.___onReady = function(){
		this.ready = true;
		this.slider.api._startTimer();
		
		if(!this.isSleeping)
			this.setup();

		CTween.fadeOut(this.$loading , 300 , true);
		
		//sequence loading
		if((this.slider.options.preload === 0 || this.slider.options.preload === 'all') && this.index < this.view.slideList.length - 1){
			this.view.slideList[this.index + 1].loadImages();
		}
		else if(this.slider.options.preload === 'all' && this.index === this.view.slideList.length - 1)
			this.slider._removeLoading();
		
	};

	/* -----------------------------------------------------*/
	
	p.setSize = function(width , height , hard){
		
		this.__width  = width;
		
		if(this.slider.options.autoHeight){
			if(this.bgLoaded){
				this.ratio = this.__width / this.bgWidth;
				height = Math.floor(this.ratio * this.bgHeight);
				this.$imgcont.height(height);
			}else{
				this.ratio = width / this.slider.options.width;
				height = this.slider.options.height * this.ratio;
			}
		}
	
		this.__height = height;
		this.$element.width(width).height(height);
			
		if(this.hasBG && this.bgLoaded)this.bgAligner.align();
				
	};

	
	p.getHeight = function(){
		if( this.hasBG && this.bgLoaded ) return this.bgHeight * this.ratio;
		return Math.max(this.$element[0].clientHeight, this.slider.options.height * this.ratio);
	};

	/* -----------------------------------------------------*/
	// YouTube and Vimeo videos	
	p.__playVideo = function(){
		if(this.vplayed || this.videodis) return;
		this.vplayed = true;
		if(!this.slider.api.paused){
			this.slider.api.pause();
			this.roc = true; // resume on close;
		}
		this.vcbtn.css('display' , '');
		CTween.fadeOut(this.vpbtn 	, 500 , false);
		CTween.fadeIn(this.vcbtn 	, 500);
		CTween.fadeIn(this.vframe 	, 500);
		this.vframe.css('display' , 'block').attr('src' , this.video + '&autoplay=1');
		this.view.$element.addClass('ms-def-cursor');
		this.view.swipeControl.disable();
		
		this.slider.slideController.dispatchEvent(new MSLSliderEvent(MSLSliderEvent.VIDEO_PLAY));
	};
	
	p.__closeVideo = function(){
		if(!this.vplayed) return;
		this.vplayed = false;
		if(this.roc)
			this.slider.api.resume();
		var that = this;
		
		CTween.fadeIn(this.vpbtn	, 500);
		CTween.animate(this.vcbtn   , 500 , {opacity:0} , {complete:function(){	that.vcbtn.css  ('display'  , 'none'); }});
		CTween.animate(this.vframe  , 500 , {opacity:0} , {complete:function(){	that.vframe.attr('src'  , 'about:blank').css('display'  , 'none');}});
		
		this.view.swipeControl.enable();
		this.view.$element.removeClass('ms-def-cursor');
		this.slider.slideController.dispatchEvent(new MSLSliderEvent(MSLSliderEvent.VIDEO_CLOSE));
	};

	/* -----------------------------------------------------*/

	p.create = function(){
		var that = this;

		if(this.link){
			this.$element.css('cursor' , 'pointer')
						 .click(function(){ if(!that.linkdis) window.open(that.link , that.link_targ || '_self'); });
		}
		
		if(this.video){

			if(this.video.indexOf('?') === -1) this.video += '?';
			this.vframe = $('<iframe></iframe>')
						  .addClass('ms-slide-video')
						  .css({width:'100%' , height:'100%' , display:'none'})
						  .attr('src' , 'about:blank')
						  .appendTo(this.$element);
			
			this.vpbtn = $('<div></div>')
						.addClass('ms-slide-vpbtn')
						.click(function(){that.__playVideo();})
						.appendTo(this.$element);	
			
			this.vcbtn = $('<div></div>')
						.addClass('ms-slide-vcbtn')
						.click(function(){that.__closeVideo();})
						.appendTo(this.$element)
						.css('display','none');

			if(window._touch){
				this.vcbtn.removeClass('ms-slide-vcbtn')
						  .addClass('ms-slide-vcbtn-mobile')
						  .append('<div class="ms-vcbtn-txt">Close video</div>')
						  .appendTo(this.view.$element.parent());
			}
		}	
		
		if(!this.slider.options.autoHeight && this.hasBG){
			this.$imgcont.css('height' , '100%');
			
			if(this.fillMode === 'center' || this.fillMode === 'stretch')
				this.fillMode = 'fill';		
		}

		if( this.slider.options.autoHeight ) { 
			this.$element.addClass('ms-slide-auto-height');
		}


		this.sleep(true);
	};
	
	
	p.destroy = function(){
		this.$element.remove();
		this.$element = null;
	};
	
	p.setup = function(){

		//if(this.isSettedup) return;
		//this.isSettedup = true;

		if(!this.initBG && this.bgLoaded){
			this.initBG = true;
			this.$bg_img.css('visibility' , '');
			this.bgWidth  = this.bgNatrualWidth  || this.$bg_img.width();
			this.bgHeight = this.bgNatrualHeight || this.$bg_img.height();

			CTween.fadeIn(this.$imgcont , 300);	

			if(this.slider.options.autoHeight)
			this.$imgcont.height(this.bgHeight * this.ratio);
			
			this.bgAligner.init(this.bgWidth  , this.bgHeight );
			this.setSize(this.__width , this.__height);
			
			if(this.slider.options.autoHeight && (this.pselected || this.selected))
			 	this.slider.setHeight(this.getHeight());
		}
		
	};

	p.prepareToSelect = function(){
		if(this.pselected || this.selected) return;
		this.pselected = true;		
		
		if(this.link || this.video){
			this.view.addEventListener(MSLViewEvents.SWIPE_START  , this.onSwipeStart  , this);
			this.view.addEventListener(MSLViewEvents.SWIPE_CANCEL , this.onSwipeCancel , this);
		}

		this.loadImages();

		if( this.moz ){
			this.$element.css('margin-top' , '');
		}
	};
	
	/*p.prepareToUnselect = function(){
		if(!this.pselected || !this.selected) return;
		
		this.pselected = false;
		
	};*/
	
	p.select = function(){
		if(this.selected) return;
		this.selected = true;
		this.pselected = false;
		this.$element.addClass('ms-sl-selected');
	};
	
	p.unselect = function(){
		this.pselected = false;

		if(this.moz)
			this.$element.css('margin-top' , '0.1px');

		if(this.link || this.video){
			this.view.removeEventListener(MSLViewEvents.SWIPE_START 	, this.onSwipeStart  , this);
			this.view.removeEventListener(MSLViewEvents.SWIPE_CANCEL  , this.onSwipeCancel , this);
		}
			
		if(!this.selected) return;
		this.selected = false;

		this.$element.removeClass('ms-sl-selected');		
		
		if(this.video && this.vplayed){
			this.__closeVideo();
			this.roc = false;
		}	
		
	};	

	p.sleep = function(force){
		if(this.isSleeping && !force) return;
		this.isSleeping = true;
		if(this.autoAppend)
			this.$element.detach();
	};
	
	p.wakeup = function(){
		if(!this.isSleeping) return;
		this.isSleeping = false;
		
		if(this.autoAppend)
			this.view.$slideCont.append(this.$element);

		if(this.moz)
			this.$element.css('margin-top' , '0.1px');
		
		this.setup();

		// aling bg
		if(this.hasBG)
			this.bgAligner.align();
	};

})(jQuery);//dev\slider\SlideController.js 
 
;(function($){
	
	"use strict";
	
	var SliderViewList = {};
	
	window.MSLSlideController = function(slider){
		
		this._delayProgress		= 0;
		
		this._timer 			= new averta.Timer(100);
		this._timer.onTimer 	= this.onTimer;
		this._timer.refrence 	= this;
		
		this.currentSlide		= null;
		
		this.slider 	= slider;
		this.so 		= slider.options;
		
		averta.EventDispatcher.call(this);
		
	};
	
	MSLSlideController.registerView = function(name , _class){
		if(name in SliderViewList){
			 throw new Error( name + ', is already registered.');
			 return;
		}
		
		SliderViewList[name] = _class;
	};
	
	MSLSlideController.SliderControlList = {};
	MSLSlideController.registerControl = function(name , _class){
		if(name in MSLSlideController.SliderControlList){
			 throw new Error( name + ', is already registered.');
			 return;
		}
		
		MSLSlideController.SliderControlList[name] = _class;
	};	
	
	var p = MSLSlideController.prototype;
	
	/*-------------- METHODS --------------*/
	

	p.setupView = function(){

		var that = this;
		this.resize_listener = function(){that.__resize();};
		
		// in @version 1.5.7 it will be added in Masterslider.js _setupSliderLayout function
		//$(window).bind('resize', this.resize_listener);
		
		//if(this.so.smoothHeight) this.so.autoHeight = true;
	
		var viewOptions = {
			spacing: 		this.so.space,
			mouseSwipe:		this.so.mouse,
			loop:			this.so.loop,
			autoHeight:		this.so.autoHeight,
			swipe:			this.so.swipe,
			speed:			this.so.speed,
			dir:			this.so.dir,
			viewNum: 		this.so.inView,
			critMargin: 	this.so.critMargin  	
		};	
		
		if(this.so.viewOptions)
			$.extend(viewOptions , this.so.viewOptions);
				
		if(this.so.autoHeight) this.so.heightLimit = false;
	
		//this.view.slideDuration = this.so.duration;

		var viewClass = SliderViewList[this.slider.options.view] || MSLBasicView;
		if(viewClass._3dreq && (!window._css3d || $.browser.msie) ) viewClass = viewClass._fallback || MSLBasicView;
		
		this.view = new viewClass(viewOptions);

		if(this.so.overPause){
			var that = this;
			this.slider.$element.mouseenter(function(){
				that.is_over = true;
				that._stopTimer();
			}).mouseleave(function(){
				that.is_over = false;
				that._startTimer();
			});
		}

	};

	p.onChangeStart = function(){
		
		this.change_started = true;

		if(this.currentSlide) this.currentSlide.unselect();
		this.currentSlide = this.view.currentSlide;
		this.currentSlide.prepareToSelect();
		//this.__appendSlides();
		if(this.so.endPause && this.currentSlide.index === this.slider.slides.length - 1){
			this.pause();
			//this._timer.reset();
			this.skipTimer();
		}
		
		if(this.so.autoHeight){
			this.slider.setHeight(this.currentSlide.getHeight());
		}

		this.dispatchEvent(new MSLSliderEvent(MSLSliderEvent.CHANGE_START));
	};
	
	p.onChangeEnd = function(){
		//if(!this.currentSlide.selected)
		//	this._timer.reset();
		this.change_started = false;
		
		this._startTimer();
		this.currentSlide.select();
		
		if(this.so.preload > 1){
			var loc ,i , l = this.so.preload - 1;
			
			// next slides
			for(i=1;i<=l;++i){
				loc = this.view.index + i;
				
				if(loc >= this.view.slideList.length) {
					if(this.so.loop){
						loc = loc - this.view.slideList.length;
					}else{
						i = l; 
						continue;
					}
				}
				this.view.slideList[loc].loadImages();
			}
			
			// previous slides
			if(l > this.view.slideList.length/2) 
				l = Math.floor(this.view.slideList.length/2);
			
			for(i=1;i<=l;++i){
				
				loc = this.view.index - i;
				
				if(loc < 0){
					if(this.so.loop){
						loc = this.view.slideList.length + loc;
					}else{
						i = l;
						continue;
					}
				} 
				this.view.slideList[loc].loadImages();
			}
		}
		
		this.dispatchEvent(new MSLSliderEvent(MSLSliderEvent.CHANGE_END));
		
	};
		
	p.onSwipeStart = function(){
		//this._timer.reset();
		this.skipTimer();
	};
	
	p.skipTimer = function(){
		this._timer.reset();
		this._delayProgress  = 0;
		this.dispatchEvent(new MSLSliderEvent(MSLSliderEvent.WAITING));
	};

	p.onTimer = function(time) {
		
		if(this._timer.getTime() >= this.view.currentSlide.delay * 1000){
			//this._timer.reset();
			this.skipTimer();
			this.view.next();
			this.hideCalled = false;
		}
		this._delayProgress = this._timer.getTime() / (this.view.currentSlide.delay * 10);

		this.dispatchEvent(new MSLSliderEvent(MSLSliderEvent.WAITING));
	};
	
	p._stopTimer = function(){
		if(this._timer)
			this._timer.stop();
	};
	
	p._startTimer = function(){
		if(!this.paused && !this.is_over && this.currentSlide && this.currentSlide.ready && !this.change_started)
			this._timer.start();
	};

	p.__appendSlides = function(){
		var slide , loc , i = 0 , l = this.view.slideList.length -1;

		// detach all
		for ( i ; i < l ; ++i){
			slide = this.view.slideList[i];
			if(!slide.detached){
			 	slide.$element.detach();
			 	slide.detached = true;
			}
		}

		// append current slide
		this.view.appendSlide(this.view.slideList[this.view.index]);

		l = 3;

		// next slides
		for(i=1;i<=l;++i){
			loc = this.view.index + i;
			
			if(loc >= this.view.slideList.length) {
				if(this.so.loop){
					loc = loc - this.view.slideList.length;
				}else{
					i = l; 
					continue;
				}
			}

			slide = this.view.slideList[loc];
			slide.detached = false;
			this.view.appendSlide(slide);

		}
		
		// previous slides
		if(l > this.view.slideList.length/2) 
			l = Math.floor(this.view.slideList.length/2);
		
		for(i=1;i<=l;++i){
			
			loc = this.view.index - i;
			
			if(loc < 0){
				if(this.so.loop){
					loc = this.view.slideList.length + loc;
				}else{
					i = l;
					continue;
				}
			} 
			
			slide = this.view.slideList[loc];
			slide.detached = false;
			this.view.appendSlide(slide);
		}

	}

	p.__resize = function(hard){
		if(!this.created) return;

		this.width = this.slider.$element[0].clientWidth || this.so.width;
		
		if(!this.so.fullwidth){ 
			this.width = Math.min(this.width , this.so.width);
			//this.view.$element.css('left' , (this.slider.$element[0].clientWidth - this.width) / 2 + 'px');
		}
		
		this.height = this.width / this.slider.aspect;
		
		if( this.so.autoHeight ){
			this.currentSlide.setSize(this.width , null , hard);
			this.view.setSize(this.width , this.currentSlide.getHeight() , hard);
		} else {
			this.view.setSize(this.width , (this.so.heightLimit ? Math.min(this.height , this.so.height) : this.height) , hard);
		}
		
		if(this.slider.$controlsCont){
			if(this.so.centerControls && this.so.fullwidth) {
				this.view.$element.css('left' , Math.min(0,-(this.slider.$element[0].clientWidth - this.so.width) / 2) + 'px');
			}
		}
		
		this.dispatchEvent(new MSLSliderEvent(MSLSliderEvent.RESIZE));
	};

	p.__dispatchInit = function(){
		this.dispatchEvent(new MSLSliderEvent(MSLSliderEvent.INIT));
	};
		
	p.setup = function(){
		
		this.created = true;
		this.paused = !this.so.autoplay;

		//this.slider.$element.append(this.view.$element);
		this.view.addEventListener(MSLViewEvents.CHANGE_START , this.onChangeStart , this);
		this.view.addEventListener(MSLViewEvents.CHANGE_END   , this.onChangeEnd   , this);
		this.view.addEventListener(MSLViewEvents.SWIPE_START  , this.onSwipeStart  , this);	
		
		//this.currentSlide = this.view.slides[this.so.start - 1];
		this.currentSlide = this.view.slideList[this.so.start - 1];
		this.__resize();
		this.view.create(this.so.start - 1);
		
		if(this.so.preload === 0)
			this.view.slideList[0].loadImages();
			
		this.scroller = this.view.controller;

		if(this.so.wheel){
			var that = this;
			var last_time = new Date().getTime();
			this.wheellistener = function(event){
				var current_time = new Date().getTime();
				if(current_time - last_time < 350) return;
				last_time = current_time;
				var e = window.event || event.orginalEvent || event;
				var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
				if(delta < 0)		that.next();
				else if(delta > 0)	that.previous();
				return false;
			};
			
			if($.browser.mozilla) this.slider.$element[0].addEventListener('DOMMouseScroll' , this.wheellistener);
			else this.slider.$element.bind('mousewheel', this.wheellistener);
		}

		if(this.slider.$element[0].clientWidth === 0)
			this.slider.init_safemode = true;

		this.__resize();
	};
	
	p.index = function(){
		return this.view.index;
	};
	
	p.count = function(){
		return this.view.slidesCount;
	};
	
	p.next = function(){
		this.skipTimer();
		this.view.next();
	};
	
	p.previous = function(){
		this.skipTimer();
		this.view.previous();
	};
	
	p.gotoSlide = function(index) {
		index = Math.min(index, this.count()-1);
		this.skipTimer();
		this.view.gotoSlide(index);
	};

	p.destroy = function(reset){
		this.slider.destroy(reset);
	};

	p._destroy = function(){
		this._timer.reset();
		this._timer = null;
		
		$(window).unbind('resize', this.resize_listener);
		this.view.destroy();
		this.view = null;
		
		if(this.so.wheel){
			if($.browser.mozilla) this.slider.$element[0].removeEventListener('DOMMouseScroll' , this.wheellistener);
			else this.slider.$element.unbind('mousewheel', this.wheellistener);
			this.wheellistener = null;
		}
			
		this.so = null;
	};

	/**
	 * @param  {String} action
	 * @since v1.0 
	 */
	p.runAction = function(action){
		var actionParams = [];

		if( action.indexOf('(') !== -1 ){
			var temp = action.slice(0 , action.indexOf('('));			
			actionParams = action.slice(action.indexOf('(') + 1 , -1).replace(/\"|\'|\s/g , '').split(',');
			action   = temp;
		}

		if ( action in this ){
			this[action].apply(this, actionParams);
		} else if ( console ){
			console.log('Master Slider Error: Action "'+action+'" not found.');
		}
	};

	p.update = function(hard){
		if(this.slider.init_safemode && hard)
			this.slider.init_safemode = false;
		this.__resize(hard);
	};
		
	p.locate = function(){
		this.__resize();
	};
	
	p.resume = function(){
		if(!this.paused) return;
		this.paused = false;
		this._startTimer();
	};
	
	p.pause = function(){
		if(this.paused) return;
		this.paused = true;
		this._stopTimer();
	};

	p.currentTime = function(){
		return this._delayProgress;
	};
	
	averta.EventDispatcher.extend(p);
})(jQuery);
//dev\slider\MasterSliderLite.js 
 
/**
 * Master Slider Lite Main JavaScript File
 * @version 1.1.0
 * @author Averta Ltd.
 */

;(function($){
	
	"use strict";
	
	window.MasterSliderLite = function(){
		
		// Default Options
		this.options = {
			autoplay 			: false,      // Enables the autoplay slideshow.
			loop 				: false,	  // Enables the continuous sliding mode.
			mouse				: true,		  // Whether the user can use mouse drag navigation.
			swipe				: true,		  // Whether the drag/swipe navigation is enabled.
			grabCursor			: true,		  // Whether the slider uses grab mouse cursor.
			space  				: 0,		  // The spacing value between slides in pixels.
			fillMode			: 'fill',  	  // Specifies the slide background scaling method. Its acceptable values are "fill", "fit", "stretch", "center" and "tile". 
			start				: 1,		  // The slider starting slide number.
			view				: 'basic',	  // The slide changing transition. 
			width				: 300,		  // The base width of slides. It helps the slider to resize in correct ratio.
			height				: 150,		  // The base height of slides, It helps the slider to resize in correct ratio.
			inView				: 15, 		  // Specifies number of slides which will be added at a same time in DOM.
			critMargin			: 1,		  // 
			heightLimit			: true,		  // It force the slide to use max height value as its base specified height value.
			smoothHeight		: true,		  // Whether the slider uses smooth animation while its height changes.
			autoHeight			: false,      // Whether the slider adapts its height to each slide height or not. It overrides heightLimit option.
			fullwidth			: false,	  // It enables the slider to adapt width to its parent element. It's very useful for creating full-width sliders. In default it takes max width as its base width value.
			fullheight			: false,	  // It enables the slider to adapt height to its parent element.
			autofill			: false,	  // It enables the slider to adapt width and height to its parent element, It's very useful for creating fullscreen or fullwindow slider.
			endPause			: false,	  // Whether the slider pauses slideshow when it stays at the last slide.
			centerControls 		: true,		  // Whether the slider aligns UI controls to center. This option is only effective in full width mode.
			overPause			: true,		  // Whether the slider pauses slideshow on hover.
			shuffle				: false,	  // Enables the shuffle slide order.
			speed				: 17, 		  // Specifies slide changing speed. It accepts float values between 0 and 100.
			dir					: 'h',		  // Specifies slide changing direction. It accepts two values "h" (horizontal) and "v" (vertical).
			preload				: 0,		  // Specifies number of slides which will be loaded by slider. 0 value means the slider loads slides in sequence.
			wheel				: false,	  // Whether slider uses mouse wheel for navigation.
			layout				: 'boxed'	  // It accepts 'fullwidth', 'fullscreen', 'fillwidth', 'autofill', 'partialview', 'boxed'. It overrides 'fullwidth' and 'autofill' (added in v1.5.6)
		};
		
		this.slides = [];		
		this.$element = null;

		// used by new layout method. to force fullwidth or fullscreen
		this.lastMargin = 0; 

		// Reserved side spaces of slider
		this.leftSpace = 0;
		this.topSpace = 0;
		this.rightSpace = 0;
		this.bottomSpace = 0;

		var that = this;
		this.resize_listener = function(){that._resize();};
		$(window).bind('resize', this.resize_listener);
				
	};
	
	MasterSliderLite.author  		= 'Averta Ltd. (www.averta.net)';
	MasterSliderLite.version 		= '1.1.0';
	MasterSliderLite.releaseDate 	= 'Sept 2014';
	
	var p = MasterSliderLite.prototype;
	
	/*-------------- METHODS --------------*/

	/**
	 * create one slide object for each slide and add it to slide controller
	 * @since 1.0
	 * @private
	 */
	p.__setupSlides = function(){
		var that = this,
			new_slide,
			ind = 0;
		
		this.$element.children('.ms-slide').each(function(index) {
			
			var $slide_ele = $(this);
			
			new_slide 			= new MSLSlide();
			new_slide.$element 	= $slide_ele;
			new_slide.slider 	= that;
			new_slide.delay  	= $slide_ele.data('delay') 		!== undefined ? $slide_ele.data('delay') 		: 3;
			new_slide.fillMode 	= $slide_ele.data('fill-mode')	!== undefined ? $slide_ele.data('fill-mode') 	: that.options.fillMode;
			new_slide.index 	= ind++;

			// Slide Background Image
			var slide_img = $slide_ele.children('img:not(.ms-layer)');
			if( slide_img.length > 0 ){
				new_slide.setBG(slide_img[0]);
			}
			
			// controls
			if(that.controls){
				for(var i = 0 , l = that.controls.length; i<l ; ++i)
					that.controls[i].slideAction(new_slide);
			}
			
			// Slide Link and Video
			var slide_link = $slide_ele.children('a').each(function(index) {
			  var $this = $(this);
			  if(this.getAttribute('data-type') === 'video'){
			  	new_slide.video = this.getAttribute('href');
			  	$this.remove();
			  }else if(!$this.hasClass('ms-layer')) {
			  	new_slide.link  = this.getAttribute('href');
			  	new_slide.link_targ = this.getAttribute('target');
			  	$this.remove();
			  }
			});//.remove();
			
			that.slides.push(new_slide);
			that.slideController.view.addSlide(new_slide);

		});
	};
	
	/**
	 * remove slider initialize loading
	 * @since 1.0
	 * @private
	 */
	p._removeLoading = function(){
		$(window).unbind('resize', this.resize_listener);
		this.$element = $('#' + this.id).removeClass('before-init')
										.css('visibility', 'visible')
										.css('height','')
										.css('opacity' , 0);
		CTween.fadeIn(this.$element);
		this.$loading.remove();

		if(this.slideController)
			this.slideController.__resize();
	};
	
	/**
	 * resize listener, it only used for aligning slider loading and after slider init it will be removed
	 * @param  {Event} e
	 * @since 1.0
	 * @private
	 */
	p._resize = function(e){
		if(this.$loading){
			var h = this.$loading[0].clientWidth / this.aspect;
			h = this.options.heightLimit ? Math.min(h , this.options.height) : h;
			
			this.$loading.height(h);
			this.$element.height(h);		
		}
	};
	
	/**
	 * changes the order of slides element before setup slides
	 * @since 1.0
	 * @private
	 */
	p._shuffleSlides = function(){
		var slides = this.$element.children('.ms-slide') , r;

		for(var i = 0 , l = slides.length; i < l ; ++i){
			r = Math.floor(Math.random() * (l - 1));
			if(i != r){
				this.$element[0].insertBefore(slides[i] , slides[r]);
				slides = this.$element.children('.ms-slide');
			}
		}
	};

	/**
	 * New method of setting up the layout of slider
	 * @since 1.0
	 */
	p._setupSliderLayout = function(){

		// create side spaces
		this._updateSideMargins();
		this.lastMargin = this.leftSpace;
		
		var lo = this.options.layout;

		if( lo !== 'boxed' ){
			this.options.fullwidth = true;  // enable slider fullscreen for fullwidth, fillwidth, autofill and fullscreen layouts.
		} 

		if( lo === 'fullwidth' ){
			$(window).bind('resize', {that:this}, this._updateLayout);
			this._updateLayout();
		}

		// bind resize handler of slidecontroller __resize 
		$(window).bind('resize', this.slideController.resize_listener);
	};

	/**
	 * updates layout of slider based on window size
	 * @param  {Event} event
	 * @since 1.0
	 */
	p._updateLayout = function(event){
		var that = event? event.data.that : this,
			lo = that.options.layout,
			$element = that.$element;

		// width 
		$element.width($('body').innerWidth() - that.leftSpace - that.rightSpace);
		var margin = -$element.offset().left + that.leftSpace + that.lastMargin;
		$element.css('margin-left', margin );
		that.lastMargin = margin;

	};


	/**
	 * initialize the slider, called by document ready
	 * <code>preventInit</code> property prevents auto initialize slider after document ready it used by plugins of slider like Flickr
	 * @since 1.0
	 * @protected
	 */
	p._init = function(){
		
		if(this.preventInit) return;
		
		this.initialized = true;

		if(this.options.preload !== 'all')
			this._removeLoading();
		//else
		//	this.$element.css('width' , this.$loading[0].clientWidth);
		
		if(this.options.shuffle) 	this._shuffleSlides();

		this.slideController.setupView();
		this.view = this.slideController.view;
				
		this.$controlsCont = $('<div></div>').addClass('ms-inner-controls-cont');//.appendTo(this.$element);
		if(this.options.centerControls){
			this.$controlsCont.css('max-width' , this.options.width + 'px');
		}

		this.$controlsCont.prepend(this.view.$element);

		this.$msContainer = $('<div></div>').addClass('ms-container').prependTo(this.$element).append(this.$controlsCont);
		
		if(this.controls){
			for(var i = 0 , l = this.controls.length; i<l ; ++i){
				this.controls[i].setup();
			}
		}	


		/*else{
			this.$element.append(this.view.$element);
		}*/

		this._setupSliderLayout();
		this.__setupSlides();
		this.slideController.setup();
		
		if(this.controls){
			for(i = 0 , l = this.controls.length; i<l ; ++i)
				this.controls[i].create();
		}
		
		if(this.options.autoHeight){
			this.slideController.view.$element.height(this.slideController.currentSlide.getHeight());
		}
			
		// add grab cursor
		if(this.options.swipe && !window._touch && this.options.grabCursor && this.options.mouse){
			var $view = this.view.$element;
			
			$view.mousedown(function(){
				$view.removeClass('ms-grab-cursor');
				$view.addClass('ms-grabbing-cursor');

				if ( $.browser.msie && window.ms_grabbing_curosr ) {
					$view[0].style.cursor = 'url(' + window.ms_grabbing_curosr + '), move';
				}

			}).addClass('ms-grab-cursor');
			
			$(document).mouseup(function(){
				$view.removeClass('ms-grabbing-cursor');
				$view.addClass('ms-grab-cursor');

				if ( $.browser.msie && window.ms_grab_curosr ) {
					$view[0].style.cursor = 'url(' + window.ms_grab_curosr + '), move';
				}

			});
		}
		
		this.slideController.__dispatchInit();
		
	};
	
	/**
	 * changes the height of slider, it used in autoheight slider
	 * @param {Number} value
	 * @since 1.0
	 * @public
	 */
	p.setHeight = function(value){
		if(this.options.smoothHeight){
			if(this.htween){
				if(this.htween.reset)this.htween.reset();
				else	 			 this.htween.stop(true);
			} 
			this.htween = CTween.animate(this.slideController.view.$element , 500 , {height:value} , {ease:'easeOutQuart'});
		}else
			this.slideController.view.$element.height(value);
	};
	
	/**
	 * reserves white space in sides of slider, it used by controls
	 * @param  {String} side  left|right|top|bottom
	 * @param  {Number} space 
	 * @returns {Number} start position in space.
	 * @since 1.0
	 * @public
	 */
	p.reserveSpace = function(side, space){
		var sideSpace = side+'Space',
			pos = this[sideSpace];

		this[sideSpace] += space;
		
		this._updateSideMargins();

		return pos;
	};

	p._updateSideMargins = function(){
		this.$element.css('margin', this.topSpace + 'px ' + this.rightSpace + 'px ' + this.bottomSpace + 'px ' + this.leftSpace + 'px');
	}

	p._realignControls = function(){
		this.rightSpace = this.leftSpace = this.topSpace = this.bottomSpace = 0;
		this._updateSideMargins();
		this.api.dispatchEvent(new MSLSliderEvent(MSLSliderEvent.RESERVED_SPACE_CHANGE));
	};

	/*------------------------- Public Methods -----------------------*/

	/**
	 * Adds new control to the slider
	 * @param  {String} control
	 * @param  {Object} options [description]
	 * @since 1.0
	 * @public
	 */
	p.control = function(control , options){
		if(!(control in MSLSlideController.SliderControlList)) return;
		if(!this.controls) this.controls = [];
		var ins = new MSLSlideController.SliderControlList[control](options);
		ins.slider = this;
		this.controls.push(ins);
		
		return this;
	};
	
	/**
	 * setup slider
	 * @param  {String|jQuery object} id
	 * @param  {Object} options 
	 * @since 1.0
	 * @public
	 */
	p.setup = function(id , options){
		this.id = id;
		if(typeof id === 'string')
			this.$element = $('#' + id);
		else 
			this.$element = id.eq(0);

		//create a copy from slider markup, it will be used in destroy method.
		this.setupMarkup = this.$element.html();

		if(this.$element.length === 0){
			//if(console) console.log('Master Slider Error: #'+id+' not found.');
			return;
		}

		this.$element.addClass('master-slider').addClass('before-init');

		// IE prefix class
		if($.browser.msie){
			this.$element.addClass('ms-ie')
						 .addClass('ms-ie' + $.browser.version.slice(0 , $.browser.version.indexOf('.')));
		}
		
		// Android prefix class
		var ua = navigator.userAgent.toLowerCase();
		var isAndroid = ua.indexOf("android") > -1;
		if(isAndroid) {
		  this.$element.addClass('ms-android');
		}

		var that = this;
		$.extend(this.options, options);
		
		this.aspect = this.options.width / this.options.height;
		
		this.$loading = $('<div></div>').
						addClass('ms-loading-container').
						insertBefore(this.$element).
						append($('<div></div>').addClass('ms-loading'));

		this.$loading.parent().css('position' , 'relative');
		
		
		// old methods 
		if(this.options.autofill){
			this.options.fullwidth = true;
			this.options.fullheight = true;
		}
		
		if(this.options.fullheight){
			this.$element.addClass('ms-fullheight');
		}

		//this._setupSliderLayout();	
		this._resize();
		
		// define slide controller and api
		this.slideController = new MSLSlideController(this);
		this.api = this.slideController;

		$(document).ready(function(){that._init();});

		return this;
	};
	
	/**
	 * destroy the slider instance 
	 * @param  {Boolean} insertMarkup	 whether add slider markup after destroy.
	 * @since 1.0
	 * @public
	 */
	p.destroy = function(insertMarkup){
		
		if(this.controls){
			for(var i = 0 , l = this.controls.length; i!==l ; i++)
				this.controls[i].destroy();
		}
		
		if(this.slideController) this.slideController._destroy();

		if(this.$loading) this.$loading.remove();

		if(insertMarkup) 
			this.$element.html(this.setupMarkup).css('visibility' , 'hidden');
		else    		 
			this.$element.remove();

		var lo = this.options.layout;
		if( lo === 'fullwidth' ){
			$(window).unbind('resize', this._updateLayout);
		}

		this.view = null;
		this.slides = null;
		this.options = null;
		this.slideController = null;
		this.api = null;
		this.resize_listener = null;
	};
		
})(jQuery);
//dev\slider\views\ViewEvents.js 
 
window.MSLViewEvents = function (type){
	this.type = type;
};

MSLViewEvents.SWIPE_START      = 'swipeStart';
MSLViewEvents.SWIPE_END        = 'swipeEnd';
MSLViewEvents.SWIPE_MOVE		 = 'swipeMove';
MSLViewEvents.SWIPE_CANCEL   	 = 'swipeCancel';
MSLViewEvents.SCROLL 			 = 'scoll';
MSLViewEvents.CHANGE_START     = 'slideChangeStart';
MSLViewEvents.CHANGE_END	     = 'slideChangeEnd';

//dev\slider\views\BasicView.js 
 
;(function($){
	
	"use strict";
	
	window.MSLBasicView = function(options){
		
		this.options = {
			loop 			: false,
			dir  			: 'h',
			autoHeight 		: false,
			spacing			: 5,
			mouseSwipe		: true,
			swipe			: true,
			speed			: 17,
			minSlideSpeed	: 2,

			viewNum			: 20,
			critMargin		: 1
		};
		
		$.extend(this.options , options);
		
		this.dir		= this.options.dir;
		this.loop   	= this.options.loop;
		this.spacing	= this.options.spacing;
		
		this.__width  = 0;
		this.__height = 0;

		this.__cssProb 		= this.dir === 'h' ? 'left'    : 'top';
		this.__offset 		= this.dir === 'h' ? 'offsetLeft' : 'offsetTop';
		this.__dimension    = this.dir === 'h' ? '__width' : '__height';

		this.__translate_end	= window._css3d ? ' translateZ(0px)' : '';

		this.$slideCont	= $('<div></div>').addClass('ms-slide-container');
		this.$element 	= $('<div></div>').addClass('ms-view').addClass('ms-basic-view').append(this.$slideCont);
	
		this.currentSlide 	= null;
		this.index 			= -1;
		this.slidesCount	= 0;

		this.slides			= [];
		this.slideList		= []; // All of slides with added priority sort;
		this.viewSlidesList = []; 
			
		this.css3 			= window._cssanim;
		this.start_buffer = 0;
		this.firstslide_snap = 0;
		
		this.controller 	 = new Controller(0 , 0 , {
			snapping	     : true,
			snapsize		 : 100,
			paging			 : true,
			snappingMinSpeed : this.options.minSlideSpeed,
			friction		 : (100 - this.options.speed * 0.5) / 100,
			endless			 : this.loop
		});
		
		this.controller.renderCallback(this.dir === 'h'? this._horizUpdate : this._vertiUpdate , this);
		this.controller.snappingCallback(this.__snapUpdate , this);
		this.controller.snapCompleteCallback(this.__snapCompelet , this);
		
		averta.EventDispatcher.call(this);
	};
	
	var p = MSLBasicView.prototype;
		
	/*-------------- METHODS --------------*/
	
	p.__snapCompelet = function(snap , type){
		// if(this.loop && Math.abs(this.__contPos) > 20000){
		// 	this.__locateSlides();
		// 	this.gotoSlide(this.index , true);
		// }

		this.__locateSlides();
		this.start_buffer = 0;
		
		//console.log(this.currentSlide.index);

		this.dispatchEvent(new MSLViewEvents(MSLViewEvents.CHANGE_END));	
	};
	
	p.__snapUpdate = function(controller , snap , change){

		if(this.loop){
			var target_index = this.index + change;
			this.updateLoop(target_index);

			if(target_index >= this.slidesCount)	target_index = target_index - this.slidesCount;
			if(target_index <  0)					target_index = this.slidesCount + target_index;
		
			this.index = target_index;
		}else{
			if(snap < 0 ||  snap >= this.slidesCount) return
			this.index = snap;
		}
		
		this._checkCritMargins();

		if($.browser.mozilla){
			this.slideList[this.index].$element[0].style.marginTop 	= '0.1px';
			if(this.currentSlide){
				this.currentSlide.$element[0].style.marginTop 	= '';
			}
		}
		var new_slide = this.slideList[this.index];
		if(new_slide === this.currentSlide)return;
		this.currentSlide = new_slide;
		this.__updateSlidesZindex();

		this.dispatchEvent(new MSLViewEvents(MSLViewEvents.CHANGE_START));	
	};


	p._checkCritMargins = function(){
		if(this.normalMode) return;

		var hlf 	= Math.floor(this.options.viewNum / 2),
			inView 	= this.viewSlidesList.indexOf(this.slideList[this.index]),
			size 	= (this[this.__dimension] + this.spacing),
			cm 		= this.options.critMargin;

		if(this.loop){
			if(inView <= cm || inView >= this.viewSlidesList.length - cm){
				size *= (inView - hlf);
				this.__locateSlides(false ,  size + this.start_buffer );
				this.start_buffer += size;
			}	

			return;
		}

		if( (inView < cm && this.index >= cm ) || (inView >= this.viewSlidesList.length - cm && this.index < this.slidesCount - cm)){
			this.__locateSlides(false);
		}

	};


	p._vertiUpdate = function(controller , value){
		
		this.__contPos = value;
		this.dispatchEvent(new MSLViewEvents(MSLViewEvents.SCROLL));
		
		if(this.css3){
			this.$slideCont[0].style[window._jcsspfx + 'Transform'] = 'translateY('+-value+'px)' + this.__translate_end;
			return;
		}

		this.$slideCont[0].style.top = -value + 'px';
		
	};
	
	p._horizUpdate = function(controller , value){

		this.__contPos = value;
		this.dispatchEvent(new MSLViewEvents(MSLViewEvents.SCROLL));
		
		if(this.css3) {
			this.$slideCont[0].style[window._jcsspfx + 'Transform'] = 'translateX('+-value+'px)'+ this.__translate_end;
			return;
		}
		
		this.$slideCont[0].style.left = -value + 'px';
		
	};


	p.__updateViewList = function(){

		if(this.normalMode) {
			this.viewSlidesList = this.slides;
			return;
		}

		var temp = this.viewSlidesList.slice();

		// update view list 
		this.viewSlidesList = [];	
		var i = 0 , hlf = Math.floor(this.options.viewNum / 2) , l;

		if(this.loop){
			for(; i !== this.options.viewNum ; i++)
				this.viewSlidesList.push(this.slides[this.currentSlideLoc - hlf + i]);
		}else{
			// before
			for(i = 0 ; i !== hlf && this.index - i !== -1 ; i++)
				this.viewSlidesList.unshift(this.slideList[this.index - i]);	
			// after
			for(i = 1; i !== hlf && this.index + i !== this.slidesCount; i++)
				this.viewSlidesList.push(this.slideList[this.index + i]);
		}

		for (i = 0 , l = temp.length ; i !== l ; i++)
			if( this.viewSlidesList.indexOf(temp[i]) === -1)
				temp[i].sleep();

		temp = null;

		if( this.currentSlide ) {
			this.__updateSlidesZindex();
		}
	};
	
	p.__locateSlides = function(move , start){

		this.__updateViewList();

		start = !this.loop ? this.slides.indexOf(this.viewSlidesList[0]) * (this[this.__dimension] + this.spacing ) : start || 0; 

		// old method
		/*for(i = 0; i < this.slidesCount ; ++i){
			var pos =  i * (this[this.__dimension] + this.spacing);
			
			this.slides[i].position = pos;
			this.slides[i].$element[0].style[this.__cssProb] =  pos + 'px';
		}*/

		var l = this.viewSlidesList.length , slide;
		
		for(var i = 0; i !== l ; i++){
			var pos =  start + i * (this[this.__dimension] + this.spacing );
			slide = this.viewSlidesList[i];
			slide.wakeup();
			slide.position = pos;
			slide.$element[0].style[this.__cssProb] =  pos + 'px';
		}

		if(move !== false)this.controller.changeTo( this.slideList[this.index].position , false , null , null , false);

	};
		
	p.__createLoopList = function(){ 
		var return_arr = [];
		var i = 0,
			count = this.slidesCount / 2;
		
		var before_count  = (this.slidesCount % 2 === 0)? count - 1	: Math.floor(count);
		var after_count	  = (this.slidesCount % 2 === 0)? count 	: Math.floor(count);
		
		this.currentSlideLoc = before_count;

		// before
		for(i = 1 ; i <= before_count ; ++i)
			return_arr.unshift(this.slideList[(this.index - i < 0)? this.slidesCount -  i + this.index: this.index - i]);
		
		// current
		return_arr.push(this.slideList[this.index]);
		
		// after
		for(i = 1; i <= after_count; ++i)
			return_arr.push(this.slideList[(this.index + i >= this.slidesCount)? this.index + i - this.slidesCount : this.index + i]);
		
		return return_arr;
		
	};
	
	/*
	 * Calculate shortest distance from index to target.
	 * It will used in loop gesture.
	 * 
	 * Negative values means left direction.
	 */
	
	p.__getSteps = function(index , target){ 
		var right = (target < index)?  this.slidesCount - index + target : target - index;
		var left  = Math.abs(this.slidesCount - right);
		
		return (right < left)? right : -left;		
	};
	
	p.__pushEnd = function(){ 
		var first_slide = this.slides.shift();
		var last_slide = this.slides[this.slidesCount - 2];
		
		this.slides.push(first_slide);
		
		if(!this.normalMode) return;

		var pos = last_slide.$element[0][this.__offset] + this.spacing + this[this.__dimension];
		first_slide.$element[0].style[this.__cssProb] = pos + 'px';
		first_slide.position = pos;
	};
	
	p.__pushStart = function(){ 
		var last_slide =  this.slides.pop();
		var first_slide = this.slides[0];
		
		this.slides.unshift(last_slide);

		if(!this.normalMode) return;

		var pos = first_slide.$element[0][this.__offset] - this.spacing - this[this.__dimension];
		last_slide.$element[0].style[this.__cssProb] = pos + 'px';
		last_slide.position = pos;
	};

	// @since 1.7.0
	// adds z-index to slides
	p.__updateSlidesZindex = function(){
		if ( !this.autoUpdateZIndex ) {
			return;
		}

		var slide,
			l = this.viewSlidesList.length,
			hlf = Math.floor( l/2 );

		if( this.loop ){
			var loc = this.viewSlidesList.indexOf(this.currentSlide);
			for ( var i = 0; i!==l; i++ ){
				slide = this.viewSlidesList[i];
				this.viewSlidesList[i].$element.css('z-index', i<=loc ? i+1 : l-i);
			}
		} else {
			
			var beforeNum = this.currentSlide.index - this.viewSlidesList[0].index,
				afterNum = l - beforeNum,
				diff = beforeNum - afterNum; 

			for ( var i = 0; i!==l; i++ ){
				this.viewSlidesList[i].$element.css('z-index', i<=beforeNum ? i+1 : l-i);
			}

			this.currentSlide.$element.css('z-index', l);
		}
		
	};

	p.addSlide = function(slide){ 
		slide.view = this;

		//this.$slideCont.append(slide.$element);

		this.slides.push(slide);
		this.slideList.push(slide);
		
		this.slidesCount++;
	};
	
	p.appendSlide = function(slide){
		this.$slideCont.append(slide.$element);
	};

	p.updateLoop = function(index){
		if(this.loop){
			var steps = this.__getSteps(this.index , index);
			
			for(var i = 0 , l = Math.abs(steps) ; i < l ; ++ i){
				if(steps < 0) 	this.__pushStart();
				else			this.__pushEnd();
			}
		}
	};
	
	p.gotoSlide = function(index , fast){
		this.updateLoop(index);

		this.index = index;
		
		var target_slide = this.slideList[this.index];

		this._checkCritMargins();

		//this.controller.changeTo( target_slide.$element[0][this.__offset] , !fast , null , null , false);
		this.controller.changeTo( target_slide.position , !fast , null , null , false);
		if(target_slide === this.currentSlide) return;
		
		//if(this.currentSlide) this.currentSlide.unselect();
		
		this.currentSlide = target_slide;
		this.__updateSlidesZindex();
		this.dispatchEvent(new MSLViewEvents(MSLViewEvents.CHANGE_START));
		if(fast)this.dispatchEvent(new MSLViewEvents(MSLViewEvents.CHANGE_END));	
	}; 
	
	p.next = function(){ 
		this.gotoSlide((this.index + 1 >= this.slidesCount)? 0 : this.index + 1);
	};
	
	p.previous = function(){ 
		this.gotoSlide((this.index - 1 < 0)? this.slidesCount - 1 : this.index - 1);
	};
	
	/* --------------- Swipe control ------------------*/	
	
	p.setupSwipe = function(){ 
		
		this.swipeControl = new averta.TouchSwipe(this.$element);
		this.swipeControl.swipeType = this.dir === 'h'? 'horizontal' : 'vertical';
		var that = this;
		
		if(this.dir === 'h'){
			this.swipeControl.onSwipe = function(status){
				that.horizSwipeMove(status);
			};
		}else{
			this.swipeControl.onSwipe = function(status){
				that.vertSwipeMove(status);
			};
		}
		
	};
	
	p.vertSwipeMove = function(status){
		var phase = status.phase;
		if(phase === 'start'){
			this.controller.stop();
			this.dispatchEvent(new MSLViewEvents(MSLViewEvents.SWIPE_START));		
		}else if(phase === 'move' && (!this.loop || Math.abs(this.currentSlide.position - this.controller.value + status.moveY ) < this.cont_size / 2)){
			this.controller.drag(status.moveY);
		}else if(phase === 'end' || phase === 'cancel'){
			
			var speed = status.distanceY / status.duration * 50/3;
			
			if(Math.abs(speed) > 0.1){
				this.controller.push(-speed);
				if(speed > this.controller.options.snappingMinSpeed)
					this.dispatchEvent(new MSLViewEvents(MSLViewEvents.SWIPE_END));
			}else{
				this.controller.cancel();
				this.dispatchEvent(new MSLViewEvents(MSLViewEvents.SWIPE_CANCEL));
			}
			
		}
	};
	
	p.horizSwipeMove = function(status){	
		var phase = status.phase;
		//console.log(this.loop)
		if(phase === 'start'){
			this.controller.stop();
			this.dispatchEvent(new MSLViewEvents(MSLViewEvents.SWIPE_START));		
		}else if(phase === 'move' && (!this.loop || Math.abs(this.currentSlide.position - this.controller.value + status.moveX ) < this.cont_size / 2)){
			this.controller.drag(status.moveX);
		}else if(phase === 'end' || phase === 'cancel'){
			
			var speed = status.distanceX / status.duration * 50/3;
			
			if(Math.abs(speed) > 0.1){
				this.controller.push(-speed );
				if(speed > this.controller.options.snappingMinSpeed)
					this.dispatchEvent(new MSLViewEvents(MSLViewEvents.SWIPE_END));
			}else{
				this.controller.cancel();
				this.dispatchEvent(new MSLViewEvents(MSLViewEvents.SWIPE_CANCEL));
			}
			
		}
	};
		
	/* ------------------------------------------------*/	
	
	p.setSize = function(width , height , hard){
		if(this.lastWidth === width && height === this.lastHeight && !hard) return;

		this.$element.width(width).height(height);
		
		for(var i = 0; i < this.slidesCount ; ++i)
				this.slides[i].setSize(width , height , hard);
				
		this.__width 	= width;
		this.__height 	= height;
			
		if(this.__created){	
			this.__locateSlides();
			
			this.cont_size = (this.slidesCount - 1) * (this[this.__dimension] + this.spacing);
			if(!this.loop) 	this.controller._max_value = this.cont_size;
				
			this.controller.options.snapsize = this[this.__dimension] + this.spacing;
			this.controller.changeTo(this.currentSlide.position , false , null , null , false );
			this.controller.cancel();
			
			this.lastWidth = width;
			this.lastHeight = height;
		}
	};
	
	p.create = function(index){
		
		this.__created = true;
		
		this.index = Math.min((index || 0), this.slidesCount - 1);
		
		if(this.loop)
			this.slides = this.__createLoopList();

		this.normalMode = this.slidesCount <= this.options.viewNum;
				
		for(var i = 0; i < this.slidesCount ; ++i)
			this.slides[i].create();
		
		this.__locateSlides();
			
		this.controller.options.snapsize = this[this.__dimension] + this.spacing;		
		if(!this.loop)	this.controller._max_value = (this.slidesCount - 1) * (this[this.__dimension] + this.spacing);
		
		this.gotoSlide(this.index , true);
		
		if(this.options.swipe && (window._touch || this.options.mouseSwipe))
			this.setupSwipe();

	};
	
	p.destroy = function(){
		if(!this.__created) return;
		
		for(var i = 0; i < this.slidesCount ; ++i)
			this.slides[i].destroy();
			
		this.slides = null;
		this.slideList = null;
		this.$element.remove();
		
		this.controller.destroy();
		this.controller = null;
	};
	
	averta.EventDispatcher.extend(p);
	
	MSLSlideController.registerView('basic' , MSLBasicView);
	
})(jQuery);
//dev\slider\views\FadeView.js 
 
;(function($){
	
	"use strict";
	
	window.MSLFadeView = function(options){
		MSLBasicView.call(this , options);
		this.$element.removeClass('ms-basic-view').addClass('ms-fade-view');
		this.controller.renderCallback(this.__update , this);
	};
	
	MSLFadeView.extend(MSLBasicView);
	
	var p  = MSLFadeView.prototype;
	var _super  = MSLBasicView.prototype;
	 
	/*-------------- METHODS --------------*/
	
	p.__update = function(controller , value){
		var cont_scroll = -value;
		var slide_pos , slide , distance;
		
		for(var i = 0; i < this.slidesCount; ++i){
			slide = this.slideList[i];
			distance = -cont_scroll - slide.position;
			this.__updateSlides(slide , distance);
		}
	};
	
	p.__updateSlides = function(slide , distance){
		var value =  Math.abs(distance / this[this.__dimension]);
		if(1 - value <= 0){
			slide.$element.fadeTo(0 , 0).css('visibility' , 'hidden');	
		}else{
			slide.$element.fadeTo(0 , 1 - value).css('visibility' , '');
		}
	};
	
	p.__locateSlides = function(move , start){

		this.__updateViewList();

		// Old method
		// for(var i = 0; i < this.slidesCount ; ++i){
		// 	this.slides[i].position = i * this[this.__dimension];
		// }

		start = !this.loop ? this.slides.indexOf(this.viewSlidesList[0]) * (this[this.__dimension] + this.spacing ) : start || 0; 

		var l = this.viewSlidesList.length , slide;
		
		for(var i = 0; i !== l ; i++){
			var pos =  start + i * this[this.__dimension];
			slide = this.viewSlidesList[i];
			slide.wakeup();
			slide.position = pos;
		}

		if(move !== false)this.controller.changeTo( this.slideList[this.index].position , false , null , null , false);

	};
	
	p.__pushEnd = function(){
		var first_slide = this.slides.shift();
		var last_slide = this.slides[this.slidesCount - 2];
		this.slides.push(first_slide);
		first_slide.position = last_slide.position + this[this.__dimension];
	};
	
	p.__pushStart = function(){
		var last_slide =  this.slides.pop();
		var first_slide = this.slides[0];
		this.slides.unshift(last_slide);		
		last_slide.position = first_slide.position - this[this.__dimension];
	};
	
	p.create = function(index){
		_super.create.call(this , index);
		this.spacing = 0;
		this.controller.options.minValidDist = 10;
	};
	
	MSLSlideController.registerView('fade' , MSLFadeView);
})(jQuery);//dev\slider\uicontrols\BaseControl.js 
 
;(function($){
	
	"use strict";
	
	var BaseControl = function(){
		this.options = {
			prefix:'ms-',
			autohide:true,
			overVideo:true	
		};
	};
	
	var p = BaseControl.prototype;
	
	/* -------------------------------- */
	
	p.slideAction = function(slide){

	};
	
	p.setup = function(){		
		this.cont = this.options.insertTo ? $(this.options.insertTo) : this.slider.$controlsCont;
		if(!this.options.overVideo) this._hideOnvideoStarts();
	};

	p.checkHideUnder = function(){
		if(this.options.hideUnder){
			//this.slider.api.addEventListener(MSSliderEvent.RESIZE, this.onSliderResize, this);
			this.needsRealign = !this.options.insetTo && (this.options.align === 'left' || this.options.align === 'right') && this.options.inset === false;
			$(window).bind('resize', {that:this}, this.onResize);
			this.onResize();

		}
	};

	/**
	 * hide control if width of slider changes to lower that specified value [hideUnder]
	 * @since 1.5.7
	 * @protected
	 */
	p.onResize = function(event){
		var that = (event && event.data.that) || this;
		var w = window.innerWidth;
		if( w <= that.options.hideUnder && !that.detached ){
			that.hide(true);
			that.detached = true;
			that.onDetach();
		}else if( w >= that.options.hideUnder && that.detached ){
			that.detached = false;
			that.visible();
			that.onAppend();
		}
	};
	
	p.create = function(){
		var that = this;
		if(this.options.autohide && !window._touch){
			
			this.hide(true);
			
			this.slider.$controlsCont.mouseenter($.proxy(this._onMouseEnter, this))
									 .mouseleave($.proxy(this._onMouseLeave, this))
									 .mousedown($.proxy(this._onMouseDown, this));

			if ( this.$element ) {
				this.$element.mouseenter($.proxy(this._onMouseEnter, this))
							 .mouseleave($.proxy(this._onMouseLeave, this))
							 .mousedown($.proxy(this._onMouseDown, this));
			}

			$(document).mouseup($.proxy(this._onMouseUp, this));
		}

	};

	/**
	 * Mouse Enter Listener 
	 * @since 2.2
	 */
	p._onMouseEnter = function(){
		if ( !this._disableAH && !this.mdown ){
			this.visible();
		}
		
		this.mleave = false;
	};

	/**
	 * Mouse Leave Listener 
	 * @since 2.2
	 */
	p._onMouseLeave = function(){
		if ( !this.mdown ){
			this.hide();
		}

		this.mleave = true;
	};

	/**
	 * Mouse Down Listener 
	 * @since 2.2
	 */
	p._onMouseDown = function(){
		this.mdown = true;
	};

	/**
	 * Mouse Up Listener 
	 * @since 2.2
	 */
	p._onMouseUp = function(){
		if ( this.mdown && this.mleave ) { 
			this.hide();
		}
		
		this.mdown = false;
	};

	/**
	 * calls by the parent class [MSBaseControl] when the control element visibles [hideUnder option]
	 * @since 1.5.7
	 */
	p.onAppend = function(){
		if( this.needsRealign ){
			this.slider._realignControls();
		}
	};

	/**
	 * calls by the parent class [MSBaseControl] when the control element visibles [hideUnder option]
	 * @since 1.5.7
	 */
	p.onDetach = function(){
		if( this.needsRealign ){
			this.slider._realignControls();
		}
	};
	
	p._hideOnvideoStarts = function(){
		var that = this;
		slider.api.addEventListener(MSSliderEvent.VIDEO_PLAY , function(){
   			 that._disableAH = true;
   			 that.hide();
		});
		 
		slider.api.addEventListener(MSSliderEvent.VIDEO_CLOSE , function(){
		     that._disableAH = false;
   			 that.visible();
		});
	};
	
	p.hide = function(fast){
		if(fast){
			this.$element.css('opacity' , 0);
			this.$element.css('display' , 'none');
		} else {
			clearTimeout(this.hideTo);
			this.hideTo = setTimeout(function($element){
				CTween.fadeOut($element , 400 , false);
			}, 20 , this.$element);
		}

		this.$element.addClass('ms-ctrl-hide');
	};
	
	p.visible = function(){
		if(this.detached) return;
		clearTimeout(this.hideTo);
		this.$element.css('display' , '');
		CTween.fadeIn(this.$element , 400 , false);
		this.$element.removeClass('ms-ctrl-hide');
	};
	
	p.destroy = function(){

		if(this.options && this.options.hideUnder){
			//this.slider.api.removeEventListener(MSSliderEvent.RESIZE, this.onResize, this);
			$(window).unbind('resize', this.onResize);
		}
	};
	
	window.BaseControl = BaseControl;
	
})(jQuery);
//dev\slider\uicontrols\Arrows.js 
 
;(function($){
	
	"use strict";
	
	var MSLArrows = function(options){
		BaseControl.call(this);
		$.extend(this.options , options);
	};
	
	MSLArrows.extend(BaseControl);
	
	var p = MSLArrows.prototype;
	var _super = BaseControl.prototype;
	
	/* -------------------------------- */
	
	p.setup = function(){
		var that = this;
		
		this.$next = $('<div></div>')
					.addClass(this.options.prefix + 'nav-next')
					//.appendTo(this.cont)
					.bind('click' , function(){
						if(!that.slider.options.loop && that.slider.api.index() === that.slider.api.count() - 1)
							that.slider.view.controller.bounce(10);
						else
							that.slider.api.next();
					});
				
		
		this.$prev = $('<div></div>')
					.addClass(this.options.prefix + 'nav-prev')
					//.appendTo(this.cont)
					.bind('click' , function(){
						if(!that.slider.options.loop && that.slider.api.index() === 0)
							that.slider.view.controller.bounce(-10);
						else
							that.slider.api.previous();
					});
		
		_super.setup.call(this);

		this.cont.append(this.$next);
		this.cont.append(this.$prev);

		this.checkHideUnder(); // super method
	};
	
	p.hide = function(fast){
		if(fast){
			this.$prev.css('opacity' , 0).css('display', 'none');
			this.$next.css('opacity' , 0).css('display', 'none');
			return;
		}
	
		CTween.fadeOut(this.$prev , 400 , false);
		CTween.fadeOut(this.$next , 400 , false);
		
		this.$prev.addClass('ms-ctrl-hide');
		this.$next.addClass('ms-ctrl-hide');
	};
	
	p.visible = function(){
		if(this.detached) return;
		CTween.fadeIn(this.$prev , 400 );
		CTween.fadeIn(this.$next , 400 );
		this.$prev.removeClass('ms-ctrl-hide').css('display', '');
		this.$next.removeClass('ms-ctrl-hide').css('display', '');
	};
	
	p.destroy = function(){
		_super.destroy();
		this.$next.remove();
		this.$prev.remove();
	};
	
	window.MSLArrows = MSLArrows;
	MSLSlideController.registerControl('arrows' , MSLArrows);
})(jQuery);
//dev\slider\uicontrols\Thumblist.js 
 
;(function($){
	
	"use strict";
	
	var MSLThumblist = function(options){
		BaseControl.call(this);
		
		// default options
		this.options.dir 	= 'h';
		this.options.wheel	= options.dir === 'v';
		this.options.arrows = true;
		this.options.speed  = 17;
		this.options.align  = null;
		this.options.inset = false;
		this.options.margin = 10;
		this.options.space = 10;
		this.options.width = 100;
		this.options.height = 100;
		this.options.type = 'thumbs'; // tabs
		
		
		$.extend(this.options , options);
		
		this.thumbs = [];
		this.index_count = 0;
		
		this.__dimen    		= this.options.dir === 'h' ? 'width' : 'height';
		this.__alignsize 		= this.options.dir === 'h' ? 'height' : 'width';
		this.__jdimen    		= this.options.dir === 'h' ? 'outerWidth' : 'outerHeight';
		this.__pos				= this.options.dir === 'h' ? 'left'	 : 'top';		
		
		this.click_enable = true;

	};
	
	MSLThumblist.extend(BaseControl);
	
	var p = MSLThumblist.prototype;
	var _super = BaseControl.prototype;
	
	/* -------------------------------- */
	
	p.setup = function(){
		this.$element = $('<div></div>')
						.addClass(this.options.prefix + 'thumb-list');

		if(this.options.type === 'tabs'){
			this.$element.addClass(this.options.prefix + 'tabs');
		}
		
		this.$element.addClass('ms-dir-' + this.options.dir);

		_super.setup.call(this);	


		if( this.slider.$controlsCont === this.cont ){
			this.$element.appendTo(this.slider.$element);
		}else{
			this.$element.appendTo(this.cont);
		}
						
		this.$thumbscont = $('<div></div>')
						.addClass('ms-thumbs-cont')
						.appendTo(this.$element);
		
		if(this.options.arrows){
			var that = this;
			this.$fwd = $('<div></div>').addClass('ms-thumblist-fwd').appendTo(this.$element).click(function(){that.controller.push(-15);});
			this.$bwd = $('<div></div>').addClass('ms-thumblist-bwd').appendTo(this.$element).click(function(){that.controller.push(15);});
		}

		// align control
		if( !this.options.insetTo && this.options.align ){
			var align = this.options.align;
			if( this.options.inset ){
				this.$element.css(align, this.options.margin );
			}else if( align === 'top' ){
				this.$element.detach().prependTo(this.slider.$element).css({
					'margin-bottom': this.options.margin,
					'position': 'relative'
				});
			}else if( align === 'bottom' ){
				this.$element.css({
					'margin-top': this.options.margin,
					'position': 'relative'
				});
			}else{
				this.slider.api.addEventListener(MSLSliderEvent.RESERVED_SPACE_CHANGE, this.align, this);
				this.align();
			}

			if( this.options.dir === 'v' ){
				this.$element.width(this.options.width);
			}else{
				this.$element.height(this.options.height);
			}
		}
		this.checkHideUnder(); // super method
	};
	
	/**
	 * calls by "RESERVED_SPACE_CHGANE" realigns the control in slider
	 * @since 1.5.7
	 */
	p.align = function(event){
		if( this.detached ){
			return;
		}
		var align = this.options.align;
		var pos = this.slider.reserveSpace(align, this.options[this.__alignsize] + this.options.margin * 2);
		this.$element.css(align, -pos - this.options[this.__alignsize] - this.options.margin);
	};

	p.slideAction = function(slide){
		var thumb_ele = $(slide.$element.find('.ms-thumb'));
		var that = this;
		var thumb_frame = $('<div></div>')
					.addClass('ms-thumb-frame')
					.append(thumb_ele)
					.append($('<div class="ms-thumb-ol"></div>'))
					.bind('click' , function(){that.changeSlide(thumb_frame);});

		if( this.options.align ){
			thumb_frame.width(this.options.width)
					.height(this.options.height)
					.css('margin-'+(this.options.dir === 'v' ? 'bottom' : 'right'), this.options.space); 
		}			
					
		thumb_frame[0].index =  this.index_count ++;
		
		this.$thumbscont.append(thumb_frame);
		
		// Added Fillmode support to thumblist
		// @since 1.6.0
		if( this.options.fillMode && thumb_ele.is('img') ){
			var aligner = new window.MSAligner(this.options.fillMode, thumb_frame, thumb_ele);
			thumb_ele[0].aligner = aligner;
			thumb_ele.one('load', function(e){
				var $this = $(this); 
				$this[0].aligner.init($this.width(), $this.height());
				$this[0].aligner.align();
			}).each($.jqLoadFix);
		}

		if($.browser.msie)
				thumb_ele.on('dragstart', function(event) { event.preventDefault(); }); // disable native dragging
				
		this.thumbs.push(thumb_frame);
	};
	
	p.create = function(){
		_super.create.call(this);
		
		this.__translate_end	= window._css3d ? ' translateZ(0px)' : '';
		this.controller 	 = new Controller(0 , 0 , {
			//snapping	     : true,
			snappingMinSpeed : 2,
			friction		 : (100 - this.options.speed * 0.5) / 100
		});
				
		this.controller.renderCallback(this.options.dir === 'h'? this._hMove : this._vMove , this);
		//this.controller.snappingCallback(this.__snapUpdate , this);
		//this.controller.snapCompleteCallback(this.__snapCompelet , this);
		
		var that = this;
		this.resize_listener = function(){that.__resize();};
		$(window).bind('resize', this.resize_listener);
		
		this.thumbSize = this.thumbs[0][this.__jdimen](true);
		
		this.setupSwipe();
		this.__resize();
		
		var that = this;
		if(this.options.wheel){
			
			this.wheellistener = function(event){
				var e = window.event || event.orginalEvent || event;
				var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
				that.controller.push(-delta*10);
				return false;
			};
			
			if($.browser.mozilla) this.$element[0].addEventListener('DOMMouseScroll' , this.wheellistener);
			else this.$element.bind('mousewheel', this.wheellistener);
		}
		
		this.slider.api.addEventListener(MSLSliderEvent.CHANGE_START , this.update , this);
		this.cindex =  this.slider.api.index();
		this.select(this.thumbs[this.cindex]);
		
		
	};
	
	p._hMove = function(controller , value){
		this.__contPos = value;
		if(window._cssanim) {
			this.$thumbscont[0].style[window._jcsspfx + 'Transform'] = 'translateX('+-value+'px)'+ this.__translate_end;
			return;
		}
		this.$thumbscont[0].style.left = -value + 'px';
	};
	
	p._vMove = function(controller , value){
		this.__contPos = value;
		if(window._cssanim) {
			this.$thumbscont[0].style[window._jcsspfx + 'Transform'] = 'translateY('+-value+'px)'+ this.__translate_end;
			return;
		}
		this.$thumbscont[0].style.top = -value + 'px';
	};
	
	p.setupSwipe = function(){ 
		this.swipeControl = new averta.TouchSwipe(this.$element);
		this.swipeControl.swipeType = this.options.dir === 'h'? 'horizontal' : 'vertical';
		
		var that = this;
		if(this.options.dir === 'h')
			this.swipeControl.onSwipe = function(status){that.horizSwipeMove(status);};
		else
			this.swipeControl.onSwipe = function(status){that.vertSwipeMove(status);};
	};
	
	p.vertSwipeMove = function(status){
		if(this.dTouch) return;
		var phase = status.phase;
		if(phase === 'start')
			this.controller.stop();	
		else if(phase === 'move')
			this.controller.drag(status.moveY);
		else if(phase === 'end' || phase === 'cancel'){
			var speed = Math.abs(status.distanceY / status.duration * 50/3);
			if(speed > 0.1){
				this.controller.push(-status.distanceY / status.duration * 50/3 );
			}else{
				this.click_enable = true;
				this.controller.cancel();
			} 
		}
	};
	
	p.horizSwipeMove = function(status){
		if(this.dTouch) return;
		var phase = status.phase;
		if(phase === 'start'){
			this.controller.stop();	
			this.click_enable = false;
		}else if(phase === 'move')
			this.controller.drag(status.moveX);
		else if(phase === 'end' || phase === 'cancel'){
			var speed = Math.abs(status.distanceX / status.duration * 50/3);
			if(speed > 0.1){
				 this.controller.push(-status.distanceX / status.duration * 50/3 );
			}else {
				this.click_enable = true;
				this.controller.cancel();
			}
		}
	};
	
	p.update = function(){
		var nindex = this.slider.api.index();
		if(this.cindex === nindex) return;
		
		if(this.cindex != null)this.unselect(this.thumbs[this.cindex]);
		this.cindex = nindex;
		this.select(this.thumbs[this.cindex]);
	
		if(!this.dTouch)this.updateThumbscroll();
	};

	p.updateThumbscroll = function(){
		var thumb_size;
		
		var pos = this.thumbSize * this.cindex;
		
		if(this.controller.value == NaN) this.controller.value = 0;
		
		if(pos -  this.controller.value < 0){
			this.controller.gotoSnap(this.cindex , true);
			return;
		}
				
		if(pos + this.thumbSize - this.controller.value > this.$element[this.__dimen]()){
			var first_snap = this.cindex - Math.floor(this.$element[this.__dimen]() / this.thumbSize) + 1;
			this.controller.gotoSnap(first_snap , true);
			return;
		}
	};

	p.changeSlide = function(thumb){
		if(!this.click_enable || this.cindex === thumb[0].index) return;
		this.slider.api.gotoSlide(thumb[0].index);
	};
	
	p.unselect = function(ele){
		ele.removeClass('ms-thumb-frame-selected');
	};
	
	p.select = function(ele){
		ele.addClass('ms-thumb-frame-selected');
	};
	
	p.__resize = function(){
		var size = this.$element[this.__dimen]();

		if(this.ls === size) return;
		
		this.ls = size;
		
		this.thumbSize = this.thumbs[0][this.__jdimen](true);
		var len = this.slider.api.count() * this.thumbSize;
		this.$thumbscont[0].style[this.__dimen] = len + 'px';
		
		if(len <= size){
			this.dTouch = true;
			this.controller.stop();
			this.$thumbscont[0].style[this.__pos] = (size - len)*.5 + 'px';
			this.$thumbscont[0].style[window._jcsspfx + 'Transform'] = '';			
		}else{
			this.dTouch = false;
			this.click_enable = true;
			this.$thumbscont[0].style[this.__pos] = '';
			this.controller._max_value = len - size;
			this.controller.options.snapsize = this.thumbSize;
			this.updateThumbscroll();
		}
		
	};
	
	p.destroy = function(){
		_super.destroy();
		
		if(this.options.wheel){
			if($.browser.mozilla) this.$element[0].removeEventListener('DOMMouseScroll' , this.wheellistener);
			else this.$element.unbind('mousewheel', this.wheellistener);
			this.wheellistener = null;
		}		
		
		$(window).unbind('resize', this.resize_listener);

		this.$element.remove();

		this.slider.api.removeEventListener(MSLSliderEvent.RESERVED_SPACE_CHANGE, this.align, this);
		this.slider.api.removeEventListener(MSLSliderEvent.CHANGE_START , this.update , this);
	};
	
	window.MSLThumblist = MSLThumblist;
	MSLSlideController.registerControl('thumblist' , MSLThumblist);
	
})(jQuery);
//dev\slider\uicontrols\Bullets.js 
 
;(function($){
	
	"use strict";
	
	var MSLBulltes = function(options){
		BaseControl.call(this);
		
		this.options.dir 	= 'h';
		this.options.inset  = true;
		this.options.margin = 10;
		this.options.space = 10;
		

		$.extend(this.options , options);
		
		this.bullets = [];
		
	};
	
	MSLBulltes.extend(BaseControl);
	
	var p = MSLBulltes.prototype;
	var _super = BaseControl.prototype;
	
	/* -------------------------------- */
	
	p.setup = function(){
		_super.setup.call(this);

		this.$element = $('<div></div>')
						.addClass(this.options.prefix + 'bullets')
						.addClass('ms-dir-' + this.options.dir)
						.appendTo(this.cont);
		
		this.$bullet_cont = $('<div></div>')
						.addClass('ms-bullets-count')
						.appendTo(this.$element);

		if( !this.options.insetTo && this.options.align ){

			var align = this.options.align;
			if( this.options.inset ){
				this.$element.css(align, this.options.margin);
			}

		}

		this.checkHideUnder(); // super method

	};
	
	p.create = function(){
		_super.create.call(this);
		var that = this;
									
		this.slider.api.addEventListener(MSLSliderEvent.CHANGE_START , this.update , this);
		this.cindex =  this.slider.api.index();
		for(var i = 0; i < this.slider.api.count(); ++i){
			var bullet = $('<div></div>').addClass('ms-bullet');
			bullet[0].index = i;
			bullet.on('click', function(){that.changeSlide(this.index);});
			this.$bullet_cont.append(bullet);
			this.bullets.push(bullet);
			if( this.options.dir === 'h' ) {
				bullet.css('margin', this.options.space/2);
			}else {
				bullet.css('margin', this.options.space);
			}
		}
		
		if(this.options.dir === 'h') {
			this.$element.width(bullet.outerWidth(true) * this.slider.api.count());
		} else {
			this.$element.css('margin-top', -this.$element.outerHeight(true)/2);
		}
		
		this.select(this.bullets[this.cindex]);
	};
	
	p.update = function(){
		var nindex = this.slider.api.index();
		if(this.cindex === nindex) return;
		
		if(this.cindex != null)this.unselect(this.bullets[this.cindex]);
		this.cindex = nindex;
		this.select(this.bullets[this.cindex]);
	};
	
	p.changeSlide = function(index){
		if(this.cindex === index) return;
		this.slider.api.gotoSlide(index);
	};
	
	p.unselect = function(ele){
		ele.removeClass('ms-bullet-selected');
	};
	
	p.select = function(ele){
		ele.addClass('ms-bullet-selected');
	};
	
	p.destroy = function(){
		_super.destroy();
		this.slider.api.removeEventListener(MSLSliderEvent.CHANGE_START , this.update , this);
		this.$element.remove();
	};
	
	window.MSLBulltes = MSLBulltes;
	
	MSLSlideController.registerControl('bullets' , MSLBulltes);
	
})(jQuery);
//dev\slider\uicontrols\Scrollbar.js 
 
;(function($){
	
	"use strict";
	
	var MSLScrollbar = function(options){
		BaseControl.call(this);
		
		this.options.dir 		= 'h';
		this.options.autohide	= true;
		this.options.width 		= 4;
		this.options.color 		= '#3D3D3D';
		this.options.margin		= 10;
		
		$.extend(this.options , options);
		this.__dimen    		= this.options.dir === 'h' ? 'width' : 'height';
		this.__jdimen    		= this.options.dir === 'h' ? 'outerWidth' : 'outerHeight';
		this.__pos				= this.options.dir === 'h' ? 'left'	 : 'top';
		this.__translate_end	= window._css3d ? ' translateZ(0px)' : '';
		this.__translate_start	= this.options.dir === 'h' ? ' translateX(' : 'translateY(';
	};
	
	MSLScrollbar.extend(BaseControl);
	
	var p = MSLScrollbar.prototype;
	var _super = BaseControl.prototype;
	
	/* -------------------------------- */
	
	p.setup = function(){

		this.$element = $('<div></div>')
						.addClass(this.options.prefix + 'sbar')
						.addClass('ms-dir-' + this.options.dir);
						
		_super.setup.call(this);
	
		if( this.slider.$controlsCont === this.cont ){
			this.$element.appendTo(this.slider.$element);
		}else{
			this.$element.appendTo(this.cont);
		}

		this.$bar = $('<div></div>')
					.addClass(this.options.prefix + 'bar')
					.appendTo(this.$element);
					
		if(this.slider.options.loop){
			console.log('WARNING, MSLScrollbar cannot work with looped slider.');
			this.disable = true;
			this.$element.remove();
		}
		
		/**
		 * align control
		 * @since 1.5.7
		 */
		// change width 
		if( this.options.dir === 'v' ){
			this.$bar.width(this.options.width);
		} else {
			this.$bar.height(this.options.width);
		}

		// change color
		this.$bar.css('background-color', this.options.color);

		if( !this.options.insetTo && this.options.align ){
			
			// reset old versions styles
			if( this.options.dir === 'v' ){
				this.$element.css({
					right:'auto',
					left:'auto',
				});
			} else {
				this.$element.css({
					top:'auto',
					bottom:'auto',
				});
			}

			var align = this.options.align;
			if( this.options.inset ){
				this.$element.css(align, this.options.margin );
			}else if( align === 'top' ){
				this.$element.prependTo(this.slider.$element).css({
					'margin-bottom': this.options.margin,
					'position': 'relative'
				});
			}else if( align === 'bottom' ){
				this.$element.css({
					'margin-top': this.options.margin,
					'position': 'relative'
				});
			}else{
				this.slider.api.addEventListener(MSLSliderEvent.RESERVED_SPACE_CHANGE, this.align, this);
				this.align();
			}
		}

		this.checkHideUnder(); // super method
	};

	/**
	 * calls by "RESERVED_SPACE_CHGANE" realigns the control in slider
	 * @since 1.5.7
	 */
	p.align = function(event){
		if( this.detached ){
			return;
		}

		var align = this.options.align;
		var pos = this.slider.reserveSpace(align, this.options.margin * 2 + this.options.width);
		this.$element.css(align, -pos - this.options.margin - this.options.width);
	};
	
	p.create = function(){
		
		if(this.disable) return;
		
		//_super.create.call(this);
		var that = this;
		
		this.scroller = this.slider.api.scroller;
		
		this.slider.api.view.addEventListener(MSLViewEvents.SCROLL , this._update , this);		
		this.slider.api.addEventListener(MSLSliderEvent.RESIZE , this._resize , this);
		
		this._resize();
		
		if(this.options.autohide){
			this.$bar.css('opacity' , '0');
		}
	};
	
	p._resize = function(){
		this.vdimen = this.$element[this.__dimen]();
		this.bar_dimen = this.slider.api.view[ '__' + this.__dimen] * this.vdimen / this.scroller._max_value; 
		this.$bar[this.__dimen](this.bar_dimen );
	};
	
	p._update = function(){
		var value = this.scroller.value * (this.vdimen - this.bar_dimen) / this.scroller._max_value;
		if(this.lvalue === value) return;
		this.lvalue = value;
		
		if(this.options.autohide){
			clearTimeout(this.hto);
			this.$bar.css('opacity' , '1');
			
			var that = this;
			this.hto = setTimeout(function(){
				//if(!that.slider.api.view.swipeControl.touchStarted)
				that.$bar.css('opacity' , '0');
			} , 150);
		}
		
		if(value < 0){
			this.$bar[0].style[this.__dimen] = this.bar_dimen + value + 'px';
			return;
		}
		
		if(value > this.vdimen - this.bar_dimen)
			this.$bar[0].style[this.__dimen] = this.vdimen - value + 'px';

		if(window._cssanim) {
			this.$bar[0].style[window._jcsspfx + 'Transform'] = this.__translate_start +value+'px)'+ this.__translate_end;
			return;
		}
		
		this.$bar[0].style[this.__pos] = value + 'px';
		
	};
	
	p.destroy = function(){
		_super.destroy();
		this.slider.api.view.removeEventListener(MSLViewEvents.SCROLL , this._update , this);		
		this.slider.api.removeEventListener(MSLSliderEvent.RESIZE , this._resize , this);
		this.slider.api.removeEventListener(MSLSliderEvent.RESERVED_SPACE_CHANGE, this.align, this);

		this.$element.remove();
	};
	
	window.MSLScrollbar = MSLScrollbar;
	MSLSlideController.registerControl('scrollbar' , MSLScrollbar);
})(jQuery);
//dev\slider\uicontrols\Timebar.js 
 
;(function($){
	
	"use strict";
	
	var MSLTimerbar = function(options){
		BaseControl.call(this);

		this.options.autohide = false;
		this.options.width 		= 4;
		this.options.color 		= '#FFFFFF';
		this.options.inset 		= true;
		this.options.margin 	= 0;

		$.extend(this.options , options);
	};
	
	MSLTimerbar.extend(BaseControl);
	
	var p = MSLTimerbar.prototype;
	var _super = BaseControl.prototype;
	
	/* -------------------------------- */
	
	p.setup = function(){
		var that = this;
		_super.setup.call(this);
		
		this.$element = $('<div></div>')
					.addClass(this.options.prefix + 'timerbar');
		
		_super.setup.call(this);
	
		if( this.slider.$controlsCont === this.cont ){
			this.$element.appendTo(this.slider.$element);
		}else{
			this.$element.appendTo(this.cont);
		}

		this.$bar = $('<div></div>')
					.addClass('ms-time-bar')
					.appendTo(this.$element);

		// change width 
		if( this.options.dir === 'v' ){
			this.$bar.width(this.options.width);
			this.$element.width(this.options.width);
		} else {
			this.$bar.height(this.options.width);
			this.$element.height(this.options.width);
		}

		// change color
		this.$bar.css('background-color', this.options.color);
		
		if( !this.options.insetTo && this.options.align ){
			
			this.$element.css({
				top:'auto',
				bottom:'auto',
			});

			var align = this.options.align;
			if( this.options.inset ){
				this.$element.css(align, this.options.margin );
			}else if( align === 'top' ){
				this.$element.prependTo(this.slider.$element).css({
					'margin-bottom': this.options.margin,
					'position': 'relative'
				});
			}else if( align === 'bottom' ){
				this.$element.css({
					'margin-top': this.options.margin,
					'position': 'relative'
				});
			}else{
				this.slider.api.addEventListener(MSLSliderEvent.RESERVED_SPACE_CHANGE, this.align, this);
				this.align();
			}
		}
		this.checkHideUnder(); // super method
	};

	/**
	 * calls by "RESERVED_SPACE_CHGANE" realigns the control in slider
	 * @since 1.5.7
	 */
	p.align = function(event){
		if( this.detached ){
			return;
		}

		var align = this.options.align;
		var pos = this.slider.reserveSpace(align, this.options.margin * 2 + this.options.width);
		this.$element.css(align, -pos - this.options.margin - this.options.width);
	};
	
	p.create = function(){
		_super.create.call(this);
		this.slider.api.addEventListener(MSLSliderEvent.WAITING , this._update , this);
		this._update();
	};
	
	p._update = function(){
		this.$bar[0].style.width = this.slider.api._delayProgress  + '%';
	};
	
	p.destroy = function(){
		_super.destroy();
		this.slider.api.removeEventListener(MSLSliderEvent.RESERVED_SPACE_CHANGE, this.align, this);
		this.slider.api.removeEventListener(MSLSliderEvent.WAITING , this._update , this);
		this.$element.remove();
	};
	
	window.MSLTimerbar = MSLTimerbar;
	MSLSlideController.registerControl('timebar' , MSLTimerbar);
})(jQuery);
//dev\slider\uicontrols\CircleTimer.js 
 
;(function($){
	
	"use strict";
	
	var MSLCircleTimer = function(options){
		BaseControl.call(this);
		
		this.options.color 	= '#A2A2A2';
		this.options.stroke = 10;
		this.options.radius	= 4;
		
		this.options.autohide = false;
		$.extend(this.options , options);
	};
	
	MSLCircleTimer.extend(BaseControl);
	
	var p = MSLCircleTimer.prototype;
	var _super = BaseControl.prototype;
	
	/* -------------------------------- */
	
	p.setup = function(){
		var that = this;
		_super.setup.call(this);
		
		this.$element = $('<div></div>')
					.addClass(this.options.prefix + 'ctimer')
					.appendTo(this.cont);
					
		this.$canvas = 	$('<canvas></canvas>')
					.addClass('ms-ctimer-canvas')
					.appendTo(this.$element);		
		
		this.$bar = $('<div></div>')
					.addClass('ms-ctimer-bullet')
					.appendTo(this.$element);
		
		if(!this.$canvas[0].getContext){
			this.destroy();
			this.disable = true;
			return;
		}
		
		
		this.ctx		= this.$canvas[0].getContext('2d');
		this.prog		= 0;
		
		this.__w = (this.options.radius + this.options.stroke/2) * 2;
		this.$canvas[0].width  = this.__w;
		this.$canvas[0].height = this.__w;

		this.checkHideUnder(); // super method
	};
	
	p.create = function(){
		if(this.disable) return;
		_super.create.call(this);
		this.slider.api.addEventListener(MSLSliderEvent.WAITING , this._update , this);
		
		var that = this;
		this.$element.click(function(){
			if(that.slider.api.paused)
				that.slider.api.resume();
			else
				that.slider.api.pause();
		});
		
		this._update();
	};
	
	p._update = function(){
		var that = this;
		$(this).stop(true).animate({prog:this.slider.api._delayProgress * 0.01} ,
					 	{duration:200 , step:function(){that._draw();}});
		//this.$bar[0].style.width = this.slider.api._delayProgress/100 * this.$element.width() + 'px';
	};
	
	p._draw = function(){
		this.ctx.clearRect(0 , 0,  this.__w ,  this.__w);
		this.ctx.beginPath(); 
		this.ctx.arc(this.__w * .5 , this.__w * .5 ,this.options.radius , Math.PI * 1.5 , Math.PI * 1.5 + 2 * Math.PI * this.prog, false);
		this.ctx.strokeStyle = this.options.color;
		this.ctx.lineWidth = this.options.stroke;
		this.ctx.stroke();
	};
	
	p.destroy = function(){
		_super.destroy();
		if(this.disable) return;
		$(this).stop(true);
		this.slider.api.removeEventListener(MSLSliderEvent.WAITING , this._update , this);
		this.$element.remove();
	};
	
	window.MSLCircleTimer = MSLCircleTimer;
		MSLSlideController.registerControl('circletimer' , MSLCircleTimer);
})(jQuery);
//dev\slider\uicontrols\SlideInfo.js 
 
;(function($){
	
	"use strict";
	
	window.MSLSlideInfo = function(options){
		BaseControl.call(this , options);
		
		this.options.autohide	= false;
		this.options.align  = null;
		this.options.inset = false;
		this.options.margin = 10;
		this.options.size = 100;
		this.options.dir = 'h';

		$.extend(this.options , options);

		this.data_list = [];
	};
	MSLSlideInfo.fadeDuratation = 400;
	MSLSlideInfo.extend(BaseControl);
	
	var p = MSLSlideInfo.prototype;
	var _super = BaseControl.prototype;
	
	/* -------------------------------- */	
	p.setup = function(){
		this.$element = $('<div></div>')
						.addClass(this.options.prefix + 'slide-info')
						.addClass('ms-dir-' + this.options.dir);

		_super.setup.call(this);	

		if( this.slider.$controlsCont === this.cont ){
			this.$element.appendTo(this.slider.$element); // insert in outter container out of overflow hidden
		}else{
			this.$element.appendTo(this.cont);
		}
		
		// align control
		if( !this.options.insetTo && this.options.align ){
			var align = this.options.align;
			if( this.options.inset ){
				this.$element.css(align, this.options.margin );
			}else if( align === 'top' ){
				this.$element.prependTo(this.slider.$element).css({
					'margin-bottom': this.options.margin,
					'position': 'relative'
				});
			}else if( align === 'bottom' ){
				this.$element.css({
					'margin-top': this.options.margin,
					'position': 'relative'
				});
			}else{
				this.slider.api.addEventListener(MSLSliderEvent.RESERVED_SPACE_CHANGE, this.align, this);
				this.align();
			}

			if( this.options.dir === 'v' ){
				this.$element.width(this.options.size);
			}else{
				this.$element.css('min-height', this.options.size);
			}
		}

		this.checkHideUnder(); // super method

	};

	/**
	 * calls by "RESERVED_SPACE_CHGANE" realigns the control in slider
	 * @since 1.5.7
	 */
	p.align = function(event){
		if( this.detached ){
			return;
		}
		var align = this.options.align;
		var pos = this.slider.reserveSpace(align, this.options.size + this.options.margin * 2);
		this.$element.css(align, -pos - this.options.size - this.options.margin);
	};
	
	p.slideAction = function(slide){
		var info_ele = $(slide.$element.find('.ms-info'));
		var that = this;
		info_ele.detach();
		
		this.data_list[slide.index] = info_ele;
	};
	
	p.create = function(){
		_super.create.call(this);
		this.slider.api.addEventListener(MSLSliderEvent.CHANGE_START , this.update , this);
		this.cindex =  this.slider.api.index();
		this.switchEle(this.data_list[this.cindex]);
	};
	
	p.update = function(){
		var nindex = this.slider.api.index();
		this.switchEle(this.data_list[nindex]);
		this.cindex = nindex;
	};
	
	p.switchEle = function(ele){
		if(this.current_ele){
			var that = this;
			
			if(this.current_ele[0].tween)this.current_ele[0].tween.stop(true);
			this.current_ele[0].tween = CTween.animate(this.current_ele , MSLSlideInfo.fadeDuratation  , {opacity:0} , {complete:function(){
				this.detach();
				this[0].tween = null; 
				ele.css('position', 'relative');
			} , target:this.current_ele });

			//this.current_ele.css('position', 'absolute');			
			ele.css('position', 'absolute');
		}

		this.__show(ele);
	};
	
	p.__show = function(ele){
		ele.appendTo(this.$element).css('opacity','0');///.css('position', 'relative');
		
		// calculate max height
		if ( this.current_ele ){
			ele.height( Math.max( ele.height(), this.current_ele.height() ) );
		}

		clearTimeout(this.tou);
		this.tou = setTimeout(function(){
			CTween.fadeIn(ele , MSLSlideInfo.fadeDuratation );
			ele.css('height', '');	
		}, MSLSlideInfo.fadeDuratation);


		if(ele[0].tween)ele[0].tween.stop(true);
		this.current_ele = ele;
	};

	p.destroy = function(){
		_super.destroy();
		clearTimeout(this.tou);
		if(this.current_ele && this.current_ele[0].tween){
			this.current_ele[0].tween.stop('true');
		}
		this.$element.remove();
		this.slider.api.removeEventListener(MSLSliderEvent.RESERVED_SPACE_CHANGE, this.align, this);
		this.slider.api.removeEventListener(MSLSliderEvent.CHANGE_START , this.update , this);
	};
	
	MSLSlideController.registerControl('slideinfo' , MSLSlideInfo);
})(jQuery);
