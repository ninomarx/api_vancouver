var restify = require('restify');

var server = restify.createServer({
    name: 'cotuto_api',
    version: '1.0.0'
});

function corsHandler(req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Expose-Headers', 'X-Api-Version, X-Request-Id, X-Response-Time');
    res.setHeader('Access-Control-Max-Age', '1000');

    return next();
}

function optionsRoute(req, res, next) {

    res.send(200);
    return next();
}

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.use(restify.CORS({
    origins: ['http://localhost:8080', 'http://localhost:63342', 'https://cotutoweb.herokuapp.com'],   // defaults to ['*']
    credentials: true,                 // defaults to false
    headers: ['x-foo'],                 // sets expose-headers
    methods: ['GET','PUT','DELETE','POST','OPTIONS']
}));

server.opts('/\.*/', corsHandler, optionsRoute);

var countryResource  = require("./server/resource/countryResource");
var categoryResource = require("./server/resource/categoryResource");
var courseResource   = require("./server/resource/courseResource");
var cityResource     = require("./server/resource/cityResource");
var loginResource    = require("./server/resource/loginResource");

/**
 * Country
 */

server.post('/api/country/save', function (req, res, next) {
   // res.send(req.params);
    countryResource.salvar(req,res);
    return next();
});

server.post('/api/country/delete', function (req, res, next) {
    // res.send(req.params);
    countryResource.delete(req,res);
    return next();
});

server.post('/api/country/update', function (req, res, next) {
    // res.send(req.params);
    countryResource.update(req,res);
    return next();
});

server.get('/api/country/select', function (req, res, next) {
    countryResource.select(req,res);
    return next();
});

/**
 * Categories
 */

server.get('/api/category/select', function (req, res, next) {
    categoryResource.select(req,res);
    return next();
});


/**
 * Courses
 */

server.post('/api/course/select', function (req, res, next) {
    courseResource.select(req,res);
    return next();
});


/**
 * City
 */

server.post('/api/city/selectCode', function (req, res, next) {
    cityResource.selectCode(req,res);
    return next();
});

/**
 * Login
 */

server.post('/api/login/signup', function (req, res, next) {
    loginResource.signup(req,res);
    return next();
});

server.post('/api/login/signin', function (req, res, next) {
    loginResource.signin(req,res);
    return next();
});



/**
 * Run Server
 */


server.listen(process.env.PORT || 8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});