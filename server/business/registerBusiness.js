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

    return new RegisterBusiness();
})();

module.exports = RegisterBusiness;