var factory = require("./../factory/dbfactory");
var emailBusiness = require("./../business/emailBusiness");

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
                    sql = sql + " INSERT INTO user (use_login,use_first_name, use_password,use_email,use_image, use_status, use_type, use_registration_date,cit_id, use_facebook) ";
                    sql = sql + " VALUES ";
                    sql = sql + " ('" + loginModel.use_login + "','" + loginModel.use_first_name + "','" + loginModel.use_password + "','" + loginModel.use_login + "','noimage_user.png','A','1',now()," + loginModel.cit_id + ",'" + loginModel.use_facebook + "'); ";

                    connection2.query(sql, function (err, login) {
                        connection2.end();
                        if (!err) {

                            var connection3 = factory.getConnection();
                            connection3.connect();

                            sql = "";
                            sql = sql + " SELECT * ";
                            sql = sql + " FROM user U";
                            sql = sql + " LEFT JOIN  user_instructor UI ON U.use_id = UI.use_id  ";
                            sql = sql + " WHERE ";
                            sql = sql + " use_login = '" + loginModel.use_login + "';";

                            connection3.query(sql, function (err, login) {
                                connection3.end();
                                if (!err) {
                                    emailBusiness.sendEmailConfirmation(loginModel.use_login,loginModel.use_first_name);
                                    ObjReturn = login;
                                    callback(ObjReturn);
                                }
                            });
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
        sql = sql + " FROM user U";
        sql = sql + " LEFT JOIN  user_instructor UI ON U.use_id = UI.use_id  ";
        sql = sql + " WHERE ";
        sql = sql + " use_login = '" + loginModel.use_login + "' ";

        if(loginModel.use_password != "")
            sql = sql + "AND use_password = '" + loginModel.use_password + "'";
        else
            sql = sql + "AND use_facebook = 'S'";



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

    LoginBusiness.prototype.recoverPassword = function(loginModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " SELECT * ";
        sql = sql + " FROM user ";
        sql = sql + " WHERE ";
        sql = sql + " use_login = '" + loginModel.use_login + "' ";


        connection.query(sql,function(err,login){
            if(!err) {

                var collectionUser = login;
                var returnUser = "OK";
                var newPassword = Math.random().toString(36).slice(-8);

                if(collectionUser != undefined && collectionUser.length > 0){

                    sql = "";
                    sql = sql + " UPDATE user";
                    sql = sql + " SET use_password = '" + newPassword + "'";
                    sql = sql + " WHERE ";
                    sql = sql + " use_login = '" + loginModel.use_login + "' ";


                    connection.query(sql,function(err,loginUser){
                        connection.end();
                        if(!err) {

                            returnUser = "OK";
                            emailBusiness.sendPasswordRecovery(loginModel.use_login,collectionUser[0].use_first_name,newPassword);

                        }
                    });
                }
                else
                {
                    returnUser = "COD001";
                }


                callback(returnUser);
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