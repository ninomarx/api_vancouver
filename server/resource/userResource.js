var userBusiness = require("./../business/userBusiness");

var UserResource = (function() {

    /**
     *
     * @constructor
     */
    var UserResource = function() {};

    UserResource.prototype.saveStudent = function(req,res){

        var userModel = new Object();

        if (req){
            userModel = req.body;
        }

        userBusiness.saveStudent(userModel, function(obj){
            res.json(obj);
        });

    }

    UserResource.prototype.saveInstructor = function(req,res){

        var userModel = new Object();

        if (req){
            userModel = req.body;
        }

        userBusiness.saveInstructor(userModel, function(obj){
            res.json(obj);
        });

    }

    return new UserResource();
})();

module.exports = UserResource;