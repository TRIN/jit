/**
 * author: temi
 * @type {void|*}
 */
L.Control.Legend = L.Control.extend({
    options: {
        position: 'topright',
        url: undefined,
        dataType:'jsonp',
        proxy: true,
        proxyUrl: undefined,
        baseUrl:undefined,
        urlParams:{
            cm:undefined,
            q:undefined,
            type:undefined,
            fq:undefined
        },
        /**
         * default value when no legend value is populated
         */
        defaultData: [{
            red: 223,
            green: 74,
            blue: 33,
            name: 'All records'
        }],
        icon: '<span class="glyphicon glyphicon-th-list">Legend</span>',
        /**
         * callback when checkbox is clicked.
         */
        onClick: null,
        /**
         * creates url from all the given parameters.
         * TODO: change architecture.
         *
         */
        createUrl:function(){
            var params =[];
            var up = this.options.urlParams;
            for(var i in up){
                up[i] && params.push(i+'='+up[i])
            }
            var url = this.options.baseUrl + '?' + params.join('&')
            if(this.options.proxy){
                this.options.url =  this.options.proxyUrl + '?url='+encodeURIComponent(url);
            } else if(this.options.baseUrl){
                this.options.url =  url
            }
        }
    },
    model: function(data){
        this.colour = ko.observable(data.colour);
        this.green = ko.observable(data.green);
        this.blue = ko.observable(data.blue);
        this.red = ko.observable(data.red);
        this.style = ko.computed(function(){
            return 'background-color:rgb('+this.red()+','+this.green()+','+this.blue()+');';
        },this)
        this.name = ko.observable(data.name||'unknown');
    },
    viewmodel: function(){
      this.legends = ko.observableArray([]);
      this.icon = ko.observable();
    },
    view : undefined,
    html: '<div>\
                   <div class="legend-short btn btn-xs" style="margin: 5px;" data-bind="html:icon"></div>\
                   <div class="legend-full leaflet-control-layers-overlays" style="margin:5px; display: none">\
                        <div class="pull-right close" style="padding-left:10px; border: 0;">&times;</div>\
                        <!--<label>Legend</label>-->\
                        <div style="overflow:auto; max-height:400px; width: 120px;">\
                            <table class="legendTable"><tbody  data-bind="foreach: legends">\
                                <tr><td><i class="legendColour" data-bind="attr:{style:style}"></i><span class="legendItemName" data-bind="text: name"></span></td></tr>\
                                </tbody>\
                            </table>\
                        </div>\
                   </div>\
           </div>',
    initialize: function (options) {
        L.setOptions(this, options);
    },

    onAdd: function (map) {
        var checkName = 'leaflet-control-layers',
            container = L.DomUtil.create('div', checkName + ' leaflet-bar'),
            options = this.options;
        this._createHTML(container);
        $(container).find('.close').click(this,this.toggle)
        $(container).find('.legend-short').click(this,this.toggle)
        this.el = container;
        L.DomEvent
            .on(container, 'mousedown dblclick', L.DomEvent.stopPropagation)
            .on(container, 'click', L.DomEvent.stop)
            .on(container,'mousewheel',L.DomEvent.stopPropagation)
//            .on(input, 'click', fn, this)
//            .on(input, 'click', this._refocusOnMap, this);
        return container;
    },

    onClick: function (value) {
        this.options.onClick && this.options.onClick.apply(this, arguments);
    },

    toggle: function(e){
        var ctrl = e.handleObj.data;
        var full = $(ctrl.el).find('.legend-full'),
            short = $(ctrl.el).find('.legend-short');
        full.is(':visible')?full.hide():full.show();
        short.is(':visible')?short.hide():short.show();
    },

    onRemove: function (map) {

    },

    _createHTML: function (container) {
        container.innerHTML = this.html;
        this.view = new this.viewmodel();
        this.view.icon(this.options.icon);
        ko.applyBindings(this.view,container);
    },

    update: function (data) {
        var that = this;
        this.options.createUrl && this.options.createUrl.apply(this);
        $.ajax({
            url: this.options.url,
            data:data,
            dataType:this.options.dataType,
            success:function(data){
                that.legend(data);
            }
        });
    },
    legend: function(data){
        this.view.legends.removeAll();
        for(var i = 0; i<data.length; i++){
            this.view.legends.push( new this.model(data[i]));
        }
    }
});

L.control.legend = function (options) {
    return new L.Control.Legend(options);
};