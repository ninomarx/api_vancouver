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
        sql = sql + " mes_transmitter_type,mes_star,cla_id, mes_status,";
        sql = sql + " case when mes_transmitter_type = 1 then use_image else use_image end as image, ";
        sql = sql + " CONCAT(use_first_name,' ',use_last_name ) as use_name, ";
        sql = sql + "  (select case when length(mec_message) > 55 then  CONCAT(SUBSTRING(mec_message,1,55), '', '...') else mec_message end  from message_conversation where mes_id = m.mes_id and use_id <>  " + messageModel.use_id + " order by mec_date desc limit 1) mec_message, ";
        sql = sql + " (select case when TIMESTAMPDIFF(day, mec_date, CURDATE()) > 0 then  CONCAT(TIMESTAMPDIFF(day, mec_date, CURDATE()), '', ' days ago') else 'today' end from message_conversation where mes_id = m.mes_id  and use_id <>  " + messageModel.use_id + "   order by mec_date desc limit 1) mec_date, ";
        sql = sql + " mes_text,  DATE_FORMAT(mes_date, \"%b. %d %Y\") mes_date ";
        sql = sql + " from message m ";
        sql = sql + " inner join user u on m.use_id_transmitter = u.use_id ";
        sql = sql + " inner join user_instructor ui on u.use_id = ui.use_id ";
        sql = sql + " where use_id_receiver = " + messageModel.use_id + ") ";

        sql = sql + " union all ";

        sql = sql + " (select mes_id,use_id_receiver,use_id_transmitter, ";
        sql = sql + " mes_transmitter_type,mes_star,cla_id,mes_status, ";
        sql = sql + " case when mes_transmitter_type = 1 then use_image else use_image end as image, ";
        sql = sql + " CONCAT(use_first_name,' ',use_last_name ) as use_name, ";
        sql = sql + "  (select case when length(mec_message) > 55 then  CONCAT(SUBSTRING(mec_message,1,55), '', '...') else mec_message end  from message_conversation where mes_id = m.mes_id and use_id <>  " + messageModel.use_id + " order by mec_date desc limit 1) mec_message, ";
        sql = sql + " (select case when TIMESTAMPDIFF(day, mec_date, CURDATE()) > 0 then  CONCAT(TIMESTAMPDIFF(day, mec_date, CURDATE()), '', ' days ago') else 'today' end from message_conversation where mes_id = m.mes_id  and use_id <>  " + messageModel.use_id + "   order by mec_date desc limit 1) mec_date, ";
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

        sql = sql + " LIMIT  " + messageModel.page + "," + messageModel.pages + ";";

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
        sql = sql + " mes_transmitter_type,cla_id, ";
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
        sql = sql + " where use_id_receiver = " + messageModel.use_id + " ";
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
        sql = sql + " select mec_id, mec_message, u.use_first_name, DATE_FORMAT(mec_date,\"%M %d %Y at %l:%i %p\") as mec_date, ";
        sql = sql + " case when u.use_id = " + messageModel.use_id + " then 'S' else 'I' end as type, ";
        sql = sql + " case when u.use_id = " + messageModel.use_id + " then u.use_image else  u.use_image end as image ";
        sql = sql + " from message_conversation mc ";
        sql = sql + " inner join user u on mc.use_id = u.use_id ";
        sql = sql + " inner join user_instructor ui on u.use_id = ui.use_id ";
        sql = sql + " where mes_id = " + messageModel.mes_id + " ";
        sql = sql + " order by mec_date desc, mec_id desc; ";

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
        sql = sql + " now(),  ";
        sql = sql + " " + messageModel.use_id + ",  ";
        sql = sql + " " + messageModel.mes_id + "  ";
        sql = sql + " ); ";

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

    MessageBusiness.prototype.postMessageStudent = function(messageModel, callback) {

        utilBusiness.processData(messageModel, function(obj){
            messageModel = obj;
        });

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";

        sql = sql + " insert into message (mes_text, mes_date, mes_group, mes_status, use_id_transmitter, use_id_receiver, mes_star, ";
        sql = sql + "                     mes_read, mes_transmitter_type, cla_id) ";
        sql = sql + "  values ( ";
        sql = sql + " '" + messageModel.mes_text.replace(/'/g, "\\'") + "',  ";
        sql = sql + " now(),  ";
        sql = sql + " 'N',  ";
        sql = sql + " 'A',  ";
        sql = sql + " " + messageModel.use_id_transmitter + ",  ";
        sql = sql + " " + messageModel.use_id_receiver + ",  ";
        sql = sql + " 'N',  ";
        sql = sql + " 'N',  ";
        sql = sql + " 1,  ";
        sql = sql + " " + messageModel.cla_id + "  ";
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

        messageModel.use_id_receiver.forEach(function(item){

            messageModel2 = messageModel;
            messageModel2.use_id_receiver = item;

            MessageBusiness.prototype.postMessageStudent(messageModel2,function(ret){});
        })

        callback("OK");
    };


    return new MessageBusiness();
})();

module.exports = MessageBusiness;