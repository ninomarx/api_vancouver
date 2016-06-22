var restify = require('restify');

var  server = restify.createServer({
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
    origins: ['*'],   // defaults to ['*']
    credentials: true,
    headers: ['x-foo'],
    methods: ['GET','PUT','DELETE','POST','OPTIONS']
}));

// origins: ['http://localhost:8080', 'http://localhost:63342', 'https://cotutoweb.herokuapp.com', 'http://cotutoweb.herokuapp.com','http://cotuto.com/','http://cotuto-web-live.herokuapp.com','https://cotuto.com/','https://cotuto-web-live.herokuapp.com'],   // defaults to ['*']

server.opts('/\.*/', corsHandler, optionsRoute);

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
var registerResource = require("./server/resource/registerResource");
var messageResource  = require("./server/resource/messageResource");
var paymentResource  = require("./server/resource/paymentResource");
var reviewResource   = require("./server/resource/reviewResource");
var utilResource     = require("./server/resource/utilResource");
var reportResource   = require("./server/resource/reportResource");
var discountResource = require("./server/resource/discountResource");


var adminInstructorsResource = require("./server/resource/admin/instructorResource");
var adminLoginResource = require("./server/resource/admin/loginResource");

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

server.get('/api/category/selectFilter', function (req, res, next) {
    categoryResource.selectFilter(req,res);
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

server.post('/api/category/selectSubcategoryFilter', function (req, res, next) {
    categoryResource.selectSubcategoryFilter(req,res);
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

server.post('/api/course/selectBySearch', function (req, res, next) {
    courseResource.selectBySearch(req,res);
    return next();
});

server.post('/api/course/delete', function (req, res, next) {
    courseResource.delete(req,res);
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

server.post('/api/login/signupAdmin', function (req, res, next) {
    loginResource.signupAdmin(req,res);
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

server.post('/api/user/saveEmail', function (req, res, next) {
    userResource.saveEmail(req,res);
    return next();
});

server.post('/api/user/savePassword', function (req, res, next) {
    userResource.savePassword(req,res);
    return next();
});

server.post('/api/user/saveInstructorSignUp', function (req, res, next) {
    userResource.saveInstructorSignUp(req,res);
    return next();
});

server.post('/api/user/saveSetting', function (req, res, next) {
    userResource.saveSetting(req,res);
    return next();
});

server.post('/api/user/updateSetting', function (req, res, next) {
    userResource.updateSetting(req,res);
    return next();
});

server.post('/api/user/getCategorySetting', function (req, res, next) {
    userResource.getCategorySetting(req,res);
    return next();
});

server.post('/api/user/getTagsSetting', function (req, res, next) {
    userResource.getTagsSetting(req,res);
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
//server.get("/api/image/:imageURL", function (req, res, next) {
//    imageResource.getImage(req,res);
//    return next();
//});

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

server.post('/api/class/getClass', function (req, res, next) {
    classResource.getClass(req,res);
    return next();
});

server.post('/api/class/getClassComments', function (req, res, next) {
    classResource.getClassComments(req,res);
    return next();
});

server.post('/api/class/getClassTime', function (req, res, next) {
    classResource.getClassTime(req,res);
    return next();
});

server.post('/api/class/otherClassTime', function (req, res, next) {
    classResource.otherClassTime(req,res);
    return next();
});

server.post('/api/class/getClassesAttending', function (req, res, next) {
    classResource.getClassesAttending(req,res);
    return next();
});

server.post('/api/class/getClassesAttended', function (req, res, next) {
    classResource.getClassesAttended(req,res);
    return next();
});

server.post('/api/class/getClassesCancelled', function (req, res, next) {
    classResource.getClassesCancelled(req,res);
    return next();
});

server.post('/api/class/getAllClassesAttended', function (req, res, next) {
    classResource.getAllClassesAttended(req,res);
    return next();
});

server.post('/api/class/getClassesTeaching', function (req, res, next) {
    classResource.getClassesTeaching(req,res);
    return next();
});

server.post('/api/class/getClassesTaught', function (req, res, next) {
    classResource.getClassesTaught(req,res);
    return next();
});

server.post('/api/class/cancelClass', function (req, res, next) {
    classResource.cancelClass(req,res);
    return next();
});

server.post('/api/class/getRoster', function (req, res, next) {
    classResource.getRoster(req,res);
    return next();
});

server.post('/api/class/getGoal', function (req, res, next) {
    classResource.getGoal(req,res);
    return next();
});


/**
 * Wishlist
 */

server.post('/api/wishlist/save', function (req, res, next) {
    wishlistResource.save(req,res);
    return next();
});

server.post('/api/wishlist/getWishList', function (req, res, next) {
    wishlistResource.getWishList(req,res);
    return next();
});



/**
 * Class Register
 */

server.post('/api/register/save', function (req, res, next) {
    registerResource.save(req,res);
    return next();
});

server.post('/api/register/cancel', function (req, res, next) {
    registerResource.cancel(req,res);
    return next();
});

server.post('/api/register/cancelVerify', function (req, res, next) {
    registerResource.cancelVerify(req,res);
    return next();
});

server.post('/api/register/saveVerify', function (req, res, next) {
    registerResource.saveVerify(req,res);
    return next();
});

/**
 * Message
 */

server.post('/api/message/getMessages', function (req, res, next) {
    messageResource.getMessages(req,res);
    return next();
});

server.post('/api/message/getMessagesTop', function (req, res, next) {
    messageResource.getMessagesTop(req,res);
    return next();
});

server.post('/api/message/getMessagesAmout', function (req, res, next) {
    messageResource.getMessagesAmout(req,res);
    return next();
});

server.post('/api/message/getMessagePages', function (req, res, next) {
    messageResource.getMessagePages(req,res);
    return next();
});

server.post('/api/message/starMessage', function (req, res, next) {
    messageResource.starMessage(req,res);
    return next();
});

server.post('/api/message/archiveMessage', function (req, res, next) {
    messageResource.archiveMessage(req,res);
    return next();
});

server.post('/api/message/getMessageDetails', function (req, res, next) {
    messageResource.getMessageDetails(req,res);
    return next();
});

server.post('/api/message/postMessage', function (req, res, next) {
    messageResource.postMessage(req,res);
    return next();
});

server.post('/api/message/postMessageStudent', function (req, res, next) {
    messageResource.postMessageStudent(req,res);
    return next();
});

server.post('/api/message/postMessageMultiple', function (req, res, next) {
    messageResource.postMessageMultiple(req,res);
    return next();
});


/**
 * Payment
 */

server.post('/api/payment/createToken', function (req, res, next) {
    paymentResource.createToken(req,res);
    return next();
});

server.post('/api/payment/charge', function (req, res, next) {
    paymentResource.charge(req,res);
    return next();
});

server.post('/api/payment/createAccount', function (req, res, next) {
    paymentResource.createAccount(req,res);
    return next();
});


/**
 * Review
 */
server.post('/api/review/save', function (req, res, next) {
    reviewResource.save(req,res);
    return next();
});

/**
 * Discount
 */
server.post('/api/discount/save', function (req, res, next) {
    discountResource.save(req,res);
    return next();
});

server.post('/api/discount/saveCodes', function (req, res, next) {
    discountResource.saveCodes(req,res);
    return next();
});

server.post('/api/discount/getDiscount', function (req, res, next) {
    discountResource.getDiscount(req,res);
    return next();
});

server.post('/api/discount/getDiscountClass', function (req, res, next) {
    discountResource.getDiscountClass(req,res);
    return next();
});

server.post('/api/discount/getDiscountCodes', function (req, res, next) {
    discountResource.getDiscountCodes(req,res);
    return next();
});

/**
 * Util
 */
server.get('/api/util/sendEmailReview', function (req, res, next) {
    utilResource.sendEmailReview(req,res);
    return next();
});


/**
 * REPORT
 */
server.post('/api/report/saveReport', function (req, res, next) {
    reportResource.saveReport(req,res);
    return next();
});


/**
 * ADMIN - INSTRUCTORS
 */
server.get('/api/admin/instructor/select', function (req, res, next) {
    adminInstructorsResource.select(req,res);
    return next();
});

server.post('/api/admin/instructor/allowInstructor', function (req, res, next) {
    adminInstructorsResource.allowInstructor(req,res);
    return next();
});

/**
 * ADMIN - LOGIN
 */
server.post('/api/admin/login/signin', function (req, res, next) {
    adminLoginResource.signin(req,res);
    return next();
});



/**
 * Run Server
 */


server.listen(process.env.PORT || 8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});