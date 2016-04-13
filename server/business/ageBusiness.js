var factory = require("./../factory/dbfactory");

var AgeBusiness = (function() {

    var AgeBusiness = function() {

    };

    AgeBusiness.prototype.select = function(ageModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " SELECT * ";
        sql = sql + " FROM age ;";

        connection.query(sql,function(err,age){
            connection.end();
            if(!err) {

                var collectionAge = age;

                callback(collectionAge);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });


    };

    return new AgeBusiness();
})();

module.exports = AgeBusiness;