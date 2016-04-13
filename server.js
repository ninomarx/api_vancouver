var restify = require('restify');

var server = restify.createServer({
    name: 'cotuto_api',
    version: '1.0.0'
});

function corsHandler(req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
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
    origins: ['http://localhost:8080', 'http://localhost:63342', 'https://cotutoweb.herokuapp.com', 'http://cotutoweb.herokuapp.com'],   // defaults to ['*']
    credentials: true,                 // defaults to false
    headers: ['x-foo'],                 // sets expose-headers
    methods: ['GET','PUT','DELETE','POST','OPTIONS']
}));

/*
server.use(restify.CORS());
server.opts(/.*!/, function (req,res,next) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Methods",
                req.header("Access-Control-Request-Method"));
                res.header("Access-Control-Allow-Headers",
                req.header("Access-Control-Request-Headers"));
                res.send(200); return next(); });

server.opts('/\.*!/', corsHandler, optionsRoute);*/

var countryResource  = require("./server/resource/countryResource");
var categoryResource = require("./server/resource/categoryResource");
var courseResource   = require("./server/resource/courseResource");
var provinceResource = require("./server/resource/provinceResource");
var cityResource     = require("./server/resource/cityResource");
var loginResource    = require("./server/resource/loginResource");
var userResource     = require("./server/resource/userResource");
var uploadResource   = require("./server/resource/uploadResource");
var imageResource    = require("./server/resource/imageResource");
var ageResource      = require("./server/resource/ageResource");
var levelResource    = require("./server/resource/levelResource");
var classResource    = require("./server/resource/classResource");
var wishlistResource = require("./server/resource/wishlistResource");


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

server.post('/api/category/selectById', function (req, res, next) {
    categoryResource.selectById(req,res);
    return next();
});

server.post('/api/category/selectSubcategory', function (req, res, next) {
    categoryResource.selectSubcategory(req,res);
    return next();
});



/**
 * Courses
 */

server.post('/api/course/select', function (req, res, next) {
    courseResource.select(req,res);
    return next();
});

server.post('/api/course/selectNearby', function (req, res, next) {
    courseResource.selectNearby(req,res);
    return next();
});

server.post('/api/course/selectInterest', function (req, res, next) {
    courseResource.selectInterest(req,res);
    return next();
});



server.post('/api/course/selectCourseTeaching', function (req, res, next) {
    courseResource.selectCourseTeaching(req,res);
    return next();
});


server.post('/api/course/save', function (req, res, next) {
    courseResource.save(req,res);
    return next();
});

server.post('/api/course/selectByFilter', function (req, res, next) {
    courseResource.selectByFilter(req,res);
    return next();
});

/**
 * Province
 */

server.get('/api/province/select', function (req, res, next) {
    provinceResource.select(req,res);
    return next();
});

/**
 * City
 */

server.post('/api/city/selectCode', function (req, res, next) {
    cityResource.selectCode(req,res);
    return next();
});

server.post('/api/city/selectbyProvince', function (req, res, next) {
    cityResource.selectbyProvince(req,res);
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

server.post('/api/login/recoverPassword', function (req, res, next) {
    loginResource.recoverPassword(req,res);
    return next();
});


/**
 * User
 */

server.post('/api/user/saveStudent', function (req, res, next) {
    userResource.saveStudent(req,res);
    return next();
});

server.post('/api/user/saveInstructor', function (req, res, next) {
    userResource.saveInstructor(req,res);
    return next();
});


/**
 * Upload
 */

server.post('/api/upload', function (req, res, next) {
    uploadResource.upload(req,res);
    return next();
});

/**
 * Image
 */
server.get("/api/image/:imageURL", function (req, res, next) {
    imageResource.getImage(req,res);
    return next();
});

/**
 * Age
 */
server.get("/api/age/select", function (req, res, next) {
    ageResource.select(req,res);
    return next();
});

/**
 * Level
 */
server.get("/api/level/select", function (req, res, next) {
    levelResource.select(req,res);
    return next();
});


/**
 * Class
 */

server.post('/api/class/save', function (req, res, next) {
    classResource.save(req,res);
    return next();
});

server.post('/api/class/getClassMultiple', function (req, res, next) {
    classResource.getClassMultiple(req,res);
    return next();
});

server.post('/api/class/postClass', function (req, res, next) {
    classResource.postClass(req,res);
    return next();
});



/**
 * Wishlist
 */

server.post('/api/wishlist/save', function (req, res, next) {
    wishlistResource.save(req,res);
    return next();
});


/**
 * Run Server
 */


server.listen(process.env.PORT || 8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});