/**
 * author: temi varghese
 */
var Character = function (options) {
    // emitter mixin. adding functions that support events.
    new Emitter(this);
    var $ = jQuery;
    var that = this;
    options = $.extend({
        type: 'GET',
        dataType: 'json',
        headerHeight: 0
    }, options);

    var id = options.id;
    var inputId = id + 'autoComplete';
    var pj = options.pj;
    var template = '\
    <div id="main">\
        <div class="container" data-bind="sortable: {data:characters, afterMove: $root.onMove}">\
            <div class="item top-buffer" title="You can drag or edit this item">\
                <div data-bind="visible: !$root.isCharacterSelected($data), attr:{class: $root.characterClass($data)}">\
                    <span class="glyphicon glyphicon-sort" aria-hidden="true" style="cursor: move"></span>\
                    <a style="color: #ffffff" href="#" data-bind="text: name, click: $root.selectedCharacter"></a>\
                    <span class="glyphicon glyphicon-remove" data-bind="click: $root.removeCharacter" \
                        style="cursor: pointer"></span>\
                </div>\
                <div data-bind="visibleAndSelect: $root.isCharacterSelected($data)">\
                    <input data-bind="value: name, event: { blur: $root.clearCharacter }" />\
                </div>\
            </div>\
        </div>\
        <div class="btn btn-xs btn-primary top-buffer" data-bind="click: addCharacter">Add Character</div>\
        <div data-bind="sortable: {data:characters}">\
            <div class="top-buffer panel panel-default">\
                <div class="panel-heading" data-bind="text: name"></div>\
                <div class="panel-body" >\
                    <div data-bind="attr:{id: id}, addChart: !$root.isCharacterSelected($data)" style="width: 100%; height: 200px;"></div>\
                </div>\
            </div>\
        </div>\
    </div>\
    <div class="bs-callout bs-callout-info">\
        <h4>Note</h4><p>You can select characters using <i>Add Character</i>\
        button. Tree branch color is determined by the first character on the list.\
        To color the tree using a character either drag that character to the top of the list, or \
        edit the first character by clicking on that character.</p>\
    </div>';

    //adding template to html page
    $('#' + id).html(template);
    var input = $('#' + inputId);
    var characterList = [], charJson;

    // knockout code
    var Character = function (opt) {
        this.name = ko.observable(opt.name);
        this.id = ko.observable(opt.id);
    }

    var CharacterViewModel = function () {
        new Emitter(this);
        var self = this;
        /**
         * list all the events supported by this function
         * @type {Array}
         */
        self.events = [
        /**
         * params
         * @selected - a list of
         */
            'statechange',
            'moved',
            'edited',
            'newchar',
            'removed'
        ]
        /**
         * serial number of the next character
         * @type {number}
         */
        var count = 1;
        self.newChar = false;
        self.characters = ko.observableArray([]);

        self.selectedCharacter = ko.observable();
        self.clearCharacter = function (data, event) {
            if (data === self.selectedCharacter()) {
                self.selectedCharacter(null);
            }

            if (data.name() == "") {
                self.characters.remove(data);
                self.emit('removed')
                self.emit('statechange', self.list());
            }
        };

        self.removeCharacter = function (data, event) {
            self.characters.remove(data);
            self.emit('removed');
            self.emit('statechange', self.list());
        };

        self.addCharacter = function () {
            var opt = {name: "", id: 'charChart-' + count}
            count++;
            var character = new Character(opt);
            self.selectedCharacter(character);
            self.characters.push(character);
            self.newChar = true;
        };

        self.isCharacterSelected = function (character) {
            return character === self.selectedCharacter();
        };

        self.onMove = function () {
            self.emit('moved');
            self.emit('statechange', self.list());
        };

        self.list = function () {
            var selected = [], i, char = self.characters();
            for (i = 0; i < char.length; i++) {
                selected.push(char[i].name())
            }
            return selected;
        }

        self.isPrimary = function (data) {
            var first = self.characters()[0];
            return data === first
        }

        self.characterClass = function (data) {
            if (self.isPrimary(data)) {
                return 'label label-primary';
            } else {
                return 'label label-default';
            }
        }

        self.isNewChar = function () {
            return self.newChar;
        }

        self.changeName = function (name, char) {
            char.name(name);
            self.newChar && self.emit('newchar', char.id(), char.name());
            self.newChar = false;
            self.emit('statechange', self.list());
        }
    };

    ko.bindingHandlers.visibleAndSelect = {
        init: function (element, valueAccessor, innerFn, data, koObj) {
            console.log('init visible and select handler');
            $(element).find("input").autocomplete({
                source: characterList,
                minLength: 0,
                minChars: 0,
                select: function (event, ui) {
                    var self = koObj.$root;
                    self.changeName(ui.item.value,data)
                }
            }).on('focus', function (event) {
                var self = this;
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
            }
        }
    };

    ko.bindingHandlers.addChart = {
        update: function (el, valueAccessor, innerFn, data, koObj) {
            console.log('add chart!')
            console.log(valueAccessor());
//            console.log( self.selectedCharacter() )
            if (valueAccessor()) {
                var id = data.id(), charName = data.name(),oneD=[];
                var data = [
                    ['Species Name', 'Value']
                ], chart;
                var temp = that.getCharArray(charName)
                // check if values are string or numeric
                if (typeof temp[0][1] === 'number') {
                    temp.forEach(function (it) {
                        data.push(it);
                    });
                    that.histogram(id,data);
                } else {
                    temp.forEach(function(it){
                        oneD.push(it[1]);
                    });
                    temp = that.frequencyCount(oneD);
                    temp.forEach(function (it) {
                        data.push(it);
                    });
                    that.columnchart(id, data)
                }
//                google.visualization.events.addListener(chart, 'onmouseover', that.chartHover);
            }
        }
    };

    var view = new CharacterViewModel();
    ko.applyBindings(view);

    this.histogram = function(id, data){
        var chart = new google.visualization.Histogram(document.getElementById(id));
        var options = {
            title: 'characters',
            legend: { position: 'none' }
        };
        data = google.visualization.arrayToDataTable(data);
        chart.draw(data, options);
    }

    this.columnchart = function(id, data){
        var chart = new google.visualization.ColumnChart(document.getElementById(id));
        var options = {
            title: 'characters',
            legend: { position: 'none' }
        };
        data = google.visualization.arrayToDataTable(data);
        chart.draw(data, options);
    }

    //get charJson
    this.setCharJson = function (char) {
        charJson = char;
        characterList = this.getCharList(charJson);
        view.characters.removeAll();
        console.log(characterList);
        console.log('setting new chars');
        //TODO: fire an event
    }

    this.getCharList = function (char) {
        var result = [], value, key, state
        if (char) {
            for (key in char) {
                value = char[key];
                for (state in value) {
                    result.push(state);
                }
                break;
            }
        }
        return result;
    }

    this.colorTreeWithCharacter = function (selected) {
        if (selected.length) {
            pj.colorTreeWithCharacter(charJson, selected);
        } else {
            // since the color is not disappearing when an empty array of selected character is passed
            pj.colorTreeWithCharacter(charJson, ['12#!!@']);
        }
    }

    this.chartHover = function () {
        console.log(arguments);
    }

    /**
     * provide a character name and it will give a two dimensional array of species name and value
     * @param charName
     */
    this.getCharArray = function (charName) {
        var result = [], char;
        for (var species in charJson) {
            var char = charJson[species];
            char[charName] && char[charName].forEach(function (it) {
                result.push([species, it]);
            })
        }
        return result;
    }

    /**
     * subset a charjson data structure to the list provided.
     * @param species - list of species to make subset.
     * @param chars (charjson - optional) if not provided charjson initially provided is used.
     * @returns {{}} charjson
     */
    this.charJsonSubset = function(species,chars){
        var comp = function(a,b){
            return a === b
        }

        var cFn = options.cFn || comp,
            result = {};
        chars = chars || charJson;
        for(i=0;i<species.length;i++){
            for(j in chars){
                if(cFn(species[i],j)){
                    result[j]=chars[j];
                }
            }
        }

        return result;
    }

    /**
     * The function accepts an array of terms and returns a frequency count of the all the terms.
     * the returned array is a two dimensional array.
     * @param terms
     * @returns {Array} [['term1',1]['term2',2]]
     */
    this.frequencyCount = function(terms){
        var freq ={},result=[],i;
        for(i=0;i<terms.length;i++){
            if(freq[terms[i]]){
                freq[terms[i]]++;
            }else{
                freq[terms[i]]=1;
            }
        }

        for(i in freq){
            result.push([i,freq[i]]);
        }

        return result;
    }
    /**
     * load character from url or from provided list.
     */
    if (options.url) {
        $.ajax({
            url: options.url,
            type: options.type,
            dataType: options.dataType,
            success: function (data) {
                that.setCharJson(data);
            }
        })
    } else if (options.character) {
        this.setCharJson(options.character)
    }

    //set style
    $('#' + id).css('max-height', options.height - options.headerHeight);
    $('#' + id).css('overflow-y', 'auto');

    /**
     * this array will list all the recognised events of this object
     * @type {Array}
     */
    this.events = [
    /**
     * params
     * @selected - a list of
     */
        'statechange'
    ]

    /**
     * adding event listeners
     */
    view.on('statechange', this.colorTreeWithCharacter)
//    view.on('newchar', this.addChart)
    pj.on('click', function () {
        console.log('clicked on phylojive. handler in character');
    })
};