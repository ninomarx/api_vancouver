var countryBusiness = require("./../business/countryBusiness");

var CountryResource = (function() {

    var CountryResource = function() {};

    CountryResource.prototype.save = function(req,res){

        var countryModel = new Object();

        if (req){
            countryModel = req.body;
        }

        countryBusiness.save(countryModel, function(obj){
            res.json(obj);
        });

    }

    CountryResource.prototype.delete = function(req,res){

        var countryModel = new Object();

        if (req){
            countryModel = req.query;
        }

        countryBusiness.delete(countryModel, function(obj){
            res.json(obj);
        });

    }

    CountryResource.prototype.update = function(req,res){

        var countryModel = new Object();

        if (req){
            countryModel = req.query;
        }

        countryBusiness.update(countryModel, function(obj){
            res.json(obj);
        });

    }

    CountryResource.prototype.select = function(req,res){

        var countryModel = new Object();

        if (req){
            countryModel = req.query;
        }

        countryBusiness.select(countryModel, function(obj){
            res.json(obj);
        });

    }

    return new CountryResource();
})();

module.exports = CountryResource;