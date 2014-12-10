var isLateralise = function () {
    return true;
}

function remoteLoadCharacters(url, characters, dataset) {
    //console.log("remoteLoadCharacters", url, characters, dataset);
    jQuery("#loadingMsg").show();
    jQuery("#loadChars").attr("disabled","disabled");

    var nodes = [];
    var root = st.graph.getNode(st.root);
    var allChars = jQuery.extend(true, {}, characters) || {}; // copy not reference it
    // iterate over tree and extract names
    root.eachSubgraph(function (node) {
        if (node.name) {
            var sciName = node.name.replace(/\s+\d+/,""); // strip off year strings
            nodes.push(sciName);
            // create stub for all names with no existing props
            if (!allChars[node.name]) {
                allChars[node.name] = {};
            }
        }
    });
    var joinedNames = nodes.join(";").replace(/\s+/g, "+");
    //url += "?names=" + joinedNames + "&dataset=" + dataset;
    var data = {
        names: joinedNames,
        dataset: dataset
    }
    //jQuery.getJSON(url, function(data) {
    jQuery.post(url, data, function(data) {
        var propObj = {}, maxProps = 0, oldChars = {}, charsFound;
        jQuery.each(data, function(key, el) {
            // need to initialize it here. otherwise it remembers value from previous iteration.
            charsFound = false;
            //oldChars[key] = jQuery.extend(true, {}, allChars[key] ); //copy it
            //console.log("key:", key, el, oldChars[key], allChars[key]);
            jQuery.extend(allChars[key], el); // merge props
            if (el) charsFound = true;
            // (do once) build a list of all (merged) properties
            if (charsFound && objLength(propObj) <= 0 && allChars[key]) {
                maxProps = objLength(allChars[key]);
                jQuery.each(el, function(k, v) {
                    //propList.push(k);
                    propObj[k] = [];
                });

            }
        });
        // normalise the properties for all taxa
        jQuery.each(allChars, function(key, el) {
            //console.log("newChars check",key,el,objLength(el),maxProps);
            //console.log("char's length", el.length, maxProps);
            if (objLength(el) < maxProps) {
                //console.log("mismatch", key);
                jQuery.extend(true, el, propObj);
            }
        });
        // determine the first character for first taxa
//        var firstChar;
//        var getFirstKey = function (data) {
//            for (var prop in data)
//                return prop;
//        }
//
//        for (var key in allChars) {
//            if (allChars[key]) {
//                firstChar = getFirstKey(allChars[key]);
//                break;
//            }
//        }
//
//        // load chars into PJ
//        st.firstCharacter = firstChar || false; //firstChar;
        st.config.initCharacter = false;
        st.character = allChars || {}; // st.characterList ???
        //console.log("st 2", st);
        if (charsFound && st.character) {
            var html = st.colorCharacter() || '';
            jQuery('#legendBody').html(html);
            //legendElem.style.display = 'inline';
            jQuery('#legend').show();
            //st.findAllCharTypes(st.graph.getNode(st.root));
            updateCharacter(st.characterList);
            //console.log("triggering navigate:", window.location.hash.slice(1));
            var hashString = window.location.hash.slice(1);
            // we need the URL to change in order to get navigate to trigger -> toggle first hash value
            var fiddleHash1 = (hashString.indexOf("characters") > -1) ? "character" : "characters";
            var fiddleHash2 = (hashString.indexOf("characters") > -1) ? "characters" : "character";
            window.AppRouter.navigate(hashString.replace(fiddleHash2, fiddleHash1),{trigger: true, replace: true});
            st.fitScreen();
            alert("characters were loaded successfully");
            // add IL to attribution tab
            var attr = "<p>Additional character data provided by <a href=\"http://www.identifylife.org/\" target=\"_blank\">Identify Life</a>.</p>";
            jQuery("#tabAbout").append(attr);
        } else {
            alert("No characters were found for this tree");
            jQuery('#legend').hide();
        }
    }, "json").error(function(jqXHR, textStatus, errorThrown){
        alert("getJSON Error: " + jqXHR.responseText.substring(0, Math.min(500,jqXHR.responseText.length)));
    }).complete(function() {
        jQuery("#loadingMsg").hide();
        jQuery("#loadChars").removeAttr("disabled");
    });
}

function updateMapColours(el) {
    //alert("foo: " + jQuery(el).val());
    var character = jQuery(el).val();
    var node = jQuery(el).data("node");
    var name = jQuery(el).data("name");
    var opt = jQuery(el).data("opt");
    //console.log("loadMap args", node, name, opt, character );
    loadMap(node, name, opt, character);
}

/**
 * Convert color name to hex code. Borrowed from http://stackoverflow.com/a/1573141/249327
 *
 * @param colour
 * @return {*}
 */
function colourNameToHex(colour) {
    var colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
        "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
        "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
        "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
        "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
        "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
        "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
        "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
        "honeydew":"#f0fff0","hotpink":"#ff69b4",
        "indianred ":"#cd5c5c","indigo ":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
        "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
        "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
        "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
        "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
        "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
        "navajowhite":"#ffdead","navy":"#000080",
        "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
        "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
        "red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
        "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
        "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
        "violet":"#ee82ee",
        "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
        "yellow":"#ffff00","yellowgreen":"#9acd32"};

    if (typeof colours[colour.toLowerCase()] != 'undefined')
        return colours[colour.toLowerCase()];

    return colour;
}

