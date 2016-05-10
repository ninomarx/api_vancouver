var registerBusiness     =    require("./../business/registerBusiness");

var RegisterResource = (function() {

    /**
     *
     * @constructor
     */
    var RegisterResource = function() {};

    RegisterResource.prototype.save = function(req,res){

        var registerModel = new Object();

        if (req){
            registerModel = req.body;
        }

        registerBusiness.save(registerModel, function(obj){
            res.json(obj);
        });

    }

    RegisterResource.prototype.cancel = function(req,res){

        var registerModel = new Object();

        if (req){
            registerModel = req.body;
        }

        registerBusiness.cancel(registerModel, function(obj){
            res.json(obj);
        });

    }

    RegisterResource.prototype.cancelVerify = function(req,res){

        var registerModel = new Object();

        if (req){
            registerModel = req.body;
        }

        registerBusiness.cancelVerify(registerModel, function(obj){
            res.json(obj);
        });

    }

    return new RegisterResource();
})();

module.exports = RegisterResource;