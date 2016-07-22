var reviewBusiness = require("./../../business/admin/reviewBusiness");

var ReviewResource = (function() {

    var ReviewResource = function() {};

    ReviewResource.prototype.select = function(req,res){

        var reviewModel = new Object();

        if (req){
            reviewModel = req.body;
        }

        reviewBusiness.select(reviewModel, function(obj){
            res.json(obj);
        });

    }

    ReviewResource.prototype.selectById = function(req,res){

        var reviewModel = new Object();

        if (req){
            reviewModel = req.body;
        }

        reviewBusiness.selectById(reviewModel, function(obj){
            res.json(obj);
        });

    }

    ReviewResource.prototype.save = function(req,res){

        var reviewModel = new Object();

        if (req){
            reviewModel = req.body;
        }

        reviewBusiness.save(reviewModel, function(obj){
            res.json(obj);
        });

    }

    return new ReviewResource();
})();

module.exports = ReviewResource;