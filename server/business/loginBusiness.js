var factory = require("./../factory/dbfactory");

var LoginBusiness = (function() {

    var LoginBusiness = function() {

    };

    LoginBusiness.prototype.signup = function(loginModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var ObjReturn = "";
        var sql = "";
        var collectionLogin = [];

        sql = sql + " SELECT * ";
        sql = sql + " FROM user ";
        sql = sql + " WHERE ";
        sql = sql + " use_login = '" + loginModel.use_login + "'";

        connection.query(sql,function(err,login){
            connection.end();
            if(!err) {

                collectionLogin = login;

                if (collectionLogin.length > 0) {
                    ObjReturn = "COD001";
                    callback(ObjReturn);
                }
                else{

                    var connection2 = factory.getConnection();
                    connection2.connect();


                    sql = "";
                    sql = sql + " INSERT INTO user (use_login, use_password,use_email, use_status, use_type, use_registration_date,cit_id) ";
                    sql = sql + " VALUES ";
                    sql = sql + " ('" + loginModel.use_login + "','" + loginModel.use_password + "','" + loginModel.use_login + "','A','1',now()," + loginModel.cit_id + ") ";


                    connection2.query(sql, function (err, login) {
                        connection2.end();
                        if (!err) {

                            ObjReturn = "OK";

                            callback(ObjReturn);
                        }
                    });

                    connection2.on('error', function(err) {
                        connection.end();
                        callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
                    });

                }

            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });

    };

    LoginBusiness.prototype.signin = function(loginModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " SELECT * ";
        sql = sql + " FROM user ";
        sql = sql + " WHERE ";
        sql = sql + " use_login = '" + loginModel.use_login + "' AND";
        sql = sql + " use_password = '" + loginModel.use_password + "'";



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