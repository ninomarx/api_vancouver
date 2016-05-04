var factory = require("./../factory/dbfactory");

var MessageBusiness = (function() {

    var MessageBusiness = function() {

    };

    MessageBusiness.prototype.getMessages = function(messageModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select mes_id, ";
        sql = sql + " mes_transmitter_type, ";
        sql = sql + " case when mes_transmitter_type = 1 then use_image else usi_image end as image, ";
        sql = sql + " CONCAT(use_first_name,' ',use_last_name ) as use_name, ";
        sql = sql + "  (select case when length(mec_message) > 55 then  CONCAT(SUBSTRING(mec_message,1,55), '', '...') else mec_message end  from message_conversation where mes_id = m.mes_id and use_id <> 2 order by mec_date desc limit 1) mec_message, ";
        sql = sql + " (select case when TIMESTAMPDIFF(day, mec_date, CURDATE()) > 0 then  CONCAT(TIMESTAMPDIFF(day, mec_date, CURDATE()), '', ' days ago') else 'today' end from message_conversation where mes_id = m.mes_id  and use_id <>  " + messageModel.use_id + "   order by mec_date desc limit 1) mec_date, ";
        sql = sql + " mes_text,  DATE_FORMAT(mes_date, \"%b. %d %Y\") mes_date ";
        sql = sql + " from message m ";
        sql = sql + " inner join user u on m.use_id_transmitter = u.use_id ";
        sql = sql + " inner join user_instructor ui on u.use_id = ui.use_id ";
        sql = sql + " where use_id_receiver = " + messageModel.use_id + " AND mes_status = 'A' ";

        // filter: 1-All, 2-Starred, 3-Unread, 4-From Students, 5-From Instructor
        if(messageModel.filter == 2)
            sql = sql + " AND mes_star = 'S' ";
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

    MessageBusiness.prototype.getMessagesTop = function(messageModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";

        sql = sql + " select mes_id, ";
        sql = sql + " mes_transmitter_type, ";
        sql = sql + " case when mes_transmitter_type = 1 then use_image else usi_image end as image, ";
        sql = sql + " CONCAT(use_first_name,' ',use_last_name ) as use_name, ";
        sql = sql + "  (select case when length(mec_message) > 55 then  CONCAT(SUBSTRING(mec_message,1,55), '', '...') else mec_message end  from message_conversation where mes_id = m.mes_id and use_id <> 2 order by mec_date desc limit 1) mec_message, ";
        sql = sql + " (select case when TIMESTAMPDIFF(day, mec_date, CURDATE()) > 0 then  CONCAT(TIMESTAMPDIFF(day, mec_date, CURDATE()), '', ' days ago') else 'today' end from message_conversation where mes_id = m.mes_id  and use_id <>  " + messageModel.use_id + "   order by mec_date desc limit 1) mec_date, ";
        sql = sql + " mes_text,  DATE_FORMAT(mes_date, \"%b. %d %Y\") mes_date ";
        sql = sql + " from message m ";
        sql = sql + " inner join user u on m.use_id_transmitter = u.use_id ";
        sql = sql + " inner join user_instructor ui on u.use_id = ui.use_id ";
        sql = sql + " where use_id_receiver = " + messageModel.use_id + " AND mes_status = 'A' ";
        sql = sql + " LIMIT " + messageModel.limit + "; ";

        // filter: 1-All, 2-Starred, 3-Unread, 4-From Students, 5-From Instructor
        if(messageModel.filter == 2)
            sql = sql + " AND mes_star = 'S' ";
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
        sql = sql + " select count(*) as all_messages, ";
        sql = sql + " sum(starred) as starred, ";
        sql = sql + " sum(unread)  as unread, ";
        sql = sql + " sum(student) as student, ";
        sql = sql + " sum(instructor) as instructor ";
        sql = sql + " from ( ";
        sql = sql + " select ";
        sql = sql + " case when mes_star = 'S' then 1 else 0 end as starred, ";
        sql = sql + " case when mes_read = 'N' then 1 else 0 end as unread, ";
        sql = sql + " case when mes_transmitter_type = 1 then 1 else 0 end as student, ";
        sql = sql + " case when mes_transmitter_type = 2 then 1 else 0 end as instructor ";
        sql = sql + " from message ";
        sql = sql + " where use_id_receiver = " + messageModel.use_id + " ";
        sql = sql + " AND mes_status = 'A' ";
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
        sql = sql + " select count(*)/ " + messageModel.pages;
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


    return new MessageBusiness();
})();

module.exports = MessageBusiness;