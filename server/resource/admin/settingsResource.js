var settingsBusiness = require("./../../business/admin/settingsBusiness");

var SettingsResource = (function() {

    var SettingsResource = function() {};

    SettingsResource.prototype.select = function(req,res){

        var setModel = new Object();

        if (req){
            setModel = req.body;
        }

        settingsBusiness.select(setModel, function(obj){
            res.json(obj);
        });

    }

    SettingsResource.prototype.save = function(req,res){

        var setModel = new Object();

        if (req){
            setModel = req.body;
        }

        settingsBusiness.save(setModel, function(obj){
            res.json(obj);
        });

    }

    SettingsResource.prototype.savePassword = function(req,res){

        var setModel = new Object();

        if (req){
            setModel = req.body;
        }

        settingsBusiness.savePassword(setModel, function(obj){
            res.json(obj);
        });

    }

    return new SettingsResource();
})();

module.exports = SettingsResource;