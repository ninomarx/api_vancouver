var wishlistBusiness     =    require("./../business/wishlistBusiness");

var WishlistResource = (function() {

    /**
     *
     * @constructor
     */
    var WishlistResource = function() {};

    WishlistResource.prototype.save = function(req,res){

        var courseModel = new Object();

        if (req){
            courseModel = req.body;
        }

        wishlistBusiness.save(courseModel, function(obj){
            res.json(obj);
        });

    }


    return new WishlistResource();
})();

module.exports = WishlistResource;