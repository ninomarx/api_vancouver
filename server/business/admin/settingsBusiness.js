var factory = require("./../../factory/dbfactory");

var SettingsBusiness = (function() {

    var SettingsBusiness = function() {

    };

    SettingsBusiness.prototype.select = function(setModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select * from admin_user ";
        sql = sql + " where adu_id = " + setModel.adu_id + ";";

        connection.query(sql,function(err,settings){
            connection.end();
            if(!err) {

                var collectionSettings = settings;

                callback(collectionSettings);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });
    };

    SettingsBusiness.prototype.save = function(setModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " UPDATE admin_user SET ";
        sql = sql + "    adu_email = '" + setModel.adu_email + "', ";
        sql = sql + "    adu_first_name = '" + setModel.adu_first_name + "' ";
        sql = sql + " where adu_id = " + setModel.adu_id + ";";

        connection.query(sql,function(err,settings){
            connection.end();
            if(!err) {

                var collectionSettings = settings;

                callback(collectionSettings);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });
    };

    SettingsBusiness.prototype.savePassword = function(setModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " UPDATE admin_user SET ";
        sql = sql + "    adu_password = '" + setModel.adu_password + "' ";
        sql = sql + " where adu_id = " + setModel.adu_id + ";";

        connection.query(sql,function(err,settings){
            connection.end();
            if(!err) {

                var collectionSettings = settings;

                callback(collectionSettings);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });
    };

    return new SettingsBusiness();
})();

module.exports = SettingsBusiness;