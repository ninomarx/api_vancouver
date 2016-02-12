var factory     =    require("./../factory/dbfactory");

var MensagemBusiness = (function() {

    /**
     *
     * @constructor
     */
    var MensagemBusiness = function() {


    };

    /**
     * Salvar Mensagem
     * @param mensagemModel
     * @param callback
     */
    MensagemBusiness.prototype.salvar = function(mensagemModel, callback) {

        var connection = factory.getConnection();

        connection.connect();

        var sql = "";
        sql = sql + " INSERT INTO Country (cou_description, cou_code) ";
        sql = sql + " VALUES ";
        sql = sql + " (";
        sql = sql + "'" + mensagemModel.cou_description + "', ";
        sql = sql + "'" + mensagemModel.cou_code + "' ";
        sql = sql + "); ";

        connection.query(sql,function(err,info){
            connection.end();
            //pool.end();
            if(!err) {

                var result = mensagemModel.cou_description;
                callback(result);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            //pool.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });


    };


    /**
     * Consultar
     *
     * @param mensagemModel
     * @param callback
     */
    MensagemBusiness.prototype.consultar = function(mensagemModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select * ";
        sql = sql + " from Country LIMIT 5 ";


        connection.query(sql,function(err,mensagens){
            connection.end();
            if(!err) {

                var collectionMensagem = mensagens;

                callback(collectionMensagem);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });


    };


    /**
     * Deletar
     *
     * @param mensagemModel
     * @param callback
     */
    MensagemBusiness.prototype.deletar = function(mensagemModel, callback) {

        var  pool = factory.getPool();
        pool.getConnection(function(err,connection){

            if (err) {
                connection.release();
                pool.end();
                callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
            }

            var sql = "";


            sql = sql + " delete from mensagem ";
            sql = sql + " where ";
            sql = sql + " mcodigo in (" + mensagemModel.mcodigo + ")";


            connection.query(sql,function(err,mensagens){
                connection.release();
                pool.end();
                if(!err) {

                    callback(mensagemModel);
                }
            });

            connection.on('error', function(err) {
                pool.end();
                callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
            });
        });

    };

    return new MensagemBusiness();
})();

module.exports = MensagemBusiness;