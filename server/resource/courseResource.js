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

    return new CourseResource();
})();

module.exports = CourseResource;