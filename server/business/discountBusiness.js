var factory = require("./../factory/dbfactory");

var DiscountBusiness = (function() {

    var DiscountBusiness = function() {

    };

    DiscountBusiness.prototype.save = function(discountModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";

        sql = sql + " insert into class_discount (cla_id,cld_early,cld_early_discount,ld_early_limit,cld_early_deadline,cld_last,cld_last_discount)";
        sql = sql + " values( ";
        sql = sql + " " + discountModel.cla_id + ", ";
        sql = sql + " '" + discountModel.cld_early + "', ";
        sql = sql + " " + discountModel.cld_early_discount + ", ";
        sql = sql + " " + discountModel.ld_early_limit + ", ";
        sql = sql + " '" + discountModel.cld_early_deadline + "', ";
        sql = sql + " '" + discountModel.cld_last + "', ";
        sql = sql + " " + discountModel.cld_last_discount + " ";
        sql = sql + " ) ";

        connection.query(sql,function(err,age){
            connection.end();
            if(!err) {

                var collectionAge = age;

                callback(collectionAge);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });
    };

    DiscountBusiness.prototype.saveCodes = function(discountModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";

        sql = sql + " insert into class_promo_codes (cla_id,cpc_code_name,cpc_discount,cpc_limit,cpc_deadline,)";
        sql = sql + " values( ";
        sql = sql + " " + discountModel.cla_id + ", ";
        sql = sql + " '" + discountModel.cpc_code_name + "', ";
        sql = sql + " " + discountModel.cpc_discount + ", ";
        sql = sql + " " + discountModel.cpc_limit + ", ";
        sql = sql + " '" + discountModel.cpc_deadline + "' ";
        sql = sql + " ) ";

        connection.query(sql,function(err,age){
            connection.end();
            if(!err) {

                var collectionAge = age;

                callback(collectionAge);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });
    };

    return new DiscountBusiness();
})();

module.exports = DiscountBusiness;