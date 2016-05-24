var factory = require("./../factory/dbfactory");
var emailBusiness = require("./../business/emailBusiness");

var LoginBusiness = (function() {

    var LoginBusiness = function() {

    };

    LoginBusiness.prototype.signup = function(loginModel, callback) {

        LoginBusiness.prototype.criptPassword(loginModel.use_password, function(obj){
            loginModel.use_password = obj;
        });

        var connection = factory.getConnection();
        connection.connect();

        var ObjReturn = "";
        var collectionLogin = [];

        var sql = "";
        sql = sql + " SELECT * ";
        sql = sql + " FROM user ";
        sql = sql + " WHERE ";
        sql = sql + " use_login = '" + loginModel.use_login + "'; ";

        connection.query(sql,function(err,login){
            if(!err) {

                collectionLogin = login;

                if (collectionLogin.length > 0)
                {
                    ObjReturn = "COD001";
                    callback(ObjReturn);
                }
                else
                {
                    var codeUser = Math.random().toString(36).slice(-12);

                    sql = "";
                    sql = sql + " INSERT INTO user (use_login,use_first_name, use_password,use_email,use_image, use_status, use_type, use_registration_date,cit_id, use_facebook, use_confirm_email_code) ";
                    sql = sql + " VALUES ";
                    sql = sql + " ('" + loginModel.use_login + "','" + loginModel.use_first_name + "','" + loginModel.use_password + "','" + loginModel.use_login + "','noimage_user.png','A','1',now()," + loginModel.cit_id + ",'" + loginModel.use_facebook + "', + '" + codeUser + "'); ";

                    connection.query(sql, function (err, login2) {
                        if (!err) {

                            sql = "";
                            sql = sql + " INSERT INTO user_instructor (usi_about,usi_expertise,usi_credential,usi_image,usi_coached_before,usi_coached_experience,usi_speaking_groups, usi_speaking_experience,use_id, com_id) ";
                            sql = sql + " VALUES ";
                            sql = sql + " ('','','','noimage_user.png','','','','','" + login2.insertId + "', ''); ";


                            connection.query(sql, function (err, login3) {
                                if (!err)
                                {
                                    sql = "";
                                    sql = sql + " SELECT * ";
                                    sql = sql + " FROM user U";
                                    sql = sql + " LEFT JOIN  user_instructor UI ON U.use_id = UI.use_id  ";
                                    sql = sql + " WHERE ";
                                    sql = sql + " use_login = '" + loginModel.use_login + "';";

                                    connection.query(sql, function (err, login4) {
                                        connection.end();
                                        if (!err) {

                                            var url = loginModel.url + codeUser + '/Q!rA3R55';

                                            emailBusiness.sendEmailConfirmation(loginModel.use_login,loginModel.use_first_name,url);
                                            ObjReturn = login4;
                                            callback(ObjReturn);
                                        }
                                    });
                                }
                            });
                        }
                    });

                }

            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });

    };

    LoginBusiness.prototype.signin = function(loginModel, callback) {

        LoginBusiness.prototype.criptPassword(loginModel.use_password, function(obj){
            loginModel.use_password = obj;
        });

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
                var newPasswordSend = newPassword;

                LoginBusiness.prototype.criptPassword(newPassword, function(obj){
                    newPassword = obj;
                });

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
                            emailBusiness.sendPasswordRecovery(loginModel.use_login,collectionUser[0].use_first_name,newPasswordSend);

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

    LoginBusiness.prototype.signupAdmin = function(loginModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var ObjReturn = "";
        var collectionLogin = [];

        var sql = "";
        sql = sql + " SELECT * ";
        sql = sql + " FROM user ";
        sql = sql + " WHERE ";
        sql = sql + " use_login = '" + loginModel.use_login + "'; ";

        connection.query(sql,function(err,login){
            if(!err) {

                collectionLogin = login;

                if (collectionLogin.length > 0)
                {
                    ObjReturn = "COD001";
                    callback(ObjReturn);
                }
                else
                {
                    var codeUser = Math.random().toString(36).slice(-12);

                    var newPassword = Math.random().toString(36).slice(-8);
                    var newPasswordSend = newPassword;

                    LoginBusiness.prototype.criptPassword(newPassword, function(obj){
                        newPassword = obj;
                    });

                    sql = "";
                    sql = sql + " INSERT INTO user (use_login,use_first_name, use_password,use_email,use_image, use_status, use_type, use_registration_date,cit_id, use_facebook, use_confirm_email_code) ";
                    sql = sql + " VALUES ";
                    sql = sql + " ('" + loginModel.use_login + "','" + loginModel.use_first_name + "','" + newPassword + "','" + loginModel.use_login + "','noimage_user.png','A','1',now()," + loginModel.cit_id + ",'N', + '" + codeUser + "'); ";

                    connection.query(sql, function (err, login2) {
                        if (!err) {

                            sql = "";
                            sql = sql + " INSERT INTO user_instructor (usi_about,usi_expertise,usi_credential,usi_image,usi_coached_before,usi_coached_experience,usi_speaking_groups, usi_speaking_experience,use_id, com_id) ";
                            sql = sql + " VALUES ";
                            sql = sql + " ('','','','noimage_user.png','','','','','" + login2.insertId + "', ''); ";


                            connection.query(sql, function (err, login3) {
                                if (!err)
                                {
                                    sql = "";
                                    sql = sql + " SELECT * ";
                                    sql = sql + " FROM user U";
                                    sql = sql + " LEFT JOIN  user_instructor UI ON U.use_id = UI.use_id  ";
                                    sql = sql + " WHERE ";
                                    sql = sql + " use_login = '" + loginModel.use_login + "';";

                                    connection.query(sql, function (err, login4) {
                                        connection.end();
                                        if (!err) {

                                            var url = 'https://www.cotuto.com/#/home/' + codeUser + '/Q!rA3R55';

                                            emailBusiness.sendEmailConfirmationAdmin(loginModel.use_login,newPasswordSend,url);
                                            ObjReturn = login4;
                                            callback(ObjReturn);
                                        }
                                    });
                                }
                            });
                        }
                    });

                }

            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });

    };

    LoginBusiness.prototype.criptPassword = function(password, callback) {
        var mensx = "";
        var l;
        var i;
        var j=0;
        var ch;
        ch = "assbdFbdpdPdpfPdAAdpeoseslsQQEcDDldiVVkadiedkdkLLnm";

        for (i=0;i<password.length; i++){
            j++;
            l=((password.substr(i,1))+((ch.substr(j,1))));
            if (j==50){
                j=1;
            }
            if (l>255){
                l-=256;
            }
            mensx+=((l));
        }
        callback(mensx);
    }

    return new LoginBusiness();
})();

module.exports = LoginBusiness;