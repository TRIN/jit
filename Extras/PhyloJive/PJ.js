var isLateralise = function () {
    return true;
}
var st;
/**
 * Convert color name to hex code. Borrowed from http://stackoverflow.com/a/1573141/249327
 *
 * @param colour
 * @return {*}
 */
function colourNameToHex(colour) {
    var colours = {"aliceblue": "#f0f8ff", "antiquewhite": "#faebd7", "aqua": "#00ffff", "aquamarine": "#7fffd4", "azure": "#f0ffff",
        "beige": "#f5f5dc", "bisque": "#ffe4c4", "black": "#000000", "blanchedalmond": "#ffebcd", "blue": "#0000ff", "blueviolet": "#8a2be2", "brown": "#a52a2a", "burlywood": "#deb887",
        "cadetblue": "#5f9ea0", "chartreuse": "#7fff00", "chocolate": "#d2691e", "coral": "#ff7f50", "cornflowerblue": "#6495ed", "cornsilk": "#fff8dc", "crimson": "#dc143c", "cyan": "#00ffff",
        "darkblue": "#00008b", "darkcyan": "#008b8b", "darkgoldenrod": "#b8860b", "darkgray": "#a9a9a9", "darkgreen": "#006400", "darkkhaki": "#bdb76b", "darkmagenta": "#8b008b", "darkolivegreen": "#556b2f",
        "darkorange": "#ff8c00", "darkorchid": "#9932cc", "darkred": "#8b0000", "darksalmon": "#e9967a", "darkseagreen": "#8fbc8f", "darkslateblue": "#483d8b", "darkslategray": "#2f4f4f", "darkturquoise": "#00ced1",
        "darkviolet": "#9400d3", "deeppink": "#ff1493", "deepskyblue": "#00bfff", "dimgray": "#696969", "dodgerblue": "#1e90ff",
        "firebrick": "#b22222", "floralwhite": "#fffaf0", "forestgreen": "#228b22", "fuchsia": "#ff00ff",
        "gainsboro": "#dcdcdc", "ghostwhite": "#f8f8ff", "gold": "#ffd700", "goldenrod": "#daa520", "gray": "#808080", "green": "#008000", "greenyellow": "#adff2f",
        "honeydew": "#f0fff0", "hotpink": "#ff69b4",
        "indianred ": "#cd5c5c", "indigo ": "#4b0082", "ivory": "#fffff0", "khaki": "#f0e68c",
        "lavender": "#e6e6fa", "lavenderblush": "#fff0f5", "lawngreen": "#7cfc00", "lemonchiffon": "#fffacd", "lightblue": "#add8e6", "lightcoral": "#f08080", "lightcyan": "#e0ffff", "lightgoldenrodyellow": "#fafad2",
        "lightgrey": "#d3d3d3", "lightgreen": "#90ee90", "lightpink": "#ffb6c1", "lightsalmon": "#ffa07a", "lightseagreen": "#20b2aa", "lightskyblue": "#87cefa", "lightslategray": "#778899", "lightsteelblue": "#b0c4de",
        "lightyellow": "#ffffe0", "lime": "#00ff00", "limegreen": "#32cd32", "linen": "#faf0e6",
        "magenta": "#ff00ff", "maroon": "#800000", "mediumaquamarine": "#66cdaa", "mediumblue": "#0000cd", "mediumorchid": "#ba55d3", "mediumpurple": "#9370d8", "mediumseagreen": "#3cb371", "mediumslateblue": "#7b68ee",
        "mediumspringgreen": "#00fa9a", "mediumturquoise": "#48d1cc", "mediumvioletred": "#c71585", "midnightblue": "#191970", "mintcream": "#f5fffa", "mistyrose": "#ffe4e1", "moccasin": "#ffe4b5",
        "navajowhite": "#ffdead", "navy": "#000080",
        "oldlace": "#fdf5e6", "olive": "#808000", "olivedrab": "#6b8e23", "orange": "#ffa500", "orangered": "#ff4500", "orchid": "#da70d6",
        "palegoldenrod": "#eee8aa", "palegreen": "#98fb98", "paleturquoise": "#afeeee", "palevioletred": "#d87093", "papayawhip": "#ffefd5", "peachpuff": "#ffdab9", "peru": "#cd853f", "pink": "#ffc0cb", "plum": "#dda0dd", "powderblue": "#b0e0e6", "purple": "#800080",
        "red": "#ff0000", "rosybrown": "#bc8f8f", "royalblue": "#4169e1",
        "saddlebrown": "#8b4513", "salmon": "#fa8072", "sandybrown": "#f4a460", "seagreen": "#2e8b57", "seashell": "#fff5ee", "sienna": "#a0522d", "silver": "#c0c0c0", "skyblue": "#87ceeb", "slateblue": "#6a5acd", "slategray": "#708090", "snow": "#fffafa", "springgreen": "#00ff7f", "steelblue": "#4682b4",
        "tan": "#d2b48c", "teal": "#008080", "thistle": "#d8bfd8", "tomato": "#ff6347", "turquoise": "#40e0d0",
        "violet": "#ee82ee",
        "wheat": "#f5deb3", "white": "#ffffff", "whitesmoke": "#f5f5f5",
        "yellow": "#ffff00", "yellowgreen": "#9acd32"};

    if (typeof colours[colour.toLowerCase()] != 'undefined')
        return colours[colour.toLowerCase()];

    return colour;
}

