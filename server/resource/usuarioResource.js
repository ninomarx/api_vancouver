var usuarioBusiness     =    require("./../business/usuarioBusiness");

var UsuarioResource = (function() {

    /**
     *
     * @constructor
     */
    var UsuarioResource = function() {};

    /**
     * Autenticação
     * @param req
     * @param res
     */
    UsuarioResource.prototype.autenticacao = function(req,res){

        var usuarioModel = new Object();

        if (req){


            var query = req.body;

            if (query.hasOwnProperty("login")){
                usuarioModel.login = query.login;
            }

            if (query.hasOwnProperty("senha")){
                usuarioModel.senha = query.senha;
            }
        }

        usuarioBusiness.autenticacao(usuarioModel, function(obj){
            res.json(obj);
        });

    }

    /**
     * Consultar
     * @param req
     * @param res
     */
    UsuarioResource.prototype.consultar = function(req,res){

        var usuarioModel = new Object();

        usuarioBusiness.consultar(usuarioModel, function(obj){
            res.json(obj);
        });

    }

    /**
     * Atualizar
     * @param req
     * @param res
     */
    UsuarioResource.prototype.atualizar = function(req,res){

        var usuarioModel = new Object();

        if (req){
            usuarioModel = req.body;
        }

        usuarioBusiness.atualizar(usuarioModel, function(obj){
            res.json(obj);
        });

    }

    return new UsuarioResource();
})();

module.exports = UsuarioResource;