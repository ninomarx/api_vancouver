var factory = require("./../factory/dbfactory");

var LevelBusiness = (function() {

    var LevelBusiness = function() {

    };

    LevelBusiness.prototype.select = function(levelModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " SELECT * ";
        sql = sql + " FROM course_level; ";

        connection.query(sql,function(err,level){
            connection.end();
            if(!err) {

                var collectionLevel = level;

                callback(collectionLevel);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });


    };

    return new LevelBusiness();
})();

module.exports = LevelBusiness;