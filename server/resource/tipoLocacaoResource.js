var tipoLocacaoBusiness     =    require("./../business/tipoLocacaoBusiness");

var TipoLocacaoResource = (function() {

    /**
     *
     * @constructor
     */
    var TipoLocacaoResource = function() {};

    /**
     *
     * @param req
     * @param res
     */
    TipoLocacaoResource.prototype.getTipoLocacao = function(req,res){

        var tipoLocacaoModel = new Object();

        tipoLocacaoBusiness.getTipoLocacao(tipoLocacaoModel, function(obj){
            res.json(obj);
        });

    }

    return new TipoLocacaoResource();
})();

module.exports = TipoLocacaoResource;