/**
 * Get a colour value (hex) by its index value in an array (32 elements)
 */
var colourScheme = {
    colours: ["3366CC","DC3912","FF9900","109618","990099","0099C6","DD4477","66AA00","B82E2E","316395","994499","22AA99","AAAA11","6633CC","E67200","8B0707","651067","329262","5574A6","3B3EAC","B77322","16D620","B91383","F43595","9C5935","A9C413","2A778D","668D1C","BEA413","0C5922","743411", "000000"],
    getColourForIndex: function(index) {
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

    var $ = jQuery;

    // used by search
    var result = []
    var config = $.extend({
        //id of viz container element
        injectInto: 'infovis',
        width: 800,
        height: 600,
        offsetX: 0,
        align: 'left',
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
            height: 40,
            width: 20,
            type: 'circle',
            dim: 5,
            color: '#aaa',
            overridable: true,
            align: 'left'
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
                var leafs;
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
                    jQuery("#infovis-canvas").data("nodeId", node.id);
                    jQuery("#infovis-canvas").data("node", node);
                    jQuery("#infovis-canvas").data("info", html);
                    jQuery("#infovis-canvas").contextMenu({x: e.pageX, y: e.pageY});
                }
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
                    name = " unnamed clade ";
                }
                //name = name + "<strong> click</strong> for ";
                if (node.data.leaf) { // end taxon
                    //    name = name + "for linked data";
                } else { //clade
                    //clade
                    name = "Part of " + name;
                    if (node.length < 30) {
                        name = name + "clade members";
                    }
                    else {
                        name = name + "30 clade members";
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
        }
    }, params);
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
                "id":node.id,
                "name":node.name,
                "data":{
                    'leaves':leaves,
                    'leaf':0,
                    'len':node.len,
                    '$type':'circle',
                    '$dim':5,
                    '$color':'#fff'
                },
                "children":childJSON
            };
        } else {
            node.name = node.name.replace(/_/g, ' ');
            var sampleArray = node.name.split(' ');
            if (sampleArray.length > 1) {
                sampleid = sampleArray[1];
            }
            var name = sampleArray[0];
            var nodeJSON = {
                "id":node.id,
                "name":node.name,
                "data":{
                    'leaves':0,
                    'leaf':1,
                    'len':node.len,
                    '$height':20,
                    '$type':'none',
                    'sampleid':sampleid,
                    'name':name
                },
                "children":childJSON
            };
            return nodeJSON;
        }
    };

    /**
     * gets tree data from url
     * @param url
     * @param callback
     * @param options
     */
    var getTree = function (url, callback, options) {
        var that = this
        console.log( 'in get tree' + this )
        $.ajax({
            url: url,
            type: 'GET',
            success: function (data) {
                options.tree = data;
                callback.apply(that, [options])
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
        var dataObject, json, d;
        switch (obj.format) {
            case 'newick':
                if (obj.tree) {
                    dataObject = new Smits.PhyloCanvas.NewickParse(obj.tree);
                } else if (obj.url) {
                    getTree(obj.url, setTree, obj)
                }
                break;
            case 'nexml':
                if (obj.tree) {
                    d = XMLObjectifier.textToXML(obj.tree);
                    d = XMLObjectifier.xmlToJSON(d);
                    dataObject = new Smits.PhyloCanvas.NexmlParse(d, {nexml:obj.nexml});
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
            st.onClick(st.root);
            st.plot();
            console.log('successfully completed')
        }
    }
    console.log('before jit initialized' )
    console.log(config)
    var st = new $jit.Phylo(config);
    setTree(config)
    console.log('after jit initialized')

    return {
        st: st,
        setTree: function (tree, format, url) {
            setTree( {
                tree: tree,
                format: format,
                url: url
            })
        },
        highlight: function (obj) {
            var nodeName, value
            for( var nodeName in obj){
                value = obj[nodeName];
                if (typeof value != 'object'){
                    obj[nodeName]={'highlight':[value]}
                }
            }
            st.character = obj;
//            console.log(obj)
            st.firstCharacter = 'highlight';
            st.colorCharacter();
//            console.log(st.characterList)
            st.plot();
        },
        clearHighlight:function(){
            var nodeName, value;
            var obj = st.character;
            for( var nodeName in obj){
                obj[nodeName]={}
            }

            st.character = obj;
            console.log(st.character)
            st.firstCharacter ='highlight'
            st.colorCharacter()
            st.plot();
        },
        ladderize: function () {

        },
        registerEvents: function () {

        },
        search: function (searchString, step) {

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
                    xTranslate = 0,
                    yTranslate = -oy;
                st.canvas.translate(xTranslate, yTranslate);

                var element = st.labels.getLabel(result[pos].id);
                element.style.backgroundColor = 'yellow';
                jQuery(element).click();
            }
        }
    }
};