var factory = require("./../factory/dbfactory");

var CategoryBusiness = (function() {

    var CategoryBusiness = function() {

    };

    CategoryBusiness.prototype.select = function(categoryModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select * ";
        sql = sql + " from Category ";


        connection.query(sql,function(err,categories){
            connection.end();
            if(!err) {

                var collectionCategory = categories;

                callback(collectionCategory);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });


    };


    CategoryBusiness.prototype.selectById = function(categoryModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select * ";
        sql = sql + " from Category ";
        sql = sql + " where  cat_id = " + categoryModel.cat_id;


        connection.query(sql,function(err,categories){
            connection.end();
            if(!err) {

                var collectionCategory = categories;

                callback(collectionCategory);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });


    };


    CategoryBusiness.prototype.selectSubcategory = function(categoryModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select * ";
        sql = sql + " from subcategory ";
        sql = sql + " where  cat_id = " + categoryModel.cat_id;



        connection.query(sql,function(err,categories){
            connection.end();
            if(!err) {

                var collectionCategory = categories;

                callback(collectionCategory);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });


    };

    return new CategoryBusiness();
})();

module.exports = CategoryBusiness;