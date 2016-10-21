var factory         = require("./../factory/dbfactory");
var paymentBusiness = require("./../business/paymentBusiness");
var utilBusiness    = require("./../business/utilBusiness");

var RegisterBusiness = (function() {

    var RegisterBusiness = function() {

    };

    var time_zone_date = " DATE_FORMAT(CONVERT_TZ(now(),'-00:00', cit_time_zone),'%Y-%m-%d') ";

    RegisterBusiness.prototype.save = function(registerModel, callback) {

        var clr_instructor_value = 0;
        RegisterBusiness.prototype.taxVerify(registerModel,function(ret){
            if(registerModel.code_type == '' || registerModel.code_type == 1) {
                clr_instructor_value = registerModel.cor_cost - ret[0].ret - 0.30;
            }else{
                clr_instructor_value = (registerModel.cor_cost + registerModel.clr_discount) - ret[0].ret - 0.30;
            }

            var connection = factory.getConnection();
            connection.connect();

            var status1 = 'A', status2 = 'W';
            if(registerModel.cor_cost == 0){
                status1 = 'A';
                status2 = 'P';
            }

            var sql = "";

            sql = sql + " INSERT INTO class_register (clr_cost, clr_added_date, clr_status, clr_transaction_status,cla_id, use_id, cor_id, clr_cancel_date, " ;
            sql = sql + "                             clr_instructor_value,clr_course_goal,clr_discount,clr_discount_code,clr_cotuto_credit,clr_transfered) ";
            sql = sql + " VALUES( ";
            sql = sql + "  " + registerModel.cor_cost + " , ";
            sql = sql + "  '" + registerModel.clr_added_date + "', ";
            sql = sql + " '"+status1+"', "; // A:active, I: Inactive
            sql = sql + " '"+status2+"', "; // W:waiting, P:paid, C:cancelled
            sql = sql + " " + registerModel.cla_id + ",  ";
            sql = sql + " " + registerModel.use_id + ",  ";
            sql = sql + " " + registerModel.cor_id + ",   ";
            sql = sql + " null,   ";
            sql = sql + " " + clr_instructor_value + ",   ";
            sql = sql + " '" + registerModel.clr_course_goal.replace(/'/g, "\\'") + "',  ";
            sql = sql + " " + registerModel.clr_discount + ",   ";
            sql = sql + " '" + registerModel.code + "',   ";
            sql = sql + " " + registerModel.credit + ",  ";
            sql = sql + " 'N'  ";
            sql = sql + " ); ";

            sql = sql + " UPDATE User SET use_first_name = '" + registerModel.use_first_name + "', use_last_name = '" + registerModel.use_last_name + "', use_phone = '" + registerModel.use_phone + "',use_credit = use_credit - " + registerModel.credit + " ";
            sql = sql + " WHERE use_id = " + registerModel.use_id + "; ";

            connection.query(sql,function(err,registerObj){
                //connection.end();
                if(!err) {

                    var collectionClassRegister = registerObj[0];

                    if(registerModel.cor_cost > 0) {

                        paymentBusiness.chargeAll(collectionClassRegister.insertId, function (id) {
                            var sql = "";
                            var ret = "";
                            if (id != "" && id != undefined) {
                                sql = sql + " UPDATE class_register SET clr_stripe_code = '" + id + "'";
                                sql = sql + " WHERE clr_id = " + collectionClassRegister.insertId + "; ";
                                var ret = "OK";
                            } else {
                                sql = sql + " DELETE FROM class_register ";
                                sql = sql + " WHERE clr_id = " + collectionClassRegister.insertId + "; ";
                                var ret = "NOK";
                            }

                            connection.query(sql, function (err, retObj) {
                                connection.end();
                                if (!err) {
                                    utilBusiness.InstructorRegistrationNotification(collectionClassRegister.insertId);
                                    var collectionRet = retObj;
                                    callback(ret);
                                }
                            });

                        })
                    }
                    else
                    {
                        callback("OK");
                    }

                }
            });

            connection.on('error', function(err) {
                connection.end();
                callback({"code" : 100, "status" : "database error"});
            });
        })
    };

    RegisterBusiness.prototype.cancel = function(registerModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";

        sql = sql + " update class_register ";
        sql = sql + " set clr_transaction_status = 'C', clr_status = 'I',clr_cancel_date = curdate() ";
        sql = sql + " where cla_id = " + registerModel.cla_id  + " and use_id = " + registerModel.use_id  + " ";

        if(registerModel.cor_cost > 0) {
            paymentBusiness.refund(registerModel.clr_stripe_code);
        }

        connection.query(sql,function(err,registerObj){
            if(!err) {
                utilBusiness.UserCancellationRecord(registerModel.clr_id);
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
        sql = sql + " when cla_allow_lateWithdraw = 'N' and "+time_zone_date+" <= cla_deadline then 'Y' ";
        sql = sql + " when cla_allow_lateWithdraw = 'N' and "+time_zone_date+" > cla_deadline then 'N' ";
        sql = sql + " when cla_allow_lateWithdraw = 'Y' and "+time_zone_date+" <= cla_lateWithdraw_date then 'Y' ";
        sql = sql + " when cla_allow_lateWithdraw = 'Y' and "+time_zone_date+" > cla_lateWithdraw_date then 'N' ";
        sql = sql + " else 'N' ";
        sql = sql + " end as cancel_allow, c.cla_cost, co.cor_name, date_format(clt_date,\"%Y-%m-%d\") date_class, c.cla_id, ";
        sql = sql + " (select clr_stripe_code from class_register where cla_id = " + registerModel.cla_id + " and use_id = " + registerModel.use_id + " and clr_status = 'A' limit 1) as clr_stripe_code,";
        sql = sql + " (select clr_id from class_register where cla_id = " + registerModel.cla_id + " and use_id = " + registerModel.use_id + " and clr_status = 'A' limit 1) as clr_id";
        sql = sql + " from class c ";
        sql = sql + " inner join class_time ct on c.cla_id = ct.cla_id and ct.clt_firstClass = 'Y' ";
        sql = sql + " inner join course co on c.cor_id = co.cor_id ";
        sql = sql + " inner join city ci on c.cit_id = ci.cit_id ";
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

    RegisterBusiness.prototype.saveVerify = function(registerModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select ";
        sql = sql + " case ";
        sql = sql + "    when clr_count >= cla_max_size  then 'COD011' ";
        sql = sql + "    when use_id = " + registerModel.use_id  + "  then 'COD007' ";
        sql = sql + "    when clr_id is not null then 'COD010' ";
        sql = sql + "    when validDate <>'Y' then 'COD008' ";
        sql = sql + "    when codStripe is null then 'COD009' ";
        sql = sql + "    else 'COD001' ";
        sql = sql + " end as ret";
        sql = sql + " from ( ";
        sql = sql + " select cou.use_id,cla_max_size, ";
        sql = sql + " case ";
        sql = sql + "    when cla_allow_lateRegistration = 'N' and "+time_zone_date+" > cla_deadline then 'N' ";
        sql = sql + "    when cla_allow_lateRegistration = 'N' and "+time_zone_date+" <=cla_deadline then 'Y' ";
        sql = sql + "    when cla_allow_lateRegistration = 'S' and "+time_zone_date+" > ct.clt_date then'N' ";
        sql = sql + "    when cla_allow_lateRegistration = 'S' and "+time_zone_date+" <= ct.clt_date then'Y' ";
        sql = sql + " end as validDate, ";
        sql = sql + " (select costumerIdStripe from user where use_id = " + registerModel.use_id  + ") as codStripe, ";
        sql = sql + " (select clr_id from class_register where cla_id = " + registerModel.cla_id  + " and use_id = " + registerModel.use_id  + " and clr_status = 'A'  limit 1) as clr_id, ";
        sql = sql + " (select count(clr_id) from class_register where cla_id = " + registerModel.cla_id  + " and clr_status = 'A'  limit 1) as clr_count ";
        sql = sql + " from class c ";
        sql = sql + " inner join class_time ct on c.cla_id = ct.cla_id and clt_firstClass = 'Y' ";
        sql = sql + " inner join course cou on c.cor_id = cou.cor_id ";
        sql = sql + " inner join city ci on c.cit_id = ci.cit_id ";
        sql = sql + " where c.cla_id = " + registerModel.cla_id  + ") as aux ";


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

    RegisterBusiness.prototype.taxVerify = function(registerModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";

        sql = sql + " select ";
        sql = sql + " case ";
        if(registerModel.code_type == '' || registerModel.code_type == 1) {
            sql = sql + " when codSourceOk = 'Y' then ((" + registerModel.cor_cost + " * linkTax)/100) ";
            sql = sql + " else ((" + registerModel.cor_cost + " * generalTax)/100) ";
        }else{
            sql = sql + " when codSourceOk = 'Y' then ((cla_cost * linkTax)/100) ";
            sql = sql + " else ((cla_cost * generalTax)/100) ";
        }
        sql = sql + " end as ret ";
        sql = sql + " from ( ";
        sql = sql + " select cla_cost, ";
        sql = sql + " (select adc_value from admin_config WHERE adc_param = 'GENERAL_TAX') generalTax, ";
        sql = sql + " (select adc_value from admin_config WHERE adc_param = 'LINK_TAX') linkTax, ";
        sql = sql + " case ";
        sql = sql + " when coalesce(cla_codSource,'') <> '" + registerModel.codSource + "' then 'N' ";
        sql = sql + " when coalesce(cla_codSource,'') =  '" + registerModel.codSource + "' then 'Y' ";
        sql = sql + " end as codSourceOk ";
        sql = sql + " from class ";
        sql = sql + " where cla_id = " + registerModel.cla_id + " ) as aux ";



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