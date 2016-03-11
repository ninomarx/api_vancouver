var factory = require("./../factory/dbfactory");

var CountryBusiness = (function() {

    var CountryBusiness = function() {};

    CountryBusiness.prototype.save = function(countryModel, callback) {

        var connection = factory.getConnection();

        connection.connect();

        var sql = "";
        sql = sql + " INSERT INTO Country (cou_description, cou_code) ";
        sql = sql + " VALUES ";
        sql = sql + " (";
        sql = sql + "'" + countryModel.cou_description + "', ";
        sql = sql + "'" + countryModel.cou_code + "' ";
        sql = sql + "); ";

        connection.query(sql,function(err,info){
            connection.end();
            if(!err) {
                var result = countryModel.cou_description;
                callback(result);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });


    };

   /* MensagemBusiness.prototype.select = function(countryModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select * ";
        sql = sql + " from Country LIMIT 5 ";


        connection.query(sql,function(err,mensagens){
            connection.end();
            if(!err) {

                var countryModel = mensagens;

                callback(collectionMensagem);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });


    };

    MensagemBusiness.prototype.delete = function(mensagemModel, callback) {

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

    };*/

    return new CountryBusiness();
})();

module.exports = CountryBusiness;