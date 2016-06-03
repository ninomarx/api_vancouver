var factory = require("./../factory/dbfactory");

var ClassBusiness = (function() {

    var ClassBusiness = function() {

    };

    ClassBusiness.prototype.getClassMultiple = function(classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " SELECT clt_date AS date,DATE_FORMAT(clt_start_time,\"%l:%i %p\") AS time, clt_address AS address, @rownum:=@rownum+1  AS 'index' ";
        sql = sql + " FROM class C";
        sql = sql + " INNER JOIN class_time CT ON C.cla_id = CT.cla_id ";
        sql = sql + " ,(SELECT @rownum := 0) r ";
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
            sql = sql + " cla_address = '" + classModel.cla_address.replace(/'/g, "\\'") + "',";
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
            sql = sql + " age_id,col_id,cit_id,cor_id,use_id,nei_id,cla_latitude,cla_longitude,cla_link) ";
            sql = sql + " VALUES (";
            sql = sql + " '" + classModel.cla_session_type + "',";
            sql = sql + " '" + classModel.cla_duration + "','"  + classModel.cla_cost + "',";
            sql = sql + " '" + classModel.cla_min_size + "','"  + classModel.cla_max_size + "',";
            sql = sql + " '" + classModel.cla_address.replace(/'/g, "\\'") + "','"  + classModel.cla_added_date + "',";
            sql = sql + " '" + classModel.cla_status + "','"  + classModel.cla_deadline + "',";
            sql = sql + " '" + classModel.cla_allow_lateRegistration + "','"  + classModel.cla_allow_lateWithdraw + "',";
            sql = sql + " '" + classModel.cla_lateWithdraw_date + "','"  + classModel.age_id + "',";
            sql = sql + " '" + classModel.col_id + "','"  + classModel.cit_id + "',";
            sql = sql + " '" + classModel.cor_id + "','"  + classModel.use_id + "',";
            sql = sql + " '" + classModel.nei_id + "','" + classModel.latitude + "','" +  classModel.longitude + "',''";
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

                    var newCode = Math.random().toString(36).slice(-12);
                    classModel.cla_link = classModel.cla_link + classObj.insertId + "/" + newCode;

                    sql = sql + " UPDATE class set cla_link = '" + classModel.cla_link + "', cla_codSource = '" + newCode + "'  WHERE cla_id = " + classObj.insertId + "; ";

                    classModel.cla_id =  classObj.insertId;
                }

                connection.query(sql,function(err,classObj1){
                    if(!err) {

                        sql = "";

                        classModel.class_time_data.forEach(function (item) {

                            sql = sql + " INSERT INTO class_time (clt_date,clt_start_time,cla_id,clt_address,clt_firstClass) ";
                            sql = sql + " VALUES ('" + item.clt_date + "', ";
                            sql = sql + " TIME( STR_TO_DATE( '" + item.clt_start_time + "', '%h:%i %p' ) ), ";
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
        sql = sql + " SELECT *, ";
        sql = sql + " case ";
        sql = sql + " when number_session > 1 then Concat(number_session, ' Sessions') ";
        sql = sql + " else Concat(SUBSTRING(SEC_TO_TIME(cla_duration * 60),1,5), 'hr') ";
        sql = sql + " end AS number_session,(cla_max_size - students) AS spot_left ";
        sql = sql + " FROM   ( ";

        sql = sql + " select CL.use_id as use_id_instructor, CL.cla_id,Cl.cor_id, cla_session_type, cla_duration, cla_cost, cla_min_size, cla_max_size, cla_address, ";
        sql = sql + "   cla_status, cla_allow_lateRegistration, cla_allow_lateWithdraw, cla_lateWithdraw_date, ";
        sql = sql + "   cla_latitude, cla_longitude, clt_date, clt_start_time, clt_address, clt_firstClass, cor_name, cor_description, ";
        sql = sql + "   cor_accreditation, cor_accreditation_description, cor_learn, cor_bring, cor_aware_before,cor_about_me, ";
        sql = sql + "   cor_structure, cor_image, cor_added_date, cor_who_isfor, cor_expertise, cor_why_love, ";
        sql = sql + "   cor_style, cor_why_take, CONCAT(coalesce(US.use_first_name,''),' ',coalesce(US.use_last_name,'') ) AS use_name, ";
        sql = sql + "   use_description, use_email, usi_about, usi_expertise, usi_credential, use_image, ";
        sql = sql + "   usi_coached_before, usi_coached_experience, usi_speaking_groups, usi_speaking_experience, ";
        sql = sql + "   DATE_FORMAT(CT.clt_date, \"%b %d\") as dateShow,  DATE_FORMAT(CT.clt_date, \"%b %d, %Y\") as dateShowC,  ";
        sql = sql + "   cit_description, pro_code, age_description,col_description, ";
        sql = sql + "   DATE_FORMAT(CT.clt_start_time,\"%l:%i %p\") AS timeShow, DAYNAME(CT.clt_date) AS dayName, ";
        sql = sql + "   TIMESTAMPDIFF(day,CURDATE(),Date_format(CL.cla_deadline, \"%y-%m-%d\")) as cla_deadline2, ";
        sql = sql + "  CASE WHEN Date_format(CL.cla_deadline,\"%Y-%m-%d\") = CURDATE() THEN 'Today' else Date_format(CL.cla_deadline, \"%b %d, %Y\") end AS cla_deadline, ";
        sql = sql + " (select coalesce(count(*),0) from class_review where cor_id = cl.cor_id) AS number_reviews, ";
        sql = sql + " (select coalesce(Sum(cre_stars) / Count(cre_id),0) from class_review  where cor_id = cl.cor_id) star_general, ";
        sql = sql + " (select coalesce(count(clr_id),0) from class_register where cla_id = cl.cla_id and clr_status = 'A') as students, ";
        sql = sql + " (select count(*) from class_time where cla_id = cl.cla_id) AS number_session ";
        if(classModel.use_id != "")
            sql = sql + "      ,COALESCE(WL.wis_status,'N') AS wis_status ";
        sql = sql + " from class CL ";
        sql = sql + "   INNER JOIN class_time CT ON CL.cla_id = CT.cla_id  ";
        sql = sql + "   INNER JOIN course CO ON CL.cor_id = CO.cor_id ";
        sql = sql + "   INNER JOIN user US ON CO.use_id = US.use_id ";
        sql = sql + "   INNER JOIN user_instructor UI ON US.use_id = UI.use_id ";
        sql = sql + "   INNER JOIN age AG ON CL.age_id = AG.age_id ";
        sql = sql + "   INNER JOIN course_level LV ON CL.col_id = LV.col_id ";
        sql = sql + "   INNER JOIN city CY ON CL.cit_id = CY.cit_id ";
        sql = sql + "   INNER JOIN province PR ON CY.pro_id = PR.pro_id ";
        if(classModel.use_id != "")
            sql = sql + "   LEFT JOIN wishlist WL ON CL.cla_id = WL.cla_id and WL.use_id = " + classModel.use_id  + " ";
        sql = sql + " where CL.cla_id = " + classModel.cla_id + " AND CT.clt_firstClass = 'Y' ";
        sql = sql + " GROUP BY CO.cor_id, CL.cla_id ) AS AUX; ";


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
        sql = sql + " CONCAT(coalesce(US.use_first_name,''),' ',coalesce(US.use_last_name,'') ) AS use_name ";
        sql = sql + " FROM class_review CR ";
        sql = sql + " INNER JOIN user US ON CR.use_id = US.use_id ";
        sql = sql + " where cor_id = " + classModel.cor_id + " and cre_status = 'A' ; ";


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
        sql = sql + " SELECT DATE_FORMAT(clt_date, \"%b %d\") as dateShow,DATE_FORMAT(clt_start_time,\"%l:%i %p\") AS timeShow, DAYNAME(clt_date) AS dayName ";
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
        sql = sql + " SELECT distinct CT.cla_id, DATE_FORMAT(clt_date, \"%b %d\") as dateShow,DATE_FORMAT(clt_start_time,\"%l:%i %p\") AS timeShow, DAYNAME(clt_date) AS dayName ";
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
        sql = sql + " select c.cla_id,co.cor_image, co.cor_name,city.cit_description, prov.pro_code, ";
        sql = sql + " CONCAT(coalesce(use_first_name,''),' ',coalesce(use_last_name,'') ) as instructor_name,use_image, ";
        sql = sql + " c.cla_cost, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%b %d\") clt_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_start_time,\"%l:%i %p\") start_time, ";
        sql = sql + " DATE_FORMAT(clr_added_date, \"%Y-%m-%d\") purchase_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%Y-%m-%d\") clt_date_account, ";
        sql = sql + " TIME_FORMAT(ADDTIME(CT.clt_start_time, SEC_TO_TIME(c.cla_duration*60)), '%l:%i %p') AS final_time, ";
        sql = sql + " case when TIMESTAMPDIFF(day,CURDATE(),ct.clt_date) > 0 then CONCAT('Starts in ' ,TIMESTAMPDIFF(day,CURDATE(),ct.clt_date), ' days') else 'Starts today' end  as day_until, ";
        sql = sql + " c.cla_address, ";
        sql = sql + " (select count(*) from class_time where cla_id = c.cla_id) as sessions, c.cla_duration ";
        sql = sql + " from class c ";
        sql = sql + " inner join course co on c.cor_id = co.cor_id ";
        sql = sql + " inner join user u on co.use_id = u.use_id ";
        sql = sql + " inner join user_instructor ui on u.use_id = ui.use_id ";
        sql = sql + " inner join class_register cr on c.cla_id = cr.cla_id ";
        sql = sql + " inner join class_time ct on c.cla_id = ct.cla_id ";
        sql = sql + " inner join city city on c.cit_id = city.cit_id ";
        sql = sql + " inner join province prov on city.pro_id = prov.pro_id ";
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
        sql = sql + " select c.cla_id,co.cor_image, co.cor_name,co.cor_id, ";
        sql = sql + " CONCAT(coalesce(use_first_name,''),' ',coalesce(use_last_name,'') ) as instructor_name,use_image, ";
        sql = sql + " c.cla_cost,city.cit_description, prov.pro_code, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%b %d\") clt_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_start_time,\"%l:%i %p\") start_time, ";
        sql = sql + " TIME_FORMAT(ADDTIME(CT.clt_start_time, SEC_TO_TIME(c.cla_duration*60)), '%l:%i %p')  AS final_time, ";
        sql = sql + " case when TIMESTAMPDIFF(day,CURDATE(),ct.clt_date) > 0 then CONCAT('Starts in ' ,TIMESTAMPDIFF(day,CURDATE(),ct.clt_date), ' days') else 'Starts today' end  as day_until, ";
        sql = sql + " c.cla_address, cre.cre_id,";
        sql = sql + " (select count(*) from class_time where cla_id = c.cla_id) as sessions, c.cla_duration ";
        sql = sql + " from class c ";
        sql = sql + " inner join course co on c.cor_id = co.cor_id ";
        sql = sql + " inner join user u on co.use_id = u.use_id ";
        sql = sql + " inner join user_instructor ui on u.use_id = ui.use_id ";
        sql = sql + " inner join class_register cr on c.cla_id = cr.cla_id ";
        sql = sql + " inner join class_time ct on c.cla_id = ct.cla_id ";
        sql = sql + " inner join city city on c.cit_id = city.cit_id ";
        sql = sql + " inner join province prov on city.pro_id = prov.pro_id ";
        sql = sql + " LEFT JOIN class_review cre ON c.cor_id = cre.cor_id AND cre.use_id = " + classModel.use_id + " "
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
        sql = sql + " select c.cla_id,co.cor_image, co.cor_name, co.cor_id, ";
        sql = sql + " CONCAT(coalesce(use_first_name,''),' ',coalesce(use_last_name,'') ) as instructor_name,use_image, ";
        sql = sql + " c.cla_cost, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%b %d\") clt_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_start_time,\"%l:%i %p\") start_time, ";
        sql = sql + " DATE_FORMAT(clr_added_date, \"%Y-%m-%d\") purchase_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%Y-%m-%d\") clt_date_account, ";
        sql = sql + " TIME_FORMAT(ADDTIME(CT.clt_start_time, SEC_TO_TIME(c.cla_duration*60)), '%l:%i %p')  AS final_time, ";
        sql = sql + " case when TIMESTAMPDIFF(day,CURDATE(),ct.clt_date) > 0 then CONCAT('Starts in ' ,TIMESTAMPDIFF(day,CURDATE(),ct.clt_date), ' days') else 'Starts today' end  as day_until, ";
        sql = sql + " c.cla_address, coalesce(cre.cre_id,0) as cre_id,";
        sql = sql + " (select count(*) from class_time where cla_id = c.cla_id) as sessions, c.cla_duration ";
        sql = sql + " from class c ";
        sql = sql + " inner join course co on c.cor_id = co.cor_id ";
        sql = sql + " inner join user u on co.use_id = u.use_id ";
        sql = sql + " inner join user_instructor ui on u.use_id = ui.use_id ";
        sql = sql + " inner join class_register cr on c.cla_id = cr.cla_id ";
        sql = sql + " inner join class_time ct on c.cla_id = ct.cla_id ";
        sql = sql + " LEFT JOIN class_review cre ON c.cla_id = cre.cla_id AND cre.cor_id = " + classModel.use_id + " "
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
        sql = sql + " CONCAT(coalesce(use_first_name,''),' ',coalesce(use_last_name,'') ) as instructor_name,use_image, ";
        sql = sql + " c.cla_cost, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%b %d\") clt_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_start_time,\"%l:%i %p\") start_time, ";
        sql = sql + " DATE_FORMAT(clr_added_date, \"%Y-%m-%d\") purchase_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%Y-%m-%d\") clt_date_account, ";
        sql = sql + " DATE_FORMAT(clr_cancel_date, \"%Y-%m-%d\") clr_cancel_date, ";
        sql = sql + " TIME_FORMAT(ADDTIME(CT.clt_start_time, SEC_TO_TIME(c.cla_duration*60)), '%l:%i %p')  AS final_time, ";
        sql = sql + " case when TIMESTAMPDIFF(day,CURDATE(),ct.clt_date) > 0 then CONCAT('Starts in ' ,TIMESTAMPDIFF(day,CURDATE(),ct.clt_date), ' days') else 'Starts today' end  as day_until, ";
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
        sql = sql + " CONCAT(coalesce(use_first_name,''),' ',coalesce(use_last_name,'') ) as instructor_name, ";
        sql = sql + " use_image, ";
        sql = sql + " c.cla_cost, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%b %d\") clt_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%Y-%m-%d\") clt_date_account, ";
        sql = sql + " DATE_FORMAT(ct.clt_start_time,\"%l:%i %p\") start_time, ";
        sql = sql + " TIME_FORMAT(ADDTIME(CT.clt_start_time, SEC_TO_TIME(c.cla_duration*60)), '%l:%i %p')  AS final_time, ";
        sql = sql + " case when TIMESTAMPDIFF(day,CURDATE(),ct.clt_date) > 0 then CONCAT('Starts in ' ,TIMESTAMPDIFF(day,CURDATE(),ct.clt_date), ' days') else 'Starts today' end as day_until, ";
        sql = sql + " c.cla_address, ";
        sql = sql + " (select count(*) from class_time where cla_id = c.cla_id) as sessions, c.cla_duration, ";
        sql = sql + " (select count(*) from class_register where cla_id = c.cla_id) students, ";
        sql = sql + " (select coalesce(sum(clr_instructor_value),0) from class_register where cla_id = c.cla_id) clr_instructor_value, ";
        sql = sql + " c.cla_max_size, c.cla_min_size ";
        sql = sql + " from class c ";
        sql = sql + " inner join course co on c.cor_id = co.cor_id ";
        sql = sql + " inner join user u on co.use_id = u.use_id ";
        sql = sql + " inner join user_instructor ui on u.use_id = ui.use_id ";
      //  sql = sql + " left join class_register cr on c.cla_id = cr.cla_id ";
        sql = sql + " inner join class_time ct on c.cla_id = ct.cla_id ";
        sql = sql + " where co.use_id = " + classModel.use_id + " ";
        sql = sql + " and ct.clt_firstClass = 'Y' ";
        sql = sql + " and c.cla_status = 'A' ";
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
        sql = sql + " CONCAT(coalesce(use_first_name,''),' ',coalesce(use_last_name,'') ) as instructor_name, ";
        sql = sql + " use_image, ";
        sql = sql + " c.cla_cost, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%b %d\") clt_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%Y-%m-%d\") clt_date_account, ";
        sql = sql + " DATE_FORMAT(ct.clt_start_time,\"%l:%i %p\") start_time, ";
        sql = sql + " TIME_FORMAT(ADDTIME(CT.clt_start_time, SEC_TO_TIME(c.cla_duration*60)), '%l:%i %p')  AS final_time, ";
        sql = sql + " case when TIMESTAMPDIFF(day,CURDATE(),ct.clt_date) > 0 then CONCAT('Starts in ' ,TIMESTAMPDIFF(day,CURDATE(),ct.clt_date), ' days') else 'Starts today' end as day_until, ";
        sql = sql + " c.cla_address, ";
        sql = sql + " (select count(*) from class_time where cla_id = c.cla_id) as sessions, c.cla_duration, ";
        sql = sql + " (select count(*) from class_register where cla_id = c.cla_id) students, ";
        sql = sql + " (select coalesce(sum(clr_instructor_value),0) from class_register where cla_id = c.cla_id) clr_instructor_value, ";
        sql = sql + " c.cla_max_size, c.cla_min_size ";
        sql = sql + " from class c ";
        sql = sql + " inner join course co on c.cor_id = co.cor_id ";
        sql = sql + " inner join user u on co.use_id = u.use_id ";
        sql = sql + " inner join user_instructor ui on u.use_id = ui.use_id ";
       // sql = sql + " left join class_register cr on c.cla_id = cr.cla_id ";
        sql = sql + " inner join class_time ct on c.cla_id = ct.cla_id ";
        sql = sql + " where co.use_id = " + classModel.use_id + " ";
        sql = sql + " and ct.clt_firstClass = 'Y' ";
        sql = sql + " and c.cla_status = 'A' ";
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

    ClassBusiness.prototype.cancelClass = function(classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " UPDATE class SET cla_status = 'I' WHERE cla_id = " + classModel.cla_id + ";";

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