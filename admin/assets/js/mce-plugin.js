/* Master Slider plugin for tinymce */

( function () {

	// skip if sliders list is not available
	if( ! __MS_EDITOR || ! __MS_EDITOR.sliders )
		return;


	tinymce.PluginManager.add( 'msp_shortcodes_button', function( editor, url ) {

		var menu_items = [],
			item_label;

		for ( slider_id in __MS_EDITOR.sliders ) {
			item_label = __MS_EDITOR.sliders[ slider_id ] + " [#" + slider_id + "]";
			menu_items.push( { text: item_label, value: slider_id } );
		};


		var ed = tinymce.activeEditor;
		editor.addButton( 'msp_shortcodes_button', {
			text: false,
			icon: false,
			title:__MS_GLOBAL.plugin_name,
			type: 'menubutton',
			menu: menu_items,
			onselect: function(e) {
                var slider_id = e.control.settings.value;
                ed.selection.setContent( '[masterslider id="' + slider_id + '"]' );
            }
		});
	});

})();
