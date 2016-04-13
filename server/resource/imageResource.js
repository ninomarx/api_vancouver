var fs = require('fs');
var http = require("http");


var ImageResource = (function() {

    /**
     *
     * @constructor
     */
    var ImageResource = function() {};

    ImageResource.prototype.getImage = function(req,res){

        var imageURL = "server//images//" + req.params.imageURL;

        var img = fs.readFileSync(imageURL);
        res.writeHead(200, {'Content-Type': 'image/png' });
        res.end(img, 'binary');

    };

    return new ImageResource();
})();

module.exports = ImageResource;