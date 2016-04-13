var loginBusiness = require("./../business/loginBusiness");

var LoginResource = (function() {

    /**
     *
     * @constructor
     */
    var LoginResource = function() {};

    LoginResource.prototype.signup = function(req,res){

        var loginModel = new Object();

        if (req){
            loginModel = req.body;
        }

        loginBusiness.signup(loginModel, function(obj){
            res.json(obj);
        });

    }

    LoginResource.prototype.signin = function(req,res){

        var loginModel = new Object();

        if (req){
            loginModel = req.body;
        }

        loginBusiness.signin(loginModel, function(obj){
            res.json(obj);
        });

    }

    LoginResource.prototype.recoverPassword = function(req,res){

        var loginModel = new Object();

        if (req){
            loginModel = req.body;
        }

        loginBusiness.recoverPassword(loginModel, function(obj){
            res.json(obj);
        });

    }

    return new LoginResource();
})();

module.exports = LoginResource;