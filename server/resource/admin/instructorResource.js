var instructorBusiness = require("./../../business/admin/instructorBusiness");

var InstructorResource = (function() {

    /**
     *
     * @constructor
     */
    var InstructorResource = function() {};

    InstructorResource.prototype.select = function(req,res){

        var instructorModel = new Object();

        if (req){
            instructorModel = req.body;
        }

        instructorBusiness.select(instructorModel, function(obj){
            res.json(obj);
        });

    }

    InstructorResource.prototype.allowInstructor = function(req,res){

        var instructorModel = new Object();

        if (req){
            instructorModel = req.body;
        }

        instructorBusiness.allowInstructor(instructorModel, function(obj){
            res.json(obj);
        });

    }

    return new InstructorResource();
})();

module.exports = InstructorResource;