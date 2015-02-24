/**
 * creates a select with a label. check options on configuration.
 * author: temi
 */
L.Control.Select = L.Control.extend({
    options: {
        position: 'bottomleft',
        title:'click me',
        text:'Color by: ',
        /**
         * format: [{"name":"REGNO_s","displayName":"REGNO"}]
         */
        initialValue:[],
        url:undefined,
        dataType:'jsonp',
        style:{
            height:'30px',
            padding: '5px'
        },
        /**
         * callback when select is clicked.
         */
        onClick:null
    },
    /**
     * select dom element
     */
    _select:null,
    _html:' <table style="height: 30px;"><tbody><tr><td><label style="display: inline-block" data-bind="text:text"></label>\
            <div style="display: inline-block"><select data-bind="foreach: facets">\
            <option data-bind="text: displayName, attr:{value:name}"></option>\
           <\select></div></td></tr></tbody></table>',
    ViewModel:function(){
        this.facets = ko.observableArray([]);
        this.text = ko.observable();
    },
    Model: function(data){
        this.displayName = ko.observable(data.displayName);
        this.name = ko.observable(data.name);
    },
    viewModel: undefined,
    initialize: function ( options) {
        L.setOptions(this, options);
        new Emitter(this);
    },

    onAdd: function (map) {
        var checkName = 'leaflet-control-select leaflet-control-layers',
            container = L.DomUtil.create('div', checkName + ' leaflet-bar'),
            options = this.options;
        this._create(container);
        return container;
    },
    
    onClick: function(value){
        this.options.onClick && this.options.onClick.apply(this,arguments);
    },

    onRemove: function (map) {

    },

    _create: function (container) {
        var that = this;
        this.el = container;
        for(var i in this.options.style){
            container.style[i] = this.options.style[i];
        }
        container.innerHTML = this._html;

        this.viewModel = new this.ViewModel();
        if(this.options.url){
            this.updateUrl();
        }else if(this.options.initialValue){
            this.updateData(this.options.initialValue)
        }
        this.viewModel.text(this.options.text);
        ko.applyBindings(this.viewModel,container);

        $(container).find('select').on('change',function(){
//            that.options && that.options.onChange(that.getValue());
            that.emit('change', that.getValue());
        });
    },
    updateData:function(data){
        this.viewModel.facets.removeAll();
        for(var i in data){
            this.viewModel.facets.push(new this.Model(data[i]))
        }
//        this.options.onChange(this.getValue());
    },
    updateUrl:function(url){
        var that = this;
        url = url || this.options.url;
        this.viewModel.facets.removeAll();
        $.ajax({
            url:url,
            dataType:this.options.dataType,
            success:function(data){
                that.updateData(data);
            }
        });
    },
    getValue : function(){
       return $(this.el).find('select').val();
    },

    setValue:function(val){
        $(this.el).find('select').val(val);
    }
});

L.control.select = function (options) {
    return new L.Control.Select(options);
};