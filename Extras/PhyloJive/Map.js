/**
 * author: temi
 * @constructor
 */
function Map(options) {
    // mixin for event handling functions
    new Emitter(this);
    var $ = jQuery;
    var that = this;
    var i;
    var $ = jQuery;
    options = $.extend({
        type: 'GET',
        dataType: 'json',
        headerHeight: 0,
        wms: 'http://biocache.ala.org.au/ws/webportal/wms/reflect',
        //flag to check if character has been loaded
        characterloaded: false,
        env: {
            'colormode': undefined,
            'name': 'circle',
            'size': 4,
            'opacity': 0.8,
            'color': 'df4a21'
        }
    }, options);

    var env = options.env;
    var id = options.id;
    var pj = options.pj;
    var filter = options.filter;

    $('#' + id).height(options.height);
    $('#' + id).width(options.width);
    var query = filter.getQuery();
    this.invalidateSize = function () {
        map.invalidateSize(false);
    };
    this.getEnv = function () {
        var str = []
        env['colormode'] = colorBy.getValue();
        for (var i in env) {
            if (env[i] && !( (i == 'color') && env['colormode']) ) {
                str.push(i + ':' + env[i]);
            }
        }
        return str.join(';');
    };
    this.updateEnv = function () {
        layer && layer.setParams({
            'ENV': this.getEnv(),
            'opacity': env.opacity,
            'outline': outlineCtrl.getValue(),
            'STYLE': 'opacity:'+env.opacity
        });
    };

    //add map here
    var RecordLayerControl = L.Control.extend({
        options: {
            position: 'topright',
            collapsed: false
        },
        onAdd: function (map) {
            // create the control container with a particular class name
            //var $controlToAdd = $('.colourbyTemplate').clone();
            var container = L.DomUtil.create('div', 'leaflet-control-layers');
            var $container = $(container);
            $container.attr("id", "recordLayerControl");
            $('#mapLayerControls').prependTo($container);
            // Fix for Firefox select bug
            var stop = L.DomEvent.stopPropagation;
            L.DomEvent
                .on(container, 'click', stop)
                .on(container, 'mousedown', stop);
            return container;
        }
    });

    var map = L.map(id, {
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: 'topleft'
        }
    }).setView([-27, 133], 3);

    L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'examples.map-i875mjb7'
    }).addTo(map);

    var layer;

    // spinner
    var loadingControl = L.Control.loading({
        spinjs: true
    });

    var outlineCtrl = new L.Control.Checkbox({
        position:'bottomleft',
        text: 'Outline: ',
        onClick: function(){
            that.updateEnv();
        }
    })

    var opactiySlider = new L.Control.Slider({
        position:'bottomleft',
        text: 'Opacity:&nbsp;',
        onChange: function (val) {
            env.opacity = val;
            that.updateEnv();
        },
        sliderOpt: {
            min: 0.1,
            max: 1.0,
            step: 0.1,
            value: env.opacity,
            tooltip: 'hide'
        }
    });

    var sizeSlider = new L.Control.Slider({
        text: 'Size:&nbsp;',
        position:'bottomleft',
        onChange: function (val) {
            env.size = Number.parseInt(val);
            that.updateEnv();
        },
        sliderOpt: {
            min: 1,
            max: 9,
            step: 1,
            value: env.size,
            tooltip: 'hide'
        }
    });

    var colorBy = new L.Control.Select({
        position: 'topright',
        url:options.facetUrl
    });
    colorBy.on('change', function(val){
        env.colormode = val;
//        legendCtrl.options.urlParams.cm = val;
        that.updateLegend();
        that.updateEnv();
    });
    var legendCtrl = new L.Control.Legend(options.legend);
    // initializing
    env.colormode = legendCtrl.options.urlParams.cm = colorBy.getValue();

    legendCtrl.update({});

    map.addControl(loadingControl);
    map.addControl(new RecordLayerControl());
    map.addControl(outlineCtrl);
    map.addControl(opactiySlider);
    map.addControl(sizeSlider);
    colorBy.addTo(map);
    map.addControl(legendCtrl);

    pj.on('click', function (node,list,ajax) {
        var update = function(){
            // color mode reset
            colorBy.updateData([]);

            // color mode reload
//        colorBy.updateUrl(filter.format(colorBy.url));
            that.updateColorBy();

            // set env variable
            // set legend variables
            // reload legend
            that.updateLegend();

            // update map
            that.updateMap();
        }

        if(ajax){
            ajax.then(update,function(){
                console.log('failed to save query')
            })
        } else {
            update();
        }
    });

    this.updateColorBy = function( f ){
        f = f || filter;
        var url = options.colorBy.url;
        var that = this;
        var qid = pj.getQid(true), data;
        if(qid){
            data = {
                q:qid,
                source: options.source
            }
        } else {
            data = {
                q: f.formatQuery(),
                fq: f.formatFq(),
                source: options.source
            }
        }
        $.ajax({
            url: url,
            dataType:options.colorBy.dataType,
            data:data,
            success: function( data ){
                data = data || [];
                colorBy.updateData( data );
            },
            error: function(){
                console.log('error communicating with colorby service.');
            }
        });
    };

    this.updateLegend = function(f){
        f = f || filter;
        var that = this;
        var params =[];
        var data = options.legend.urlParams;
        data.cm = colorBy.getValue() || '';
//        data.q = f.getQuery();
        data.q = pj.getQid(true);
//        var url = f.format(options.legend.baseUrl)
        var url = options.legend.baseUrl
        if( data.cm ){
            if(options.legend.proxy){
                data.cm && params.push('cm='+data.cm);
                data.type && params.push('type='+data.type);
                data.q && params.push('q='+data.q);
                if(url.split(/\?/g).length > 1){
                    url = url + '&' + params.join('&');
                } else {
                    url = url + '?' + params.join('&');
                }
                data = {};
                url =  options.legend.proxyUrl + '?url='+encodeURIComponent(url);
            }

            $.ajax({
                url: url,
                data:data,
                dataType:options.legend.dataType,
                success:function(data){
                    legendCtrl.legend(data);
                }
            });
        } else {
            legendCtrl.legend(legendCtrl.options.defaultData);
        }
    };

    this.updateMap = function(f){
        var qid = pj.getQid(true);
        var query = filter.format(options.layer)
        if(qid){
            query = options.layer + '?q=' + qid
        }
        f = f || filter;
        // only if query exist add layer. otherwise, the whole atlas data gets added.
        if( f.getQuery() || f.getFq() ||  (options.source != 'ala')){
            layer && map.removeLayer(layer);
            console.log(query);
            layer = L.tileLayer.wms(query, {
//            layers: 'Ala occurrence',
                format: 'image/png',
                transparent: true,
                attribution: "PhyloJive",
                bgcolor: "0x000000"
            });
            that.updateEnv();
            map.addLayer(layer);
        }
    };

//    this.updateEnv();
    that.updateMap();
    this.updateColorBy();
    this.updateLegend();
}