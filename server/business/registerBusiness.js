var factory = require("./../factory/dbfactory");

var RegisterBusiness = (function() {

    var RegisterBusiness = function() {

    };

    RegisterBusiness.prototype.save = function(registerModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";

        sql = sql + " INSERT INTO class_register (clr_cost, clr_added_date, clr_status, clr_transaction_status, cla_id, use_id, cor_id) ";
        sql = sql + " VALUES( ";
        sql = sql + "  " + registerModel.cor_cost + " , ";
        sql = sql + " NOW(), ";
        sql = sql + " 'A', "; // A:active, I: Inactive
        sql = sql + " 'W', "; // W:waiting, P:paid, C:cancelled
        sql = sql + " " + registerModel.cla_id + ",  ";
        sql = sql + " " + registerModel.use_id + ",  ";
        sql = sql + " " + registerModel.cor_id + "   ";
        sql = sql + " ) ";



        connection.query(sql,function(err,registerObj){
            connection.end();
            if(!err) {

                var collectionClassRegister = registerObj;

                callback(collectionClassRegister);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });


    };

    RegisterBusiness.prototype.cancel = function(registerModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";

        sql = sql + " update class_register ";
        sql = sql + " set clr_transaction_status = 'C', clr_status = 'I' ";
        sql = sql + " where cla_id = " + registerModel.cla_id  + " and use_id = " + registerModel.use_id  + " ";

        connection.query(sql,function(err,registerObj){
            if(!err) {
                callback(registerObj);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });
    };

    RegisterBusiness.prototype.cancelVerify = function(registerModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select case ";
        sql = sql + " when cla_allow_lateWithdraw = 'N' and now() <= cla_deadline then 'Y' ";
        sql = sql + " when cla_allow_lateWithdraw = 'N' and now() > cla_deadline then 'N' ";
        sql = sql + " when cla_allow_lateWithdraw = 'Y' and now() <= cla_lateWithdraw_date then 'Y' ";
        sql = sql + " when cla_allow_lateWithdraw = 'Y' and now() > cla_lateWithdraw_date then 'N' ";
        sql = sql + " else 'N' ";
        sql = sql + " end as cancel_allow, co.cor_name, date_format(clt_date,\"%Y-%m-%d\") date_class, c.cla_id ";
        sql = sql + " from class c ";
        sql = sql + " inner join class_time ct on c.cla_id = ct.cla_id and ct.clt_firstClass = 'Y' ";
        sql = sql + " inner join course co on c.cor_id = co.cor_id ";
        sql = sql + " where c.cla_id = " + registerModel.cla_id  + "; ";


        connection.query(sql,function(err,registerObj){
            if(!err) {
                callback(registerObj);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });
    };

    return new RegisterBusiness();
})();

module.exports = RegisterBusiness;