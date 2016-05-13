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

    UserResource.prototype.saveEmail = function(req,res){

        var userModel = new Object();

        if (req){
            userModel = req.body;
        }

        userBusiness.saveEmail(userModel, function(obj){
            res.json(obj);
        });
    }

    UserResource.prototype.savePassword = function(req,res){

        var userModel = new Object();

        if (req){
            userModel = req.body;
        }

        userBusiness.savePassword(userModel, function(obj){
            res.json(obj);
        });
    }


    UserResource.prototype.saveInstructorSignUp = function(req,res){

        var userModel = new Object();

        if (req){
            userModel = req.body;
        }

        userBusiness.saveInstructorSignUp(userModel, function(obj){
            res.json(obj);
        });
    }

    UserResource.prototype.saveSetting = function(req,res){

        var userModel = new Object();

        if (req){
            userModel = req.body;
        }

        userBusiness.saveSetting(userModel, function(obj){
            res.json(obj);
        });
    }

    return new UserResource();
})();

module.exports = UserResource;