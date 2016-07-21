var userBusiness = require("./../../business/admin/userBusiness");

var UserResource = (function() {

    /**
     *
     * @constructor
     */
    var UserResource = function() {};

    UserResource.prototype.select = function(req,res){

        var userModel = new Object();

        if (req){
            userModel = req.body;
        }

        userBusiness.select(userModel, function(obj){
            res.json(obj);
        });

    }

    UserResource.prototype.allowUser = function(req,res){

        var userModel = new Object();

        if (req){
            userModel = req.body;
        }

        userBusiness.allowUser(userModel, function(obj){
            res.json(obj);
        });

    }

    return new UserResource();
})();

module.exports = UserResource;