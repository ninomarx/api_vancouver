var factory = require("./../factory/dbfactory");
var utilBusiness = require("./../business/utilBusiness");

var CourseBusiness = (function() {

    var CourseBusiness = function() {

    };

    CourseBusiness.prototype.select = function(courseModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";

        sql = sql + " SELECT *, ";
        sql = sql + " CASE ";
        sql = sql + " WHEN cla_min_size > students ";
        sql = sql + " AND cla_deadline2 > 0 THEN 'A' ";
        sql = sql + " WHEN cla_min_size <= students ";
        sql = sql + " AND cla_allow_lateregistration = 'N' THEN 'B' ";
        sql = sql + " ELSE 'C' ";
        sql = sql + " END AS priority, ";
        sql = sql + " 0   AS distance, ";
        sql = sql + " (cla_max_size - students) AS spot_left, ";
        sql = sql + " case ";
        sql = sql + " when number_session > 1 then Concat(number_session, ' Sessions') ";
        sql = sql + " else cla_duration ";
        sql = sql + " end AS number_session, ";
        sql = sql + " (SELECT count(clt_date) FROM class cla inner join class_time clat on cla.cla_id = clat.cla_id ";
        sql = sql + " WHERE CLA.cor_id = corId and clt_date > curdate() and cla_status = 'A' AND clt_firstClass = 'Y' AND clt_date <> date_first_class) as other_dates ";
        sql = sql + " FROM   ( ";
        sql = sql + " SELECT COU.cor_id AS corId, COU.cor_image,COU.cor_name,COU.cor_description, CL.cla_id, ";
        sql = sql + " CL.cla_cost, USI.usi_image, Date_format(CT.clt_date, \"%b %d\") AS clt_date, ";
        sql = sql + " CT.clt_date AS clt_dateFilter, Date_format(CT.clt_start_time, \"%l:%i %p\") AS clt_start_time, ";
        sql = sql + " Dayname(CT.clt_date) AS week_day, CI.cit_description, PR.pro_code, AG.age_description, ";
        sql = sql + " COL.col_description, CL.cla_min_size, CL.cla_max_size,CL.cla_address, NULLIF(CL.cla_location_name,'') as cla_location_name,";
        sql = sql + " Timestampdiff(day, Curdate(), Date_format(CL.cla_deadline, \"%y-%m-%d\")) AS cla_deadline2, ";
        sql = sql + " CASE WHEN Date_format(CL.cla_deadline,\"%Y-%m-%d\") = CURDATE() THEN 'Today' else Date_format(CL.cla_deadline, \"%b %d, %Y\") end AS cla_deadline, ";
        sql = sql + " CL.cla_deadline AS cla_deadlineFilter, CONCAT(coalesce(US.use_first_name,''),' ',coalesce(US.use_last_name,'') )  AS use_name, ";
        sql = sql + " US.use_image, CL.cla_allow_lateregistration, ";
        sql = sql + " CL.cla_latitude, CL.cla_longitude, CL.cla_duration, ";
        sql = sql + " (select coalesce(count(*),0) from class_review where cor_id = cl.cor_id) AS number_reviews, ";
        sql = sql + " (select coalesce(Sum(cre_stars) / Count(cre_id),0) from class_review  where cor_id = cl.cor_id) star_general, ";
        sql = sql + " (select coalesce(count(clr_id),0) from class_register where cla_id = cl.cla_id and clr_status = 'A') as students, ";
        sql = sql + " (select count(*) from class_time where cla_id = cl.cla_id) AS number_session ";
        if(courseModel.use_id != "")
            sql = sql + " ,COALESCE(WS.wis_status,'N') AS wis_status ";
        sql = sql + "  ,(SELECT min(clt_date) FROM class cla inner join class_time clat on cla.cla_id = clat.cla_id ";
        sql = sql + "   WHERE cor_id = COU.cor_id and clt_date > curdate() and cla_status = 'A' AND clt_firstClass = 'Y' ) as date_first_class ";
        sql = sql + " FROM   course COU ";
        sql = sql + " INNER JOIN class CL ON COU.cor_id = CL.cor_id ";
        sql = sql + " INNER JOIN class_time CT ON CL.cla_id = CT.cla_id AND CT.clt_firstclass = 'Y' ";
        sql = sql + " INNER JOIN city CI ON CL.cit_id = CI.cit_id ";
        sql = sql + " INNER JOIN province PR ON CI.pro_id = PR.pro_id ";
        sql = sql + " INNER JOIN USER US ON US.use_id = COU.use_id ";
        sql = sql + " INNER JOIN user_instructor USI ON US.use_id = USI.use_id ";
        sql = sql + " INNER JOIN age AG ON CL.age_id = AG.age_id ";
        sql = sql + " INNER JOIN course_level COL ON CL.col_id = COL.col_id ";
        if(courseModel.use_id != "")
            sql = sql + "   LEFT JOIN wishlist WS ON CL.cla_id = WS.cla_id AND WS.use_id = " + courseModel.use_id + " ";
        sql = sql + " WHERE  CI.cit_id in (select cit_id from city where reg_id in (select reg_id from city where cit_id = " + courseModel.cit_id + ")) ";
        sql = sql + " AND COU.cor_status = 'A' ";
        sql = sql + " AND CL.cla_status = 'A' ";
        sql = sql + " AND US.use_type = 2 ";
        sql = sql + " AND ct.clt_date >= DATE_ADD(Curdate(), INTERVAL -1 DAY) ";
        sql = sql + " GROUP  BY COU.cor_id, ";
        sql = sql + " CL.cla_id) AS AUX ";
        /*sql = sql + " WHERE  (cla_max_size - students) > 0 ";
              sql = sql + " AND ( ";
         sql = sql + "   (cla_allow_lateRegistration = 'S' AND now() <= clt_dateFilter AND cla_min_size <= students  ) OR ";
         sql = sql + "   (cla_allow_lateRegistration = 'N' AND cla_deadline BETWEEN 0 AND 7) ";
         sql = sql + " ) ";*/
        sql = sql + " WHERE clt_dateFilter = date_first_class ";
        sql = sql + " ORDER  BY priority,cla_deadlineFilter DESC,spot_left DESC,distance,cor_name ";
        sql = sql + " LIMIT 24 ";


        connection.query(sql,function(err,courses){
            connection.end();
            if(!err) {

                var collectionCourse = courses;

                collectionCourse.forEach(function(item){

                    utilBusiness.getDistanceFromLatLonInKm(courseModel.latitude,courseModel.longitude,item.cla_latitude, item.cla_longitude, function(obj){
                        item.distance = obj;
                    });
                })

                collectionCourse = collectionCourse.sort(utilBusiness.sort_by('priority', {
                                                                                name: 'cla_deadline',
                                                                                primer: parseInt,
                                                                                reverse: false
                                                                            },{
                                                                                name: 'spot_left',
                                                                                primer: parseInt,
                                                                                reverse: true
                                                                            }));

                callback(collectionCourse);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });


    };


    CourseBusiness.prototype.selectNearby = function(courseModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";

        sql = sql + " SELECT *, ";
        sql = sql + " CASE ";
        sql = sql + " WHEN cla_min_size > students ";
        sql = sql + " AND cla_deadline2 > 0 THEN 'A' ";
        sql = sql + " WHEN cla_min_size <= students ";
        sql = sql + " AND cla_allow_lateregistration = 'N' THEN 'B' ";
        sql = sql + " ELSE 'C' ";
        sql = sql + " END AS priority, ";
        sql = sql + " 0   AS distance, ";
        sql = sql + " (cla_max_size - students) AS spot_left, ";
        sql = sql + " case ";
        sql = sql + " when number_session > 1 then Concat(number_session, ' Sessions') ";
        sql = sql + " else cla_duration ";
        sql = sql + " end AS number_session, ";
        sql = sql + " (SELECT count(clt_date) FROM class cla inner join class_time clat on cla.cla_id = clat.cla_id ";
        sql = sql + " WHERE CLA.cor_id = corId and clt_date > curdate() and cla_status = 'A' AND clt_firstClass = 'Y' AND clt_date <> date_first_class) as other_dates ";
        sql = sql + " FROM   ( ";
        sql = sql + " SELECT COU.cor_id AS corId,COU.cor_image,COU.cor_name,COU.cor_description, CL.cla_id, ";
        sql = sql + " CL.cla_cost, USI.usi_image, Date_format(CT.clt_date, \"%b %d\") AS clt_date, ";
        sql = sql + " CT.clt_date AS clt_dateFilter, Date_format(CT.clt_start_time, \"%l:%i %p\") AS clt_start_time, ";
        sql = sql + " Dayname(CT.clt_date) AS week_day, CI.cit_description, PR.pro_code, AG.age_description, ";
        sql = sql + " COL.col_description, CL.cla_min_size, CL.cla_max_size,CL.cla_address, NULLIF(CL.cla_location_name,'') as cla_location_name, ";
        sql = sql + " Timestampdiff(day, Curdate(), Date_format(CL.cla_deadline, \"%y-%m-%d\")) AS cla_deadline2, ";
        sql = sql + " CASE WHEN Date_format(CL.cla_deadline,\"%Y-%m-%d\") = CURDATE() THEN 'Today' else Date_format(CL.cla_deadline, \"%b %d, %Y\") end AS cla_deadline, ";
        sql = sql + " CL.cla_deadline AS cla_deadlineFilter, CONCAT(coalesce(US.use_first_name,''),' ',coalesce(US.use_last_name,'') )  AS use_name, ";
        sql = sql + " US.use_image, CL.cla_allow_lateregistration, ";
        sql = sql + " CL.cla_latitude, CL.cla_longitude, CL.cla_duration, ";
        sql = sql + " (select coalesce(count(*),0) from class_review where cor_id = cl.cor_id) AS number_reviews, ";
        sql = sql + " (select coalesce(Sum(cre_stars) / Count(cre_id),0) from class_review  where cor_id = cl.cor_id) star_general, ";
        sql = sql + " (select coalesce(count(clr_id),0) from class_register where cla_id = cl.cla_id and clr_status = 'A') as students, ";
        sql = sql + " (select count(*) from class_time where cla_id = cl.cla_id) AS number_session ";
        if(courseModel.use_id != "")
            sql = sql + " ,COALESCE(WS.wis_status,'N') AS wis_status";
        sql = sql + "  ,(SELECT min(clt_date) FROM class cla inner join class_time clat on cla.cla_id = clat.cla_id ";
        sql = sql + "   WHERE cor_id = COU.cor_id and clt_date > curdate() and cla_status = 'A' AND clt_firstClass = 'Y' ) as date_first_class ";
        sql = sql + " FROM   course COU ";
        sql = sql + " INNER JOIN class CL ON COU.cor_id = CL.cor_id ";
        sql = sql + " INNER JOIN class_time CT ON CL.cla_id = CT.cla_id AND CT.clt_firstclass = 'Y' ";
        sql = sql + " INNER JOIN city CI ON CL.cit_id = CI.cit_id ";
        sql = sql + " INNER JOIN province PR ON CI.pro_id = PR.pro_id ";
        sql = sql + " INNER JOIN USER US ON US.use_id = COU.use_id ";
        sql = sql + " INNER JOIN user_instructor USI ON US.use_id = USI.use_id ";
        sql = sql + " INNER JOIN age AG ON CL.age_id = AG.age_id ";
        sql = sql + " INNER JOIN course_level COL ON CL.col_id = COL.col_id ";
        if(courseModel.use_id != "")
            sql = sql + "   LEFT JOIN wishlist WS ON CL.cla_id = WS.cla_id AND WS.use_id = " + courseModel.use_id + " ";
        sql = sql + " WHERE  ";
        sql = sql + " COU.cor_status = 'A' ";
        sql = sql + " AND CL.cla_status = 'A' ";
        sql = sql + " AND US.use_type = 2 ";
        sql = sql + " AND ct.clt_date >= DATE_ADD(Curdate(), INTERVAL -1 DAY) ";
        sql = sql + " GROUP  BY COU.cor_id, ";
        sql = sql + " CL.cla_id) AS AUX ";
        /*sql = sql + " WHERE  (cla_max_size - students) > 0 ";
              sql = sql + " AND ( ";
         sql = sql + "   (cla_allow_lateRegistration = 'S' AND now() <= clt_dateFilter AND cla_min_size <= students  ) OR ";
         sql = sql + "   (cla_allow_lateRegistration = 'N' AND cla_deadline BETWEEN 0 AND 7) ";
         sql = sql + " ) ";*/
        sql = sql + " WHERE clt_dateFilter = date_first_class ";
        sql = sql + " ORDER  BY priority,cla_deadline,spot_left DESC,distance,cor_name "
        sql = sql + " LIMIT 24 ";


        connection.query(sql,function(err,courses){
            connection.end();
            if(!err) {

                var collectionCourse = courses;
                var collectionCourseRet = [];

                collectionCourse.forEach(function(item){

                    utilBusiness.getDistanceFromLatLonInKm(courseModel.latitude,courseModel.longitude,item.cla_latitude, item.cla_longitude, function(obj){
                        item.distance = obj;
                    });

                    if(item.distance <= 5){
                        collectionCourseRet.push(item);
                    }

                })

                collectionCourseRet = collectionCourseRet.sort(utilBusiness.sort_by('priority', {
                    name: 'distance',
                    primer: parseInt,
                    reverse: false
                },{
                    name: 'cla_deadline',
                    primer: false,
                    reverse: true
                }));

                callback(collectionCourseRet);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });


    };

    CourseBusiness.prototype.selectInterest = function(courseModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";

        sql = sql + " SELECT *, ";
        sql = sql + " CASE ";
        sql = sql + " WHEN cla_min_size > students ";
        sql = sql + " AND cla_deadline2 > 0 THEN 'A' ";
        sql = sql + " WHEN cla_min_size <= students ";
        sql = sql + " AND cla_allow_lateregistration = 'N' THEN 'B' ";
        sql = sql + " ELSE 'C' ";
        sql = sql + " END AS priority, ";
        sql = sql + " 0   AS distance, ";
        sql = sql + " (cla_max_size - students) AS spot_left, ";
        sql = sql + " case ";
        sql = sql + " when number_session > 1 then Concat(number_session, ' Sessions') ";
        sql = sql + " else cla_duration ";
        sql = sql + " end AS number_session, ";
        sql = sql + " (SELECT count(clt_date) FROM class cla inner join class_time clat on cla.cla_id = clat.cla_id ";
        sql = sql + " WHERE CLA.cor_id = corId and clt_date > curdate() and cla_status = 'A' AND clt_firstClass = 'Y' AND clt_date <> date_first_class) as other_dates ";
        sql = sql + " FROM   ( ";
        sql = sql + " SELECT COU.cor_id AS corId,COU.cor_image,COU.cor_name,COU.cor_description, CL.cla_id, ";
        sql = sql + " CL.cla_cost, USI.usi_image, Date_format(CT.clt_date, \"%b %d\") AS clt_date, ";
        sql = sql + " CT.clt_date AS clt_dateFilter, Date_format(CT.clt_start_time, \"%l:%i %p\") AS clt_start_time, ";
        sql = sql + " Dayname(CT.clt_date) AS week_day, CI.cit_description, PR.pro_code, AG.age_description, ";
        sql = sql + " COL.col_description, CL.cla_min_size, CL.cla_max_size,CL.cla_address, NULLIF(CL.cla_location_name,'') as cla_location_name, ";
        sql = sql + " Timestampdiff(day, Curdate(), Date_format(CL.cla_deadline, \"%y-%m-%d\")) AS cla_deadline2, ";
        sql = sql + " CASE WHEN Date_format(CL.cla_deadline,\"%Y-%m-%d\") = CURDATE() THEN 'Today' else Date_format(CL.cla_deadline, \"%b %d, %Y\") end AS cla_deadline, ";
        sql = sql + " CL.cla_deadline AS cla_deadlineFilter, CONCAT(coalesce(US.use_first_name,''),' ',coalesce(US.use_last_name,'') )  AS use_name, ";
        sql = sql + " US.use_image, CL.cla_allow_lateregistration, ";
        sql = sql + " CL.cla_latitude, CL.cla_longitude, CL.cla_duration, ";
        sql = sql + " (select coalesce(count(*),0) from class_review where cor_id = cl.cor_id) AS number_reviews, ";
        sql = sql + " (select coalesce(Sum(cre_stars) / Count(cre_id),0) from class_review  where cor_id = cl.cor_id) star_general, ";
        sql = sql + " (select coalesce(count(clr_id),0) from class_register where cla_id = cl.cla_id and clr_status = 'A') as students, ";
        sql = sql + " (select count(*) from class_time where cla_id = cl.cla_id) AS number_session ";
        if(courseModel.use_id != "")
            sql = sql + " ,COALESCE(WS.wis_status,'N') AS wis_status";
        sql = sql + "  ,(SELECT min(clt_date) FROM class cla inner join class_time clat on cla.cla_id = clat.cla_id ";
        sql = sql + "   WHERE cor_id = COU.cor_id and clt_date > curdate() and cla_status = 'A' AND clt_firstClass = 'Y' ) as date_first_class ";
        sql = sql + " FROM   course COU ";
        sql = sql + " INNER JOIN class CL ON COU.cor_id = CL.cor_id ";
        sql = sql + " INNER JOIN class_time CT ON CL.cla_id = CT.cla_id AND CT.clt_firstclass = 'Y' ";
        sql = sql + " INNER JOIN city CI ON CL.cit_id = CI.cit_id ";
        sql = sql + " INNER JOIN province PR ON CI.pro_id = PR.pro_id ";
        sql = sql + " INNER JOIN USER US ON US.use_id = COU.use_id ";
        sql = sql + " INNER JOIN user_instructor USI ON US.use_id = USI.use_id ";
        sql = sql + " INNER JOIN age AG ON CL.age_id = AG.age_id ";
        sql = sql + " INNER JOIN course_level COL ON CL.col_id = COL.col_id ";
        if(courseModel.use_id != "") {
            sql = sql + "   LEFT JOIN wishlist WS ON CL.cla_id = WS.cla_id AND WS.use_id = " + courseModel.use_id + " ";
            sql = sql + "   INNER JOIN course_subcategory COS ON COU.cor_id = COS.cor_id ";
            sql = sql + "   INNER JOIN user_interests UI ON UI.cat_id = COS.cat_id  and UI.use_id = " + courseModel.use_id + " ";
        }
        sql = sql + " WHERE  ";
        sql = sql + " COU.cor_status = 'A' ";
        sql = sql + " AND CL.cla_status = 'A' ";
        sql = sql + " AND US.use_type = 2 ";
        sql = sql + " AND ct.clt_date >= DATE_ADD(Curdate(), INTERVAL -1 DAY)";
        sql = sql + " GROUP  BY COU.cor_id, ";
        sql = sql + " CL.cla_id) AS AUX ";
        /*sql = sql + " WHERE  (cla_max_size - students) > 0 ";
              sql = sql + " AND ( ";
         sql = sql + "   (cla_allow_lateRegistration = 'S' AND now() <= clt_dateFilter AND cla_min_size <= students  ) OR ";
         sql = sql + "   (cla_allow_lateRegistration = 'N' AND cla_deadline BETWEEN 0 AND 7) ";
         sql = sql + " ) ";*/
        sql = sql + " WHERE clt_dateFilter = date_first_class ";
        sql = sql + " ORDER  BY priority,cla_deadline,spot_left DESC,distance,cor_name ";
        sql = sql + " LIMIT 24 ";


        connection.query(sql,function(err,courses){
            connection.end();
            if(!err) {

                var collectionCourse = courses;

                collectionCourse.forEach(function(item){

                    utilBusiness.getDistanceFromLatLonInKm(courseModel.latitude,courseModel.longitude,item.cla_latitude, item.cla_longitude, function(obj){
                        item.distance = obj;
                    });
                })

                collectionCourse = collectionCourse.sort(utilBusiness.sort_by('priority', {
                    name: 'distance',
                    primer: parseInt,
                    reverse: false
                },{
                    name: 'cla_deadline',
                    primer: false,
                    reverse: true
                }));

                callback(collectionCourse);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });


    };

    CourseBusiness.prototype.selectCourseTeaching = function(courseModel, callback) {

        var collectionCourse = [];

        var collectionClassA = [];
        var collectionClassP = [];
        var collectionTags = [];
        var collectionCategory = [];
        var collectionSubCategory = [];

        var courses_string = "";

        var connection = factory.getConnection();
        connection.connect();

        /* Course Data */
        var sql = "";
        sql = sql + " SELECT  COU.cor_id, COU.cor_image, COU.cor_name, COU.cor_description, ";
        sql = sql + " COU.cor_learn, COU.cor_who_isfor, COU.cor_bring, ";
        sql = sql + " COU.cor_accreditation, COU.cor_style, COU.cor_structure, COU.cor_added_date, COU.cor_status, ";
        sql = sql + " COU.cor_why_take, COU.cor_aware_before,cor_about_me, ";
        sql = sql + " COU.cor_why_love, COU.cor_style, COU.cor_expertise, COU.cor_accreditation_description, ";
        sql = sql + " (select count(wis_id) from wishlist where cla_id in (select cla_id from class where cor_id = COU.cor_id)) wishlist, ";
        sql = sql + " (select coalesce(count(*),0) from class_review where cor_id = COU.cor_id) AS number_reviews, ";
        sql = sql + " (select coalesce(Sum(cre_stars) / Count(cre_id),0) from class_review  where cor_id = COU.cor_id) star_general ";
        sql = sql + " FROM course COU ";
        sql = sql + " WHERE COU.use_id =  " + courseModel.use_id + " AND COU.cor_status <> 'C' ";
        sql = sql + " ORDER BY  COU.cor_id ; ";

        connection.query(sql,function(err,courses){if(!err) {
            collectionCourse = courses;

            collectionCourse.forEach(function(item){
                courses_string = courses_string + item.cor_id + ",";
            })

            courses_string = courses_string.substring(0, courses_string.length - 1);

            /*  Class Posted Data */
            sql = "";
            sql = sql + "SELECT C.cor_id,C.cla_id, DATE_FORMAT(CT.clt_date,\"%b %d, %y\") AS clt_date, DATE_FORMAT(CT.clt_start_time,\"%l:%i %p\") AS clt_start_time,";
            sql = sql + "TIME_FORMAT(ADDTIME(CT.clt_start_time, SEC_TO_TIME(c.cla_duration*60)), '%l:%i %p')  AS final_time,CI.cit_description, PR.pro_code,  ";
            sql = sql + "C.cla_cost, COALESCE(C.cla_address,'') AS cla_address,COALESCE(C.cla_location_name,'') AS cla_location_name,C.cla_location_name, C.cla_max_size, COUNT(CR.clr_id) qtde_students,DATE_FORMAT(CT.clt_date,\"%m/%d/%Y\") AS clt_date_edit, ";
            sql = sql + "C.cla_session_type, C.cla_duration,C.cla_min_size,C.cla_added_date, C.cla_status, DATE_FORMAT(C.cla_deadline,\"%m/%d/%Y\") AS cla_deadline, C.cla_allow_lateRegistration, ";
            sql = sql + "C.cla_allow_lateWithdraw, DATE_FORMAT(C.cla_lateWithdraw_date,\"%m/%d/%Y\") as cla_lateWithdraw_date ,C.age_id,C.col_id,CI.pro_id,C.cit_id,C.cor_id,C.nei_id,C.cla_latitude,C.cla_longitude,C.cla_link , ";
            sql = sql + "(SELECT COUNT(*) FROM class_register CR2 WHERE CR2.cla_id = C.cla_id and CR2.clr_status = 'A' AND CR2.use_id = 9999  ) AS qtde_students_aux, ";
            sql = sql + "(SELECT concat(' - ', Date_format(CTF.clt_date, \"%b %d, %y\")) FROM   class_time CTF WHERE  CTF.cla_id = C.cla_id AND  clt_firstclass <> 'Y' ORDER  BY clt_date DESC LIMIT 1) AS clt_final_date  ";
            sql = sql + "FROM Class C ";
            sql = sql + "INNER JOIN class_time CT ON C.cla_id = CT.cla_id ";
            sql = sql + "LEFT JOIN city CI ON C.cit_id = CI.cit_id ";
            sql = sql + "LEFT JOIN province PR ON CI.pro_id = PR.pro_id ";
            sql = sql + "LEFT JOIN class_register CR ON C.cla_id = CR.cla_id and CR.clr_status = 'A' ";
            sql = sql + "WHERE C.use_id = " + courseModel.use_id + " and cla_status = 'A' AND clt_firstClass = 'Y' AND CT.clt_date >= curdate()  ";
            sql = sql + "GROUP BY C.cla_id ";
            sql = sql + "ORDER BY C.cor_id,CT.clt_date; ";

            connection.query(sql,function(err,classesA){if(!err) {
                collectionClassA = classesA;

                var collectionAux = [];
                var i = 0;
                //var j = 0;
                collectionClassA.forEach(
                    function(item) {
                        if (i > 0) {
                            var k = i-1;
                            if (item.cor_id == collectionAux[k].cor_id) {
                                collectionAux[i] = item;
                            }
                            else {
                                collectionCourse.forEach(function(item2){

                                    if (item2.cor_id == collectionAux[i-1].cor_id) {
                                        item2.classesA = collectionAux;
                                    }
                                })
                                //collectionCourse[j].classesA = collectionAux;
                                collectionAux = [];
                                collectionAux[0] = item;
                                i = 0;
                                //j++;
                            }
                        }
                        else{
                            collectionAux[i] = item;
                        }

                        i++;
                    }
                )

                if(collectionAux.length > 0) {
                    collectionCourse.forEach(function (item2) {

                        if (item2.cor_id == collectionAux[i - 1].cor_id) {
                            item2.classesA = collectionAux;
                        }
                    })
                }

                /* Class Planned Data */
                sql = "";
                sql = sql + "SELECT C.cor_id,C.cla_id, DATE_FORMAT(CT.clt_date,\"%b %d, %y\") AS clt_date, DATE_FORMAT(CT.clt_start_time,\"%l:%i %p\") AS clt_start_time,";
                sql = sql + "TIME_FORMAT(ADDTIME(CT.clt_start_time, SEC_TO_TIME(c.cla_duration*60)), '%l:%i %p') AS final_time,CI.cit_description, PR.pro_code, ";
                sql = sql + "C.cla_cost,COALESCE(C.cla_address,'') AS cla_address,COALESCE(C.cla_location_name,'') AS cla_location_name,C.cla_location_name, C.cla_max_size, COUNT(CR.clr_id) qtde_students,DATE_FORMAT(CT.clt_date,\"%m/%d/%Y\") AS clt_date_edit, ";
                sql = sql + "C.cla_session_type, C.cla_duration,C.cla_min_size,C.cla_added_date, C.cla_status, DATE_FORMAT(C.cla_deadline,\"%m/%d/%Y\") AS cla_deadline, C.cla_allow_lateRegistration, ";
                sql = sql + "C.cla_allow_lateWithdraw,  DATE_FORMAT(C.cla_lateWithdraw_date,\"%m/%d/%Y\") as cla_lateWithdraw_date, C.age_id,C.col_id,CI.pro_id,C.cit_id,C.cor_id,C.nei_id,C.cla_latitude,C.cla_longitude,C.cla_link,  ";
                sql = sql + "(SELECT concat(' - ', Date_format(CTF.clt_date, \"%b %d, %y\")) FROM   class_time CTF WHERE  CTF.cla_id = C.cla_id AND  clt_firstclass <> 'Y' ORDER  BY clt_date DESC LIMIT 1) AS clt_final_date  ";
                sql = sql + "FROM Class C ";
                sql = sql + "INNER JOIN class_time CT ON C.cla_id = CT.cla_id ";
                sql = sql + "LEFT JOIN city CI ON C.cit_id = CI.cit_id ";
                sql = sql + "LEFT JOIN province PR ON CI.pro_id = PR.pro_id ";
                sql = sql + "LEFT JOIN class_register CR ON C.cla_id = CR.cla_id ";
                sql = sql + "WHERE C.use_id = " + courseModel.use_id + " and cla_status = 'P' AND clt_firstClass = 'Y' ";
                sql = sql + "GROUP BY C.cla_id ";
                sql = sql + "ORDER BY C.cor_id,CT.clt_date; ";

                connection.query(sql,function(err,classesP){if(!err) {
                    collectionClassP = classesP;

                    collectionAux = [];
                    i = 0;
                    //j = 0;
                    collectionClassP.forEach(
                        function(item) {
                            if (i > 0) {
                                if (item.cor_id == collectionAux[i-1].cor_id) {
                                    collectionAux[i] = item;
                                }
                                else {
                                    collectionCourse.forEach(function(item2){

                                        if (item2.cor_id == collectionAux[i-1].cor_id) {
                                            item2.classesP = collectionAux;
                                        }
                                    })
                                    //collectionCourse[j].classesP = collectionAux;
                                    collectionAux = [];
                                    collectionAux[0] = item;
                                    i = 0;
                                   // j++;
                                }
                            }
                            else{
                                collectionAux[i] = item;
                            }

                            i++;
                        }
                    )

                    if(collectionAux.length > 0) {
                        collectionCourse.forEach(function (item2) {

                            if (item2.cor_id == collectionAux[i - 1].cor_id) {
                                item2.classesP = collectionAux;
                            }
                        })
                    }

                    /* Tags Data */
                    sql = "";
                    sql = sql + "SELECT cor_id, cta_tag ";
                    sql = sql + "FROM course_tags ";
                    sql = sql + "WHERE cor_id IN ( "+ courses_string + " ) ";
                    sql = sql + "ORDER BY cor_id; ";

                    connection.query(sql,function(err,tags){if(!err) {

                        collectionTags = tags;

                        collectionAux = [];
                        i = 0;
                        //j = 0;
                        collectionTags.forEach(
                            function(item) {
                                if (i > 0) {
                                    if (item.cor_id == collectionAux[i-1].cor_id) {
                                        collectionAux[i] = item;
                                    }
                                    else {

                                        collectionCourse.forEach(function(item2){

                                            if (item2.cor_id == collectionAux[i-1].cor_id) {
                                                item2.Tags = collectionAux;
                                            }
                                        })

                                        //collectionCourse[j].Tags = collectionAux;
                                        collectionAux = [];
                                        collectionAux[0] = item;
                                        i = 0;
                                        //j++;
                                    }
                                }
                                else{
                                    collectionAux[i] = item;
                                }

                                i++;
                            }
                        )

                        if(collectionAux.length > 0) {
                            collectionCourse.forEach(function (item2) {

                                if (item2.cor_id == collectionAux[i - 1].cor_id) {
                                    item2.Tags = collectionAux;
                                }
                            })
                        }


                        /* Category Data */
                        sql = "";
                        sql = sql + "SELECT DISTINCT CS.cor_id, CS.cat_id, CA.cat_description ";
                        sql = sql + "FROM course_subcategory CS ";
                        sql = sql + "left JOIN subcategory S ON CS.sca_id = S.sca_id ";
                        sql = sql + "INNER JOIN category CA ON CA.cat_id = CS.cat_id ";
                        sql = sql + "WHERE cor_id IN ( "+ courses_string + " ) ";
                        sql = sql + "ORDER BY CS.cor_id, CS.cat_id; ";

                        connection.query(sql,function(err,category){

                            if(!err) {

                                collectionCategory = category;

                                collectionAux = [];
                                i = 0;
                                //j = 0;
                                collectionCategory.forEach(
                                    function(item) {
                                        if (i > 0) {
                                            if (item.cor_id == collectionAux[i-1].cor_id) {
                                                collectionAux[i] = item;
                                            }
                                            else {

                                                collectionCourse.forEach(function(item2){

                                                    if (item2.cor_id == collectionAux[i-1].cor_id) {
                                                        item2.Category = collectionAux;
                                                    }
                                                })
                                                //collectionCourse[j].Category = collectionAux;
                                                collectionAux = [];
                                                collectionAux[0] = item;
                                                i = 0;
                                               // j++;
                                            }
                                        }
                                        else{
                                            collectionAux[i] = item;
                                        }

                                        i++;
                                    }
                                )

                                if(collectionAux.length > 0) {
                                    collectionCourse.forEach(function (item2) {

                                        if (item2.cor_id == collectionAux[i - 1].cor_id) {
                                            item2.Category = collectionAux;
                                        }
                                    })
                                }

                                /* SubCategory Data */
                                sql = "";
                                sql = sql + "SELECT CS.cor_id, CS.cat_id, CS.sca_id, S.sca_description ";
                                sql = sql + "FROM course_subcategory CS ";
                                sql = sql + "INNER JOIN subcategory S ON CS.sca_id = S.sca_id ";
                                sql = sql + "INNER JOIN category CA ON CA.cat_id = CS.cat_id ";
                                sql = sql + "WHERE cor_id IN ( "+ courses_string + " ) ";
                                sql = sql + "ORDER BY CS.cor_id, CS.cat_id; ";

                                connection.query(sql,function(err,subcategory){
                                    connection.end();
                                    if(!err) {

                                        collectionSubCategory = subcategory;

                                        collectionAux = [];
                                        i = 0;
                                        var j = 0;
                                        var k = 0;
                                        collectionSubCategory.forEach(
                                            function(item) {
                                                if (i > 0) {
                                                    if (item.cor_id == collectionAux[i-1].cor_id &&
                                                        item.cat_id == collectionAux[i-1].cat_id) {
                                                        collectionAux[i] = item;
                                                    }
                                                    else if(item.cor_id == collectionAux[i-1].cor_id &&
                                                            item.cat_id != collectionAux[i-1].cat_id){

                                                        collectionCourse.forEach(function(item2){

                                                            if (item2.cor_id == collectionAux[i-1].cor_id) {

                                                                item2.Category.forEach(function(item3){
                                                                    if(item3.cat_id == collectionAux[i-1].cat_id)
                                                                        item3.Subcategory = collectionAux;
                                                                })

                                                            }
                                                        })

                                                        //collectionCourse[j].Category[k].Subcategory = collectionAux;
                                                        collectionAux = [];
                                                        collectionAux[0] = item;
                                                        i = 0;
                                                        k++;
                                                    }
                                                    else {
                                                        collectionCourse.forEach(function(item2){

                                                            if (item2.cor_id == collectionAux[i-1].cor_id) {

                                                                item2.Category.forEach(function(item3){
                                                                    if(item3.cat_id == collectionAux[i-1].cat_id)
                                                                        item3.Subcategory = collectionAux;
                                                                })

                                                            }
                                                        })
                                                        //collectionCourse[j].Category[k].Subcategory = collectionAux;
                                                        collectionAux = [];
                                                        collectionAux[0] = item;
                                                        i = 0;
                                                        j++;
                                                    }
                                                }
                                                else{
                                                    collectionAux[i] = item;
                                                }

                                                i++;
                                            }
                                        )

                                        //collectionCourse[j].Category[k].Subcategory = collectionAux;

                                        if(collectionAux.length > 0) {
                                            collectionCourse.forEach(function(item2){

                                                if (item2.cor_id == collectionAux[i-1].cor_id) {

                                                    item2.Category.forEach(function(item3){
                                                        if(item3.cat_id == collectionAux[i-1].cat_id)
                                                            item3.Subcategory = collectionAux;
                                                    })

                                                }
                                            })
                                        }

                                    callback(collectionCourse);

                                }});

                        }});

                    }});
                }});
                }});
        }});

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });


    };

    CourseBusiness.prototype.save = function(courseModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var d = new Date();
        courseModel.cor_added_date = d.getDate();

        var sql = "";

        if(courseModel.cor_id == "")
        {
            sql = sql + " INSERT INTO course ( ";
            sql = sql + " cor_name,cor_description,cor_accreditation,cor_accreditation_description, ";
            sql = sql + " cor_learn,cor_bring,cor_aware_before,cor_structure,cor_image,cor_added_date, ";
            sql = sql + " cor_status,use_id,cor_who_isfor,cor_expertise,cor_why_love,cor_style,cor_why_take, cor_about_me) ";
            sql = sql + " VALUES ( ";
            sql = sql + " '" + courseModel.cor_name.replace(/'/g, "\\'") + "', '" + courseModel.cor_description.replace(/'/g, "\\'") + "', '" + courseModel.cor_accreditation + "', ";
            sql = sql + " '" + courseModel.cor_accreditation_description.replace(/'/g, "\\'") + "', '" + courseModel.cor_learn.replace(/'/g, "\\'") + "', '" + courseModel.cor_bring.replace(/'/g, "\\'") + "', ";
            sql = sql + " '" + courseModel.cor_aware_before.replace(/'/g, "\\'") + "', '" + courseModel.cor_structure.replace(/'/g, "\\'") + "', '" + courseModel.cor_image + "', ";
            sql = sql + " '" + courseModel.cor_added_date + "', '" + courseModel.cor_status + "', " + courseModel.use_id + ", ";
            sql = sql + " '" + courseModel.cor_who_isfor.replace(/'/g, "\\'") + "', '" + courseModel.cor_expertise.replace(/'/g, "\\'") + "', '" + courseModel.cor_why_love.replace(/'/g, "\\'") + "', ";
            sql = sql + " '" + courseModel.cor_style.replace(/'/g, "\\'") + "', '" + courseModel.cor_why_take.replace(/'/g, "\\'") + "', '" + courseModel.cor_about_me.replace(/'/g, "\\'") + "' ";
            sql = sql + " ); ";

        }
        else {
            sql = sql + " UPDATE course SET ";
            sql = sql + " cor_name = '" + courseModel.cor_name.replace(/'/g, "\\'") + "',";
            sql = sql + " cor_description = '" + courseModel.cor_description.replace(/'/g, "\\'") + "',";
            sql = sql + " cor_accreditation = '" + courseModel.cor_accreditation + "',";
            sql = sql + " cor_accreditation_description = '" + courseModel.cor_accreditation_description.replace(/'/g, "\\'") + "',";
            sql = sql + " cor_learn = '" + courseModel.cor_learn.replace(/'/g, "\\'") + "',";
            sql = sql + " cor_bring = '" + courseModel.cor_bring.replace(/'/g, "\\'") + "',";
            sql = sql + " cor_aware_before = '" + courseModel.cor_aware_before.replace(/'/g, "\\'") + "',";
            sql = sql + " cor_structure = '" + courseModel.cor_structure.replace(/'/g, "\\'") + "',";
            sql = sql + " cor_image = '" + courseModel.cor_image + "',";
            sql = sql + " cor_status = '" + courseModel.cor_status + "',";
            sql = sql + " cor_who_isfor = '" + courseModel.cor_who_isfor.replace(/'/g, "\\'") + "',";
            sql = sql + " cor_expertise = '" + courseModel.cor_expertise.replace(/'/g, "\\'") + "',";
            sql = sql + " cor_why_love = '" + courseModel.cor_why_love.replace(/'/g, "\\'") + "',";
            sql = sql + " cor_style = '" + courseModel.cor_style.replace(/'/g, "\\'") + "',";
            sql = sql + " cor_why_take = '" + courseModel.cor_why_take.replace(/'/g, "\\'") + "',";
            sql = sql + " cor_about_me = '" + courseModel.cor_about_me.replace(/'/g, "\\'") + "'";
            sql = sql + " WHERE ";
            sql = sql + " cor_id = " + courseModel.cor_id + ";";
        }

         sql = sql + " UPDATE user SET ";
         sql = sql + " use_type = 3";
         sql = sql + " WHERE ";
         sql = sql + " use_id = " + courseModel.use_id + " AND use_type = 1; ";

        connection.query(sql,function(err,course){
            if(!err) {

                if(courseModel.cor_id == "")
                {
                    sql = "";

                    courseModel.cat_id.forEach(function(item) {
                            sql = sql + " INSERT INTO course_subcategory VALUES (" + course[0].insertId + "," + item.cat_id + "," + item.subCategory + " ); ";
                        }
                    )

                    courseModel.tags.forEach(function(item) {
                            sql = sql + " INSERT INTO course_tags VALUES (" + course[0].insertId + ",'" + item + "' ); ";
                        }
                    )
                }
                else
                {
                    sql = "";

                    sql = sql + " DELETE FROM course_subcategory WHERE cor_id = " + courseModel.cor_id + "; ";
                    sql = sql + " DELETE FROM course_tags WHERE cor_id = " + courseModel.cor_id + "; ";

                    courseModel.cat_id.forEach(function(item) {
                            sql = sql + " INSERT INTO course_subcategory VALUES (" + courseModel.cor_id + "," + item.cat_id + "," + item.subCategory + " ); ";
                        }
                    )

                    courseModel.tags.forEach(function(item) {
                            sql = sql + " INSERT INTO course_tags VALUES (" + courseModel.cor_id + ",'" + item + "' ); ";
                        }
                    )
                }

                var return_var = "";
                if(sql == "")
                {
                    connection.end();
                    return_var = "OK";
                    callback(return_var);
                }
                else {
                    connection.query(sql, function (err, result) {
                        if (!err) {
                            connection.end();
                            return_var = "OK";
                            callback(return_var);
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

    CourseBusiness.prototype.selectByFilter = function(courseModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";

        sql = sql + " SELECT *, ";
        sql = sql + " CASE ";
        sql = sql + " WHEN cla_min_size > students ";
        sql = sql + " AND cla_deadline2 > 0 THEN 'A' ";
        sql = sql + " WHEN cla_min_size <= students ";
        sql = sql + " AND cla_allow_lateregistration = 'N' THEN 'B' ";
        sql = sql + " ELSE 'C' ";
        sql = sql + " END AS priority, ";
        sql = sql + " 0   AS distance, ";
        sql = sql + " (cla_max_size - students) AS spot_left, ";
        sql = sql + " case ";
        sql = sql + " when number_session > 1 then Concat(number_session, ' Sessions') ";
        sql = sql + " else cla_duration ";
        sql = sql + " end AS number_session, ";
        sql = sql + " (SELECT count(clt_date) FROM class cla inner join class_time clat on cla.cla_id = clat.cla_id ";
        sql = sql + " WHERE CLA.cor_id = corId and clt_date > curdate() and cla_status = 'A' AND clt_firstClass = 'Y' AND clt_date <> date_first_class) as other_dates ";
        sql = sql + " FROM   ( ";
        sql = sql + " SELECT COU.cor_id AS corId,COU.cor_image,COU.cor_name,COU.cor_description, CL.cla_id, ";
        sql = sql + " CL.cla_cost, USI.usi_image, Date_format(CT.clt_date, \"%b %d\") AS clt_date, ";
        sql = sql + " CT.clt_date AS clt_dateFilter, Date_format(CT.clt_start_time, \"%l:%i %p\") AS clt_start_time, ";
        sql = sql + " Dayname(CT.clt_date) AS week_day, CI.cit_description, PR.pro_code, AG.age_description, ";
        sql = sql + " COL.col_description, CL.cla_min_size, CL.cla_max_size,CL.cla_address, NULLIF(CL.cla_location_name,'') as cla_location_name, ";
        sql = sql + " Timestampdiff(day, Curdate(), Date_format(CL.cla_deadline, \"%y-%m-%d\")) AS cla_deadline2, ";
        sql = sql + " CASE WHEN Date_format(CL.cla_deadline,\"%Y-%m-%d\") = CURDATE() THEN 'Today' else Date_format(CL.cla_deadline, \"%b %d, %Y\") end AS cla_deadline, ";
        sql = sql + " CL.cla_deadline AS cla_deadlineFilter, CONCAT(coalesce(US.use_first_name,''),' ',coalesce(US.use_last_name,'') )  AS use_name, ";
        sql = sql + " US.use_image, CL.cla_allow_lateregistration, ";
        sql = sql + " CL.cla_latitude, CL.cla_longitude, CL.cla_duration, ";
        sql = sql + " (select coalesce(count(*),0) from class_review where cor_id = cl.cor_id) AS number_reviews, ";
        sql = sql + " (select coalesce(Sum(cre_stars) / Count(cre_id),0) from class_review  where cor_id = cl.cor_id) star_general, ";
        sql = sql + " (select coalesce(count(clr_id),0) from class_register where cla_id = cl.cla_id and clr_status = 'A') as students, ";
        sql = sql + " (select count(*) from class_time where cla_id = cl.cla_id) AS number_session ";
        if(courseModel.use_id != "")
            sql = sql + " ,COALESCE(WS.wis_status,'N') AS wis_status";
        sql = sql + "  ,(SELECT min(clt_date) FROM class cla inner join class_time clat on cla.cla_id = clat.cla_id ";
        sql = sql + "   WHERE cor_id = COU.cor_id and cla_status = 'A' AND clt_firstClass = 'Y' ";

        if(courseModel.filter.begin_date != "" && courseModel.filter.end_date != "" ){
            sql = sql + " AND (clt_date BETWEEN STR_TO_DATE('" + courseModel.filter.begin_date + "','%m/%d/%Y') AND STR_TO_DATE('" + courseModel.filter.end_date + "','%m/%d/%Y'))";
        }else{
            sql = sql + " AND clt_date > curdate() ";
        }

        var aux = courseModel.filter.times.length;
        var aux2 = 0;
        if(courseModel.filter.times.length > 0) {

            var index = courseModel.filter.times.indexOf("A");

            if (index > -1) {
                sql = sql;
            }
            else
            {
                sql = sql + " AND ";

                courseModel.filter.times.forEach(function (item) {

                    if (aux == 1) {
                        if (item == "M")
                            sql = sql + "  clt_start_time BETWEEN '00:00' AND '12:00' ";

                        if (item == "N")
                            sql = sql + "  clt_start_time BETWEEN '12:00' AND '17:00' ";

                        if (item == "E")
                            sql = sql + "  clt_start_time BETWEEN '17:00' AND '23:59' ";
                    }
                    else {

                        if (aux2 == 0)
                            sql = sql + " ( ";
                        else
                            sql = sql + " OR ";

                        if (item == "M") {
                            sql = sql + "  clt_start_time <= '12:00PM' ";
                            aux2++;
                        }

                        if (item == "N") {
                            sql = sql + "  clt_start_time BETWEEN '12:00PM' AND '6:00PM' ";
                            aux2++;
                        }

                        if (item == "E") {
                            sql = sql + "  clt_start_time >= '6:00PM' ";
                            aux2++;
                        }

                        if (aux == aux2)
                            sql = sql + " ) ";
                    }

                })
            }

        }

        if(courseModel.filter.days.length > 0) {

            var days = "";
            var all = "N";
            courseModel.filter.days.forEach(function(item){

                days = days + " " + item + ",";

                if(item == "A")
                    all = "S";

            })
            days = days.substring(0,days.length - 1);

            if(all == "N")
                sql = sql + " AND DAYOFWEEK(clt_date) IN (" + days + ") ";
        }

        if(courseModel.filter.age.length > 0) {
            sql = sql + " AND ";
            var ages = "";
            courseModel.filter.age.forEach(function(item){

                ages = ages + " " + item + ",";

            })
            ages = ages.substring(0,ages.length - 1);
            sql = sql + " age_id IN (" + ages + ") ";
        }

        if(courseModel.filter.level.length > 0) {
            sql = sql + " AND ";
            var levels = "";
            courseModel.filter.level.forEach(function(item){

                levels = levels + " " + item + ",";

            })
            levels = levels.substring(0,levels.length - 1);
            sql = sql + " col_id IN (" + levels + ") ";
        }

        if(courseModel.filter.price_1 != "" && courseModel.filter.price_2 != "" ){
            sql = sql + " AND ";
            sql = sql + " (cla_cost BETWEEN " + courseModel.filter.price_1 + " AND " + courseModel.filter.price_2 + ") ";
        }

        sql = sql + "  ) as date_first_class ";

        sql = sql + " FROM   course COU ";
        sql = sql + " INNER JOIN class CL ON COU.cor_id = CL.cor_id ";
        sql = sql + " INNER JOIN class_time CT ON CL.cla_id = CT.cla_id AND CT.clt_firstclass = 'Y' ";
        sql = sql + " INNER JOIN city CI ON CL.cit_id = CI.cit_id ";
        sql = sql + " INNER JOIN province PR ON CI.pro_id = PR.pro_id ";
        sql = sql + " INNER JOIN USER US ON US.use_id = COU.use_id ";
        sql = sql + " INNER JOIN user_instructor USI ON US.use_id = USI.use_id ";
        sql = sql + " INNER JOIN age AG ON CL.age_id = AG.age_id ";
        sql = sql + " INNER JOIN course_level COL ON CL.col_id = COL.col_id ";
        sql = sql + " LEFT JOIN course_subcategory CSU ON COU.cor_id = CSU.cor_id ";
        if(courseModel.use_id != "")
            sql = sql + "   LEFT JOIN wishlist WS ON CL.cla_id = WS.cla_id AND WS.use_id = " + courseModel.use_id + " ";
        sql = sql + " WHERE ";
        sql = sql + "      COU.cor_status = 'A' AND ";
        sql = sql + "      CL.cla_status = 'A'  AND";
        sql = sql + "      US.use_type = 2 AND ";
        sql = sql + "      ct.clt_date >= DATE_ADD(Curdate(), INTERVAL -1 DAY) ";

        if(courseModel.cit_id) {
            sql = sql + " AND ";
            sql = sql + " CI.cit_id in (select cit_id from city where reg_id in (select reg_id from city where cit_id =  " + courseModel.cit_id + ")) ";
        }

        if(courseModel.cat_id) {
            sql = sql + " AND ";
            sql = sql + " CSU.cat_id = " + courseModel.cat_id + " ";
        }

        if(courseModel.sca_id) {
            sql = sql + " AND ";
            sql = sql + " CSU.sca_id = " + courseModel.sca_id + " ";
        }

        if(courseModel.filter.begin_date != "" && courseModel.filter.end_date != "" ){
            sql = sql + " AND ";
            sql = sql + " (CT.clt_date BETWEEN STR_TO_DATE('" + courseModel.filter.begin_date + "','%m/%d/%Y') AND STR_TO_DATE('" + courseModel.filter.end_date + "','%m/%d/%Y')) ";
        }

        var aux = courseModel.filter.times.length;
        var aux2 = 0;
        if(courseModel.filter.times.length > 0) {

            var index = courseModel.filter.times.indexOf("A");

            if (index > -1) {
                sql = sql;
            }
            else
            {
                sql = sql + " AND ";

                courseModel.filter.times.forEach(function (item) {

                    if (aux == 1) {
                        if (item == "M")
                            sql = sql + "  CT.clt_start_time BETWEEN '00:00' AND '12:00' ";

                        if (item == "N")
                            sql = sql + "  CT.clt_start_time BETWEEN '12:00' AND '17:00' ";

                        if (item == "E")
                            sql = sql + "  CT.clt_start_time BETWEEN '17:00' AND '23:59' ";
                    }
                    else {

                        if (aux2 == 0)
                            sql = sql + " ( ";
                        else
                            sql = sql + " OR ";

                        if (item == "M") {
                            sql = sql + "  CT.clt_start_time <= '12:00PM' ";
                            aux2++;
                        }

                        if (item == "N") {
                            sql = sql + "  CT.clt_start_time BETWEEN '12:00PM' AND '6:00PM' ";
                            aux2++;
                        }

                        if (item == "E") {
                            sql = sql + "  CT.clt_start_time >= '6:00PM' ";
                            aux2++;
                        }

                        if (aux == aux2)
                            sql = sql + " ) ";
                    }

                })
             }

        }

        if(courseModel.filter.days.length > 0) {

            var days = "";
            var all = "N";
            courseModel.filter.days.forEach(function(item){

                days = days + " " + item + ",";

                if(item == "A")
                    all = "S";

            })
            days = days.substring(0,days.length - 1);

            if(all == "N")
                sql = sql + " AND DAYOFWEEK(CT.clt_date) IN (" + days + ") ";
        }

        if(courseModel.filter.age.length > 0) {
            sql = sql + " AND ";
            var ages = "";
            courseModel.filter.age.forEach(function(item){

                ages = ages + " " + item + ",";

            })
            ages = ages.substring(0,ages.length - 1);
            sql = sql + " CL.age_id IN (" + ages + ") ";
        }

        if(courseModel.filter.level.length > 0) {
            sql = sql + " AND ";
            var levels = "";
            courseModel.filter.level.forEach(function(item){

                levels = levels + " " + item + ",";

            })
            levels = levels.substring(0,levels.length - 1);
            sql = sql + " CL.col_id IN (" + levels + ") ";
        }

        if(courseModel.filter.price_1 != "" && courseModel.filter.price_2 != "" ){
            sql = sql + " AND ";
            sql = sql + " (CL.cla_cost BETWEEN " + courseModel.filter.price_1 + " AND " + courseModel.filter.price_2 + ") ";
        }

        sql = sql + " GROUP BY COU.cor_id,CL.cla_id  ";
        sql = sql + " ) AS AUX ";
      /*sql = sql + " WHERE (cla_max_size - students) > 0  ";
        sql = sql + " AND ( ";
        sql = sql + "   (cla_allow_lateRegistration = 'S' AND now() <= clt_dateFilter AND cla_min_size <= students  ) OR ";
        sql = sql + "   (cla_allow_lateRegistration = 'N' AND cla_deadline BETWEEN 0 AND 7) ";
        sql = sql + " ) ";*/
        sql = sql + " WHERE clt_dateFilter = date_first_class ";

        if(courseModel.filter.sort == "R") {
            sql = sql + " ORDER BY priority, cla_deadlineFilter,spot_left DESC, distance, cor_name; ";
        }
        else if(courseModel.filter.sort == "S") {
            sql = sql + " ORDER BY cla_deadlineFilter,priority,spot_left DESC, distance, cor_name; ";
        }
        else if(courseModel.filter.sort == "P") {
            sql = sql + " ORDER BY cla_cost, priority, cla_deadlineFilter,spot_left DESC, distance, cor_name; ";
        }
        else
        {
            sql = sql + " ORDER BY cla_deadlineFilter,priority,spot_left DESC, distance, cor_name; ";
        }


        connection.query(sql,function(err,courses){
            connection.end();
            if(!err) {

                var collectionCourse = courses;
                var collectionCourseRet = courses;

                if(courseModel.filter.distance != "" && courseModel.filter.sort != "D") {

                    var dist = courseModel.filter.distance;
                    collectionCourseRet = [];

                    collectionCourse.forEach(function (item) {

                        utilBusiness.getDistanceFromLatLonInKm(courseModel.latitude, courseModel.longitude, item.cla_latitude, item.cla_longitude, function (obj) {
                            item.distance = obj;
                        });

                        if(item.distance <= dist){
                            collectionCourseRet.push(item);
                        }
                    })
                }
                else if(courseModel.filter.distance == "" && courseModel.filter.sort == "D") {

                    collectionCourseRet.forEach(function (item) {

                        utilBusiness.getDistanceFromLatLonInKm(courseModel.latitude, courseModel.longitude, item.cla_latitude, item.cla_longitude, function (obj) {
                            item.distance = obj;
                        });

                    })

                    collectionCourseRet = collectionCourseRet.sort(utilBusiness.sort_by('distance', {
                        name: 'cla_deadline',
                        primer: false,
                        reverse: false
                    }));
                }
                else if(courseModel.filter.distance != "" && courseModel.filter.sort == "D")
                {
                    var dist = courseModel.filter.distance;
                    collectionCourseRet = [];

                    collectionCourse.forEach(function (item) {

                        utilBusiness.getDistanceFromLatLonInKm(courseModel.latitude, courseModel.longitude, item.cla_latitude, item.cla_longitude, function (obj) {
                            item.distance = obj;
                        });

                        if(item.distance <= dist){
                            collectionCourseRet.push(item);
                        }
                    })

                    collectionCourseRet = collectionCourseRet.sort(utilBusiness.sort_by('distance', {
                        name: 'priority',
                        primer: false,
                        reverse: false
                    }));

                }


                var aux = 0;
                collectionCourseRet.forEach(function(item){
                    if(item.distance <= 5){
                        aux++;
                    }
                })

                var classesNearby = {qtde: aux};
                collectionCourseRet.push(classesNearby);

                callback(collectionCourseRet);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });


    };

    CourseBusiness.prototype.selectBySearch = function(courseModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " SELECT *, ";
        sql = sql + " CASE ";
        sql = sql + " WHEN cla_min_size > students ";
        sql = sql + " AND cla_deadline2 > 0 THEN 'A' ";
        sql = sql + " WHEN cla_min_size <= students ";
        sql = sql + " AND cla_allow_lateregistration = 'N' THEN 'B' ";
        sql = sql + " ELSE 'C' ";
        sql = sql + " END AS priority, ";
        sql = sql + " 0   AS distance, ";
        sql = sql + " (cla_max_size - students) AS spot_left, ";
        sql = sql + " case ";
        sql = sql + " when number_session > 1 then Concat(number_session, ' Sessions') ";
        sql = sql + " else cla_duration ";
        sql = sql + " end AS number_session, ";
        sql = sql + " (SELECT count(clt_date) FROM class cla inner join class_time clat on cla.cla_id = clat.cla_id ";
        sql = sql + " WHERE CLA.cor_id = corId and clt_date > curdate() and cla_status = 'A' AND clt_firstClass = 'Y' AND clt_date <> date_first_class) as other_dates ";
        sql = sql + " FROM   ( ";
        sql = sql + " SELECT COU.cor_id AS corId,COU.cor_image,COU.cor_name,COU.cor_description, CL.cla_id, ";
        sql = sql + " CL.cla_cost, USI.usi_image, Date_format(CT.clt_date, \"%b %d\") AS clt_date, ";
        sql = sql + " CT.clt_date AS clt_dateFilter, Date_format(CT.clt_start_time, \"%l:%i %p\") AS clt_start_time, ";
        sql = sql + " Dayname(CT.clt_date) AS week_day, CI.cit_description, PR.pro_code, AG.age_description, ";
        sql = sql + " COL.col_description, CL.cla_min_size, CL.cla_max_size,CL.cla_address, NULLIF(CL.cla_location_name,'') as cla_location_name, ";
        sql = sql + " Timestampdiff(day, Curdate(), Date_format(CL.cla_deadline, \"%y-%m-%d\")) AS cla_deadline2, ";
        sql = sql + " CASE WHEN Date_format(CL.cla_deadline,\"%Y-%m-%d\") = CURDATE() THEN 'Today' else Date_format(CL.cla_deadline, \"%b %d, %Y\") end AS cla_deadline, ";
        sql = sql + " CL.cla_deadline AS cla_deadlineFilter, CONCAT(coalesce(US.use_first_name,''),' ',coalesce(US.use_last_name,'') )  AS use_name, ";
        sql = sql + " US.use_image, CL.cla_allow_lateregistration, ";
        sql = sql + " CL.cla_latitude, CL.cla_longitude, CL.cla_duration, ";
        sql = sql + " (select coalesce(count(*),0) from class_review where cor_id = cl.cor_id) AS number_reviews, ";
        sql = sql + " (select coalesce(Sum(cre_stars) / Count(cre_id),0) from class_review  where cor_id = cl.cor_id) star_general, ";
        sql = sql + " (select coalesce(count(clr_id),0) from class_register where cla_id = cl.cla_id and clr_status = 'A') as students, ";
        sql = sql + " (select count(*) from class_time where cla_id = cl.cla_id) AS number_session ";
        if(courseModel.use_id != "")
            sql = sql + " ,COALESCE(WS.wis_status,'N') AS wis_status";
        sql = sql + "  ,(SELECT min(clt_date) FROM class cla inner join class_time clat on cla.cla_id = clat.cla_id ";
        sql = sql + "   WHERE cor_id = COU.cor_id and cla_status = 'A' AND clt_firstClass = 'Y' ";

        if(courseModel.filter.begin_date != "" && courseModel.filter.end_date != "" ){
            sql = sql + " AND (clt_date BETWEEN STR_TO_DATE('" + courseModel.filter.begin_date + "','%m/%d/%Y') AND STR_TO_DATE('" + courseModel.filter.end_date + "','%m/%d/%Y'))";
        }else{
            sql = sql + " AND clt_date > curdate() ";
        }

        var aux = courseModel.filter.times.length;
        var aux2 = 0;
        if(courseModel.filter.times.length > 0) {

            var index = courseModel.filter.times.indexOf("A");

            if (index > -1) {
                sql = sql;
            }
            else
            {
                sql = sql + " AND ";

                courseModel.filter.times.forEach(function (item) {

                    if (aux == 1) {
                        if (item == "M")
                            sql = sql + "  clt_start_time BETWEEN '00:00' AND '12:00' ";

                        if (item == "N")
                            sql = sql + "  clt_start_time BETWEEN '12:00' AND '17:00' ";

                        if (item == "E")
                            sql = sql + "  clt_start_time BETWEEN '17:00' AND '23:59' ";
                    }
                    else {

                        if (aux2 == 0)
                            sql = sql + " ( ";
                        else
                            sql = sql + " OR ";

                        if (item == "M") {
                            sql = sql + "  clt_start_time <= '12:00PM' ";
                            aux2++;
                        }

                        if (item == "N") {
                            sql = sql + "  clt_start_time BETWEEN '12:00PM' AND '6:00PM' ";
                            aux2++;
                        }

                        if (item == "E") {
                            sql = sql + "  clt_start_time >= '6:00PM' ";
                            aux2++;
                        }

                        if (aux == aux2)
                            sql = sql + " ) ";
                    }

                })
            }

        }

        if(courseModel.filter.days.length > 0) {

            var days = "";
            var all = "N";
            courseModel.filter.days.forEach(function(item){

                days = days + " " + item + ",";

                if(item == "A")
                    all = "S";

            })
            days = days.substring(0,days.length - 1);

            if(all == "N")
                sql = sql + " AND DAYOFWEEK(clt_date) IN (" + days + ") ";
        }

        if(courseModel.filter.age.length > 0) {
            sql = sql + " AND ";
            var ages = "";
            courseModel.filter.age.forEach(function(item){

                ages = ages + " " + item + ",";

            })
            ages = ages.substring(0,ages.length - 1);
            sql = sql + " age_id IN (" + ages + ") ";
        }

        if(courseModel.filter.level.length > 0) {
            sql = sql + " AND ";
            var levels = "";
            courseModel.filter.level.forEach(function(item){

                levels = levels + " " + item + ",";

            })
            levels = levels.substring(0,levels.length - 1);
            sql = sql + " col_id IN (" + levels + ") ";
        }

        if(courseModel.filter.price_1 != "" && courseModel.filter.price_2 != "" ){
            sql = sql + " AND ";
            sql = sql + " (cla_cost BETWEEN " + courseModel.filter.price_1 + " AND " + courseModel.filter.price_2 + ") ";
        }

        sql = sql + "  ) as date_first_class ";
        sql = sql + " FROM   course COU ";
        sql = sql + " INNER JOIN class CL ON COU.cor_id = CL.cor_id ";
        sql = sql + " INNER JOIN class_time CT ON CL.cla_id = CT.cla_id AND CT.clt_firstclass = 'Y' ";
        sql = sql + " INNER JOIN city CI ON CL.cit_id = CI.cit_id ";
        sql = sql + " INNER JOIN province PR ON CI.pro_id = PR.pro_id ";
        sql = sql + " INNER JOIN USER US ON US.use_id = COU.use_id ";
        sql = sql + " INNER JOIN user_instructor USI ON US.use_id = USI.use_id ";
        sql = sql + " INNER JOIN age AG ON CL.age_id = AG.age_id ";
        sql = sql + " INNER JOIN course_level COL ON CL.col_id = COL.col_id ";
        sql = sql + " LEFT JOIN class_register CR ON CL.cla_id = CR.cla_id ";
        sql = sql + " LEFT JOIN class_review CV ON CL.cor_id = CV.cor_id ";
        sql = sql + " LEFT JOIN course_subcategory CSU ON COU.cor_id = CSU.cor_id ";
        if(courseModel.use_id != "")
            sql = sql + "   LEFT JOIN wishlist WS ON CL.cla_id = WS.cla_id AND WS.use_id = " + courseModel.use_id + " ";
        sql = sql + " WHERE ";
        sql = sql + "      COU.cor_status = 'A' AND ";
        sql = sql + "      CL.cla_status = 'A'  AND";
        sql = sql + "      US.use_type = 2 AND ";
        sql = sql + "      ct.clt_date >= DATE_ADD(Curdate(), INTERVAL -1 DAY) ";


        if(courseModel.cit_id) {
            sql = sql + " AND ";
            sql = sql + " CI.cit_id in (select cit_id from city where reg_id in (select reg_id from city where cit_id = " + courseModel.cit_id + "))  ";
        }

        if(courseModel.search != "") {
            sql = sql + " AND (COU.cor_name like \"%" + courseModel.search + "%\" OR COU.cor_description like \"%" + courseModel.search + "%\" OR ";
            sql = sql + " COU.cor_id in (select cor_id from course_tags where cta_tag like \"%" + courseModel.search + "%\" ))";
        }

        if(courseModel.filter.begin_date != "" && courseModel.filter.end_date != "" ){
            sql = sql + " AND ";
            sql = sql + " (CT.clt_date BETWEEN STR_TO_DATE('" + courseModel.filter.begin_date + "','%m/%d/%Y') AND STR_TO_DATE('" + courseModel.filter.end_date + "','%m/%d/%Y')) ";
        }

        var aux = courseModel.filter.times.length;
        var aux2 = 0;
        if(courseModel.filter.times.length > 0) {

            var index = courseModel.filter.times.indexOf("A");

            if (index > -1) {
                sql = sql;
            }
            else
            {
                sql = sql + " AND ";

                courseModel.filter.times.forEach(function (item) {

                    if (aux == 1) {
                        if (item == "M")
                            sql = sql + "  CT.clt_start_time <= '12:00PM' ";

                        if (item == "N")
                            sql = sql + "  CT.clt_start_time BETWEEN '12:00PM' AND '6:00PM' ";

                        if (item == "E")
                            sql = sql + "  CT.clt_start_time >= '6:00PM' ";
                    }
                    else {

                        if (aux2 == 0)
                            sql = sql + " ( ";
                        else
                            sql = sql + " OR ";

                        if (item == "M") {
                            sql = sql + "  CT.clt_start_time <= '12:00PM' ";
                            aux2++;
                        }

                        if (item == "N") {
                            sql = sql + "  CT.clt_start_time BETWEEN '12:00PM' AND '6:00PM' ";
                            aux2++;
                        }

                        if (item == "E") {
                            sql = sql + "  CT.clt_start_time >= '6:00PM' ";
                            aux2++;
                        }

                        if (aux == aux2)
                            sql = sql + " ) ";
                    }

                })
            }

        }

        if(courseModel.filter.days.length > 0) {

            var days = "";
            var all = "N";
            courseModel.filter.days.forEach(function(item){

                days = days + " " + item + ",";

                if(item == "A")
                    all = "S";

            })
            days = days.substring(0,days.length - 1);

            if(all == "N")
                sql = sql + " AND DAYOFWEEK(CT.clt_date) IN (" + days + ") ";
        }

        if(courseModel.filter.age.length > 0) {
            sql = sql + " AND ";
            var ages = "";
            courseModel.filter.age.forEach(function(item){

                ages = ages + " " + item + ",";

            })
            ages = ages.substring(0,ages.length - 1);
            sql = sql + " CL.age_id IN (" + ages + ") ";
        }

        if(courseModel.filter.level.length > 0) {
            sql = sql + " AND ";
            var levels = "";
            courseModel.filter.level.forEach(function(item){

                levels = levels + " " + item + ",";

            })
            levels = levels.substring(0,levels.length - 1);
            sql = sql + " CL.col_id IN (" + levels + ") ";
        }

        if(courseModel.filter.price_1 != "" && courseModel.filter.price_2 != "" ){
            sql = sql + " AND ";
            sql = sql + " (CL.cla_cost BETWEEN " + courseModel.filter.price_1 + " AND " + courseModel.filter.price_2 + ") ";
        }

        sql = sql + " GROUP BY COU.cor_id,CL.cla_id  ";
        sql = sql + " ) AS AUX ";
        /*sql = sql + " WHERE (cla_max_size - students) > 0  ";
         sql = sql + " AND ( ";
         sql = sql + "   (cla_allow_lateRegistration = 'S' AND now() <= clt_dateFilter AND cla_min_size <= students  ) OR ";
         sql = sql + "   (cla_allow_lateRegistration = 'N' AND cla_deadline BETWEEN 0 AND 7) ";
         sql = sql + " ) ";*/
        sql = sql + " WHERE clt_dateFilter = date_first_class ";

        if(courseModel.filter.sort == "R") {
            sql = sql + " ORDER BY priority, cla_deadline,spot_left DESC, distance, cor_name; ";
        }
        else if(courseModel.filter.sort == "S") {
            sql = sql + " ORDER BY cla_deadline,priority,spot_left DESC, distance, cor_name; ";
        }
        else if(courseModel.filter.sort == "P") {
            sql = sql + " ORDER BY cla_cost, priority, cla_deadline,spot_left DESC, distance, cor_name; ";
        }
        else
        {
            sql = sql + " ORDER BY priority, cla_deadline,spot_left DESC, distance, cor_name; ";
        }


        connection.query(sql,function(err,courses){
            connection.end();
            if(!err) {

                var collectionCourse = courses;
                var collectionCourseRet = courses;

                if(courseModel.filter.distance != "" && courseModel.filter.sort != "D") {

                    var dist = courseModel.filter.distance;
                    collectionCourseRet = [];

                    collectionCourse.forEach(function (item) {

                        utilBusiness.getDistanceFromLatLonInKm(courseModel.latitude, courseModel.longitude, item.cla_latitude, item.cla_longitude, function (obj) {
                            item.distance = obj;
                        });

                        if(item.distance <= dist){
                            collectionCourseRet.push(item);
                        }
                    })
                }
                else if(courseModel.filter.distance == "" && courseModel.filter.sort == "D") {

                    collectionCourseRet.forEach(function (item) {

                        utilBusiness.getDistanceFromLatLonInKm(courseModel.latitude, courseModel.longitude, item.cla_latitude, item.cla_longitude, function (obj) {
                            item.distance = obj;
                        });

                    })

                    collectionCourseRet = collectionCourseRet.sort(utilBusiness.sort_by('distance', {
                        name: 'priority',
                        primer: false,
                        reverse: false
                    }));
                }
                else if(courseModel.filter.distance != "" && courseModel.filter.sort == "D")
                {
                    var dist = courseModel.filter.distance;
                    collectionCourseRet = [];

                    collectionCourse.forEach(function (item) {

                        utilBusiness.getDistanceFromLatLonInKm(courseModel.latitude, courseModel.longitude, item.cla_latitude, item.cla_longitude, function (obj) {
                            item.distance = obj;
                        });

                        if(item.distance <= dist){
                            collectionCourseRet.push(item);
                        }
                    })

                    collectionCourseRet = collectionCourseRet.sort(utilBusiness.sort_by('distance', {
                        name: 'priority',
                        primer: false,
                        reverse: false
                    }));

                }

                callback(collectionCourseRet);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });


    };

    CourseBusiness.prototype.delete = function(courseModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " SELECT count (*) as count FROM class WHERE cor_id = " + courseModel.cor_id + " AND cla_status = 'A';";

        connection.query(sql,function(err,courses){
            if(!err) {

                if(courses[0].count > 0){
                    connection.end();
                    callback("COD009");
                }else{
                    sql = sql + " UPDATE course SET cor_status = 'C' WHERE cor_id = " + courseModel.cor_id + ";";

                    connection.query(sql,function(err,classObj){
                        connection.end();
                        if(!err) {
                            var collectionCourse = courses;
                            callback(collectionCourse);
                        }
                    });
                }

            } else {
                callback("COD009");
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });


    };

    return new CourseBusiness();
})();

module.exports = CourseBusiness;