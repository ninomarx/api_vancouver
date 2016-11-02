var factory = require("./../factory/dbfactory");
var utilBusiness = require("./../business/utilBusiness");

var WishlistBusiness = (function() {

    var WishlistBusiness = function() {

    };

    WishlistBusiness.prototype.save = function(wishlistModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " DELETE FROM wishlist WHERE use_id = "  + wishlistModel.use_id + " AND cor_id=" + wishlistModel.cor_id + ";";
        sql = sql + " INSERT INTO wishlist (wis_status, use_id, cor_id, wis_date)";
        sql = sql + " VALUES ( ";
        sql = sql + " '" + wishlistModel.wis_status + "',";
        sql = sql + " " + wishlistModel.use_id + ",";
        sql = sql + " " + wishlistModel.cor_id + ",";
        sql = sql + " curdate()";
        sql = sql + " ); ";


        connection.query(sql,function(err,wishlist){
            connection.end();
            if(!err) {

                utilBusiness.InstructorWishlistedClass(wishlistModel.cor_id);

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
        sql = sql + " select aux.cor_id,cor_image,cor_name, city.cit_description, prov.pro_code, ";
        sql = sql + " cla.cla_id,cla.cla_cost,cla.cla_address,instructor_name,use_image, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%b. %d\") clt_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_start_time,\"%l:%i %p\") start_time, ";
        sql = sql + " TIME_FORMAT(ADDTIME(ct.clt_start_time, SEC_TO_TIME(cla.cla_duration*60)), '%l:%i %p') AS final_time, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%Y-%m-%d\") clt_date_account, ";
        sql = sql + " case when TIMESTAMPDIFF(day,CURDATE(),ct.clt_date) > 0 then CONCAT('Start in ' ,TIMESTAMPDIFF(day,CURDATE(),ct.clt_date), ' days') else 'Start today' end  as day_until, ";
        sql = sql + " TIMESTAMPDIFF(day,CURDATE(),ct.clt_date) day_until_num, (select count(*) from class_time where cla_id = cla.cla_id) as sessions, cla.cla_duration ";
        sql = sql + " from ( ";
        sql = sql + " select co.cor_id, co.cor_image, co.cor_name, ";
        sql = sql + " CONCAT(use_first_name,' ',use_last_name ) as instructor_name,use_image, ";
        sql = sql + " (select cla.cla_id from class cla inner join class_time clt on cla.cla_id = clt.cla_id ";
        sql = sql + " where cor_id = co.cor_id and clt_firstClass = 'Y' and clt.clt_date >= CURDATE() ";
        sql = sql + " order by clt.clt_date desc limit 1) as next_class ";
        sql = sql + " from wishlist ws ";
        sql = sql + " inner join course co on ws.cor_id = co.cor_id ";
        sql = sql + " inner join user u on co.use_id = u.use_id ";
        sql = sql + " where ws.use_id = " + wishlistModel.use_id + " ";
        sql = sql + " and wis_status = 'S' ";
        sql = sql + " group by co.cor_id) as aux ";
        sql = sql + " left join class cla on aux.next_class = cla.cla_id ";
        sql = sql + " left join class_time ct on cla.cla_id = ct.cla_id and ct.clt_firstClass = 'Y'";
        sql = sql + " left join city city on cla.cit_id = city.cit_id ";
        sql = sql + " left join province prov on city.pro_id = prov.pro_id ";
        sql = sql + " ) as aux2 ";

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