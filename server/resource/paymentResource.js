var paymentBusiness = require("./../business/paymentBusiness");

var PaymentResource = (function() {

    var PaymentResource = function() {};

    PaymentResource.prototype.createToken = function(req,res){

        var paymentModel = new Object();

        if (req){
            paymentModel = req.body;
        }

        paymentBusiness.createToken(paymentModel, function(obj){
            res.json(obj);
        });

    }

    PaymentResource.prototype.charge = function(req,res){

        var paymentModel = new Object();

        if (req){
            paymentModel = req.body;
        }

        paymentBusiness.charge(paymentModel, function(obj){
            res.json(obj);
        });

    }

    PaymentResource.prototype.createAccount = function(req,res){

        var paymentModel = new Object();

        if (req){
            paymentModel = req.body;
        }

        paymentBusiness.createAccount(paymentModel, function(obj){
            res.json(obj);
        });

    }

    PaymentResource.prototype.chargeAll = function(req,res){

        var paymentModel = new Object();

        paymentBusiness.chargeAll(paymentModel, function(obj){
            res.json(obj);
        });

    }

    PaymentResource.prototype.CreditRefund = function(req,res){

        var paymentModel = new Object();

        paymentBusiness.CreditRefund(paymentModel, function(obj){
            res.json(obj);
        });

    }

    PaymentResource.prototype.refund = function(req,res){

        var paymentModel = new Object();

        if (req){
            paymentModel = req.body;
        }

        paymentBusiness.refund(paymentModel, function(obj){
            res.json(obj);
        });

    }

    return new PaymentResource();
})();

module.exports = PaymentResource;