var reportBusiness = require("./../business/reportBusiness");

var ReportResource = (function() {

    var ReportResource = function() {};

    ReportResource.prototype.saveReport = function(req,res){

        var reportModel = new Object();

        if (req){
            reportModel = req.body;
        }

        reportBusiness.saveReport(reportModel, function(obj){
            res.json(obj);
        });

    }

    return new ReportResource();
})();

module.exports = ReportResource;