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


    WishlistBusiness.prototype.getWishList = function (wishlistModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select *, ";
        sql = sql + " case when sessions > 1 then concat(sessions, ' Sessions') else cla_duration  end as sessions ";
        sql = sql + " from ( ";
        sql = sql + " select c.cla_id,co.cor_image, co.cor_name, city.cit_description, prov.pro_code,  ";
        sql = sql + " CONCAT(use_first_name,' ',use_last_name ) as instructor_name,use_image, ";
        sql = sql + " c.cla_cost, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%b. %d\") clt_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_start_time,\"%l:%i %p\") start_time, ";
        sql = sql + " TIME_FORMAT(ADDTIME(ct.clt_start_time, SEC_TO_TIME(c.cla_duration*60)), '%l:%i %p') AS final_time, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%Y-%m-%d\") clt_date_account, ";
        sql = sql + " case when TIMESTAMPDIFF(day,CURDATE(),ct.clt_date) > 0 then CONCAT('Start in ' ,TIMESTAMPDIFF(day,CURDATE(),ct.clt_date), ' days') else 'Start today' end  as day_until, ";
        sql = sql + " c.cla_address, ";
        sql = sql + " (select count(*) from class_time where cla_id = c.cla_id) as sessions, c.cla_duration ";
        sql = sql + " from class c ";
        sql = sql + " inner join course co on c.cor_id = co.cor_id ";
        sql = sql + " inner join user u on co.use_id = u.use_id ";
        sql = sql + " inner join user_instructor ui on u.use_id = ui.use_id ";
        sql = sql + " inner join class_time ct on c.cla_id = ct.cla_id ";
        sql = sql + " inner join wishlist ws on c.cla_id = ws.cla_id and ws.use_id = " + wishlistModel.use_id + " ";
        sql = sql + " inner join city city on c.cit_id = city.cit_id ";
        sql = sql + " inner join province prov on city.pro_id = prov.pro_id ";
        sql = sql + " where ";
        sql = sql + " ct.clt_firstClass = 'Y' ";
        sql = sql + " and wis_status = 'S' ";
        sql = sql + " and ct.clt_date >= CURDATE()  ) as aux; ";

        connection.query(sql, function (err, wishlist) {
            connection.end();
            if (!err) {

                var collectionWish = wishlist;

                callback(collectionWish);
            }
        });
    };

    return new WishlistBusiness();
})();

module.exports = WishlistBusiness;