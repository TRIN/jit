/**
 * creates a checkbox with a label. check options on configuration.
 * author: temi
 */
L.Control.Checkbox = L.Control.extend({
    options: {
        position: 'topright',
        title:'click me',
        text:'Checkbox: ',
        initialValue:true,
        style:{
            height:'20px',
            padding: '5px'
        },
        /**
         * callback when checkbox is clicked.
         */
        onClick:null
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
    
    onClick: function(value){
        this.options.onClick && this.options.onClick.apply(this,arguments);
    },

    onRemove: function (map) {

    },

    _createButton: function (html, title, className, container, fn) {
        var that = this;
        var label = L.DomUtil.create('label','', container);
        label.innerHTML = this.options.text;
        for(var i in this.options.style){
            label.style[i] = this.options.style[i];
        }

        var input = L.DomUtil.create('input', className, label);
        input.type ='checkbox';
        input.checked = this.options.initialValue;
        input.title = title;
        this._checkbox = input;

        L.DomEvent
            .on(input, 'mousedown dblclick', L.DomEvent.stopPropagation)
//            .on(input, 'click', L.DomEvent.stop)
            .on(input, 'click', function(){
                that.onClick(that.getValue())
            }, this)
            .on(input, 'click', this._refocusOnMap, this);

        return input;
    },

    getValue : function(){
              return this._checkbox.checked;
    }
});

L.control.zoom = function (options) {
    return new L.Control.Zoom(options);
};