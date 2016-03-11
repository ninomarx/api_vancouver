var cityBusiness = require("./../business/cityBusiness");

var CityResource = (function() {

    /**
     *
     * @constructor
     */
    var CityResource = function() {};

    CityResource.prototype.selectCode = function(req,res){

        var cityModel = new Object();

        if (req){
            cityModel = req.body;
        }

        cityBusiness.selectCode(cityModel, function(obj){
            res.json(obj);
        });

    }

    return new CityResource();
})();

module.exports = CityResource;