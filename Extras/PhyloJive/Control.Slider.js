/**
 * creates a checkbox with a label. check options on configuration.
 * author: temi
 * depends on slider.js and slider.css; http://www.eyecon.ro/bootstrap-slider/
 * jquery
 *
 */
L.Control.Slider = L.Control.extend({
    options: {
        position: 'topright',
        title:'click me',
        text:'slider: ',
        style:{
//            height:'25px',
            padding: '5px'
//            width:'75px'
        },
        sliderLength:'75px',
        /**
         * callback when checkbox is clicked.
         */
        onChange: null,
        sliderOpt: {
            min: 0.1,
            max: 1.0,
            step: 0.1,
            value: 0.8,
            tooltip: 'hide'
        }
    },
    /**
     * checkbox dom element
     */
    _checkbox:null,

    initialize: function ( options) {
        L.setOptions(this, options);
    },

    onAdd: function (map) {
        var checkName = 'leaflet-control-checkbox leaflet-control-layers',
            container = L.DomUtil.create('div', checkName + ' leaflet-bar'),
            options = this.options;
        this._createButton(options.text, options.title, '', container, this.onClick)
        return container;
    },
    onChange: function(){
        this.options.onChange && this.options.onChange.apply(this,arguments);
    },

    onRemove: function (map) {

    },

    _createButton: function (html, title, className, container, fn) {
        var that = this;
        var cont = L.DomUtil.create('div','', container);
        for(var i in this.options.style){
            cont.style[i] = this.options.style[i];
        }

        var label = L.DomUtil.create('label','', cont);
        label.innerHTML = this.options.text + ' ' + this.options.sliderOpt.value;
        this._label = label;

        var div = L.DomUtil.create('div', '', cont);
        div.style['width'] = this.options.sliderLength;

        $(div).slider(this.options.sliderOpt).on('slideStop', function(ev){
            var value = parseFloat(ev.value).toFixed(1); // prevent values like 0.30000000004 appearing
            label.innerHTML = that.options.text + ' ' + value;
            that.onChange(value);
        });

        this._slider = $(div);

        L.DomEvent
            .on(div, 'mousedown dblclick', L.DomEvent.stopPropagation)
////            .on(input, 'click', L.DomEvent.stop)
//            .on(input, 'click', fn, this)
//            .on(input, 'click', this._refocusOnMap, this);
    },

    setValue: function(val){
        this._slider.slider('setValue',val);
    },

    getValue : function(){
        return this._slider.slider('getValue');
    }
});

L.control.zoom = function (options) {
    return new L.Control.Zoom(options);
};