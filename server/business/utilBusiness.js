var factory = require("./../factory/dbfactory");
var emailBusiness = require("./../business/emailBusiness");

var UtilBusiness = (function() {

    var UtilBusiness = function() {

    };

    UtilBusiness.prototype.sendEmailReview = function(callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select *, DATE_FORMAT(timestampadd(day,30,last_date),'%M %d') until_date ";
        sql = sql + " from ( ";
        sql = sql + " select UU.use_email, COU.cor_image, U.use_image, COU.cor_name, U.use_first_name,cla_id, ";
        sql = sql + " (select count(*) from class_review where use_id = CR.use_id and cla_id = CR.cla_id) as reviews, ";
        sql = sql + " (select clt_date from class_time where cla_id = CR.cla_id order by clt_date desc limit 1) as last_date ";
        sql = sql + " from class_register CR ";
        sql = sql + " INNER JOIN course COU on CR.cor_id = COU.cor_id ";
        sql = sql + " INNER JOIN user U on COU.use_id = U.use_id ";
        sql = sql + " INNER JOIN user UU on CR.use_id = UU.use_id ";
        sql = sql + " where clr_status = 'A' ";
        sql = sql + " AND clr_transaction_status = 'P' ";
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