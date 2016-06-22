var discountBusiness = require("./../business/discountBusiness");

var DiscountResource = (function() {

    /**
     *
     * @constructor
     */
    var DiscountResource = function() {};

    DiscountResource.prototype.save = function(req,res){

        var discountModel = new Object();

        if (req){
            discountModel = req.body;
        }

        discountBusiness.save(discountModel, function(obj){
            res.json(obj);
        });

    }

    DiscountResource.prototype.saveCodes = function(req,res){

        var discountModel = new Object();

        if (req){
            discountModel = req.body;
        }

        discountBusiness.saveCodes(discountModel, function(obj){
            res.json(obj);
        });
    }

    DiscountResource.prototype.getDiscount = function(req,res){

        var discountModel = new Object();

        if (req){
            discountModel = req.body;
        }

        discountBusiness.getDiscount(discountModel, function(obj){
            res.json(obj);
        });
    }

    DiscountResource.prototype.getDiscountClass = function(req,res){

        var discountModel = new Object();

        if (req){
            discountModel = req.body;
        }

        discountBusiness.getDiscountClass(discountModel, function(obj){
            res.json(obj);
        });
    }

    DiscountResource.prototype.getDiscountCodes = function(req,res){

        var discountModel = new Object();

        if (req){
            discountModel = req.body;
        }

        discountBusiness.getDiscountCodes(discountModel, function(obj){
            res.json(obj);
        });
    }

    return new DiscountResource();
})();

module.exports = DiscountResource;