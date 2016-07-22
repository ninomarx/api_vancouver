var factory = require("./../../factory/dbfactory");

var ReviewBusiness = (function() {

    var ReviewBusiness = function() {

    };

    ReviewBusiness.prototype.select = function(reviewModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select cre_id,cou.cor_name,date_format(ct.clt_date,'%Y-%m-%d') clt_date, us1.use_first_name instructor, ";
        sql = sql + " us2.use_first_name students, cr.cre_stars, ";
        sql = sql + " case when cre_review_private = 'Y' then 'Yes' else 'No' end as cre_review_private, ";
        sql = sql + " case when coalesce(cre_feedback_instructor,'') = '' then 'No' else 'Yes' end as instructor_feedback, ";
        sql = sql + " case when coalesce(cre_feedback_cotuto_improve,'') = '' then 'No' else 'Yes' end as cotuto_feedback ";
        sql = sql + " from class_review cr ";
        sql = sql + " inner join course cou on cr.cor_id = cou.cor_id ";
        sql = sql + " inner join user us1 on cou.use_id = us1.use_id ";
        sql = sql + " inner join user us2 on cr.use_id = us2.use_id ";
        sql = sql + " inner join class_time ct on cr.cla_id = ct.cla_id and ct.clt_firstClass = 'Y'; ";

        connection.query(sql,function(err,review){
            connection.end();
            if(!err) {

                var collectionReview = review;

                callback(collectionReview);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });
    };

    ReviewBusiness.prototype.selectById = function(reviewModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select cre_id,cou.cor_name, date_format(ct.clt_date,'%Y-%m-%d') clt_date, us1.use_first_name instructor, ";
        sql = sql + " us2.use_first_name students, cr.cre_stars,cre_review_private, ";
        sql = sql + " cre_feedback_cotuto_instructor,cre_feedback_cotuto_improve, ";
        sql = sql + " cre_review,cre_feedback_instructor,us1.use_last_name last_instructor,us2.use_last_name last_student ";
        sql = sql + " from class_review cr ";
        sql = sql + " inner join course cou on cr.cor_id = cou.cor_id ";
        sql = sql + " inner join user us1 on cou.use_id = us1.use_id ";
        sql = sql + " inner join user us2 on cr.use_id = us2.use_id ";
        sql = sql + " inner join class_time ct on cr.cla_id = ct.cla_id and ct.clt_firstClass = 'Y' ";
        sql = sql + " where cre_id = " + reviewModel.cre_id + "; ";

        connection.query(sql,function(err,review){
            connection.end();
            if(!err) {

                var collectionReview = review;

                callback(collectionReview);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });
    };

    ReviewBusiness.prototype.save = function(reviewModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " UPDATE class_review SET cre_review = '" + reviewModel.cre_review.replace(/'/g, "\\'") + "', cre_review_private = '" + reviewModel.cre_review_private + "'";
        sql = sql + " where cre_id = " + reviewModel.cre_id + "; ";

        connection.query(sql,function(err,review){
            connection.end();
            if(!err) {

                var collectionReview = review;

                callback(collectionReview);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });
    };

    return new ReviewBusiness();
})();

module.exports = ReviewBusiness;