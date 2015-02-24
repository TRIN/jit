var Filter = function(options){
    this.opt = jQuery.extend({
        type:'ala',
        op:{
            OR:' OR ',
            AND: ' AND ',
            equal:'=',
            fqsep:':',
            paramsep:'&'
        },
        code:{
            fq:'fq',
            query:'q'
        }
    }, options);
    var pj = this.opt.pj;
    var that = this;
    var filter = {
        query:this.opt.q || '',
        fq:this.opt.fq || {
        }
    }
    this.addFq = function(name, value){
        if(!filter['fq'][name]){
            filter['fq'][name] = [];
        }
        filter['fq'][name].push(value);
    }
    this.clearFq = function(){
        filter['fq'] = {}
    }

    this.clearFqName = function(name){
        filter['fq'][name] = [];
    }

    this.clearQuery = function(){
        filter['query'] = '';
    }

    this.clear = function(){
        this.clearFq();
        this.clearQuery()
    }

    this.alaFormatting = function(){
        var result = [], prefix, fqs, j, temp;
        filter['query'] && result.push(this.formatQuery());
        for(var i in filter['fq']){
            result.push(this.formatFq(i));
        }
        return result.join(this.opt.op.paramsep).replace(/ /g,'+');
    }

    this.formatQuery = function(){
        return this.opt.code['query']+this.opt.op.equal+filter['query'];
    }

    this.formatFq = function( name ){
        var fq = this.getFq(name);
        if( fq ){
            return this.opt.code['fq']+this.opt.op.equal + fq;
        }
    }

    this.getQuery = function(){
        return filter['query'];
    }

    this.getFq = function(name){
        name = name || this.opt.fqVariable;
        var prefix = this.opt.code['fq']+this.opt.op.equal;
        var fqs = filter['fq'][name];
        var temp =[];
        if( fqs ){
            for( j = 0; j<fqs.length; j++){
                temp.push(name + this.opt.op.fqsep +'"'+fqs[j]+'"' )
            }
            return temp.join(this.opt.op.OR)
        }
    }

    this.format = function(baseUrl){
        var params;
        baseUrl = baseUrl || '';
        switch (this.opt.type){
            case 'ala': params = this.alaFormatting();
                break;
        }
        baseUrl && (params = baseUrl + '?' + params )
        return params;
    }

    pj.on('click', function (node) {
        that.clearFqName(that.opt.fqVariable);
        var children = pj.getChildrensName(node);
        var params;

        for (i in children) {
            that.addFq(that.opt.fqVariable,children[i])
        }
    });
}