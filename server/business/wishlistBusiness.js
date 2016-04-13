var factory = require("./../factory/dbfactory");

var WishlistBusiness = (function() {

    var WishlistBusiness = function() {

    };

    WishlistBusiness.prototype.save = function(wishlistModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " DELETE FROM wishlist WHERE use_id = "  + wishlistModel.use_id + " AND cla_id=" + wishlistModel.cla_id + ";";
        sql = sql + " INSERT INTO wishlist (wis_status, use_id, cla_id)";
        sql = sql + " VALUES ( ";
        sql = sql + " '" + wishlistModel.wis_status + "',";
        sql = sql + " " + wishlistModel.use_id + ",";
        sql = sql + " " + wishlistModel.cla_id + "";
        sql = sql + " ); ";


        connection.query(sql,function(err,wishlist){
            connection.end();
            if(!err) {

                var collectionWishlist = wishlist;

                callback(collectionWishlist);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });


    };

    return new WishlistBusiness();
})();

module.exports = WishlistBusiness;