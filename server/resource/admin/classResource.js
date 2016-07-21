var classBusiness = require("./../../business/admin/classBusiness");

var ClassResource = (function() {

    var ClassResource = function() {};

    ClassResource.prototype.select = function(req,res){

        var classModel = new Object();

        if (req){
            classModel = req.body;
        }

        classBusiness.select(classModel, function(obj){
            res.json(obj);
        });

    }

    return new ClassResource();
})();

module.exports = ClassResource;