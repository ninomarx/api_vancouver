var categoryBusiness     =    require("./../business/categoryBusiness");

var CategoryResource = (function() {

    /**
     *
     * @constructor
     */
    var CategoryResource = function() {};

    CategoryResource.prototype.select = function(req,res){

        var categoryModel = new Object();

        if (req){
            categoryModel = req.query;
        }

        categoryBusiness.select(categoryModel, function(obj){
            res.json(obj);
        });

    }

    CategoryResource.prototype.selectById = function(req,res){

        var categoryModel = new Object();

        if (req){
            categoryModel = req.body;
        }

        categoryBusiness.selectById(categoryModel, function(obj){
            res.json(obj);
        });

    }


    CategoryResource.prototype.selectSubcategory = function(req,res){

        var categoryModel = new Object();

        if (req){
            categoryModel = req.body;
        }

        categoryBusiness.selectSubcategory(categoryModel, function(obj){
            res.json(obj);
        });

    }

    return new CategoryResource();
})();

module.exports = CategoryResource;