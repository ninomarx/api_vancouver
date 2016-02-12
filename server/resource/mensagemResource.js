var mensagemBusiness     =    require("./../business/mensagemBusiness");

var MensagemResource = (function() {

    /**
     *
     * @constructor
     */
    var MensagemResource = function() {};

    /**
     *
     * @param req
     * @param res
     */
    MensagemResource.prototype.salvar = function(req,res){

        var mensagemModel = new Object();

        if (req){
            mensagemModel = req.body;
        }

        mensagemBusiness.salvar(mensagemModel, function(obj){
            res.json(obj);
        });

    }


    /**
     * Consultar
     * @param req
     * @param res
     */
    MensagemResource.prototype.consultar = function(req,res){

        var mensagemModel = new Object();

        if (req){
            mensagemModel = req.query;
        }

        mensagemBusiness.consultar(mensagemModel, function(obj){
            res.json(obj);
        });

    }

    /**
     *
     * @param req
     * @param res
     */
    MensagemResource.prototype.deletar = function(req,res){

        var mensagemModel = new Object();

        if (req){
            mensagemModel = req.query;
        }

        mensagemBusiness.deletar(mensagemModel, function(obj){
            res.json(obj);
        });

    }

    return new MensagemResource();
})();

module.exports = MensagemResource;