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

    ClassResource.prototype.getClass = function(req,res){

        var classModel = new Object();

        if (req){
            classModel = req.body;
        }

        classBusiness.getClass(classModel, function(obj){
            res.json(obj);
        });

    }

    ClassResource.prototype.getClassComments = function(req,res){

        var classModel = new Object();

        if (req){
            classModel = req.body;
        }

        classBusiness.getClassComments(classModel, function(obj){
            res.json(obj);
        });
    }

    ClassResource.prototype.getClassTime = function(req,res){

        var classModel = new Object();

        if (req){
            classModel = req.body;
        }

        classBusiness.getClassTime(classModel, function(obj){
            res.json(obj);
        });
    }

    ClassResource.prototype.otherClassTime = function(req,res){

        var classModel = new Object();

        if (req){
            classModel = req.body;
        }

        classBusiness.otherClassTime(classModel, function(obj){
            res.json(obj);
        });
    }

    ClassResource.prototype.getClassesAttending = function(req,res){

        var classModel = new Object();

        if (req){
            classModel = req.body;
        }

        classBusiness.getClassesAttending(classModel, function(obj){
            res.json(obj);
        });
    }

    ClassResource.prototype.getClassesAttended = function(req,res){

        var classModel = new Object();

        if (req){
            classModel = req.body;
        }

        classBusiness.getClassesAttended(classModel, function(obj){
            res.json(obj);
        });
    }

    ClassResource.prototype.getAllClassesAttended = function(req,res){

        var classModel = new Object();

        if (req){
            classModel = req.body;
        }

        classBusiness.getAllClassesAttended(classModel, function(obj){
            res.json(obj);
        });
    }

    ClassResource.prototype.getClassesCancelled = function(req,res){

        var classModel = new Object();

        if (req){
            classModel = req.body;
        }

        classBusiness.getClassesCancelled(classModel, function(obj){
            res.json(obj);
        });
    }

    ClassResource.prototype.getClassesTeaching = function(req,res){

        var classModel = new Object();

        if (req){
            classModel = req.body;
        }

        classBusiness.getClassesTeaching(classModel, function(obj){
            res.json(obj);
        });
    }

    ClassResource.prototype.getClassesTaught = function(req,res){

        var classModel = new Object();

        if (req){
            classModel = req.body;
        }

        classBusiness.getClassesTaught(classModel, function(obj){
            res.json(obj);
        });
    }

    ClassResource.prototype.cancelClass = function(req,res){

        var classModel = new Object();

        if (req){
            classModel = req.body;
        }

        classBusiness.cancelClass(classModel, function(obj){
            res.json(obj);
        });
    }

    ClassResource.prototype.getRoster = function(req,res){

        var classModel = new Object();

        if (req){
            classModel = req.body;
        }

        classBusiness.getRoster(classModel, function(obj){
            res.json(obj);
        });
    }

    ClassResource.prototype.getGoal = function(req,res){

        var classModel = new Object();

        if (req){
            classModel = req.body;
        }

        classBusiness.getGoal(classModel, function(obj){
            res.json(obj);
        });
    }

    return new ClassResource();
})();

module.exports = ClassResource;