var factory = require("./../factory/dbfactory");
var emailBusiness = require("./../business/emailBusiness");

var UtilBusiness = (function() {

    var UtilBusiness = function() {

    };

    // EMAILS - COTUTO

    UtilBusiness.prototype.sendEmailReview = function(callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select *, DATE_FORMAT(timestampadd(day,15,last_date),'%M %d') until_date ";
        sql = sql + " from ( ";
        sql = sql + " select UU.use_email, COU.cor_image, U.use_image, COU.cor_name, U.use_first_name,cla_id, ";
        sql = sql + " (select count(*) from class_review where use_id = CR.use_id and cla_id = CR.cla_id) as reviews, ";
        sql = sql + " (select clt_date from class_time where cla_id = CR.cla_id order by clt_date desc limit 1) as last_date ";
        sql = sql + " from class_register CR ";
        sql = sql + " INNER JOIN course COU on CR.cor_id = COU.cor_id ";
        sql = sql + " INNER JOIN user U on COU.use_id = U.use_id ";
        sql = sql + " INNER JOIN user UU on CR.use_id = UU.use_id ";
        sql = sql + " where clr_status = 'A' ";
        sql = sql + " AND clr_transaction_status <> 'C' ";
        sql = sql + " ) as aux ";
        sql = sql + " where reviews = 0 ";
        sql = sql + " and last_date < curdate() ";
        sql = sql + " and TIMESTAMPDIFF(day,last_date,CURDATE()) in (1,4,7,10,13,15) ";


        connection.query(sql,function(err,review){
            connection.end();
            if(!err) {

                var collectionReview = review;

                collectionReview.forEach(function(item){
                    emailBusiness.sendEmailReview(item.use_email,item.cor_image, item.use_image, item.until_date, item.cor_name, item.use_first_name, item.cla_id);
                })

                callback('OK');
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });
    };

    UtilBusiness.prototype.InstructorApplicationNotification = function(cor_id) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select cou.cor_name, us.use_first_name, us.use_image, use_email, cou.cor_image,";
        sql = sql + " 'Your course sounds awesome and we look forward to seeing the classes on the site. If there is anything you need, let us know by email. - The Cotuto Team' as message";
        sql = sql + " from course cou";
        sql = sql + " inner join user us on cou.use_id = us.use_id";
        sql = sql + " where cou.cor_id = " + cor_id + ";";


        connection.query(sql,function(err,email_data){
            connection.end();
            if(!err) {

                var collectionEmail = email_data[0];

                emailBusiness.InstructorApplicationNotification(collectionEmail);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });
    };

    UtilBusiness.prototype.InstructorClassPosting = function(cla_id) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select cou.cor_name, DATE_FORMAT(ct.clt_date,'%M %d %Y') as clt_date, cou.cor_image, use_email, ";
        sql = sql + " DATE_FORMAT(CT.clt_start_time,\"%l:%i %p\") AS clt_start_time, ";
        sql = sql + "     TIME_FORMAT(ADDTIME(ct.clt_start_time, SEC_TO_TIME(cl.cla_duration*60)), '%l:%i %p')  AS final_time, ";
        sql = sql + " cl.cla_location_name, cl.cla_address ";
        sql = sql + " from class cl ";
        sql = sql + " inner join class_time ct on cl.cla_id = ct.cla_id and ct.clt_firstClass = 'Y' ";
        sql = sql + " inner join course cou on cl.cor_id = cou.cor_id ";
        sql = sql + " inner join user us on cou.use_id = us.use_id ";
        sql = sql + " where cl.cla_id = " + cla_id + "; ";

        connection.query(sql,function(err,email_data){
            connection.end();
            if(!err) {

                var collectionEmail = email_data[0];

                emailBusiness.InstructorClassPosting(collectionEmail);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });
    };

    UtilBusiness.prototype.InstructorRegistrationNotification = function(clr_id) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select us1.use_first_name, cou.cor_name, DATE_FORMAT(ct.clt_date,'%M %d %Y') as clt_date, ";
        sql = sql + " us2.use_email, cou.cor_image, ";
        sql = sql + " DATE_FORMAT(CT.clt_start_time,\"%l:%i %p\") AS clt_start_time, ";
        sql = sql + " TIME_FORMAT(ADDTIME(ct.clt_start_time, SEC_TO_TIME(cl.cla_duration*60)), '%l:%i %p')  AS final_time, ";
        sql = sql + " cl.cla_location_name, cl.cla_address, ";
        sql = sql + " cr.clr_id, coalesce(nullif(cr.clr_discount_code,''),'-') as clr_discount_code, cl.cla_cost,cr.clr_discount,cr.clr_cost,cr.clr_instructor_value, ";
        sql = sql + " (cr.clr_cost-cr.clr_instructor_value) as comission,clr_cotuto_credit,cr.clr_course_goal, us1.use_image ";
        sql = sql + "  from class_register cr ";
        sql = sql + " inner join user us1 on cr.use_id = us1.use_id ";
        sql = sql + " inner join course cou on cr.cor_id = cou.cor_id ";
        sql = sql + " inner join user us2 on cou.use_id = us2.use_id ";
        sql = sql + " inner join class cl on cr.cla_id = cl.cla_id ";
        sql = sql + " inner join class_time ct on cl.cla_id = ct.cla_id and ct.clt_firstClass = 'Y' ";
        sql = sql + " where cr.clr_id = " + clr_id + "; ";


        connection.query(sql,function(err,email_data){
            connection.end();
            if(!err) {

                var collectionEmail = email_data[0];

                emailBusiness.InstructorRegistrationNotification(collectionEmail);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });
    };

    UtilBusiness.prototype.InstructorReview = function(cre_id) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select us.use_first_name, us.use_image, cre_review, cre_feedback_instructor, us2.use_email ";
        sql = sql + " from class_review cre ";
        sql = sql + " inner join user us on cre.use_id = us.use_id ";
        sql = sql + " inner join course cou on cre.cor_id = cou.cor_id ";
        sql = sql + " inner join user us2 on cou.use_id = us2.use_id ";
        sql = sql + " where cre_id = " + cre_id + "; ";

        connection.query(sql,function(err,email_data){
            connection.end();
            if(!err) {

                var collectionEmail = email_data[0];

                emailBusiness.InstructorReview(collectionEmail);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });
    };

    UtilBusiness.prototype.MessageNotificationClass = function(mec_id) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select mec.mec_message,us1.use_image, us1.use_first_name, ";
        sql = sql + " cou.cor_name, cou.cor_image, DATE_FORMAT(ct.clt_date,'%M %d %Y') as clt_date,  ";
        sql = sql + " DATE_FORMAT(CT.clt_start_time,\"%l:%i %p\") AS clt_start_time, ";
        sql = sql + " TIME_FORMAT(ADDTIME(ct.clt_start_time, SEC_TO_TIME(cl.cla_duration*60)), '%l:%i %p')  AS final_time, ";
        sql = sql + " cl.cla_location_name, cl.cla_address,us2.use_first_name as instructor_name, ";
        sql = sql + " case when mes.use_id_receiver != us1.use_id then us1.use_email ";
        sql = sql + " else (select use_email from user where use_id = mes.use_id_transmitter) ";
        sql = sql + " end as email, ";
        sql = sql + " case when cou.use_id = us1.use_id then 'Teaches' else 'Wants to learn' end as role, ";
        sql = sql + " case when cou.use_id = us1.use_id then cou.cor_expertise else us1.use_want_learn end as use_want_learn ";
        sql = sql + " from message mes ";
        sql = sql + " inner join message_conversation mec on mes.mes_id = mec.mes_id ";
        sql = sql + " inner join user us1 on mec.use_id = us1.use_id ";
        sql = sql + " inner join course cou on mes.cor_id = cou.cor_id ";
        sql = sql + " left join class cl on mes.cla_id = cl.cla_id ";
        sql = sql + " left join class_time ct on cl.cla_id = ct.cla_id and ct.clt_firstClass = 'Y' ";
        sql = sql + " inner join user us2 on cou.use_id = us2.use_id ";
        sql = sql + " where mec.mec_id = " + mec_id + "; ";

        connection.query(sql,function(err,email_data){
            connection.end();
            if(!err) {

                var collectionEmail = email_data[0];

                emailBusiness.MessageNotificationClass(collectionEmail);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });
    };

    UtilBusiness.prototype.UserCancellationRecord = function(clr_id) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select cr.clr_id,us.use_first_name, cou.cor_name,DATE_FORMAT(ct.clt_date,'%Y-%m-%d') as clt_date, ";
        sql = sql + " cr.clr_cost, DATE_FORMAT(cla.cla_deadline,'%Y-%m-%d') as cla_deadline, DATE_FORMAT(cr.clr_cancel_date,'%Y-%m-%d') as clr_cancel_date, ";
        sql = sql + " us.use_email ";
        sql = sql + " from class_register cr ";
        sql = sql + " inner join user us on cr.use_id = us.use_id ";
        sql = sql + " inner join course cou on cr.cor_id = cou.cor_id ";
        sql = sql + " inner join class cla on cr.cla_id = cla.cla_id ";
        sql = sql + " left join class_time ct on cla.cla_id = ct.cla_id and ct.clt_firstClass = 'Y' ";
        sql = sql + " where cr.clr_id = " + clr_id + "; ";

        connection.query(sql,function(err,email_data){
            connection.end();
            if(!err) {

                var collectionEmail = email_data[0];

                emailBusiness.UserCancellationRecord(collectionEmail);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });
    };

    UtilBusiness.prototype.UserClassChangeNotification = function(cla_id) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select us2.use_first_name student, us2.use_email, us1.use_first_name, us1.use_last_name, ";
        sql = sql + " DATE_FORMAT(ct.clt_date,'%M %d %Y') as clt_date, ";
        sql = sql + " cou.cor_name, cou.cor_image, ";
        sql = sql + " DATE_FORMAT(CT.clt_start_time,\"%l:%i %p\") AS clt_start_time, ";
        sql = sql + " TIME_FORMAT(ADDTIME(ct.clt_start_time, SEC_TO_TIME(cla.cla_duration*60)), '%l:%i %p')  AS final_time, ";
        sql = sql + " cla.cla_location_name, cla.cla_address ";
        sql = sql + " from class cla ";
        sql = sql + " inner join course cou on cla.cor_id = cou.cor_id ";
        sql = sql + " inner join class_time ct on cla.cla_id = ct.cla_id and ct.clt_firstClass = 'Y' ";
        sql = sql + " inner join class_register cr on cla.cla_id = cr.cla_id ";
        sql = sql + " inner join user us1 on cou.use_id = us1.use_id ";
        sql = sql + " inner join user us2 on cr.use_id = us2.use_id ";
        sql = sql + " where cla.cla_id = " + cla_id + " and cr.clr_status = 'A'; ";

        connection.query(sql,function(err,email_data){
            connection.end();
            if(!err) {

                var collectionEmail = email_data;

                collectionEmail.forEach(function(item){
                    emailBusiness.UserClassChangeNotification(item);
                })
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });
    };

    UtilBusiness.prototype.InstructorFinancialSummary = function() {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select *, coalesce((cla_cost * registrations),0) as Gross, coalesce(((cla_cost * coalesce(registrations,0)) - net),0) as fee ";
        sql = sql + " from ( ";
        sql = sql + " select cla.cla_id,cou.cor_name, DATE_FORMAT(ct.clt_date,'%M %d %Y') as clt_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_date,'%Y-%m-%d') as clt_date2,us.use_email, ";
        sql = sql + " DATE_FORMAT(CT.clt_start_time,\"%l:%i %p\") AS clt_start_time, ";
        sql = sql + " TIME_FORMAT(ADDTIME(ct.clt_start_time, SEC_TO_TIME(cla.cla_duration*60)), '%l:%i %p')  AS final_time, ";
        sql = sql + " cla.cla_location_name, cla.cla_address,cla.cla_cost, ";
        sql = sql + " (select count(*) from class_register where cla_id = cla.cla_id and clr_status = 'A') as registrations, ";
        sql = sql + " (select coalesce(sum(clr_instructor_value),0) from class_register where cla_id = cla.cla_id and clr_status = 'A') as net ";
        sql = sql + " from class cla ";
        sql = sql + " inner join course cou on cla.cor_id = cou.cor_id ";
        sql = sql + " inner join class_time ct on cla.cla_id = ct.cla_id and ct.clt_firstClass = 'Y' ";
        sql = sql + " inner join user us on cou.use_id = us.use_id ";
        sql = sql + " where cla.cla_status = 'A' and cla.cla_deadline >= curdate() ";
        sql = sql + " ) as class_detail; ";


        connection.query(sql,function(err,email_data){
            connection.end();
            if(!err) {

                var collectionEmail = email_data;

                collectionEmail.forEach(function(item){
                    emailBusiness.InstructorFinancialSummary(item);
                })
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });
    };

    UtilBusiness.prototype.InstructorWeekCoursePerformance = function() {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select cor_id,us.use_email, cor_name, sum(visit) visit, sum(visit_week) visit_week, wishlist,wishlist_week, ";
        sql = sql + " DATE_FORMAT(date_add(curdate(), interval -9 DAY),'%Y-%m-%d')  begin_date, ";
        sql = sql + " DATE_FORMAT(date_add(curdate(), interval -1 DAY),'%Y-%m-%d')  final_date ";
        sql = sql + " from ( ";
        sql = sql + " select cou.cor_id,cou.cor_name, ";
        sql = sql + " (select count(*) from class_visit where cla_id = cla.cla_id and clv_date < curdate()) visit, ";
        sql = sql + " (select count(*) from class_visit where cla_id = cla.cla_id and clv_date between date_add(curdate(), interval -9 DAY) and date_add(curdate(), interval -1 DAY)) visit_week, ";
        sql = sql + " (select count(*) from wishlist where cor_id = cou.cor_id and wis_date < curdate()) wishlist, ";
        sql = sql + " (select count(*) from wishlist where cor_id = cou.cor_id and wis_date between date_add(curdate(), interval -9 DAY) and date_add(curdate(), interval -1 DAY)) wishlist_week ";
        sql = sql + " from class cla ";
        sql = sql + " inner join course cou on cla.cor_id = cou.cor_id ";
        sql = sql + " inner join class_time ct on cla.cla_id = ct.cla_id and ct.clt_firstClass = 'Y' ";
        sql = sql + " inner join user us on cou.use_id = us.use_id ";
        sql = sql + " where cla.cla_status = 'A' and cla.cla_deadline >= curdate() ";
        sql = sql + " ) as aux ";
        sql = sql + " group by cor_id; ";

        connection.query(sql,function(err,email_data){
            if(!err) {

                var collectionEmail = email_data;

                sql = "";
                sql = sql + " select cor_id,concat(clt_date, '-', clt_start_time) date_class,visit,visit_week,register,(register_week-cancel_week) as register_week ";
                sql = sql + " from ( ";
                sql = sql + " select cla.cor_id,DATE_FORMAT(ct.clt_date,'%b %d, %Y') as clt_date, ";
                sql = sql + " DATE_FORMAT(CT.clt_start_time,\"%l:%i %p\") AS clt_start_time, ";
                sql = sql + " TIME_FORMAT(ADDTIME(ct.clt_start_time, SEC_TO_TIME(cla.cla_duration*60)), '%l:%i %p')  AS final_time, ";
                sql = sql + " (select count(*) from class_visit where cla_id = cla.cla_id and clv_date < curdate()) visit, ";
                sql = sql + " (select count(*) from class_visit where cla_id = cla.cla_id and clv_date between date_add(curdate(), interval -9 DAY) and date_add(curdate(), interval -1 DAY)) visit_week, ";
                sql = sql + " (select count(*) from class_register where cla_id = cla.cla_id and clr_added_date < curdate() and clr_status = 'A') register, ";
                sql = sql + " (select count(*) from class_register where cla_id = cla.cla_id and clr_added_date between date_add(curdate(), interval -9 DAY) and date_add(curdate(), interval -1 DAY)) register_week, ";
                sql = sql + " (select count(*) from class_register where cla_id = cla.cla_id and clr_cancel_date between date_add(curdate(), interval -9 DAY) and date_add(curdate(), interval -1 DAY) and clr_status = 'I') cancel_week ";
                sql = sql + " from class cla ";
                sql = sql + " inner join course cou on cla.cor_id = cou.cor_id ";
                sql = sql + " inner join class_time ct on cla.cla_id = ct.cla_id and ct.clt_firstClass = 'Y' ";
                sql = sql + " inner join user us on cou.use_id = us.use_id ";
                sql = sql + " where cla.cla_status = 'A' and cla.cla_deadline >= curdate() ";
                sql = sql + " ) as aux ";


                connection.query(sql,function(err,email_data_2){
                    connection.end();
                    if(!err) {

                        var collectionEmail2 = email_data_2;

                        emailBusiness.InstructorWeekCoursePerformance(collectionEmail,collectionEmail2);

                    }
                });
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
        });
    };

    UtilBusiness.prototype.getDistanceFromLatLonInKm = function(lat1,lon1,lat2,lon2, callback) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lon2-lon1);
        var a =
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon/2) * Math.sin(dLon/2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c; // Distance in km
        callback(d);
    }

    function deg2rad(deg) {
        return deg * (Math.PI/180)
    }

    UtilBusiness.prototype.processData = function(collection,callback){

        for(var obj in collection) {
            if(collection[obj] != null) {
                if (collection[obj].toString().indexOf("[object") == -1) {
                    collection[obj] = collection[obj].toString().replace(/'/g, "\\'");
                }
            }
        }

        callback(collection);
    }

    var sort_by;
    (function() {
        // utility functions
        var default_cmp = function(a, b) {
                if (a == b) return 0;
                return a < b ? -1 : 1;
            },
            getCmpFunc = function(primer, reverse) {
                var cmp = default_cmp;
                if (primer) {
                    cmp = function(a, b) {
                        return default_cmp(primer(a), primer(b));
                    };
                }
                if (reverse) {
                    return function(a, b) {
                        return -1 * cmp(a, b);
                    };
                }
                return cmp;
            };

        // actual implementation
        UtilBusiness.prototype.sort_by = function() {
            var fields = [],
                n_fields = arguments.length,
                field, name, reverse, cmp;

            // preprocess sorting options
            for (var i = 0; i < n_fields; i++) {
                field = arguments[i];
                if (typeof field === 'string') {
                    name = field;
                    cmp = default_cmp;
                }
                else {
                    name = field.name;
                    cmp = getCmpFunc(field.primer, field.reverse);
                }
                fields.push({
                    name: name,
                    cmp: cmp
                });
            }

            return function(A, B) {
                var a, b, name, cmp, result;
                for (var i = 0, l = n_fields; i < l; i++) {
                    result = 0;
                    field = fields[i];
                    name = field.name;
                    cmp = field.cmp;

                    result = cmp(A[name], B[name]);
                    if (result !== 0) break;
                }
                return result;
            }
        }
    }());

    return new UtilBusiness();
})();

module.exports = UtilBusiness;