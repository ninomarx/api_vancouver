var factory = require("./../factory/dbfactory");
var stripe = require("stripe")("sk_test_460XHEvqOdYJFTRiy4zP88ha");
//var stripe = require("stripe")("sk_live_KsGnJ5V6z1BJKdCuhdq47Zhz");

var PaymentBusiness = (function() {

    var PaymentBusiness = function() {

    };

    PaymentBusiness.prototype.createToken = function(paymentModel,callback) {

        stripe.tokens.create({
            card: {
                "number": paymentModel.number,
                "exp_month": paymentModel.exp_month,
                "exp_year": paymentModel.exp_year,
                "cvc": paymentModel.cvc
            }
        }, function(err, token) {
            if(!err) {
                PaymentBusiness.prototype.costumerCreate(token, paymentModel,function(msg){
                    callback(msg);
                });
            }
            else{
                callback(err.message);
            }
        });

    };

    PaymentBusiness.prototype.costumerCreate = function(token,paymentModel,callback) {

        stripe.customers.create({
            description: paymentModel.description,
            source: token.id
        }, function(err, customer) {
            if(!err) {
                PaymentBusiness.prototype.saveStripeCostumer(customer.id, paymentModel.use_id, paymentModel.use_card);
                callback("OK");
            }
            else{
                callback(err.message);
            }
        });
    };

    PaymentBusiness.prototype.saveStripeCostumer = function(costumerIdStripe,use_id,use_card) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " UPDATE";
        sql = sql + " user ";
        sql = sql + " set costumerIdStripe = '" + costumerIdStripe + "' ";
        sql = sql + " ,use_card = '" + use_card + "' ";
        sql = sql + " WHERE use_id = " + use_id;

        connection.query(sql,function(err,user){
            connection.end();
            if(!err) {

            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });

    };

    PaymentBusiness.prototype.charge = function(paymentModel, callback) {

        PaymentBusiness.prototype.getStripeCostumer(paymentModel);
    };

    PaymentBusiness.prototype.getStripeCostumer = function(paymentModel) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select costumerIdStripe from user ";
        sql = sql + " WHERE use_id = " + paymentModel.use_id;

        connection.query(sql,function(err,user){
            connection.end();
            if(!err) {
                PaymentBusiness.prototype.getStripeAccount(paymentModel,user[0].costumerIdStripe);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });
    };

    PaymentBusiness.prototype.chargeCustomer = function(paymentModel,accountIdStripe,callback) {

        stripe.charges.create({
            amount: paymentModel.amount,
            currency: "cad",
            customer: paymentModel.costumerIdStripe,
            description: paymentModel.description
            //destination: accountIdStripe,
            // application_fee: paymentModel.fee

        }, function(err, charge) {
            if (err) {
                callback();
            }
            else{
                if(charge.captured) {
                    PaymentBusiness.prototype.updatePayment(paymentModel.clr_id);
                    callback(charge.id);
                }
                else{
                    callback();
                }
            }
        })
    };

    PaymentBusiness.prototype.createAccount = function(paymentModel) {

        stripe.accounts.create({
            managed: false,
            country: 'CA',
            email: paymentModel.use_email
        }, function(err, account) {
            PaymentBusiness.prototype.saveStripeAccount(account.id,paymentModel);
        });

    };

    PaymentBusiness.prototype.saveStripeAccount = function(accountIdStripe,paymentModel) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " UPDATE";
        sql = sql + " user_instructor ";
        sql = sql + " set accountIdStripe = '" + accountIdStripe + "' ";
        sql = sql + " WHERE use_id = " + paymentModel.use_id + "; ";

  /*      sql = sql + " UPDATE";
        sql = sql + " user ";
        sql = sql + " set use_type = 2 ";
        sql = sql + " WHERE use_id = " + paymentModel.use_id + "; ";*/

        connection.query(sql,function(err,user){
            connection.end();
            if(!err) {

            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });

    };

    PaymentBusiness.prototype.getStripeAccount = function(paymentModel,callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select accountIdStripe from user_instructor ";
        sql = sql + " WHERE use_id = " + paymentModel.use_id_instructor;

        connection.query(sql,function(err,user){
            connection.end();
            if(!err) {
                PaymentBusiness.prototype.chargeCustomer(paymentModel, user[0].accountIdStripe,function(item){
                    callback(item);
                });
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });
    };

    PaymentBusiness.prototype.chargeAll = function(clr_id,callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select * from ( ";
        sql = sql + " select clr_id,CAST((clr_cost*100) AS DECIMAL(18,0)) as amount, co.use_id as use_id_instructor, ";
        sql = sql + " CAST(((clr_cost - clr_instructor_value) * 100) AS DECIMAL(18,0)) as fee, ";
        sql = sql + " co.cor_name as description, u.costumerIdStripe, ";
        sql = sql + " (SELECT max(clt_date) FROM class_time WHERE cla_id = cr.cla_id) as date_class ";
        sql = sql + " from class_register cr ";
        sql = sql + " inner join course co on cr.cor_id = co.cor_id ";
        sql = sql + " inner join user u on cr.use_id = u.use_id ";
        sql = sql + " where clr_status = 'A' ";
        sql = sql + " AND clr_transaction_status = 'W' ";
        sql = sql + " ) as aux ";
        //sql = sql + " where  DATE_FORMAT(now(),'%Y-%m-%d') >  DATE_ADD(date_class, INTERVAL 3 DAY); ";
        sql = sql + " where clr_id = " + clr_id + "; ";


        connection.query(sql,function(err,user_charge){
            connection.end();
            if(!err) {
                PaymentBusiness.prototype.getStripeAccount(user_charge[0],function(item){
                    callback(item);
                });

            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });

    };

    PaymentBusiness.prototype.CreditRefund = function(callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select clr_id,accountIdStripe,amount,cor_name from ( ";
        sql = sql + " select clr_id,u.accountIdStripe, clr_cotuto_credit, co.cor_name, CAST((clr_instructor_value*100)as decimal(18,0)) as amount, ";
        sql = sql + " (SELECT max(clt_date) FROM class_time WHERE cla_id = cr.cla_id) as date_class ";
        sql = sql + " from class_register cr ";
        sql = sql + " inner join course co on cr.cor_id = co.cor_id ";
        sql = sql + " inner join user_instructor u on co.use_id = u.use_id ";
        sql = sql + " where clr_status = 'A' ";
        sql = sql + " AND clr_transaction_status = 'P' ";
        sql = sql + " AND clr_transfered = 'N' ";
        sql = sql + " ) as aux ";
        sql = sql + " where  DATE_FORMAT(now(),'%Y-%m-%d') >  DATE_ADD(date_class, INTERVAL 3 DAY) ";


        connection.query(sql,function(err,user_charge){
            connection.end();
            if(!err) {
                user_charge.forEach(function (item){
                    PaymentBusiness.prototype.transferInstructor(item);
                })

                callback("OK");
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });

    };

    PaymentBusiness.prototype.transferInstructor = function(transferModel) {

        stripe.transfers.create({
            amount: transferModel.amount,
            currency: "cad",
            destination: transferModel.accountIdStripe,
            description: transferModel.cor_name

        }, function(err, charge) {
            if (err) {
            }
            else{
                PaymentBusiness.prototype.updateTransfer(transferModel.clr_id);
            }
        })
    };

    PaymentBusiness.prototype.updateTransfer = function(clr_id) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " UPDATE class_register SET clr_transfered = 'Y' ";
        sql = sql + " WHERE clr_id = " + clr_id + " ;";

        connection.query(sql,function(err,user_charge){
            connection.end();
            if(!err) {

            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });

    };

    PaymentBusiness.prototype.updatePayment = function(clr_id) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " UPDATE";
        sql = sql + " class_register ";
        sql = sql + " set clr_transaction_status = 'P' ";
        sql = sql + " WHERE clr_id = " + clr_id + "; ";

        connection.query(sql,function(err,user){
            connection.end();
            if(!err) {

            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });

    };

    PaymentBusiness.prototype.refund = function(paymentModel) {

        stripe.refunds.create({
            charge: paymentModel
        }, function(err, refund) {
            if (err) {
            }
            else{
            }
        });
    };


    return new PaymentBusiness();
})();

module.exports = PaymentBusiness;