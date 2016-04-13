var factory = require("./../factory/dbfactory");

var ClassBusiness = (function() {

    var ClassBusiness = function() {

    };

    ClassBusiness.prototype.getClassMultiple = function(classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " SELECT clt_date AS date, clt_start_time AS time, clt_address AS address, clt_id AS index_ ";
        sql = sql + " FROM class C";
        sql = sql + " INNER JOIN class_time CT ON C.cla_id = CT.cla_id ";
        sql = sql + " WHERE C.cla_id =  " + classModel.cla_id + " AND clt_firstClass = 'N'; ";


        connection.query(sql,function(err,classObj){
            connection.end();
            if(!err) {

                var collectionClass = classObj;

                callback(collectionClass);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });


    };

    ClassBusiness.prototype.save = function(classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var d = new Date();
        classModel.cla_added_date = d.getDate();

        var sql = "";
        if(classModel.cla_id != "")
        {
            sql = sql + " UPDATE class SET ";
            sql = sql + " cla_session_type = '" + classModel.cla_session_type + "',";
            sql = sql + " cla_duration = '" + classModel.cla_duration + "',";
            sql = sql + " cla_cost = '" + classModel.cla_cost + "',";
            sql = sql + " cla_min_size = '" + classModel.cla_min_size + "',";
            sql = sql + " cla_max_size = '" + classModel.cla_max_size + "',";
            sql = sql + " cla_address = '" + classModel.cla_address + "',";
            sql = sql + " cla_added_date = '" + classModel.cla_added_date + "',";
            sql = sql + " cla_status = '" + classModel.cla_status + "',";
            sql = sql + " cla_deadline = '" + classModel.cla_deadline + "',";
            sql = sql + " cla_allow_lateRegistration = '" + classModel.cla_allow_lateRegistration + "',";
            sql = sql + " cla_allow_lateWithdraw = '" + classModel.cla_allow_lateWithdraw + "',";
            sql = sql + " cla_lateWithdraw_date = '" + classModel.cla_lateWithdraw_date + "',";
            sql = sql + " age_id = '" + classModel.age_id + "',";
            sql = sql + " col_id = '" + classModel.col_id + "',";
            sql = sql + " cit_id = '" + classModel.cit_id + "',";
            sql = sql + " cor_id = '" + classModel.cor_id + "',";
            sql = sql + " use_id = '" + classModel.use_id + "',";
            sql = sql + " nei_id = '" + classModel.nei_id + "',";
            sql = sql + " cla_latitude = '" + classModel.latitude + "',";
            sql = sql + " cla_longitude = '" + classModel.longitude + "'";
            sql = sql + " WHERE ";
            sql = sql + " cla_id = " + classModel.cla_id + ";";
        }
        else{

            sql = sql + " INSERT INTO class (cla_session_type,cla_duration,cla_cost,cla_min_size, ";
            sql = sql + " cla_max_size,cla_address,cla_added_date,cla_status,cla_deadline, ";
            sql = sql + " cla_allow_lateRegistration,cla_allow_lateWithdraw,cla_lateWithdraw_date, ";
            sql = sql + " age_id,col_id,cit_id,cor_id,use_id,nei_id,cla_latitude,cla_longitude) ";
            sql = sql + " VALUES (";
            sql = sql + " '" + classModel.cla_session_type + "',";
            sql = sql + " '" + classModel.cla_duration + "','"  + classModel.cla_cost + "',";
            sql = sql + " '" + classModel.cla_min_size + "','"  + classModel.cla_max_size + "',";
            sql = sql + " '" + classModel.cla_address + "','"  + classModel.cla_added_date + "',";
            sql = sql + " '" + classModel.cla_status + "','"  + classModel.cla_deadline + "',";
            sql = sql + " '" + classModel.cla_allow_lateRegistration + "','"  + classModel.cla_allow_lateWithdraw + "',";
            sql = sql + " '" + classModel.cla_lateWithdraw_date + "','"  + classModel.age_id + "',";
            sql = sql + " '" + classModel.col_id + "','"  + classModel.cit_id + "',";
            sql = sql + " '" + classModel.cor_id + "','"  + classModel.use_id + "',";
            sql = sql + " '" + classModel.nei_id + "','" + classModel.latitude + "','" +  classModel.longitude + "'";
            sql = sql + " );";
        }

        connection.query(sql,function(err,classObj){
            if(!err) {

                if(classModel.cla_id != "") {
                    sql = "";
                    sql = sql + " DELETE  FROM class_time ";
                    sql = sql + " WHERE ";
                    sql = sql + " cla_id = " + classModel.cla_id + ";";
                }else{
                    sql = "";
                    sql = sql + " DELETE  FROM class_time ";
                    sql = sql + " WHERE ";
                    sql = sql + " cla_id = " + classObj.insertId + ";";

                    classModel.cla_id =  classObj.insertId;
                }

                connection.query(sql,function(err,classObj1){
                    if(!err) {

                        classModel.class_time_data.forEach(function (item) {

                            sql = "";
                            sql = sql + " INSERT INTO class_time (clt_date,clt_start_time,cla_id,clt_address,clt_firstClass) ";
                            sql = sql + " VALUES ('" + item.clt_date + "', ";
                            sql = sql + " '" + item.clt_start_time + "', ";
                            sql = sql + " " + classModel.cla_id + ", ";
                            sql = sql + " " + item.clt_address + " ,";
                            sql = sql + " '" + item.clt_firstClass + "' ";
                            sql = sql + " ); ";

                        });

                        connection.query(sql, function (err, classObj2) {
                            connection.end();
                            if (!err) {
                                callback("OK");
                            }
                        });
                    }

                });
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });

    };

    ClassBusiness.prototype.postClass = function(classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " UPDATE class SET cla_status = 'A' WHERE cla_id = " + classModel.cla_id + ";";

        connection.query(sql,function(err,classObj){
            connection.end();
            if(!err) {

                var collectionClass = classObj;

                callback(collectionClass);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });


    };

    Date.prototype.yyyymmdd = function() {
        var yyyy = this.getFullYear().toString();
        var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
        var dd  = this.getDate().toString();
        return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
    };

    return new ClassBusiness();
})();

module.exports = ClassBusiness;