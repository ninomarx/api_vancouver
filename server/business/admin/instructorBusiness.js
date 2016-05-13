var factory = require("./../../factory/dbfactory");

var InstructorBusiness = (function() {

    var InstructorBusiness = function() {

    };

    InstructorBusiness.prototype.select = function(instructorModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select u.use_id, use_image, use_first_name, use_last_name, use_status,use_type,use_email, ";
        sql = sql + " (select count(*) from class where use_id = u.use_id) as classes, ";
        sql = sql + " (select  count(distinct cr.use_id) from class c inner join class_register cr on c.cla_id = cr.cla_id where c.use_id = u.use_id) as students ";
        sql = sql + "         from user U ";
        sql = sql + " inner join user_instructor ui on u.use_id = ui.use_id ";
        sql = sql + " where u.use_type in (2,3); ";

        connection.query(sql,function(err,user){
            connection.end();
            if(!err) {

                var collectionInstructor = user;

                callback(collectionInstructor);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });
    };

    InstructorBusiness.prototype.allowInstructor = function(instructorModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " update user set use_type = " + instructorModel.status + " where use_id = " + instructorModel.use_id + " ;";

        connection.query(sql,function(err,user){
            connection.end();
            if(!err) {

                var collectionInstructor = user;

                callback(collectionInstructor);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });
    };

    return new InstructorBusiness();
})();

module.exports = InstructorBusiness;