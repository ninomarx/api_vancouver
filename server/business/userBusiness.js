var factory = require("./../factory/dbfactory");
var utilBusiness = require("./../business/utilBusiness");

var UserBusiness = (function() {

    var UserBusiness = function() {

    };

    UserBusiness.prototype.saveStudent = function(userModel, callback) {

        utilBusiness.processData(userModel, function(obj){
            userModel = obj;
        });

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " UPDATE user SET ";
        sql = sql + " use_first_name = '" + userModel.use_first_name + "',";
        sql = sql + " use_last_name = '" + userModel.use_last_name + "',";
        sql = sql + " use_zip_postal_code = '" + userModel.use_zip_postal_code + "',";
        sql = sql + " use_description = '" + userModel.use_description + "',";
        sql = sql + " use_want_learn = '" + userModel.use_want_learn + "',";
        sql = sql + " use_image = '" + userModel.use_image + "'";
        sql = sql + " WHERE ";
        sql = sql + " use_id = " + userModel.use_id + "";


        connection.query(sql,function(err,user){
            connection.end();
            if(!err) {
                callback(user);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });

    };

    UserBusiness.prototype.saveInstructor = function(userModel, callback) {

        utilBusiness.processData(userModel, function(obj){
            userModel = obj;
        });

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " UPDATE user_instructor SET ";
        sql = sql + " usi_about = '" + userModel.usi_about + "',";
        sql = sql + " usi_expertise = '" + userModel.usi_expertise + "',";
        sql = sql + " usi_credential = '" + userModel.usi_credential + "',";
        sql = sql + " usi_image = '" + userModel.usi_image + "'";
        sql = sql + " WHERE ";
        sql = sql + " use_id = " + userModel.use_id + "";


        connection.query(sql,function(err,user){
            connection.end();
            if(!err) {
                callback(user);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });
    };

    UserBusiness.prototype.saveEmail = function(userModel, callback) {

        utilBusiness.processData(userModel, function(obj){
            userModel = obj;
        });

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " UPDATE user SET ";
        sql = sql + " use_login = '" + userModel.use_email + "',";
        sql = sql + " use_email = '" + userModel.use_email + "'";
        sql = sql + " WHERE ";
        sql = sql + " use_id = " + userModel.use_id + "";


        connection.query(sql,function(err,user){
            connection.end();
            if(!err) {
                callback(user);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });
    };

    UserBusiness.prototype.savePassword = function(userModel, callback) {

        utilBusiness.processData(userModel, function(obj){
            userModel = obj;
        });

        UserBusiness.prototype.criptPassword(userModel.password, function(obj){
            userModel.password = obj;
        });

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " UPDATE user SET ";
        sql = sql + " use_password = '" + userModel.password + "' ";
        sql = sql + " WHERE ";
        sql = sql + " use_id = " + userModel.use_id + "";


        connection.query(sql,function(err,user){
            connection.end();
            if(!err) {
                callback(user);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });
    };

    UserBusiness.prototype.criptPassword = function(password, callback) {
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

    return new UserBusiness();
})();

module.exports = UserBusiness;