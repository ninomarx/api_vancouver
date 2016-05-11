var reviewBusiness = require("./../business/reviewBusiness");

var ReviewResource = (function() {

    var ReviewResource = function() {};

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