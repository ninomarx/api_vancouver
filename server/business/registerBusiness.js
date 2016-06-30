var factory = require("./../factory/dbfactory");

var RegisterBusiness = (function() {

    var RegisterBusiness = function() {

    };

    RegisterBusiness.prototype.save = function(registerModel, callback) {

        var clr_instructor_value = 0;
        RegisterBusiness.prototype.taxVerify(registerModel,function(ret){
            if(registerModel.code_type == '' || registerModel.code_type == 1) {
                clr_instructor_value = registerModel.cor_cost - ret[0].ret;
            }else{
                clr_instructor_value = (registerModel.cor_cost + registerModel.clr_discount) - ret[0].ret;
            }

            var connection = factory.getConnection();
            connection.connect();

            var sql = "";

            sql = sql + " INSERT INTO class_register (clr_cost, clr_added_date, clr_status, clr_transaction_status, cla_id, use_id, cor_id, clr_cancel_date, clr_instructor_value,clr_course_goal,clr_discount,clr_discount_code) ";
            sql = sql + " VALUES( ";
            sql = sql + "  " + registerModel.cor_cost + " , ";
            sql = sql + "  '" + registerModel.clr_added_date + "', ";
            sql = sql + " 'A', "; // A:active, I: Inactive
            sql = sql + " 'W', "; // W:waiting, P:paid, C:cancelled
            sql = sql + " " + registerModel.cla_id + ",  ";
            sql = sql + " " + registerModel.use_id + ",  ";
            sql = sql + " " + registerModel.cor_id + ",   ";
            sql = sql + " null,   ";
            sql = sql + " " + clr_instructor_value + ",   ";
            sql = sql + " '" + registerModel.clr_course_goal + "',  ";
            sql = sql + " " + registerModel.clr_discount + ",   ";
            sql = sql + " '" + registerModel.code + "'   ";
            sql = sql + " ); ";

            sql = sql + " UPDATE User SET use_first_name = '" + registerModel.use_first_name + "', use_last_name = '" + registerModel.use_last_name + "', use_phone = '" + registerModel.use_phone + "' ";
            sql = sql + " WHERE use_id = " + registerModel.use_id + "; ";

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
        })
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
        sql = sql + "    when cla_allow_lateRegistration = 'N' and DATE_FORMAT(now(),'%Y-%m-%d') > cla_deadline then 'N' ";
        sql = sql + "    when cla_allow_lateRegistration = 'N' and DATE_FORMAT(now(),'%Y-%m-%d') <=cla_deadline then 'Y' ";
        sql = sql + "    when cla_allow_lateRegistration = 'S' and DATE_FORMAT(now(),'%Y-%m-%d') > ct.clt_date then'N' ";
        sql = sql + "    when cla_allow_lateRegistration = 'S' and DATE_FORMAT(now(),'%Y-%m-%d') <= ct.clt_date then'Y' ";
        sql = sql + " end as validDate, ";
        sql = sql + " (select costumerIdStripe from user where use_id = " + registerModel.use_id  + ") as codStripe, ";
        sql = sql + " (select clr_id from class_register where cla_id = " + registerModel.cla_id  + " and use_id = " + registerModel.use_id  + " and clr_status = 'A'  limit 1) as clr_id, ";
        sql = sql + " (select count(clr_id) from class_register where cla_id = " + registerModel.cla_id  + " and clr_status = 'A'  limit 1) as clr_count ";
        sql = sql + " from class c ";
        sql = sql + " inner join class_time ct on c.cla_id = ct.cla_id and clt_firstClass = 'Y' ";
        sql = sql + " inner join course cou on c.cor_id = cou.cor_id ";
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