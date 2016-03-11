var factory = require("./../factory/dbfactory");

var CityBusiness = (function() {

    var CityBusiness = function() {

    };

    CityBusiness.prototype.selectCode = function(cityModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " SELECT COALESCE(cit_id,0) AS cit_id ";
        sql = sql + " FROM city ";
        sql = sql + " WHERE";
        sql = sql + " cit_description = '" + cityModel.cit_description + "'";


        connection.query(sql,function(err,city){
            connection.end();
            if(!err) {

                var collectionCity = city;

                callback(collectionCity);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });


    };

    return new CityBusiness();
})();

module.exports = CityBusiness;