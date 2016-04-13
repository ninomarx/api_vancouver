var classBusiness     =    require("./../business/classBusiness");

var ClassResource = (function() {

    /**
     *
     * @constructor
     */
    var ClassResource = function() {};

    ClassResource.prototype.save = function(req,res){

        var classModel = new Object();

        if (req){
            classModel = req.body;
        }

        classBusiness.save(classModel, function(obj){
            res.json(obj);
        });

    }

    ClassResource.prototype.getClassMultiple = function(req,res){

        var classModel = new Object();

        if (req){
            classModel = req.body;
        }

        classBusiness.getClassMultiple(classModel, function(obj){
            res.json(obj);
        });

    }

    ClassResource.prototype.postClass = function(req,res){

        var classModel = new Object();

        if (req){
            classModel = req.body;
        }

        classBusiness.postClass(classModel, function(obj){
            res.json(obj);
        });

    }



    return new ClassResource();
})();

module.exports = ClassResource;