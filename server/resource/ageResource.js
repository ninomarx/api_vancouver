var ageBusiness = require("./../business/ageBusiness");

var AgeResource = (function() {

    /**
     *
     * @constructor
     */
    var AgeResource = function() {};

    AgeResource.prototype.select = function(req,res){

        var ageModel = new Object();

        if (req){
            ageModel = req.body;
        }

        ageBusiness.select(ageModel, function(obj){
            res.json(obj);
        });

    }

    return new AgeResource();
})();

module.exports = AgeResource;