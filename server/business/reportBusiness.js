var factory = require("./../factory/dbfactory");

var ReportBusiness = (function() {

    var ReportBusiness = function() {

    };

    ReportBusiness.prototype.saveReport = function(reportModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " INSERT INTO report_user (reu_option,reu_desc,use_id) VALUES ( ";
        sql = sql + " " + reportModel.reu_option + ", ";
        sql = sql + " '" + reportModel.reu_desc.replace(/'/g, "\\'") + "', ";
        sql = sql + " " + reportModel.use_id + " ";
        sql = sql + " ); ";




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

    return new ReportBusiness();
})();

module.exports = ReportBusiness;