var UtilBusiness = (function() {

    var UtilBusiness = function() {

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
            if(collection[obj].toString().indexOf("[object") == -1) {
                collection[obj] = collection[obj].toString().replace(/'/g, "\\'");
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