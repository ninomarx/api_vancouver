var factory = require("./../factory/dbfactory");

var ProvinceBusiness = (function() {

    var ProvinceBusiness = function() {

    };

    ProvinceBusiness.prototype.select = function(provinceModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " SELECT *";
        sql = sql + " FROM province ";

        connection.query(sql,function(err,province){
            connection.end();
            if(!err) {

                var collectionProvince = province;

                callback(collectionProvince);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });


    };

    return new ProvinceBusiness();
})();

module.exports = ProvinceBusiness;