var Habitat = function (c) {
    var $ = jQuery;
    new Emitter(this);
    /**
     * Events
     *
     *
     *
     */
    var events = [
    /**
     * save state to database
     */
        'sync'
    ]
    var config = $.extend({
        bootstrap: 2,
        list: [],
        listUrl: 'http://localhost:8080/phylolink/ala/getAllLayers',
        graph: {
            url: 'http://localhost:8080/phylolink/phylo/getHabitat',
            type: 'GET',
            dataType: 'JSONP',
//            title:'Habitat',
            xAxisContextual: 'Habitat states',
            xAxisEnvironmental: 'values',
            yAxis: 'Occurrence count'
        },
        dataType: 'JSONP',
        googleChartsLoaded: false,
        delayedChartCall: [],
        chartWidth: 400,
        chartHeight: 200,
        headerHeight:60,
        /**
         * sync flag
         *
         */
        doSync: true,
        /**
         * address to sync to
         */
        syncUrl: 'http://localhost:8080/phylolink/phylo/saveHabitat',
        syncType: 'POST',
        syncData: {
            id: 4
        },
        /**
         * save query flags
         */
        doSaveQuery: true,
        saveQuery:{
            url: 'http://localhost:8080/phylolink/ala/saveQuery',
            type: 'POST',
            dataType: 'JSONP'
        },
        template: '<style>' +
            '.ui-autocomplete {\
            max-height: 200px;\
            overflow-y: auto;   /* prevent horizontal scrollbar */\
            overflow-x: hidden; /* add padding to account for vertical scrollbar */\
            z-index:1000 !important;\
            }\
            .ellipselabel {\
              white-space: nowrap;\
              max-width: 220px;\
              overflow: hidden;              /* "overflow" value must be different from "visible" */\
              text-overflow: ellipsis;\
            }' +
            '</style>' +
            '<div id="habitatMain">' +
            '<div class="btn btn-primary" data-bind="click:addHabitat">Plot profile</div>' +
            '<div data-bind="sortable:{data:habitats, afterMove: $root.onMove}">' +
            '<div class="item top-buffer">' +
            '<div class="label label-default" data-bind="visible: !$root.isHabitatSelected($data)">\
                <i class="icon-white icon-resize-vertical" aria-hidden="true" style="cursor: move"></i>\
                <div class="ellipselabel" style="color: #ffffff;display:inline-block;cursor: pointer\
                " href="#" data-bind="text: displayName, click: $root.selectedHabitat"></div>\
                <i class="icon-white icon-remove" data-bind="click: $root.removeHabitat" \
                       style="cursor: pointer"></i>\
            </div>' +
            '<div data-bind="select: $root.isHabitatSelected($data)">' +
            '<input data-bind="value: displayName, event:{blur: $root.clearHabitat}"/>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div data-bind="sortable: {data:habitats, afterMove: $root.onMove}">\
                <div class="top-buffer panel panel-default" style="position: relative">\
                    <div class="panel-heading" data-bind="text: displayName"></div>\
                    <div class="panel-body" >\
                        <div data-bind="attr:{id: id}, addHabitatChart: !$root.isHabitatSelected($data)" style="width: 100%; height: 200px;"></div>\
                    </div>\
                </div>\
            </div>' +
            '</div>'
    }, c);
    var pj = config.pj, hab = this, id = config.id;
    $('#' + config.id).html(config.template);
    /**
     * stores query id for a node.
     */
    var qid;

    if (config.listUrl) {
        $.ajax({
            url: config.listUrl,
            dataType: config.dataType || 'JSON',
            success: function (data) {
                while (config.list.pop()) {
                    // empty list
                }
                var i = 0;
                for (i = 0; i < data.length; i++) {
                    data[i].value = data[i].id;
                    config.list.push(data[i]);
                }
            }
        })
    }

    var Habitat = function (c) {
        this.name = ko.observable(c.name);
        this.displayName = ko.observable(c.displayName);
        this.id = ko.observable(c.id);
        this.xAxis = ko.observable(c.xAxis);
        this.yAxis = ko.observable(c.yAxis);
        var frequency;
        var spinner = new Spinner({
            top: '50%',
            left: '50%',
            className: 'loader'
        });
        this.setFrequency = function (freq) {
            frequency = freq;
        };
        this.getFrequency = function () {
            return frequency;
        }
        this.startLoading = function () {
            if (!spinner || !spinner.el) {
                spinner = new Spinner({
                    top: '50%',
                    left: '50%',
                    className: 'loader'
                });
            }
            spinner.spin();
            $('#' + this.id()).parent().append(spinner.el);
        };
        this.stopLoading = function () {
            spinner.stop();
        };
    }
    var HabitatViewModel = function () {
        new Emitter(this);
        var self = this;
        var events = [
        /**
         * when a model is reordered in the list
         */
            'moved',
        /**
         * when a model is deleted
         */
            'removed',
        /**
         * when selected value is changed for another.
         * params:
         *  habitat- current model
         *  initialization flag - boolean
         */
            'changed'
        ]
        self.habitats = ko.observableArray();
        self.selectedHabitat = ko.observable();
        self.count = ko.observable(1);

        /**
         *
         * @param init
         */
        self.initialize = function (init) {
            var habitats = init.habitats, temp, habitat, count = init.count;
            if( !habitats || (count === undefined)){
                return;
            }

            for (var i in habitats) {
                temp = habitats[i];
                habitat = new Habitat(temp);
                self.habitats.push(habitat);
                self.emit('changed', habitat, true);
            }
            self.count(count);
            self.selectedHabitat(null);
        };

        /**
         * add a habitat to list
         */
        self.addHabitat = function () {
            var habitat = new Habitat({name: '', displayName: '', id: 'habitat-' + self.count()});
            self.count(self.count() + 1);
            console.log("count:" + self.count());
            self.selectedHabitat(habitat);
            self.habitats.push(habitat);
        };

        /**
         * is the passed character same as the selected character?
         * @param character
         * @returns {boolean}
         */
        self.isHabitatSelected = function (character) {
            return character === self.selectedHabitat();
        };

        /**
         * remove a habitat from list
         * @param data
         * @param event
         */
        self.removeHabitat = function (data, event) {
            self.habitats.remove(data);
            self.emit('removed');
        };

        self.clearHabitat = function (data, event) {
            if (data === self.selectedHabitat()) {
                self.selectedHabitat(null);
            }

            if (data.name() == "") {
                self.removeHabitat(data);
            }
        };

        /**
         * change the selected item
         */
        self.changeHabitat = function (data) {
            var xaxis = '';
            switch (data.type) {
                case 'Contextual':
                    xaxis = config.graph.xAxisContextual;
                    console.log('cont')
                    break;
                case 'Environmental':
                    xaxis = data.environmentalvalueunits || config.graph.xAxisEnvironmental;
                    console.log('env');
                    break;
            }
            console.log(xaxis);
            self.selectedHabitat().displayName(data.label);
            self.selectedHabitat().name(data.value);
            self.selectedHabitat().xAxis(xaxis);
            self.selectedHabitat().yAxis(config.graph.yAxis);
            self.emit('changed', self.selectedHabitat());
        }

        /**
         *
         */
        self.updateChart = function(habitat, list){
            var data = {
                speciesList: JSON.stringify(list),
                config: habitat.name()
            };
            if(config.doSaveQuery){
                self.saveQuery(data).then(function(qid){
                    var data = {q:"qid:"+qid}
                    self.updateChartDirect(habitat, data);
                });
            } else {
                self.updateChartDirect(habitat, data);
            }
        }

        self.saveQuery = function(params){
            return $.ajax({
                url: config.saveQuery.url,
                data: params,
                dataType: config.saveQuery.dataType,
                type: config.saveQuery.type,
                success: function(qid){
                    //todo: how to pass this value?
                }
            })
        };

        /**
         *
         */
        self.updateChartDirect = function (habitat, params) {
            var id = habitat.id();
            habitat.startLoading();

            $.ajax({
                url: config.graph.url,
                type: config.graph.type,
                dataType: config.graph.dataType,
                data: params,
                success: function (temp) {
                    habitat.stopLoading();
                    var data = temp.data;
                    habitat.setFrequency(data);
                    if (data == undefined || data.length == 0) {
                        hab.columnchart(id, [
                            ['', ''],
                            [0, 0]
                        ]);
                        return;
                    }
                    hab.columnchart(id, data, view.getOptions(habitat));
                },
                error: function () {
                    habitat.stopLoading();
                }
            });

            /**
             *
             */
        }

        /**
         * google chart options. sets x & y axis title.
         * @param habitat
         * @returns {{width: *, height: *, legend: {position: string}, vAxis: {title: *}, hAxis: {title: *}}}
         */
        self.getOptions = function (habitat) {
            var options = {
                width: config.chartWidth,
                height: config.chartHeight,
                legend: { position: 'none' },
                vAxis: {
                    title: habitat.yAxis()
                },
                hAxis: {
                    title: habitat.xAxis()
                }
            };
            return options;
        }

        /**
         *
         * @param habitat
         */
        self.refreshHabitat = function (habitat) {
            var data, list;
            var qid = pj.getQid(true);
            if( qid ){
                data = {
                    q : qid,
                    config: habitat.name()
                }
                self.updateChartDirect(habitat, data);
            } else {
                list = pj.getChildrensName(pj.getSelection());
                data = {
                    speciesList: JSON.stringify(list),
                    config: habitat.name()
                };
                self.updateChartDirect(habitat, data);
            }
        }

        /**
         * handler when list is reordered.
         */
        self.onMove = function () {
            self.emit('moved');
        };
    }
    ko.bindingHandlers.select = {
        init: function (element, valueAccessor, innerFn, data, koObj) {
            console.log('init visible and select handler');
            $(element).find("input").autocomplete({
                source: config.list,
                minLength: 0,
                minChars: 0,
                select: function (event, ui) {
                    event.preventDefault();
                    $(this).val(ui.item.label);
                    var self = koObj.$root;
                    self.changeHabitat(ui.item, data)
                },
                _renderItem: function (ul, item) {
                    return $("<li>")
                        .attr("data-value", item.value)
                        .append(item.label)
                        .appendTo(ul);
                }
            }).on('focus', function (event, ui) {
                var self = this;
                ui && $(self).val(ui.item.label);
                $(self).autocomplete("search", "");
                koObj.$root.newChar = true;
            });
            $(element).find("input").focus().select();
        },
        update: function (element, valueAccessor, innerFn, data, koObj) {
            console.log('update function');
            ko.bindingHandlers.visible.update(element, valueAccessor);
            if (valueAccessor()) {
                // focus on input tag once clicked to edit
                $(element).find("input").focus().select();
            } else {
                $(element).find("input").blur();
            }
        }
    };

    ko.bindingHandlers.addHabitatChart = {
        update: function (el, valueAccessor, innerFn, data, koObj) {
            if (valueAccessor()) {
                var id = data.id();
                var temp = data.getFrequency();
                if (temp == undefined || temp.length == 0) {
                    return;
                }
                // check if values are string or numeric
                if (typeof temp[0][1] === 'number') {
                    hab.histogram(id, temp, view.getOptions(data));
                } else {
                    hab.columnchart(id, temp, view.getOptions(data));
                }
//                google.visualization.events.addListener(chart, 'onmouseover', that.chartHover);
            }
        }
    };
    var view = new HabitatViewModel();
    ko.applyBindings(view, document.getElementById(config.id));

    view.on('changed', function (habitat) {
        view.refreshHabitat(habitat);
    });

    this.refresh = function (node, list, saveQuery) {
        var habitats = view.habitats();
        var i, data;

        if(saveQuery){
            saveQuery.then(function(qid){
                var data = {q:pj.getQid(true)}
                console.log(data)
                for (i = 0; i < habitats.length; i++) {
                    data.config = habitats[i].name();
                    view.updateChartDirect(habitats[i], data);
                }

            },function(qid){
                console.log('failed')
            });
        } else {
            for (i = 0; i < habitats.length; i++) {
                data = {
                    speciesList: JSON.stringify(list),
                    config: habitats[i].name()
                };

                view.updateChartDirect(habitats[i], data);
            }
        }

    };

    this.save = function () {
        if (!config.doSync) {
            return;
        }

        var data = ko.toJSON(view);
        console.log(data);
        console.log(view.count());
        var sync = $.extend({}, config.syncData);
        sync.json = data;
        $.ajax({
            url: config.syncUrl,
            type: config.syncType,
            data: sync,
            success: function (data) {
                console.log('saved!');
            },
            error: function () {
                console.log('error saving!');
            }
        });
    }

    pj.on('click', this.refresh);
    this.on('sync', this.save);
    view.on('changed', function (habitat, init) {
        // do not save when initializing the charts. changed event is fired there too.
        !init && hab.emit('sync');
    });
    view.on('removed', function () {
        hab.emit('sync');
    });
    view.on('moved', function () {
        hab.emit('sync');
    });
    /**
     * draws a histogram. currently using google charts
     * @param id - element id to draw the map
     * @param data - contains data in google chart understandable format
     */
    this.histogram = function (id, data, opt) {
        if (config.googleChartsLoaded) {
            var chart = new google.visualization.Histogram(document.getElementById(id));
            data = google.visualization.arrayToDataTable(data);
            chart.draw(data, opt);
        } else {
            // some times google chart is not ready when this function is called
            config.delayedChartCall.push([arguments.callee, this, arguments]);
        }
    }

    /**
     * draws a column chart. this is used when data are qualitative i.e. string. currently using google charts
     * @param id - element id to draw the map
     * @param data - contains data in google chart understandable format
     */
    this.columnchart = function (id, data, opt) {
        if (config.googleChartsLoaded) {
            var chart = new google.visualization.ColumnChart(document.getElementById(id));
            data = google.visualization.arrayToDataTable(data);
            chart.draw(data, opt);
        } else {
            // some times google chart is not ready when this function is called
            config.delayedChartCall.push([arguments.callee, this, arguments]);
        }

    }

    this.googleChartsLoaded = function () {
        var delay;
        console.log('google chart loaded');
        config.googleChartsLoaded = true;
        console.log(config.delayedChartCall.length)
        while (delay = config.delayedChartCall.shift()) {
            delay[0].apply(delay[1], delay[2]);
        }
    }

    /**
     * initialize the selected charts.
     */
        config.initialState && view.initialize(config.initialState);

    //set style
    $('#' + id).css('max-height', config.height - config.headerHeight);
    $('#' + id).css('overflow-y', 'auto');
};