/**
 * Get a colour value (hex) by its index value in an array (32 elements)
 */
var colourScheme = {
    colours: ["3366CC", "DC3912", "FF9900", "109618", "990099", "0099C6", "DD4477", "66AA00", "B82E2E", "316395", "994499", "22AA99", "AAAA11", "6633CC", "E67200", "8B0707", "651067", "329262", "5574A6", "3B3EAC", "B77322", "16D620", "B91383", "F43595", "9C5935", "A9C413", "2A778D", "668D1C", "BEA413", "0C5922", "743411", "000000"],
    getColourForIndex: function (index) {
        var hexCode = "";

        if (this.isInteger(index) && index < this.colours.length) {
            hexCode = this.colours[index];
        } else {
            hexCode = this.colours[0];
        }

        return hexCode;
    },
    isInteger: function (value) {
        if ((parseFloat(value) == parseInt(value)) && !isNaN(value)) {
            return true;
        } else {
            return false;
        }
    }
}

var PJ = function (params) {
    console.log('in pj');
    var self = new Emitter(this);
    var pj = this;
    var qid, prevSearch;
    //adding support functions for event handling
    this.events = [
    /**
     * when a node is clicked
     */
        'click',
    /**
     * when a node is hovered
     */
        'hover',
    /**
     * after tree has been loaded
     */
        'treeloaded'
    ]
    var $ = jQuery;
    var spinner = new Spinner({
        top: '50%',
        left: '50%',
        className: 'loader'
    });

    // used by search
    var result = []
    var config = $.extend({
        //id of viz container element
        injectInto: 'infovis',
        width: 800,
        height: 600,
        offsetX: 0,
        align: 'left',
        //treeloaded flag to check if the tree is loaded
        treeloaded: false,
        alignName: false,
        lateralise: true,
        branchLength: true,
        branchMultiplier: 1,
        duration: 1000,
        fps: 10,
        //set animation transition type
        transition: $jit.Trans.Quart.easeInOut,
        //set distance between node and its children
        levelDistance: 20,
        levelsToShow: Number.MAX_VALUE,
        constrained: false,
        firstCharacter: 'Raceme_length_median',
        /**
         * save query flags
         */
        doSaveQuery: true,
        saveQuery:{
            url: 'http://dev.ala.org.au:8080/phylolink/ala/saveQuery',
            type: 'POST',
            dataType: 'JSON'
        },
        /**
         * flag to see if hash is changing due to click by user or going back on browser history
         */
        setNodeToUrlFlag: false,
        //enable panning
        Navigation: {
            enable: true,
            panning: 'avoid nodes',
            zooming: 50
        },
        //set node and edge styles
        //set overridable=true for styling individual
        //nodes or edges
        Node: {
            height: 8,
            width: 5,
            type: 'circle',
            dim: 5,
            color: '#aaa',
            overridable: true,
            align: 'left',
            selectedShape: 'ellipse',
            selectedColor: 'green'
        },
        Edge: {
            type: 'line',
            color: '#000',
            overridable: true,
            lineWidth: 2
        },
        Events: {
            enable: true,
            type: 'Native',
            //Change cursor style when hovering a node
            onMouseEnter: function (node, event, e) {
                st.canvas.getElement().style.cursor = 'crosshair';
                // call tips from here
                st.tips.config.onShow(st.tips.tip, node);
                st.tips.setTooltipPosition($jit.util.event.getPos(e));
            },

            onMouseLeave: function () {
                st.canvas.getElement().style.cursor = '';
                st.tips.hide(true);
            },

            onRightClick: function (node, eventInfo, e) {

            },

            onClick: function (node, eventInfo, e) {
                var leafs,names,queryObj;
                //console.log("debug",node, eventInfo, e);
                if (false && node) {
                    selectedClade = [];

                    var expand = $jit.id('expand');
                    var pos = st.labels.getLabel(node.id);
                    var setRoot = $jit.id('setRoot');
                    var rotate = $jit.id('rotate');
                    var select = $jit.id('selectClade');
                    var loc = parseInt(pos.style.left.replace(/px/, ''), 10) + 100;
                    var locy = parseInt(pos.style.top.replace(/px/, ''), 10) + 40;

                    // re-root the tree.
                    if (setRoot.checked) {
                        var id = node.id;
                        st.setRoot(id, 'animate');
                        st.root = id;
                    }

                    // rotate node
                    if (rotate.checked) {
                        st.computePositions(st.graph.getNode(st.root), 'start');
                        if (typeof node.data.rotate === "undefined") {
                            node.data.rotate = false;
                        }
                        node.data.rotate = !node.data.rotate;
                        st.computePositions(st.graph.getNode(st.root), 'end');
                        st.fx.animate({
                            modes: ['linear', 'node-property:alpha'],
                            onComplete: function () {
                            }
                        });
                    }

                    // action for
                    if (expand.checked) {
                        st.setCollapsed(node);
                        var level = st.nodesExpCol(node);
                        if (level) {
                            st.zoomIndex = level;
                        }
                        st.computePositions(st.graph.getNode(st.root), '');
                        st.plot();
                    }

                    // select clade and display it on the popup window
                    if (select.checked) {
                        st.clickedNode = node;
                        node.eachSubgraph(function (elem) {
                            if (elem.data.leaf) {
                                if (leafs) {
                                    leafs += "<li>" + elem.name + "</li>";
                                } else {
                                    leafs = "<li>" + elem.name + "</li>";
                                }
                                selectedClade.push(elem);
                            }
                        });

                        popup.style.display = 'inline';
                        popup.style.top = locy + 'px';
                        popup.style.left = loc + 'px';
                        popupText.innerHTML = st.config.presentClade(selectedClade);
                        st.config.onPresentClade();
                        st.plot();
                    }
                } else if (node) {
                    // Trigger the contextMenu to popup
                    //console.log("tips", st.tips);
                    if (st.tips.config.enable) st.tips.hide(false); // hide the tip so it doesn't cover the context menu
//                    jQuery("#infovis-canvas").data("nodeId", node.id);
//                    jQuery("#infovis-canvas").data("node", node);
//                    jQuery("#infovis-canvas").data("info", html);
//                    jQuery("#infovis-canvas").contextMenu({x: e.pageX, y: e.pageY});

                    st.clickedNode = node;
//                    redraw()
                    st.plot()
                    console.log(node);
                    pj.setNodeToUrl(node.id);
                    names = pj.getChildrensName(node);
                    queryObj = config.onBeforeClick(node, names);
                    node && self.emit('click', node, names, queryObj);
                }
            }
        },

        onBeforeClick: function(node, names){
            if(config.doSaveQuery){
                qid = undefined;
                var obj = $.ajax({
                    url: config.saveQuery.url,
                    type: config.saveQuery.type,
                    dataType: config.saveQuery.dataType,
                    data:{
                        speciesList: JSON.stringify(names)
                    },
                    success: function(q){
                        qid = q.qid;
                        console.log(qid);
                    },
                    error: function(){
                        console.log('failed!')
                    }
                });
                return obj;
            }
        },
        presentClade: function (clade) {
            var tmpl = st.config.tmpl,
                nodeList = [],
                node, html, split;
            for (var i = 0; ((i < clade.length) & (i < 30)); i++) {
                node = {}
                node.name = clade [ i ].name;
                nodeList.push(node);
            }
            if (tmpl) {
                tmpl = _.template(tmpl);
                html = tmpl({nodeList: nodeList});
            } else {

            }
            return html;

        }, //presentClade

        onPresentClade: function () {
            $('a.thumbImage1').colorbox({iframe: true, width: '80%', height: '80%'});
        }, // onPresentClade

        tmpl: '<ul><% _.each(nodeList , function( value ) { %> <li> <%= value.name %> </li> <% }); %> </ul>',

        Tips: {
            enable: true,
            onShow: function (div, node) {
                var url = '', key, i , char,
                    html = '', name = '', maptitle = '', index;
                if (!!node.name) {
                    name = "<i>" + node.name + "</i>";
                }
                else {
                    name = " unnamed";
                }
                //name = name + "<strong> click</strong> for ";
                if (node.data.leaf) { // end taxon
                    //    name = name + "for linked data";
                } else { //clade
                    if (name) {
                        name = "Inner Node:" + name;
                    } else {
                        name = "Inner Node: not named"
                    }
                }
                name = "<h3>" + name + "</h3>";
                // display all characters
                var result = [];
                for (index in st.config.selectedCharacters) {
                    key = st.config.selectedCharacters [ index ];
                    char = node.data.character [ key ];
                    html = '<strong>' + key + '</strong>: ';
                    if (typeof char === 'undefined' || char.length === 0 || typeof char[0] === 'undefined') {
                        html += '&mdash;';
                    } else if (typeof char[0] !== 'number') {
                        html += char.join(',<br/>....');
                    } else {
                        html += char[0].toFixed(4);
                    }
                    result.push(html);
                }
                result.push('[click for actions &amp; more info]');
                div.innerHTML = name + result.join('<br/>') + maptitle + url;
            }
        },

        onBeforeCompute: function (node) {
            console.log("loading " + node.name);
        },

        onAfterCompute: function (msg) {
            if (msg) {
                console.log(msg);
            } else {
                console.log("done");
            }
        },

        //This method is called on DOM label creation.
        //Use this method to add event handlers and styles to
        //your node.
        onCreateLabel: function (label, node) {
            var char, list = st.config.selectedCharacters /*st.characterList*/
                ,
                charTypeMapping = st.charTypeMapping,
                i, values, div, colorCoding = st.colorCoding,
                firstColor, index, temp, shape;
            label.id = node.id;
            label.innerHTML = node.name;
            label.onclick = function (e) {
                st.controller.Events.onClick(node, null, e);
            };
            //set label styles
            var style = label.style;
            style.width = 'auto';
            style.height = 17 + 'px';
            style.cursor = 'pointer';
            style.color = '#333';
            style.fontSize = '0.8em';
            style.textAlign = 'left';
            style.paddingTop = '3px';
            style.display = 'inline';

            style.color = node.data.$color;
            //         if (node.data.color)
            var boxes = '';
            var first = st.config.firstCharacter;
            var shapes = ['box', 'star', 'triangle'],
                index = 0;

            boxes = '';

            for (i = 0; i < list.length; i += 1) {
                //           for ( char in node.data.character )
                char = list[i];
                values = node.data.character[char];
                if (values && values.length > 0 && typeof values[0] !== 'undefined') {
                    if (charTypeMapping[char] === st.config.typeEnum.quali) {
                        temp = colorCoding[char];
                        value = values[0];
                        if (values.length > 1) {
                            value = 'multiple';
                        }
                        shape = '<div class="' + temp[value].shape
                            + '" style="float:left;background-color:'
                            + temp[value].color + ';" title="' + char + ' : '
                            + values.join(' , ') + '"></div>';
                        if (i === 0) {
                            firstColor = temp[value].color;
                        }
                    } else if (charTypeMapping[char] === st.config.typeEnum.quant) {
                        temp = st.colorCodingQuali[char];
                        value = values[0];
                        index = st.findIndex(value, st.range[char]);
                        shape = '<div class="' + temp[index].shape
                            + '" style="float:left;background-color:'
                            + temp[index].color + ';" title="' + char + ' : '
                            + temp[index].name + '"></div>';

                        if (i === 0) {
                            firstColor = st.config.quantColor[st.config.quantColor.length - 1];
                        }
                    }
                } else {
                    shape = '<div class="empty" style="float:left;background-color:;" title="empty"></div>';
                }
                if (first !== char) {
                    boxes += shape;
                } else {
                    boxes = shape + boxes;
                }
            }

            // make names for nodes.
            if (label) {
                if (!node.data.leaf) {
                    label.innerHTML = boxes
                        + '&nbsp;&nbsp;<div style="display:inline;margin-top:-4px;color:'
                        + firstColor + '">' + node.data.leaves + ' Taxa</div>';
                } else {
                    label.innerHTML = boxes
                        + '&nbsp;&nbsp;<div style="display:inline;margin-top:-4px;color:'
                        + firstColor + '">' + node.name + '</div>';
                }
            }
        },

        //This method is called right before plotting
        //a node. It's useful for changing an individual node
        //style properties before plotting it.
        //The data properties prefixed with a dollar
        //sign will override the global node style properties.
        onBeforePlotNode: function (node) {
            //add some color to the nodes in the path between the
            //root node and the selected node.
            //       if (!node.data.leaf) {
            var result = true,
                char;
            if (!node.data.leaf) {
                for (var key in st.config.selectedCharacters) {
                    if (node.data.characterConsistency.hasOwnProperty(key)) {
                        char = st.config.selectedCharacters[key];
                        result = result && node.data.characterConsistency[char];
                    }
                }
            }
            if (!result && node.data.$type !== 'triangle') {
                node.data.$type = 'square';
            }
            if (node.data.$type === 'circle') {
                if (node.data.rotate) {
                    node.data.$color = 'purple';
                } else {
                    node.data.$color = 'red';
                }
            } else if (node.data.$type === 'square') {
                node.data.$dim = 10;
                node.data.$color = "red";
            }
            /*      }else {
             }*/
            if (node.data.$type === 'triangle') {
                node.data.$dim = 15;
                node.data.$color = '#EE9AA2';
            } else if (node.data.$type !== 'square') {
                delete node.data.$dim;
            }
            // color for root node.
            if (st.root === node.id) {
                node.data.$color = 'lightblue';
            }
        },

        //This method is called right before plotting
        //an edge. It's useful for changing an individual edge
        //style properties before plotting it.
        //Edge data proprties prefixed with a dollar sign will
        //override the Edge global style properties.
        onBeforePlotLine: function (adj) {
        },

        onClick: function (node, eventInfo, e) {
            if (node) {
                var elem = document.getElementById('selected');
                if (node.leaf) {
                    elem.innerHTML = node.name;
                } else {
                    elem.innerHTML = '';
                    node.subGraph(function (n) {
                        if (n.data.leaf) {
                            elem.innerHTML += n.name + "<br/>";
                        }
                    });
                }
            }
        },

        onPlaceLabel: function (dom, node) {
            var alignName = config.alignName || false
            if (node.selected) {
                dom.style.display = 'none';
            }
            //             remove labels of non-leaf nodes
            if (!node.data.leaf) {
                dom.style.display = 'none';
                //         dom.innerHTML = node.data.leaves + ' Taxa';
            }
            //    // show label for the last visible node in the clade
            dom.style.display = node.data.display || 'block';
            if (alignName) {
                jQuery('#' + dom.id + ' .quant').addClass('quantAlign');
            } else {
                jQuery('#' + dom.id + ' .quant').removeClass('quantAlign');
            }
        },

        getSelectedNode:function(){
            return st.clickedNode;
        }
    }, params);
    config.injectInto = config.id;
    delete config.id;
    //end config

    var nextStep = function (pos, step, length) {
        // logic so that search starts from the first instance
        if (typeof pos === 'undefined') {
            return step > 0 ? 0 : length - 1;
        }
        var i = (pos + step) % length;
        return i < 0 ? length + i : i;
    };

    var smitsNode2JSON = function (node) {
        var childJSON = [];
        var leaves = 0;
        for (var i = 0; i < node.children.length; i++) {
            var j = smitsNode2JSON(node.children[i])
            childJSON.push(j);
            leaves += j.data.leaf;
            leaves += j.data.leaves;
        }
        var that = node;
        var sampleid = '';
        if (childJSON.length !== 0) {
            return {
                "id": node.id,
                "name": node.name,
                "data": {
                    'leaves': leaves,
                    'leaf': 0,
                    'len': node.len,
                    '$type': 'circle',
                    '$dim': 5,
                    '$color': '#fff'
                },
                "children": childJSON
            };
        } else {
            node.name = node.name.replace(/_/g, ' ');
            var sampleArray = node.name.split(' ');
            if (sampleArray.length > 1) {
                sampleid = sampleArray[1];
            }
            var name = sampleArray[0];
            var nodeJSON = {
                "id": node.id,
                "name": node.name,
                "data": {
                    'leaves': 0,
                    'leaf': 1,
                    'len': node.len,
                    '$height': 20,
                    '$type': 'none',
                    'sampleid': sampleid,
                    'name': name
                },
                "children": childJSON
            };
            return nodeJSON;
        }
    };

    var navigation = function (opt) {
        function $E(tag, props) {
            var elem = document.createElement(tag);
            for (var p in props) {
                if (typeof props[p] == "object") {
                    $jit.util.extend(elem[p], props[p]);
                } else {
                    elem[p] = props[p];
                }
            }
            return elem;
        }

        opt.codeBase = opt.codeBase || '';
//        var popupHTML = '<div id="popup-close" style="position:relative; width:100%; background-color:lightblue"><a href="#" onclick="this.parentNode.parentNode.style.display=\'none\';" onmouseover="this.style.cursor=\'pointer\';" class="ui-dialog-titlebar-close ui-corner-all" role="button"><span class="ui-icon ui-icon-closethick">close</span></a></div><div id="popup-text"></div>';
        var navHTML2 = '<div style="position:relative">' +
            '<div style="position: absolute; left: -153px; top: 5px; width:50px; height: 20px; cursor: pointer;">'+
            '<div class="input-append">'+
            '<input style="width:150px;" id="searchText" type="text" placeholder="Search tree">'+
            '<button class="btn btn-primary" type="button" id="searchBtn"><i class="icon icon-white icon-search"></i> </button>'+
            '</div></div>'+
            '<div id="panup" style="position: absolute; left: 13px; top: 42px;' +
            ' width: 18px; height: 18px; cursor: pointer;"><div id="north"><i class="icon-arrow-up"' +
            ' aria-hidden="true"></i></div></div><div id="panleft" style="position: absolute; left: 4px; top: 56px;' +
            ' width: 18px; height: 18px; cursor: pointer;"><div id="west"><i class="icon-arrow-left"' +
            ' aria-hidden="true"></i></div></div><div id="panright" style="position: absolute; left: 22px; ' +
            'top: 56px; width: 18px; height: 18px; cursor: pointer;"><div id="east"><i class=" ' +
            'icon-arrow-right" aria-hidden="true"></i></div></div><div id="pandown" style="position: ' +
            'absolute; left: 13px; top: 70px; width: 18px; height: 18px; cursor: pointer;"><div id="south"><i ' +
            'class="icon-arrow-down" aria-hidden="true"></i></div></div>' +
            '<div id="zoomout" style="position: absolute; left: 13px; top: 129px; width: 18px; height: 18px; ' +
            'cursor: pointer;"><div id="zoomOUT"><i class="icon-zoom-out"></i></div></div>' +
            '<div id="zoomworld" style="position: absolute; left: 13px; top: 93px; width: 18px; height: 18px; cursor: pointer;"><div id="world" style="position: relative; width: 18px; height: ' +
            '18px;" ><i class="icon-resize-small"></i></div></div>' +
            '<div id="zoomin" style="position: absolute; left: 13px; top: 111px; width: 18px; height: 18px; cursor: ' +
            'pointer;">' +
            '<div id="zoomIN"><i class="icon-zoom-in"></i></div></div>' +
            '</div>';

        var navHTML3 =  '<div style="position:relative"><div id="panup" style="position: absolute; left: 13px; top: 4px;' +
            ' width: 18px; height: 18px; cursor: pointer;"><div id="north"><span class="glyphicon glyphicon-arrow-up"' +
            ' aria-hidden="true"></span></div></div><div id="panleft" style="position: absolute; left: 4px; top: 22px;' +
            ' width: 18px; height: 18px; cursor: pointer;"><div id="west"><span class="glyphicon glyphicon-arrow-left"' +
            ' aria-hidden="true"></span></div></div><div id="panright" style="position: absolute; left: 22px; ' +
            'top: 22px; width: 18px; height: 18px; cursor: pointer;"><div id="east"><span class="glyphicon ' +
            'glyphicon-arrow-right" aria-hidden="true"></span></div></div><div id="pandown" style="position: ' +
            'absolute; left: 13px; top: 40px; width: 18px; height: 18px; cursor: pointer;"><div id="south"><span ' +
            'class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span></div></div>' +
            '<div id="zoomout" style="position: absolute; left: 13px; top: 99px; width: 18px; height: 18px; ' +
            'cursor: pointer;"><div id="zoomOUT"><span class="glyphicon glyphicon-zoom-out"></span></div></div>' +
            '<div id="zoomworld" style="position: absolute; left: 13px; top: 63px; width: 18px; height: 18px; cursor: pointer;"><div id="world" style="position: relative; width: 18px; height: ' +
            '18px;" ><span class="glyphicon glyphicon-resize-small"></span></div></div>' +
            '<div id="zoomin" style="position: absolute; left: 13px; top: 81px; width: 18px; height: 18px; cursor: ' +
            'pointer;">' +
            '<div id="zoomIN"><span class="glyphicon glyphicon-zoom-in"></span></div></div>' +
            '</div>';

        var navHTML = config.bootstrap == 2? navHTML2: navHTML3;
        var jitcontainer, rightJitContainer, centerJitContainer,
            id = typeof (opt.injectInto) == 'string' ? opt.injectInto : opt.injectInto.id,
            infovis, parent, popup, navigation, menu, border;

        //  this function is losing its meaning by adding this. just for now.
        //     var popupContainer = document.getElementById('center-jitcontainer');
        //     var popup = $jit.id('popup');
        //     popup.style.display = 'none';
        border = opt.width * 100 / 90;
        jitcontainer = $E('div', {
            'id': 'jitcontainer',
            'className': 'clearfix',
            'style': {
                'position': 'relative'
//                'width': border + 'px',
//                'height': ((opt.height + 55 + border / 20)) + 'px'
            }
        });

        rightJitContainer = $E('div', {
            'id': 'right-jitcontainer',
            'className': '',
            'style': {
                display: 'none'
            }
        });
        centerJitContainer = $E('div', {
            'id': 'center-jitcontainer',
            'className': ''
        });
        infovis = jQuery('#' + id)[0];

        parent = infovis.parentNode;
//        parent.replaceChild(jitcontainer, infovis);

//        centerJitContainer.appendChild(infovis);
//        jitcontainer.appendChild(centerJitContainer);
//        jitcontainer.appendChild(rightJitContainer);

        popup = $E('div', {
            'id': 'popup',
            'className': '',
            'style': {
                'color': 'black',
                'display': 'none',
                'border': '1px solid green',
                'background-color': '#B5D397',
                'position': 'absolute',
                'left': '50px',
                'top': '90px',
                //'width': '250px',
                //'height': '170px',
                'overflow': 'auto',
                'text-align': 'left'
            }
        });
//        jQuery(popup).html(popupHTML);
        centerJitContainer.appendChild(popup);
        jQuery(popup).resizable({
            maxHeight: 450,
            maxWidth: 350,
            minHeight: 250,
            minWidth: 170
        });
        jQuery(popup).draggable({
            handle: '#popup-close',
            containment: '#' + opt.injectInto
        });

        navigation = $E('div', {
            'id': 'navigationPanel',
            'style': {
                'left': (opt.width - 50) + 'px',
                'z-index': 1
            }
        });

        jQuery(navigation).html(navHTML);
        jQuery(infovis).prepend(navigation);

        // setup handlers for navigation icons
        var north = $jit.id('north'),
            east = $jit.id('east'),
            west = $jit.id('west'),
            south = $jit.id('south');

        function clickHandler() {
            var pos = {};
            switch (this.id) {
                case 'north':
                    pos = {
                        x: 0,
                        y: 10
                    };
                    break;
                case 'west':
                    pos = {
                        x: -10,
                        y: 0
                    };
                    break;
                case 'east':
                    pos = {
                        x: 10,
                        y: 0
                    };
                    break;
                case 'south':
                    pos = {
                        x: 0,
                        y: -10
                    };
                    break;
            }
            var canvas = st.canvas;
            canvas.translate(pos.x, pos.y);
        }

        north.onmousedown = south.onmousedown = east.onmousedown = west.onmousedown = clickHandler;

        function zoomHandler() {
            var scroll;
            switch (this.id) {
                case 'zoomIN':
                    scroll = +1;
                    break;
                case 'zoomOUT':
                    scroll = -1;
                    break;
            }
            st.zoom(scroll);
        }

        var zoomIN = $jit.id('zoomIN'),
            zoomOUT = $jit.id('zoomOUT'),
            world = $jit.id('world');
        zoomIN.onclick = zoomOUT.onclick = zoomHandler;
        world.onclick = function () {
            st.fitScreen();
        };

        var searchBox = $("#searchBtn");
        searchBox.click(function(){
            var str = $('#searchText').val();
            pj.search(str, 1);
        })
        var searchText = $('#searchText').keypress( function(e){
            if(e.which == 13) {
                searchBox.trigger('click');
            }
        });
    };

    /**
     * gets tree data from url
     * @param url
     * @param callback
     * @param options
     */
    var getTree = function (url, callback, options) {
        var that = this
        var method = options.method || 'GET'
        console.log(options)

        spinner.spin();
        $('#'+config.injectInto).append(spinner.el);

        $.ajax({
            url: url,
            dataType: options.dataType,
            success: function (data) {
                spinner.stop();
                if (typeof data == 'object') {
                    options.format = data.format || options.format;
                    options.tree = data.tree;
                } else {
                    options.tree = data;
                }
                callback.apply(that, [options])
            },
            error: function(){
                spinner.stop();
                alert('Could not load tree. Tree URL seems to be incorrect.');
            }
        })
    }

    /**
     * pass a tree and render it on phylojive canvas
     * params - an object
     * tree - tree data
     * format - 'newick','nexml' - mandatory
     * url - url to the tree data
     */
    var setTree = function (obj) {
        var dataObject, json, d, id, node;
        config.treeloaded = false;
        switch (obj.format) {
            case 'newick':
                if (obj.tree) {
                    obj.tree = obj.tree.replace(/ /g, '_').replace(/'/g, "").replace(/\[pre-ingroup-marker\]/g, '')
                    dataObject = new Smits.PhyloCanvas.NewickParse(obj.tree);
                } else if (obj.url) {
                    getTree(obj.url, setTree, obj)
                }
                break;
            case 'nexml':
                if (obj.tree) {
                    d = XMLObjectifier.textToXML(obj.tree);
                    d = XMLObjectifier.xmlToJSON(d);
                    dataObject = new Smits.PhyloCanvas.NexmlParse(d, {nexml: obj.nexml});
                } else if (obj.url) {
                    getTree(obj.url, setTree, obj)
                }
                break;
        }

        if (dataObject) {
            console.log('converting using smits library');
            json = smitsNode2JSON(dataObject.getRoot());
            st.loadJSON(json)
            st.compute();
            id = pj.getNodeFromUrl();
            st.onClick(st.root);

            // if zoomIndex is not set, the rendering will go crazy. make sure zoomIndex is set when a node is clicked
            st.zoomIndex = st.graph.depth.length;
            st.plot();
            if(id!== undefined){
                pj.clickNode(id);
            }

            config.treeloaded = true;
            // fire event after tree is loaded
            pj.emit('treeloaded');
            console.log('successfully completed')
        }
    }

    var redraw = function () {
        var legendElem = $jit.id('legend'),
            i, node, label;
//        if (st.character) {
////            html = st.colorCharacter() || '';
////            jQuery('#legendBody').html(html);
//            legendElem.style.display = 'inline';
//        } else {
//            legendElem.style.display = 'none';
//        }

        for (i in st.graph.nodes) {
            if (st.graph.nodes.hasOwnProperty(i)) {
                node = st.graph.nodes[i];
                //         if( node.data.leaf ) {
                label = jQuery('#' + node.id)[0];
                label && st.config.onCreateLabel(label, node);
                //         }
            }
        }

        //optional: make a translation of the tree
        //emulate a click on the root node.
//        var currentZoom = st.zoomIndex;
//        st.onClick(st.root);
//        alert("pre-fitScreen, zoom = " + st.zoomIndex);
//        console.log("st", st);
//        st.fitScreen();
//        st.zoomIndex = currentZoom;
//        if (currentZoom) st.zoom(currentZoom);
//        alert("post-fitScreen, zoom = " + st.zoomIndex);
    }

    // add this class to make the labels disappear outside the bounds of canvas
    $('#' + config.injectInto).addClass('infovis');

    console.log('before jit initialized')
    console.log(config)
    st = new $jit.Phylo(config);
    navigation(config)
    setTree(config)
    console.log('after jit initialized')

    this.st = st;

    this.setTree = function (tree, format, url) {
        setTree({
            tree: tree,
            format: format,
            url: url
        });
    };

    this.highlight = function (obj) {
        var nodeName, value
        for (var nodeName in obj) {
            value = obj[nodeName];
            if (typeof value != 'object') {
                obj[nodeName] = {'highlight': [1]}
            }
        }
        st.character = obj;
        console.log(obj)
        st.firstCharacter = 'highlight';
        st.colorCharacter();
        console.log(st.characterList)
        st.plot();
    };

    this.clearHighlight = function () {
        console.log('in clear hightlight')
        var nodeName, value;
        var obj = st.character;
        for (var nodeName in obj) {
            obj[nodeName] = {}
        }

        st.character = obj;
        console.log(st.character)
        st.firstCharacter = 'hightlight'
        st.colorCharacter()
        st.plot();
    };

    this.ladderize = function () {

    };

    this.registerEvents = function () {

    };

    this.search = function (searchString, step) {

        // if search has been done, clear the selected label
        var len;
        var root = st.graph.getNode(st.root);
        if (result.length > 0) {
            len = result.length;
            pos = nextStep(pos, step, len);
            var prevElem = st.labels.getLabel(result[nextStep(pos, -1 * step, len)].id);
            prevElem.style.backgroundColor = '';
        }
        if (searchString && prevSearch !== searchString) {
            result = [];
            prevSearch = searchString;
            root.eachSubgraph(function (node) {
                var name = node.name,
                    pattern = new RegExp(searchString, 'i');
                if (name.match(pattern)) {
                    result.push(node);
                }
            });
            pos = nextStep(undefined, step, len);
        } else if (searchString === '') {
            result = [];
        }
        if (result.length > 0) {
            var shownNode = result[pos];
            if (!shownNode.exist) {
                root.collapsed = true;
                st.nodesExpCol(root);
                st.computePositions(root, '');
                st.plot();
            }
            // transalate to top
            var canvas = st.canvas,
                oy = canvas.translateOffsetY,
                ox = canvas.translateOffsetX,
                xTranslate = -ox,
                yTranslate = -oy;
            st.canvas.translate(xTranslate, yTranslate);

            var element = st.labels.getLabel(result[pos].id);
            element.style.backgroundColor = 'yellow';
            yTranslate = $(element).css('top').replace('px');
            yTranslate = yTranslate?Number.parseInt(yTranslate):0;
            st.canvas.translate(0, -yTranslate);
//            jQuery(element).click();
        }
    };

    this.colorTreeWithCharacter = function (charJson, selected) {
        st.character = charJson;
        st.config.firstCharacter = st.firstCharacter = selected[0];
        st.config.selectedCharacters = st.selectedCharacters = selected;
        st.colorCharacter();
        redraw();
        st.plot();
    };

    this.getChildrensName = function(node){
        var result = []
        node && node.eachSubgraph(function (n) {
            if (n.data.leaf) {
                result.push(n.name);
            }
        });
        return result;
    }

    this.getSelection = function(){
        return st.clickedNode;
    }

    this.getRoot = function(){
        return st.root;
    }

    /**
     * check if tree is loaded
     * @returns {boolean}
     */
    this.isTreeLoaded = function(){
        return config.treeloaded;
    }

    /**
     * get query id. The returned value can be formatted using the format parameter.
     * @param format (Boolean) format query id in ala format
     * @returns (string) eg: 'qid:1234887' or '1234887'
     */
    this.getQid=function(format){
        if(qid === undefined){
            return;
        }

        if(format){
            return 'qid:'+qid;
        } else {
            return qid;
        }
    }

    /**
     * gets node id from url hash
     */
    this.getNodeFromUrl = function(){
        var hash = window.location.hash;
        var nodeId = hash.split("#node/");
        if(nodeId.length > 1){
            return Number.parseInt(nodeId[1]);
        }
    }

    /**
     * set a node id to url
     * @param id - node id
     */
    this.setNodeToUrl = function(id){
        if(id == undefined){
            return;
        }
        config.setNodeToUrlFlag = true;
        var hash = '#node/' + id
        window.location.hash = hash;
    }

    /**
     * simulate a click on a node
     * @param node
     */
    this.clickNode = function(id){
        var node = st.graph.getNode(id);
        var pos = node.getPos(),
            p = st.canvas.getPos(),
            offx = st.canvas.translateOffsetX,
            offy = st.canvas.translateOffsetY,
            x,y;
        if( !node.data.leaf){
            x = p.x + offx + pos.x+5;
            y = p.y + offy + pos.y+3;
            console.log(x+":"+y);
            var evt = document.createEvent('MouseEvent');
            evt.initMouseEvent("mousedown", true, true, window,
                0, 0, 0, x, y, false, false, false, false, 0, null);
            st.canvas.canvases[0].canvas.dispatchEvent(evt);

            evt = document.createEvent('MouseEvent');
            evt.initMouseEvent("mouseup", true, true, window,
                0, 0, 0, x, y, false, false, false, false, 0, null);
            st.canvas.canvases[0].canvas.dispatchEvent(evt);
        } else {
            $('#'+node.id).click();
        }
        st.plot()
    }


    $(window).on('hashchange',function(){
        if(!config.setNodeToUrlFlag){
            pj.clickNode(pj.getNodeFromUrl())
        }
        config.setNodeToUrlFlag = false;
    })
};