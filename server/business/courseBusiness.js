var factory = require("./../factory/dbfactory");

var CourseBusiness = (function() {

    var CourseBusiness = function() {

    };

    CourseBusiness.prototype.select = function(courseModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " SELECT  COU.cor_image, COU.cor_name, COU.cor_description, ";
        sql = sql + " CL.cla_cost,DATE_FORMAT(CT.clt_date, \"%b. %d\") as clt_date  , ";
        sql = sql + " DATE_FORMAT(CT.clt_start_time,\"%l:%i%p\")AS clt_start_time, ";
        sql = sql + " DAYNAME(CT.clt_date) AS week_day,CI.cit_description, PR.pro_code, AG.age_description, ";
        sql = sql + " COL.col_description,CL.cla_min_size, CL.cla_max_size, ";
        sql = sql + " TIMESTAMPDIFF(day,CURDATE(),CL.cla_deadlinE) as cla_deadline, ";
        sql = sql + " CONCAT(US.use_first_name,' ',US.use_last_name ) as use_name, US.use_image, ";
        sql = sql + " (CL.cla_max_size - COALESCE(SUM(CR.use_id),0)) AS spot_left, ";
        sql = sql + " SUM(CT.clt_id) AS number_session ";
        sql = sql + " FROM course COU ";
        sql = sql + " INNER JOIN class CL ON COU.cor_id = CL.cor_id ";
        sql = sql + " INNER JOIN class_time CT ON CL.cla_id = CT.cla_id ";
        sql = sql + " INNER JOIN city CI ON CL.cit_id = CI.cit_id ";
        sql = sql + " INNER JOIN province PR ON CI.pro_id = PR.pro_id ";
        sql = sql + " INNER JOIN user US ON US.use_id = COU.use_id ";
        sql = sql + " INNER JOIN age AG ON CL.age_id = AG.age_id ";
        sql = sql + " INNER JOIN course_level COL ON CL.col_id = COL.col_id ";
        sql = sql + " LEFT JOIN class_register CR ON CL.cla_id = CR.cla_id ";
        sql = sql + " WHERE";
        if(courseModel.cit_id)
          sql = sql + " CI.cit_id = " + courseModel.cit_id + " AND";

        sql = sql + " COU.cor_status = 'A' AND CL.cla_status = 'A' ";


        connection.query(sql,function(err,courses){
            connection.end();
            if(!err) {

                var collectionCourse = courses;

                callback(collectionCourse);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });


    };

    return new CourseBusiness();
})();

module.exports = CourseBusiness;