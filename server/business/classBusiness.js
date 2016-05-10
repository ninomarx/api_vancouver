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

                        sql = "";

                        classModel.class_time_data.forEach(function (item) {

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

    ClassBusiness.prototype.getClass = function(classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select CL.use_id as use_id_instructor, CL.cla_id,Cl.cor_id, cla_session_type, cla_duration, cla_cost, cla_min_size, cla_max_size, cla_address, ";
        sql = sql + "   cla_status, cla_deadline, cla_allow_lateRegistration, cla_allow_lateWithdraw, cla_lateWithdraw_date, ";
        sql = sql + "   cla_latitude, cla_longitude, clt_date, clt_start_time, clt_address, clt_firstClass, cor_name, cor_description, ";
        sql = sql + "   cor_accreditation, cor_accreditation_description, cor_learn, cor_bring, cor_aware_before, ";
        sql = sql + "   cor_structure, cor_image, cor_added_date, cor_who_isfor, cor_expertise, cor_why_love, ";
        sql = sql + "   cor_style, cor_why_take, CONCAT(US.use_first_name,' ',US.use_last_name ) AS use_name, ";
        sql = sql + "   use_description, use_email, usi_about, usi_expertise, usi_credential, usi_image, ";
        sql = sql + "   usi_coached_before, usi_coached_experience, usi_speaking_groups, usi_speaking_experience, ";
        sql = sql + "   usi_course_experience, COALESCE(SUM(CR.use_id),0) AS students,DATE_FORMAT(CT.clt_date, \"%b. %d\") as dateShow, ";
        sql = sql + "   DATE_FORMAT(CT.clt_start_time,\"%l:%i%p\") AS timeShow, DAYNAME(CT.clt_date) AS dayName, ";
        sql = sql + "   TIMESTAMPDIFF(day,CURDATE(),CL.cla_deadline) as cla_deadline, ";
        sql = sql + "   (CL.cla_max_size - COALESCE(SUM(CR.use_id),0)) AS spot_left, ";
        sql = sql + "   COUNT(CT.clt_id) AS number_session,cit_description,pro_code, age_description, col_description,";
        sql = sql + "   COUNT(CV.cre_id) AS number_reviews,(SUM(cre_stars)/COUNT(CV.cre_id)) star_general";
        if(classModel.use_id != "")
            sql = sql + "      ,COALESCE(WL.wis_status,'N') AS wis_status ";
        sql = sql + " from class CL ";
        sql = sql + "   INNER JOIN class_time CT ON CL.cla_id = CT.cla_id ";
        sql = sql + "   INNER JOIN course CO ON CL.cor_id = CO.cor_id ";
        sql = sql + "   INNER JOIN user US ON CO.use_id = US.use_id ";
        sql = sql + "   INNER JOIN user_instructor UI ON US.use_id = UI.use_id ";
        sql = sql + "   INNER JOIN age AG ON CL.age_id = AG.age_id ";
        sql = sql + "   INNER JOIN course_level LV ON CL.col_id = LV.col_id ";
        sql = sql + "   INNER JOIN city CY ON CL.cit_id = CY.cit_id ";
        sql = sql + "   INNER JOIN province PR ON CY.pro_id = PR.pro_id ";
        sql = sql + "   LEFT JOIN class_register CR ON CL.cla_id = CR.cla_id ";
        sql = sql + "   LEFT JOIN class_review CV ON CL.cla_id = CV.cla_id ";
        if(classModel.use_id != "")
            sql = sql + "   LEFT JOIN wishlist WL ON CL.cla_id = WL.cla_id and WL.use_id = " + classModel.use_id  + " ";
        sql = sql + " where CL.cla_id = " + classModel.cla_id + " AND CT.clt_firstClass = 'Y' ";
        sql = sql + " GROUP BY CO.cor_id, CL.cla_id; ";


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


    ClassBusiness.prototype.getClassComments = function(classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " SELECT cre_id,cre_review,cre_stars,use_image, ";
        sql = sql + " CONCAT(US.use_first_name,' ',US.use_last_name ) AS use_name ";
        sql = sql + " FROM class_review CR ";
        sql = sql + " INNER JOIN user US ON CR.use_id = US.use_id ";
        sql = sql + " where cla_id = " + classModel.cla_id + " and cre_status = 'A' ; ";


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

    ClassBusiness.prototype.getClassTime = function(classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " SELECT DATE_FORMAT(clt_date, \"%b. %d\") as dateShow,DATE_FORMAT(clt_start_time,\"%l:%i%p\") AS timeShow, DAYNAME(clt_date) AS dayName ";
        sql = sql + " FROM class_time ";
        sql = sql + " where cla_id = " + classModel.cla_id + " ; ";

        connection.query(sql, function (err, classObj) {
            connection.end();
            if (!err) {

                var collectionClass = classObj;

                callback(collectionClass);
            }
        });
    };


    ClassBusiness.prototype.otherClassTime = function (classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " SELECT distinct CT.cla_id, DATE_FORMAT(clt_date, \"%b. %d\") as dateShow,DATE_FORMAT(clt_start_time,\"%l:%i%p\") AS timeShow, DAYNAME(clt_date) AS dayName ";
        sql = sql + " FROM class CT ";
        sql = sql + " INNER JOIN class_time C ON CT.cla_id = C.cla_id ";
        sql = sql + " where CT.cor_id = " + classModel.cor_id + "  and clt_firstClass = 'Y' AND CT.cla_status = 'A' and C.clt_date > now() and CT.cla_id <> " +  classModel.cla_id + ";";

        connection.query(sql, function (err, classObj) {
            connection.end();
            if (!err) {

                var collectionClass = classObj;

                callback(collectionClass);
            }
        });
    };

    ClassBusiness.prototype.getClassesAttending = function (classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select *, ";
        sql = sql + " case when sessions > 1 then concat(sessions, ' Sessions') else CONCAT(FLOOR(cla_duration/60),'h',MOD(cla_duration,60),'m')  end as sessions ";
        sql = sql + " from ( ";
        sql = sql + " select c.cla_id,co.cor_image, co.cor_name, ";
        sql = sql + " CONCAT(use_first_name,' ',use_last_name ) as instructor_name,usi_image, ";
        sql = sql + " c.cla_cost, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%b. %d\") clt_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_start_time,\"%l:%i%p\") start_time, ";
        sql = sql + " DATE_FORMAT(clr_added_date, \"%Y-%m-%d\") purchase_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%Y-%m-%d\") clt_date_account, ";
        sql = sql + " DATE_FORMAT(DATE_ADD( ct.clt_start_time, interval c.cla_duration DAY_MINUTE),\"%l:%i%p\") AS final_time, ";
        sql = sql + " case when TIMESTAMPDIFF(day,CURDATE(),ct.clt_date) > 0 then CONCAT('Start in ' ,TIMESTAMPDIFF(day,CURDATE(),ct.clt_date), ' days') else 'Start today' end  as day_until, ";
        sql = sql + " c.cla_address, ";
        sql = sql + " (select count(*) from class_time where cla_id = c.cla_id) as sessions, c.cla_duration ";
        sql = sql + " from class c ";
        sql = sql + " inner join course co on c.cor_id = co.cor_id ";
        sql = sql + " inner join user u on co.use_id = u.use_id ";
        sql = sql + " inner join user_instructor ui on u.use_id = ui.use_id ";
        sql = sql + " inner join class_register cr on c.cla_id = cr.cla_id ";
        sql = sql + " inner join class_time ct on c.cla_id = ct.cla_id ";
        sql = sql + " where cr.use_id = " + classModel.use_id + " ";
        sql = sql + " and ct.clt_firstClass = 'Y' ";
        sql = sql + " and clr_status = 'A' and clr_transaction_status <> 'C' ";
        sql = sql + " and ct.clt_date >= CURDATE()  ) as aux; ";

        connection.query(sql, function (err, classObj) {
            connection.end();
            if (!err) {

                var collectionClass = classObj;

                callback(collectionClass);
            }
        });
    };

    ClassBusiness.prototype.getClassesAttended = function (classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select *, ";
        sql = sql + " case when sessions > 1 then concat(sessions, ' Sessions') else CONCAT(FLOOR(cla_duration/60),'h',MOD(cla_duration,60),'m')  end as sessions ";
        sql = sql + " from ( ";
        sql = sql + " select c.cla_id,co.cor_image, co.cor_name, ";
        sql = sql + " CONCAT(use_first_name,' ',use_last_name ) as instructor_name,usi_image, ";
        sql = sql + " c.cla_cost, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%b. %d\") clt_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_start_time,\"%l:%i%p\") start_time, ";
        sql = sql + " DATE_FORMAT(DATE_ADD( ct.clt_start_time, interval c.cla_duration DAY_MINUTE),\"%l:%i%p\") AS final_time, ";
        sql = sql + " case when TIMESTAMPDIFF(day,CURDATE(),ct.clt_date) > 0 then CONCAT('Start in ' ,TIMESTAMPDIFF(day,CURDATE(),ct.clt_date), ' days') else 'Start today' end  as day_until, ";
        sql = sql + " c.cla_address, cre.cre_id,";
        sql = sql + " (select count(*) from class_time where cla_id = c.cla_id) as sessions, c.cla_duration ";
        sql = sql + " from class c ";
        sql = sql + " inner join course co on c.cor_id = co.cor_id ";
        sql = sql + " inner join user u on co.use_id = u.use_id ";
        sql = sql + " inner join user_instructor ui on u.use_id = ui.use_id ";
        sql = sql + " inner join class_register cr on c.cla_id = cr.cla_id ";
        sql = sql + " inner join class_time ct on c.cla_id = ct.cla_id ";
        sql = sql + " LEFT JOIN class_review cre ON c.cla_id = cre.cla_id AND cre.use_id = " + classModel.use_id + " "
        sql = sql + " where cr.use_id = " + classModel.use_id + " ";
        sql = sql + " and ct.clt_firstClass = 'Y' ";
        sql = sql + " and clr_status = 'A' and clr_transaction_status <> 'C' ";
        sql = sql + " AND cre_id is null ";
        sql = sql + " and ct.clt_date < CURDATE()  ) as aux; ";

        connection.query(sql, function (err, classObj) {
            connection.end();
            if (!err) {

                var collectionClass = classObj;

                callback(collectionClass);
            }
        });
    };

    ClassBusiness.prototype.getAllClassesAttended = function (classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select *, ";
        sql = sql + " case when sessions > 1 then concat(sessions, ' Sessions') else CONCAT(FLOOR(cla_duration/60),'h',MOD(cla_duration,60),'m')  end as sessions ";
        sql = sql + " from ( ";
        sql = sql + " select c.cla_id,co.cor_image, co.cor_name, ";
        sql = sql + " CONCAT(use_first_name,' ',use_last_name ) as instructor_name,usi_image, ";
        sql = sql + " c.cla_cost, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%b. %d\") clt_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_start_time,\"%l:%i%p\") start_time, ";
        sql = sql + " DATE_FORMAT(clr_added_date, \"%Y-%m-%d\") purchase_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%Y-%m-%d\") clt_date_account, ";
        sql = sql + " DATE_FORMAT(DATE_ADD( ct.clt_start_time, interval c.cla_duration DAY_MINUTE),\"%l:%i%p\") AS final_time, ";
        sql = sql + " case when TIMESTAMPDIFF(day,CURDATE(),ct.clt_date) > 0 then CONCAT('Start in ' ,TIMESTAMPDIFF(day,CURDATE(),ct.clt_date), ' days') else 'Start today' end  as day_until, ";
        sql = sql + " c.cla_address, cre.cre_id,";
        sql = sql + " (select count(*) from class_time where cla_id = c.cla_id) as sessions, c.cla_duration ";
        sql = sql + " from class c ";
        sql = sql + " inner join course co on c.cor_id = co.cor_id ";
        sql = sql + " inner join user u on co.use_id = u.use_id ";
        sql = sql + " inner join user_instructor ui on u.use_id = ui.use_id ";
        sql = sql + " inner join class_register cr on c.cla_id = cr.cla_id ";
        sql = sql + " inner join class_time ct on c.cla_id = ct.cla_id ";
        sql = sql + " LEFT JOIN class_review cre ON c.cla_id = cre.cla_id AND cre.use_id = " + classModel.use_id + " "
        sql = sql + " where cr.use_id = " + classModel.use_id + " ";
        sql = sql + " and ct.clt_firstClass = 'Y' ";
        sql = sql + " and clr_status = 'A' and clr_transaction_status <> 'C' ";
        sql = sql + " and ct.clt_date < CURDATE()  ) as aux; ";

        connection.query(sql, function (err, classObj) {
            connection.end();
            if (!err) {

                var collectionClass = classObj;

                callback(collectionClass);
            }
        });
    };

    ClassBusiness.prototype.getClassesCancelled = function (classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select *, ";
        sql = sql + " case when sessions > 1 then concat(sessions, ' Sessions') else CONCAT(FLOOR(cla_duration/60),'h',MOD(cla_duration,60),'m')  end as sessions ";
        sql = sql + " from ( ";
        sql = sql + " select c.cla_id,co.cor_image, co.cor_name, ";
        sql = sql + " CONCAT(use_first_name,' ',use_last_name ) as instructor_name,usi_image, ";
        sql = sql + " c.cla_cost, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%b. %d\") clt_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_start_time,\"%l:%i%p\") start_time, ";
        sql = sql + " DATE_FORMAT(clr_added_date, \"%Y-%m-%d\") purchase_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%Y-%m-%d\") clt_date_account, ";
        sql = sql + " DATE_FORMAT(clr_cancel_date, \"%Y-%m-%d\") clr_cancel_date, ";
        sql = sql + " DATE_FORMAT(DATE_ADD( ct.clt_start_time, interval c.cla_duration DAY_MINUTE),\"%l:%i%p\") AS final_time, ";
        sql = sql + " case when TIMESTAMPDIFF(day,CURDATE(),ct.clt_date) > 0 then CONCAT('Start in ' ,TIMESTAMPDIFF(day,CURDATE(),ct.clt_date), ' days') else 'Start today' end  as day_until, ";
        sql = sql + " c.cla_address, cre.cre_id,";
        sql = sql + " (select count(*) from class_time where cla_id = c.cla_id) as sessions, c.cla_duration ";
        sql = sql + " from class c ";
        sql = sql + " inner join course co on c.cor_id = co.cor_id ";
        sql = sql + " inner join user u on co.use_id = u.use_id ";
        sql = sql + " inner join user_instructor ui on u.use_id = ui.use_id ";
        sql = sql + " inner join class_register cr on c.cla_id = cr.cla_id ";
        sql = sql + " inner join class_time ct on c.cla_id = ct.cla_id ";
        sql = sql + " LEFT JOIN class_review cre ON c.cla_id = cre.cla_id AND cre.use_id = " + classModel.use_id + " "
        sql = sql + " where cr.use_id = " + classModel.use_id + " ";
        sql = sql + " and ct.clt_firstClass = 'Y' ";
        sql = sql + " and clr_status = 'I' and clr_transaction_status = 'C' ";
        sql = sql + " and ct.clt_date < CURDATE()  ) as aux; ";

        connection.query(sql, function (err, classObj) {
            connection.end();
            if (!err) {

                var collectionClass = classObj;

                callback(collectionClass);
            }
        });
    };

    ClassBusiness.prototype.getClassesTeaching = function (classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";

        sql = sql + " select *, ";
        sql = sql + " case when sessions > 1 then concat(sessions, ' Sessions') else CONCAT(FLOOR(cla_duration/60),'h',MOD(cla_duration,60),'m')  end as sessions, ";
        sql = sql + " (students*cla_cost) gross, ";
        sql = sql + " concat(students,'/',cla_max_size) students, ";
        sql = sql + " case when students >= cla_min_size then ' - Class is on!' else '' end classOn ";
        sql = sql + " from ( ";
        sql = sql + " select c.cla_id,co.cor_image, co.cor_name, co.cor_id,";
        sql = sql + " CONCAT(use_first_name,' ',use_last_name ) as instructor_name, ";
        sql = sql + " usi_image, ";
        sql = sql + " c.cla_cost, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%b. %d\") clt_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%Y-%m-%d\") clt_date_account, ";
        sql = sql + " DATE_FORMAT(ct.clt_start_time,\"%l:%i%p\") start_time, ";
        sql = sql + " DATE_FORMAT(DATE_ADD( ct.clt_start_time, interval c.cla_duration DAY_MINUTE),\"%l:%i%p\") AS final_time, ";
        sql = sql + " case when TIMESTAMPDIFF(day,CURDATE(),ct.clt_date) > 0 then CONCAT('Start in ' ,TIMESTAMPDIFF(day,CURDATE(),ct.clt_date), ' days') else 'Start today' end as day_until, ";
        sql = sql + " c.cla_address, ";
        sql = sql + " (select count(*) from class_time where cla_id = c.cla_id) as sessions, c.cla_duration, ";
        sql = sql + " (select count(*) from class_register where cla_id = c.cla_id) students, ";
        sql = sql + " (select coalesce(sum(clr_instructor_value),0) from class_register where cla_id = c.cla_id) clr_instructor_value, ";
        sql = sql + " c.cla_max_size, c.cla_min_size ";
        sql = sql + " from class c ";
        sql = sql + " inner join course co on c.cor_id = co.cor_id ";
        sql = sql + " inner join user u on co.use_id = u.use_id ";
        sql = sql + " inner join user_instructor ui on u.use_id = ui.use_id ";
        sql = sql + " left join class_register cr on c.cla_id = cr.cla_id ";
        sql = sql + " inner join class_time ct on c.cla_id = ct.cla_id ";
        sql = sql + " where co.use_id = " + classModel.use_id + " ";
        sql = sql + " and ct.clt_firstClass = 'Y' ";
        sql = sql + " and ct.clt_date >= CURDATE() ";
        sql = sql + " ) as aux; ";

        connection.query(sql, function (err, classObj) {
            connection.end();
            if (!err) {

                var collectionClass = classObj;

                callback(collectionClass);
            }
        });
    };

    ClassBusiness.prototype.getClassesTaught = function (classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";

        sql = sql + " select *, ";
        sql = sql + " case when sessions > 1 then concat(sessions, ' Sessions') else CONCAT(FLOOR(cla_duration/60),'h',MOD(cla_duration,60),'m')  end as sessions, ";
        sql = sql + " concat(students,'/',cla_max_size) students, ";
        sql = sql + " case when students >= cla_min_size then ' - Class is on!' else '' end classOn ";
        sql = sql + " from ( ";
        sql = sql + " select c.cla_id,co.cor_image, co.cor_name, ";
        sql = sql + " CONCAT(use_first_name,' ',use_last_name ) as instructor_name, ";
        sql = sql + " usi_image, ";
        sql = sql + " c.cla_cost, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%b. %d\") clt_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%Y-%m-%d\") clt_date_account, ";
        sql = sql + " DATE_FORMAT(ct.clt_start_time,\"%l:%i%p\") start_time, ";
        sql = sql + " DATE_FORMAT(DATE_ADD( ct.clt_start_time, interval c.cla_duration DAY_MINUTE),\"%l:%i%p\") AS final_time, ";
        sql = sql + " case when TIMESTAMPDIFF(day,CURDATE(),ct.clt_date) > 0 then CONCAT('Start in ' ,TIMESTAMPDIFF(day,CURDATE(),ct.clt_date), ' days') else 'Start today' end as day_until, ";
        sql = sql + " c.cla_address, ";
        sql = sql + " (select count(*) from class_time where cla_id = c.cla_id) as sessions, c.cla_duration, ";
        sql = sql + " (select count(*) from class_register where cla_id = c.cla_id) students, ";
        sql = sql + " (select coalesce(sum(clr_instructor_value),0) from class_register where cla_id = c.cla_id) clr_instructor_value, ";
        sql = sql + " c.cla_max_size, c.cla_min_size ";
        sql = sql + " from class c ";
        sql = sql + " inner join course co on c.cor_id = co.cor_id ";
        sql = sql + " inner join user u on co.use_id = u.use_id ";
        sql = sql + " inner join user_instructor ui on u.use_id = ui.use_id ";
        sql = sql + " left join class_register cr on c.cla_id = cr.cla_id ";
        sql = sql + " inner join class_time ct on c.cla_id = ct.cla_id ";
        sql = sql + " where co.use_id = " + classModel.use_id + " ";
        sql = sql + " and ct.clt_firstClass = 'Y' ";
        sql = sql + " and ct.clt_date < CURDATE() ";
        sql = sql + " ) as aux; ";

        connection.query(sql, function (err, classObj) {
            connection.end();
            if (!err) {

                var collectionClass = classObj;

                callback(collectionClass);
            }
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