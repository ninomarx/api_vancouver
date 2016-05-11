var factory = require("./../factory/dbfactory");
var stripe = require("stripe")("sk_test_460XHEvqOdYJFTRiy4zP88ha");

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
                PaymentBusiness.prototype.costumerCreate(token, paymentModel);
                callback(token);
            }
        });

    };

    PaymentBusiness.prototype.costumerCreate = function(token,paymentModel) {

        stripe.customers.create({
            description: paymentModel.description,
            source: token.id
        }, function(err, customer) {
            PaymentBusiness.prototype.saveStripeCostumer(customer.id,paymentModel.use_id,paymentModel.use_card);
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

    PaymentBusiness.prototype.chargeCustomer = function(paymentModel,customer_id,accountIdStripe) {

        stripe.charges.create({
            amount: paymentModel.amount,
            currency: "cad",
            customer: customer_id,
            description: paymentModel.description,
            destination: accountIdStripe,
            application_fee: 1200

        }, function(err, charge) {
            if (err && err.type === 'StripeCardError') {
            }
        })
    };

    PaymentBusiness.prototype.createAccount = function(paymentModel) {

        stripe.accounts.create({
            managed: false,
            country: 'CA',
            email: paymentModel.email
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
        sql = sql + " WHERE use_id = " + paymentModel.use_id;

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

    PaymentBusiness.prototype.getStripeAccount = function(paymentModel,costumerIdStripe) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select accountIdStripe from user_instructor ";
        sql = sql + " WHERE use_id = " + paymentModel.use_id_instructor;

        connection.query(sql,function(err,user){
            connection.end();
            if(!err) {
                PaymentBusiness.prototype.chargeCustomer(paymentModel,costumerIdStripe, user[0].accountIdStripe);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });
    };

    return new PaymentBusiness();
})();

module.exports = PaymentBusiness;