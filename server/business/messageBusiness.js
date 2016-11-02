var factory = require("./../factory/dbfactory");
var utilBusiness = require("./../business/utilBusiness");

var MessageBusiness = (function() {

    var MessageBusiness = function() {

    };

    MessageBusiness.prototype.getMessages = function(messageModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " SELECT * FROM ( ";
        sql = sql + " (select mes_id, use_id_receiver,use_id_transmitter,";
        sql = sql + " mes_transmitter_type,mes_star,cla_id,cor_id, mes_status,";
        sql = sql + " case when mes_transmitter_type = 1 then use_image else use_image end as image, ";
        sql = sql + " CONCAT(coalesce(use_first_name,''),' ',coalesce(use_last_name,'') ) as use_name, ";
        sql = sql + "  (select case when length(mec_message) > 55 then  CONCAT(SUBSTRING(mec_message,1,55), '', '...') else mec_message end  from message_conversation where mes_id = m.mes_id and use_id <>  " + messageModel.use_id + " order by mec_date desc limit 1) mec_message, ";
        sql = sql + " (select case when TIMESTAMPDIFF(day, mec_date, CURDATE()) > 0 then  CONCAT(TIMESTAMPDIFF(day, mec_date, CURDATE()), '', ' days ago') else 'today' end from message_conversation where mes_id = m.mes_id  and use_id <>  " + messageModel.use_id + "   order by mec_date desc limit 1) mec_date, ";
        sql = sql + " (SELECT mec_date FROM   message_conversation WHERE  mes_id = m.mes_id ORDER  BY mec_date DESC LIMIT  1)  as mec_date_order, ";
        sql = sql + " mes_text,  DATE_FORMAT(mes_date, \"%b. %d %Y\") mes_date ";
        sql = sql + " from message m ";
        sql = sql + " inner join user u on m.use_id_transmitter = u.use_id ";
        sql = sql + " inner join user_instructor ui on u.use_id = ui.use_id ";
        sql = sql + " where use_id_receiver = " + messageModel.use_id + ") ";

        sql = sql + " union all ";

        sql = sql + " (select mes_id,use_id_receiver,use_id_transmitter, ";
        sql = sql + " mes_transmitter_type,mes_star,cla_id,cor_id,mes_status, ";
        sql = sql + " case when mes_transmitter_type = 1 then use_image else use_image end as image, ";
        sql = sql + " CONCAT(coalesce(use_first_name,''),' ',coalesce(use_last_name,'') ) as use_name, ";
        sql = sql + "  (select case when length(mec_message) > 55 then  CONCAT(SUBSTRING(mec_message,1,55), '', '...') else mec_message end  from message_conversation where mes_id = m.mes_id and use_id <>  " + messageModel.use_id + " order by mec_date desc limit 1) mec_message, ";
        sql = sql + " (select case when TIMESTAMPDIFF(day, mec_date, CURDATE()) > 0 then  CONCAT(TIMESTAMPDIFF(day, mec_date, CURDATE()), '', ' days ago') else 'today' end from message_conversation where mes_id = m.mes_id  and use_id <>  " + messageModel.use_id + "   order by mec_date desc limit 1) mec_date, ";
        sql = sql + " (SELECT mec_date FROM   message_conversation WHERE  mes_id = m.mes_id ORDER  BY mec_date DESC LIMIT  1)  as mec_date_order, ";
        sql = sql + " mes_text,  DATE_FORMAT(mes_date, \"%b. %d %Y\") mes_date ";
        sql = sql + " from message m ";
        sql = sql + " inner join user u on m.use_id_receiver = u.use_id ";
        sql = sql + " inner join user_instructor ui on u.use_id = ui.use_id ";
        sql = sql + " where use_id_transmitter = " + messageModel.use_id + ") ";
        sql = sql + " ) as aux ";

        // filter: 1-All, 2-Starred, 3-Unread, 4-From Students, 5-From Instructor
        if(messageModel.filter == 1)
            sql = sql + " WHERE mes_status = 'A' ";
        else if(messageModel.filter == 2)
            sql = sql + " WHERE mes_star = 'Y' AND mes_status = 'A' ";
        else if (messageModel.filter == 3)
            sql = sql + " WHERE mes_read = 'N' AND mes_status = 'A' ";
        else if (messageModel.filter == 4)
            sql = sql + " WHERE mes_transmitter_type = 1 AND mes_status = 'A' AND use_id_transmitter <> " + messageModel.use_id + "";
        else if (messageModel.filter == 5)
            sql = sql + " WHERE mes_transmitter_type = 2 AND mes_status = 'A' AND use_id_transmitter <> " + messageModel.use_id + "";
        else if (messageModel.filter == 6)
            sql = sql + " WHERE mes_status = 'I' AND mes_status = 'I'";

        messageModel.page = (messageModel.page - 1) * messageModel.pages;

        sql = sql + " ORDER BY mec_date_order desc ";
        sql = sql + " LIMIT  " + messageModel.page + "," + messageModel.pages + "; ";


        connection.query(sql,function(err,message){
            connection.end();
            if(!err) {

                var collectionMessage = message;

                callback(collectionMessage);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Errorto connect database"});
        });
    };

    MessageBusiness.prototype.getMessagesTop = function(messageModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";

        sql = sql + " select mes_id, ";
        sql = sql + " mes_transmitter_type,cla_id,cor_id, ";
        sql = sql + " case when mes_transmitter_type = 1 then use_image else use_image end as image, ";
        sql = sql + " CONCAT(use_first_name,' ',use_last_name ) as use_name, ";
        sql = sql + "  (select case when length(mec_message) > 55 then  CONCAT(SUBSTRING(mec_message,1,55), '', '...') else mec_message end  from message_conversation where mes_id = m.mes_id and use_id <>  " + messageModel.use_id + "  order by mec_date desc limit 1) mec_message, ";
        sql = sql + " (select case when TIMESTAMPDIFF(day, mec_date, CURDATE()) > 0 then  CONCAT(TIMESTAMPDIFF(day, mec_date, CURDATE()), '', ' days ago') else 'today' end from message_conversation where mes_id = m.mes_id  and use_id <>  " + messageModel.use_id + "   order by mec_date desc limit 1) mec_date, ";
        sql = sql + " mes_text,  DATE_FORMAT(mes_date, \"%b. %d %Y\") mes_date ";
        sql = sql + " from message m ";
        sql = sql + " inner join user u on m.use_id_transmitter = u.use_id ";
        sql = sql + " inner join user_instructor ui on u.use_id = ui.use_id ";
        sql = sql + " where use_id_receiver = " + messageModel.use_id + " AND mes_status = 'A' ";
        sql = sql + " LIMIT " + messageModel.limit + "; ";

        // filter: 1-All, 2-Starred, 3-Unread, 4-From Students, 5-From Instructor
        if(messageModel.filter == 2)
            sql = sql + " AND mes_star = 'Y' ";
        else if (messageModel.filter == 3)
            sql = sql + " AND mes_read = 'N' ";
        else if (messageModel.filter == 4)
            sql = sql + " AND mes_transmitter_type = 1 ";
        else if (messageModel.filter == 5)
            sql = sql + " AND mes_transmitter_type = 2 ";

        connection.query(sql,function(err,message){
            connection.end();
            if(!err) {

                var collectionMessage = message;

                callback(collectionMessage);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Errorto connect database"});
        });
    };

    MessageBusiness.prototype.getMessagesAmout = function(messageModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select sum(total) as all_messages, ";
        sql = sql + " sum(starred) as starred, ";
        sql = sql + " sum(unread)  as unread, ";
        sql = sql + " sum(student) as student, ";
        sql = sql + " sum(instructor) as instructor, ";
        sql = sql + " sum(archived) AS archived ";
        sql = sql + " from ( ";
        sql = sql + " select ";
        sql = sql + " case when mes_star = 'Y' AND mes_status = 'A' then 1 else 0 end as starred, ";
        sql = sql + " case when mes_read = 'N' AND mes_status = 'A' then 1 else 0 end as unread, ";
        sql = sql + " case when mes_transmitter_type = 1 AND mes_status = 'A' AND use_id_transmitter <> " + messageModel.use_id + " then 1 else 0 end as student, ";
        sql = sql + " case when mes_transmitter_type = 2 AND mes_status = 'A' AND use_id_transmitter <> " + messageModel.use_id + " then 1 else 0 end as instructor, ";
        sql = sql + " CASE WHEN mes_status = 'I' THEN 1 ELSE 0 END AS archived, ";
        sql = sql + " CASE WHEN mes_status = 'A' THEN 1 ELSE 0 END AS total ";
        sql = sql + " from message ";
        sql = sql + " where (use_id_receiver = " + messageModel.use_id + " ";
        sql = sql + " or use_id_transmitter = " + messageModel.use_id + ") ";
        sql = sql + " ) as aux; ";


        connection.query(sql,function(err,message){
            connection.end();
            if(!err) {

                var collectionMessage = message;

                callback(collectionMessage);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });
    };

    MessageBusiness.prototype.getMessagePages = function(messageModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select CEILING(count(*)/ " + messageModel.pages + ") as pages";
        sql = sql + " from message ";
        sql = sql + " where (use_id_receiver = " + messageModel.use_id + " or use_id_transmitter = " + messageModel.use_id + ") ";
        sql = sql + " AND mes_status = 'A' ";


        connection.query(sql,function(err,message){
            connection.end();
            if(!err) {

                var collectionMessage = message;

                callback(collectionMessage);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });
    };

    MessageBusiness.prototype.starMessage = function(messageModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " UPDATE";
        sql = sql + " message ";
        sql = sql + " set mes_star = '" + messageModel.mes_star + "' ";
        sql = sql + " WHERE mes_id = " + messageModel.mes_id;


        connection.query(sql,function(err,message){
            connection.end();
            if(!err) {

                var collectionMessage = message;

                callback(collectionMessage);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });
    };

    MessageBusiness.prototype.archiveMessage = function(messageModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " UPDATE";
        sql = sql + " message ";
        sql = sql + " set mes_status = '" + messageModel.mes_status + "' ";
        sql = sql + " WHERE mes_id = " + messageModel.mes_id;


        connection.query(sql,function(err,message){
            connection.end();
            if(!err) {

                var collectionMessage = message;

                callback(collectionMessage);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });
    };

    MessageBusiness.prototype.getMessageDetails = function(messageModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select mec_id, mec_message, u.use_first_name, DATE_FORMAT(mec_date,\"%M %d %Y at %l:%i %p\") as mec_date, mec_date as mec_date_order, ";
        sql = sql + " (select case when mc.use_id = c.use_id then 'I' else 'S' end ";
        sql = sql + " from message m inner join course c on m.cor_id = c.cor_id ";
        sql = sql + " where mes_id = mc.mes_id) as type, ";
        sql = sql + " case when u.use_id = " + messageModel.use_id + " then u.use_image else  u.use_image end as image ";
        sql = sql + " from message_conversation mc ";
        sql = sql + " inner join user u on mc.use_id = u.use_id ";
        sql = sql + " inner join user_instructor ui on u.use_id = ui.use_id ";
        sql = sql + " where mes_id = " + messageModel.mes_id + " ";
        sql = sql + " order by mec_date_order desc; ";

        connection.query(sql,function(err,message){
            connection.end();
            if(!err) {

                var collectionMessage = message;

                callback(collectionMessage);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });
    };

    MessageBusiness.prototype.postMessage = function(messageModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";

        sql = sql + " insert into message_conversation (mec_message, mec_date, use_id, mes_id) ";
        sql = sql + " values (  ";
        sql = sql + " '" + messageModel.message.replace(/'/g, "\\'") + "',  ";
        sql = sql + " '" + messageModel.date  + "',  ";
        sql = sql + " " + messageModel.use_id + ",  ";
        sql = sql + " " + messageModel.mes_id + "  ";
        sql = sql + " ); ";

        connection.query(sql,function(err,message){
            connection.end();
            if(!err) {
                utilBusiness.MessageNotificationClass(message.insertId);
                var collectionMessage = message;

                callback(collectionMessage);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });
    };

    MessageBusiness.prototype.postMessageStudent = function(messageModel, callback) {

     /*   utilBusiness.processData(messageModel, function(obj){
            messageModel = obj;
        });*/

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";

        sql = sql + " insert into message (mes_text, mes_date, mes_group, mes_status, use_id_transmitter, use_id_receiver, mes_star, ";
        sql = sql + "                     mes_read, mes_transmitter_type, cla_id, cor_id) ";
        sql = sql + "  values ( ";
        sql = sql + " '" + messageModel.mes_text.replace(/'/g, "\\'") + "',  ";
        sql = sql + " '" + messageModel.date  + "',  ";
        sql = sql + " 'N',  ";
        sql = sql + " 'A',  ";
        sql = sql + " " + messageModel.use_id_transmitter + ",  ";
        sql = sql + " " + messageModel.use_id_receiver + ",  ";
        sql = sql + " 'N',  ";
        sql = sql + " 'N',  ";
        sql = sql + " 1,  ";
        sql = sql + " " + messageModel.cla_id + ",  ";
        sql = sql + " " + messageModel.cor_id + "  ";
        sql = sql + "  );";


        connection.query(sql,function(err,message){
            if(!err) {

                var collectionMessage = message;

                var sql = "";

                sql = sql + " insert into message_conversation (mec_message, mec_date, use_id, mes_id) ";
                sql = sql + " values (  ";
                sql = sql + " '" + messageModel.message.replace(/'/g, "\\'") + "',  ";
                sql = sql + " now(),  ";
                sql = sql + " " + messageModel.use_id_transmitter + ",  ";
                sql = sql + " " + message.insertId + "  ";
                sql = sql + " ); ";


                connection.query(sql,function(err,message1){
                    connection.end();
                    if(!err) {

                        utilBusiness.MessageNotificationClass(message1.insertId);

                        var collectionMessageReturn = message1;
                        callback(collectionMessageReturn);
                    }
                });


                callback(collectionMessage);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });
    };

    MessageBusiness.prototype.postMessageMultiple = function(messageModel, callback) {

        var messageModel2 = [];
        var aux = messageModel.message;

        messageModel.use_id_receiver.forEach(function(item, index){

            var messageOriginal =  aux;
            messageModel2 = messageModel;
            messageModel2.message = messageOriginal.replace('[First Name]', messageModel.use_name_receiver[index]);
            messageModel2.use_id_receiver = item;

            MessageBusiness.prototype.postMessageStudentMult(messageModel2,messageModel2.message,messageModel2.use_id_receiver, function(ret){});
        })

        callback("OK");
    };

    MessageBusiness.prototype.postMessageStudentMult = function(messageModel,text,id, callback) {

        /*   utilBusiness.processData(messageModel, function(obj){
         messageModel = obj;
         });*/

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";

        sql = sql + " insert into message (mes_text, mes_date, mes_group, mes_status, use_id_transmitter, use_id_receiver, mes_star, ";
        sql = sql + "                     mes_read, mes_transmitter_type, cla_id, cor_id) ";
        sql = sql + "  values ( ";
        sql = sql + " '" + messageModel.mes_text.replace(/'/g, "\\'") + "',  ";
        sql = sql + " '" + messageModel.date  + "',  ";
        sql = sql + " 'N',  ";
        sql = sql + " 'A',  ";
        sql = sql + " " + messageModel.use_id_transmitter + ",  ";
        sql = sql + " " + id + ",  ";
        sql = sql + " 'N',  ";
        sql = sql + " 'N',  ";
        sql = sql + " 1,  ";
        sql = sql + " " + messageModel.cla_id + ",  ";
        sql = sql + " " + messageModel.cor_id + "  ";
        sql = sql + "  );";


        connection.query(sql,function(err,message){
            if(!err) {

                var collectionMessage = message;

                var sql = "";

                sql = sql + " insert into message_conversation (mec_message, mec_date, use_id, mes_id) ";
                sql = sql + " values (  ";
                sql = sql + " '" + text.replace(/'/g, "\\'") + "',  ";
                sql = sql + " now(),  ";
                sql = sql + " " + messageModel.use_id_transmitter + ",  ";
                sql = sql + " " + message.insertId + "  ";
                sql = sql + " ); ";


                connection.query(sql,function(err,message1){
                    connection.end();
                    if(!err) {

                        utilBusiness.MessageNotificationClass(message1.insertId);

                        var collectionMessageReturn = message1;
                        callback(collectionMessageReturn);
                    }
                });


                callback(collectionMessage);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });
    };

    MessageBusiness.prototype.getClassCourse = function(messageModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";

        sql = sql + " select cla_id,cor_id from message ";
        sql = sql + " where mes_id = " + messageModel.messageId + "; ";

        connection.query(sql,function(err,message){
            connection.end();
            if(!err) {

                var collectionMessage = message[0];
                MessageBusiness.prototype.getInfoMessage(collectionMessage,function(ret){
                    callback(ret);
                })
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });
    };

    MessageBusiness.prototype.getInfoMessage = function(messageModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        if(messageModel.cla_id != null) {

            sql = sql + " SELECT *, ";
            sql = sql + " case ";
            sql = sql + " when number_session > 1 then Concat(number_session, ' Sessions') ";
            sql = sql + " else cla_duration ";
            sql = sql + " end AS number_session,(cla_max_size - students) AS spot_left ";
            sql = sql + " FROM   ( ";

            sql = sql + " select CL.use_id as use_id_instructor, CL.cla_id,Cl.cor_id, cla_session_type, cla_duration, cla_cost, cla_min_size, cla_max_size, cla_address,nullif(cla_location_name,'') as cla_location_name, ";
            sql = sql + "   coalesce(nullif(cor_waiver,''),'') as cor_waiver,cla_status, cla_allow_lateRegistration, cla_allow_lateWithdraw, cla_lateWithdraw_date, ";
            sql = sql + "   cla_latitude, cla_longitude, clt_date, clt_start_time, clt_address, clt_firstClass, cor_name, cor_description, ";
            sql = sql + "   cor_accreditation, cor_accreditation_description, cor_learn, cor_bring, cor_aware_before,cor_about_me, ";
            sql = sql + "   cor_structure, cor_image, cor_added_date, cor_who_isfor, cor_expertise, cor_why_love, ";
            sql = sql + "   cor_style, cor_why_take, CONCAT(coalesce(US.use_first_name,''),' ',coalesce(US.use_last_name,'') ) AS use_name, ";
            sql = sql + "   use_description, use_email, usi_about, usi_expertise, usi_credential, use_image, ";
            sql = sql + "   usi_coached_before, usi_coached_experience, usi_speaking_groups, usi_speaking_experience, ";
            sql = sql + "   DATE_FORMAT(CT.clt_date, \"%b %d\") as dateShow, ";
            sql = sql + "   case  ";
            sql = sql + "       when cla_session_type = 'S' then DATE_FORMAT(cla_deadline, \"%b %d, %Y\")  ";
            sql = sql + "       when cla_session_type = 'M' and cla_allow_lateWithdraw = 'Y' then  DATE_FORMAT(cla_lateWithdraw_date, \"%b %d, %Y\")  ";
            sql = sql + "       when cla_session_type = 'M' and cla_allow_lateWithdraw = 'N' then DATE_FORMAT(cla_deadline, \"%b %d, %Y\")  ";
            sql = sql + "   end as dateShowC , ";
            sql = sql + "   cit_description, pro_code, age_description,col_description, ";
            sql = sql + "   DATE_FORMAT(CT.clt_start_time,\"%l:%i %p\") AS timeShow, DAYNAME(CT.clt_date) AS dayName, ";
            sql = sql + "   TIMESTAMPDIFF(day,CURDATE(),Date_format(CL.cla_deadline, \"%y-%m-%d\")) as cla_deadline2, ";
            sql = sql + "  CASE WHEN Date_format(CL.cla_deadline,\"%Y-%m-%d\") = CURDATE() THEN 'Today' else Date_format(CL.cla_deadline, \"%b %d, %Y\") end AS cla_deadline, ";
            sql = sql + " (select coalesce(count(*),0) from class_review where cor_id = cl.cor_id) AS number_reviews, ";
            sql = sql + " (select coalesce(Sum(cre_stars) / Count(cre_id),0) from class_review  where cor_id = cl.cor_id) star_general, ";
            sql = sql + " (select coalesce(count(clr_id),0) from class_register where cla_id = cl.cla_id and clr_status = 'A') as students, ";
            sql = sql + " (select count(*) from class_time where cla_id = cl.cla_id) AS number_session, ";
            sql = sql + " (select count(wis_id) from wishlist where cor_id = CO.cor_id) wishlist ";
            sql = sql + " from class CL ";
            sql = sql + "   INNER JOIN class_time CT ON CL.cla_id = CT.cla_id  ";
            sql = sql + "   INNER JOIN course CO ON CL.cor_id = CO.cor_id ";
            sql = sql + "   INNER JOIN user US ON CO.use_id = US.use_id ";
            sql = sql + "   INNER JOIN user_instructor UI ON US.use_id = UI.use_id ";
            sql = sql + "   INNER JOIN age AG ON CL.age_id = AG.age_id ";
            sql = sql + "   INNER JOIN course_level LV ON CL.col_id = LV.col_id ";
            sql = sql + "   INNER JOIN city CY ON CL.cit_id = CY.cit_id ";
            sql = sql + "   INNER JOIN province PR ON CY.pro_id = PR.pro_id ";
            sql = sql + " where CL.cla_id = " + messageModel.cla_id + " AND CT.clt_firstClass = 'Y' ";
            sql = sql + " GROUP BY CO.cor_id, CL.cla_id ) AS AUX; ";

        }
        else
        {
            sql = sql + " select CONCAT(coalesce(US.use_first_name,''),' ',coalesce(US.use_last_name,'') ) AS use_name, ";
            sql = sql + " use_image,cor_about_me,cor_bring,cor_aware_before,cor_name,null as cla_id ";
            sql = sql + " from course co ";
            sql = sql + " inner join user us on co.use_id = us.use_id ";
            sql = sql + " where co.cor_id = " + messageModel.cor_id + " ";
        }

        connection.query(sql,function(err,classObj){
            connection.end();
            if(!err) {

                var collectionClass = classObj[0];

                callback(collectionClass);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });
    };


    return new MessageBusiness();
})();

module.exports = MessageBusiness;