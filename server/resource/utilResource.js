var utilBusiness = require("./../business/utilBusiness");

var UtilResource = (function() {

    var UtilResource = function() {};

    UtilResource.prototype.sendEmailReview = function(req,res){

        utilBusiness.sendEmailReview(function(obj){
            res.json(obj);
        });

    }

    return new UtilResource();
})();

module.exports = UtilResource;