var courseBusiness     =    require("./../business/courseBusiness");

var CourseResource = (function() {

    /**
     *
     * @constructor
     */
    var CourseResource = function() {};

    CourseResource.prototype.select = function(req,res){

        var courseModel = new Object();

        if (req){
            courseModel = req.body;
        }

        courseBusiness.select(courseModel, function(obj){
            res.json(obj);
        });

    }

    CourseResource.prototype.selectNearby = function(req,res){

        var courseModel = new Object();

        if (req){
            courseModel = req.body;
        }

        courseBusiness.selectNearby(courseModel, function(obj){
            res.json(obj);
        });

    }

    CourseResource.prototype.selectInterest = function(req,res){

        var courseModel = new Object();

        if (req){
            courseModel = req.body;
        }

        courseBusiness.selectInterest(courseModel, function(obj){
            res.json(obj);
        });

    }

    CourseResource.prototype.selectCourseTeaching = function(req,res){

        var courseModel = new Object();

        if (req){
            courseModel = req.body;
        }

        courseBusiness.selectCourseTeaching(courseModel, function(obj){
            res.json(obj);
        });

    }

    CourseResource.prototype.save = function(req,res){

        var courseModel = new Object();

        if (req){
            courseModel = req.body;
        }

        courseBusiness.save(courseModel, function(obj){
            res.json(obj);
        });

    }

    CourseResource.prototype.selectByFilter = function(req,res){

        var courseModel = new Object();

        if (req){
            courseModel = req.body;
        }

        courseBusiness.selectByFilter(courseModel, function(obj){
            res.json(obj);
        });

    }



    return new CourseResource();
})();

module.exports = CourseResource;