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

    UserBusiness.prototype.saveInstructorSignUp = function(userModel, callback) {

        utilBusiness.processData(userModel, function(obj){
            userModel = obj;
        });

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " UPDATE user_instructor SET ";
        sql = sql + " usi_about = '" + userModel.usi_about + "',";
        sql = sql + " usi_coached_before = '" + userModel.usi_coached_before + "',";
        sql = sql + " usi_coached_experience = '" + userModel.usi_coached_experience + "',";
        sql = sql + " usi_speaking_groups = '" + userModel.usi_speaking_groups + "',";
        sql = sql + " usi_speaking_groups = '" + userModel.usi_speaking_experience + "'";
        sql = sql + " WHERE ";
        sql = sql + " use_id = " + userModel.use_id + "; ";

        /*sql = sql + " UPDATE user SET ";
        sql = sql + " use_type = 3";
        sql = sql + " WHERE ";
        sql = sql + " use_id = " + userModel.use_id + "; ";*/

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

    UserBusiness.prototype.saveSetting = function(userModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select use_id from user where";
        sql = sql + " use_confirm_email_code = '" + userModel.use_id + "';";

        connection.query(sql,function(err,user){
            if(!err) {

                sql = "";
                sql = sql + " UPDATE user SET ";
                sql = sql + " use_update_category = '" + userModel.updateCategory + "', ";
                sql = sql + " use_confirm_email = 'Y' ";
                sql = sql + " WHERE ";
                sql = sql + " use_confirm_email_code = '" + userModel.use_id + "';";

                userModel.category.forEach(function(item) {
                        sql = sql + " INSERT INTO user_interests (cat_id, use_id) VALUES (" + item + "," + user[0].use_id + " ); ";
                    }
                )

                userModel.tags.forEach(function(item) {
                        sql = sql + " INSERT INTO user_tags (use_id,uta_tag) VALUES (" + user[0].use_id + ",'" + item + "' ); ";
                    }
                )

                connection.query(sql,function(err,user){
                    connection.end();
                    if(!err) {
                        callback(user);
                    }
                });
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });
    };

    UserBusiness.prototype.updateSetting = function(userModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";

        sql = sql + " UPDATE user SET ";
        sql = sql + " use_update_category = '" + userModel.updateCategory + "' ";
        sql = sql + " WHERE ";
        sql = sql + " use_id = '" + userModel.use_id + "';";

        sql = sql + " DELETE FROM user_interests WHERE use_id = " + userModel.use_id + "; ";
        sql = sql + " DELETE FROM user_tags WHERE use_id = " + userModel.use_id + "; ";

        userModel.category.forEach(function(item) {
                sql = sql + " INSERT INTO user_interests (cat_id, use_id) VALUES (" + item + "," + userModel.use_id + " ); ";
            }
        )

        userModel.tags.forEach(function(item) {
                sql = sql + " INSERT INTO user_tags (use_id,uta_tag) VALUES (" + userModel.use_id + ",'" + item + "' ); ";
            }
        )

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

    UserBusiness.prototype.getCategorySetting = function(userModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";

        sql = sql + " SELECT * FROM user_interests ";
        sql = sql + " WHERE ";
        sql = sql + " use_id = '" + userModel.use_id + "';";

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

    UserBusiness.prototype.getTagsSetting = function(userModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";

        sql = sql + " SELECT * FROM user_tags ";
        sql = sql + " WHERE ";
        sql = sql + " use_id = '" + userModel.use_id + "';";

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

    return new UserBusiness();
})();

module.exports = UserBusiness;