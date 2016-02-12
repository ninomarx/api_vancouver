var restify = require('restify');

var server = restify.createServer({
    name: 'myapp',
    version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

var tipoLocacaoResource     =    require("./server/resource/tipoLocacaoResource");
var usuarioResource     =    require("./server/resource/usuarioResource");
var mensagemResource     =    require("./server/resource/mensagemResource");

server.post('/api/mensagem', function (req, res, next) {
   // res.send(req.params);
    mensagemResource.salvar(req,res);
    return next();
});

server.get('/api/mensagem', function (req, res, next) {
    mensagemResource.consultar(req,res);
    return next();
});

server.listen(process.env.PORT || 8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});