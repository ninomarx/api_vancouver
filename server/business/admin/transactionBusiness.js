var factory = require("./../../factory/dbfactory");

var TransactionBusiness = (function() {

    var TransactionBusiness = function() {

    };

    TransactionBusiness.prototype.select = function(transModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " SELECT CR.clr_id,COU.cor_name,DATE_FORMAT(CLAT.clt_date,'%Y-%m-%d') clt_date, ";
        sql = sql + " US1.use_first_name student, US2.use_first_name instructor, ";
        sql = sql + " clr_cost,DATE_FORMAT(clr_added_date,'%Y-%m-%d') clr_added_date, ";
        sql = sql + " CASE WHEN clr_transaction_status = 'W' THEN 'Pending' ";
        sql = sql + " WHEN clr_transaction_status = 'C' THEN 'Cancelled' ";
        sql = sql + " WHEN clr_transaction_status = 'P' THEN 'Complete' ";
        sql = sql + " END clr_transaction_status ";
        sql = sql + " FROM class_register CR ";
        sql = sql + " INNER JOIN class CLA ON CR.cla_id = CLA.cla_id ";
        sql = sql + " INNER JOIN class_time CLAT ON CLA.cla_id = CLAT.cla_id AND CLAT.clt_firstClass = 'Y' ";
        sql = sql + " INNER JOIN course COU ON CR.cor_id = COU.cor_id ";
        sql = sql + " INNER JOIN user US1 ON CR.use_id = US1.use_id ";
        sql = sql + " INNER JOIN user US2 ON COU.use_id = US2.use_id ";
        sql = sql + " ORDER BY clr_id DESC; ";

        connection.query(sql,function(err,transaction){
            connection.end();
            if(!err) {

                var collectionTransaction = transaction;

                callback(collectionTransaction);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });
    };

    return new TransactionBusiness();
})();

module.exports = TransactionBusiness;