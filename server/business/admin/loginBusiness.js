var factory = require("./../../factory/dbfactory");

var LoginBusiness = (function() {

    var LoginBusiness = function() {

    };

    LoginBusiness.prototype.signin = function(loginModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " SELECT * ";
        sql = sql + " FROM admin_user";
        sql = sql + " WHERE ";
        sql = sql + " adu_login = '" + loginModel.use_login + "' ";
        sql = sql + " AND adu_password = '" + loginModel.use_password + "'";

        connection.query(sql,function(err,login){
            connection.end();
            if(!err) {

                var collectionUser = login;

                callback(collectionUser);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });


    };

    LoginBusiness.prototype.validateAdmin = function(loginModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " SELECT * ";
        sql = sql + " FROM admin_user";
        sql = sql + " WHERE ";
        sql = sql + " adu_login = '" + loginModel.use_login + "'";
        sql = sql + " AND adu_password_admin = '" + loginModel.use_password + "'";

        connection.query(sql,function(err,login){
            connection.end();
            if(!err) {

                var collectionUser = login;

                callback(collectionUser);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });

    };

    return new LoginBusiness();
})();

module.exports = LoginBusiness;