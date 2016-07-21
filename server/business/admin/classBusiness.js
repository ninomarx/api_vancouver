var factory = require("./../../factory/dbfactory");

var ClassBusiness = (function() {

    var ClassBusiness = function() {

    };

    ClassBusiness.prototype.select = function(classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";

        sql = sql + " SELECT cla.cla_id,cou.cor_name, date_format(ct.clt_date,'%Y-%m-%d') clt_date,user.use_first_name, ";
        sql = sql + " user.use_last_name,cla_cost,date_format(cla.cla_deadline,'%Y-%m-%d') cla_deadline,cla.cla_max_size, ";
        sql = sql + " case when cla.cla_session_type = 'S' then 'Single' else 'Multiple' end as class_type, ";
        sql = sql + " (select COUNT(CR.clr_id) from class_register CR where cla.cla_id = CR.cla_id and CR.clr_status = 'A') qtde_students, ";
        sql = sql + " case when cla.cla_status = 'A' and curdate() <= cla.cla_deadline then 'Open' ";
        sql = sql + " when cla.cla_status = 'A' and curdate() > ct.clt_date then 'Completed' ";
        sql = sql + " when cla.cla_status = 'A' and curdate() > cla.cla_deadline then 'Closed' ";
        sql = sql + " when cla.cla_status = 'I'then 'Cancelled' ";
        sql = sql + " else 'Unknown' ";
        sql = sql + " end as status ";
        sql = sql + " FROM class cla ";
        sql = sql + " INNER JOIN course cou ON cla.cor_id = cou.cor_id ";
        sql = sql + " INNER JOIN class_time ct ON cla.cla_id = ct.cla_id and ct.clt_firstClass = 'Y' ";
        sql = sql + " INNER JOIN user user ON cou.use_id = user.use_id; ";


        connection.query(sql,function(err,classes){
            connection.end();
            if(!err) {

                var collectionClass = classes;

                callback(collectionClass);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });
    };

    return new ClassBusiness();
})();

module.exports = ClassBusiness;