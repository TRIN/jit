    function init() {

        phylogenyExplorer_init({
        	codeBase:'../..',
            width: 800,
            height:1200,        
        	alignName:true,
        	lateralise:false, 
       		levelsToShow:12,
        	branchMultiplier:5,
            presentClade: function (clade) {
              var tmpl = st.config.tmpl,
                nodeList = [],
                node, html, split;
                for (var i = 0; ((i < clade.length) & (i < 30)); i++) {
                  node = {}
                  node.name = clade [ i ].name;
                  node.plus = clade [ i ].name.replace(/\s+/g,'+');
                  split = node.name.split( /\s+/ );
                  if ( split.length > 1 ){
                    node.genus = split [ 0 ];
                    node.species = split [ 1 ];              
                  } else {
                    node.species = split [ 0 ];
                  }
                  node.rel = node.species + '' + i;
                  node.index = i;
                  nodeList.push ( node );            
                }
              if ( tmpl ) {
                tmpl = _.template ( tmpl );
                html = tmpl ( {nodeList: nodeList});
              } else {
                
              }
              return html;

            }, //presentClade 
            tmpl : '<table style="border: none"><tbody><tr><th></th><th>links</th><th> </th><th> </th><th> </th><th> </th></tr><% _.each(nodeList , function( value ) { %> <tr><td><a href="http://bie.ala.org.au/species/<%= value.plus %>" title="<%= value.name %> ALA species page" rel="<%= value.rel %>" class="thumbImage1"><%= value.name %></a></td><td><a href="http://biodiversity.org.au/name/<%= value.plus %>" title="about <%= value.name %> in NSL nomenclator " rel="<%= value.rel %>" class="thumbImage1"><id="thumb1"><div class="forward"></div> </id="thumb1"></a></td><td><a href="http://www.anbg.gov.au/cgi-bin/apiiGenus?genus=<%= value.genus %>&species=<%= value.species %>" title="images of <%= value.name %> in Aust. plant Image Index" rel="<%= value.rel %>" class="thumbImage1"><id="thumb1"><div class="forward"></div> </id="thumb1"></a><td><a href="http://biocache.ala.org.au/ws/density/map?q=<%= value.name %>" title="<%= value.name %> Aus density Map (if sufficient samples)" rel="<%= value.rel %>" class="thumbImage1"><id="thumb1"><div class="forward"></div></id="thumb1"></a></td></td><td><a href="http://eol.org/search/show?q=<%= value.plus %>&amp;type[]=taxon_concept&amp;type[]=image&amp;commit=Filter" title="images of <%= value.name %> in EOL" rel="<%= value.rel %>" class="thumbImage1"><id="thumb1"><div class="forward"></div> </id="thumb1"></a></td></tr> <% }); %></tbody></table></div>',

            character: {}
        });
        //testcase();
    } 