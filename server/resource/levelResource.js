var levelBusiness = require("./../business/levelBusiness");

var LevelResource = (function() {

    /**
     *
     * @constructor
     */
    var LevelResource = function() {};

    LevelResource.prototype.select = function(req,res){

        var levelModel = new Object();

        if (req){
            levelModel = req.body;
        }

        levelBusiness.select(levelModel, function(obj){
            res.json(obj);
        });

    }

    return new LevelResource();
})();

module.exports = LevelResource;