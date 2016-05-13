var loginBusiness = require("./../../business/admin/loginBusiness");

var LoginResource = (function() {

    /**
     *
     * @constructor
     */
    var LoginResource = function() {};


    LoginResource.prototype.signin = function(req,res){

        var loginModel = new Object();

        if (req){
            loginModel = req.body;
        }

        loginBusiness.signin(loginModel, function(obj){
            res.json(obj);
        });

    }


    return new LoginResource();
})();

module.exports = LoginResource;