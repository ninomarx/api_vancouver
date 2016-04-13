var provinceBusiness = require("./../business/provinceBusiness");

var ProvinceResource = (function() {

    /**
     *
     * @constructor
     */
    var ProvinceResource = function() {};

    ProvinceResource.prototype.select = function(req,res){

        var provinceModel = new Object();

        if (req){
            provinceModel = req.body;
        }

        provinceBusiness.select(provinceModel, function(obj){
            res.json(obj);
        });

    }

    return new ProvinceResource();
})();

module.exports = ProvinceResource;