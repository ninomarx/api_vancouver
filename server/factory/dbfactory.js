var mysql     =    require("mysql");

var DbFactory = (function() {

    var DbFactory = function() {};

    DbFactory.prototype.getPool = function(){

        return mysql.createPool({
            connectionLimit : 100, //important
            host     : 'localhost',
            user     : 'root',
            password : '123',
            database : 'cotuto_db',
            debug    :  false
        });
    }

    DbFactory.prototype.getConnection = function(){

        return mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : '123',
            database : 'cotuto_db',
            multipleStatements: true
        });
    }

    return new DbFactory();
})();

module.exports = DbFactory;

/*

COTUTO - LIVE
host     : 'us-cdbr-iron-east-04.cleardb.net',
user     : 'b79c2e2bb86abd',
password : 'bbc41da0',
database : 'heroku_c0cc37b2dd794df',

HEROKU
 host     : 'us-cdbr-iron-east-03.cleardb.net',
 user     : 'bcb66f67dd09b7',
 password : '481935e4',
 database : 'heroku_461cbb34ac72c8b',

 LOCAL
 host     : 'localhost',
 user     : 'root',
 password : '123',
 database : 'cotuto_db',

 */