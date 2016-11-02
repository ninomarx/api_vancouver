var utilBusiness = require("./../business/utilBusiness");

var UtilResource = (function() {

    var UtilResource = function() {};

    UtilResource.prototype.sendEmailReview = function(req,res){

        utilBusiness.sendEmailReview(function(obj){
            res.json(obj);
        });

    }

    UtilResource.prototype.InstructorApplicationNotification = function(req,res){

        utilBusiness.InstructorApplicationNotification(function(obj){
            res.json(obj);
        });

    }

    UtilResource.prototype.InstructorClassPosting = function(req,res){

        utilBusiness.InstructorClassPosting(function(obj){
            res.json(obj);
        });

    }

    UtilResource.prototype.InstructorRegistrationNotification = function(req,res){

        utilBusiness.InstructorRegistrationNotification(function(obj){
            res.json(obj);
        });

    }

    UtilResource.prototype.InstructorWeekCoursePerformance = function(req,res){

        utilBusiness.InstructorWeekCoursePerformance(function(obj){
            res.json(obj);
        });

    }

    UtilResource.prototype.InstructorFinancialSummary = function(req,res){

        utilBusiness.InstructorFinancialSummary(function(obj){
            res.json(obj);
        });
    }

    UtilResource.prototype.InstructorApplicationReminder = function(req,res){

        utilBusiness.InstructorApplicationReminder(function(obj){
            res.json(obj);
        });
    }

    UtilResource.prototype.InstructorClassCheckIn = function(req,res){

        utilBusiness.InstructorClassCheckIn(function(obj){
            res.json(obj);
        });
    }

    UtilResource.prototype.StudentClassReminder = function(req,res){

        utilBusiness.StudentClassReminder(function(obj){
            res.json(obj);
        });
    }

    UtilResource.prototype.StudentClassReminderDayBefore = function(req,res){

        utilBusiness.StudentClassReminderDayBefore(function(obj){
            res.json(obj);
        });
    }

    return new UtilResource();
})();

module.exports = UtilResource;