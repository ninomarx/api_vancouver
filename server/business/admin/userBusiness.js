var factory = require("./../../factory/dbfactory");

var UserBusiness = (function() {

    var UserBusiness = function() {

    };

    UserBusiness.prototype.select = function(userModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select u.use_id, use_image, use_first_name, use_last_name, use_status, ";
        sql = sql + " use_email,'Cotuto' source,date_format(use_registration_date,'%Y-%m-%d') date,";
        sql = sql + " case when use_update_category = 'Y' then 'Yes' else 'No' end as use_update_category ";
        sql = sql + " from user U ";
        sql = sql + " where u.use_type = 1; ";

        connection.query(sql,function(err,user){
            connection.end();
            if(!err) {

                var collectionUser = user;

                callback(collectionUser);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });
    };

    UserBusiness.prototype.allowUser = function(userModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " update user set use_status = '" + userModel.status + "' where use_id = " + userModel.use_id + " ;";

        connection.query(sql,function(err,user){
            connection.end();
            if(!err) {

                var collectionUser = user;

                callback(collectionUser);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });
    };

    return new UserBusiness();
})();

module.exports = UserBusiness;