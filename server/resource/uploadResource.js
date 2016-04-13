//var categoryBusiness     =    require("./../business/categoryBusiness");
var fs = require('fs');
var path = require("path");

var UploadResource = (function() {

    /**
     *
     * @constructor
     */
    var UploadResource = function() {};

    UploadResource.prototype.upload = function(req,res){

        var imageName = req.files.file.name;

        fs.readFile(req.files.file.path, function (err, data) {
            //var newPath =  "C:\\Users\\Nino\\Desktop\\Cotuto\\Projects\\Cotuto_API\\Cotuto_API\\server\\images\\" + imageName;
            var newPath =  path.join(__dirname, '../', 'images/') + imageName;
            fs.writeFile(newPath, data, function (err) {
                res.redirect("back");
            });
        });

        var objRet = imageNameSave;
        res.json(objRet);

    }

    return new UploadResource();
})();

module.exports = UploadResource;