var factory     =    require("./../factory/dbfactory");

var UsuarioBusiness = (function() {


    /**
     *
     * @constructor
     */
    var UsuarioBusiness = function() {


    };

    /**
     * Autenticação
     *
     * @param Usuario
     * @param callback
     */
    UsuarioBusiness.prototype.autenticacao = function(usuarioModel, callback) {

        var pool = factory.getPool();
        pool.getConnection(function(err,connection){

            if (err) {
                connection.release();
                pool.end();
                callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
            }

            var sql = "";

            sql = sql + " select ";
            sql = sql + " u.ucodigo as usuarioCodigo, ";
            sql = sql + "     u.login as login, ";
            sql = sql + "     u.senha as senha, ";
            sql = sql + "     u.nome as nome, ";
            sql = sql + "     u.sexo as sexo, ";
            sql = sql + "     DATE_FORMAT(u.nascimento,'%d/%m/%Y') as nascimento, ";
            sql = sql + "     u.cpf as cpf, ";
            sql = sql + "     u.email as email, ";
            sql = sql + "     l.lcodigo as locacaoCodigo, ";
            sql = sql + "     l.endereco as endereco, ";
            sql = sql + "     l.numero as numero, ";
            sql = sql + "     l.complemento as complemento, ";
            sql = sql + "     l.cep as cep, ";
            sql = sql + "     tl.tlcodigo tipoLocacaoCodigo, ";
            sql = sql + "     tl.descricao as tipoLocacao ";

            sql = sql + " from usuario u ";
            sql = sql + " inner join locacao l on l.lcodigo = u.lcodigo ";
            sql = sql + " inner join tipoLocacao tl on tl.tlcodigo = l.tlcodigo ";
            sql = sql + " where u.login = '"+usuarioModel.login+"' ";
            sql = sql + " and u.senha = '"+usuarioModel.senha+"' ";


            connection.query(sql,function(err,usuarios){
                connection.release();
                pool.end();
                if(!err) {

                    var collectionTipoLocacao = usuarios;

                    callback(collectionTipoLocacao);
                }
            });

            connection.on('error', function(err) {

                pool.end();
                callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
            });
        });

    };


    /**
     * Consultar
     *
     * @param Usuario
     * @param callback
     */
    UsuarioBusiness.prototype.consultar = function(usuarioModel, callback) {

        var pool = factory.getPool();
        pool.getConnection(function(err,connection){

            if (err) {
                connection.release();
                pool.end();
                callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
            }

            var sql = "";

            sql = sql + " select ";
            sql = sql + " u.ucodigo as usuarioCodigo, ";
            sql = sql + "     u.login as login, ";
            sql = sql + "     u.senha as senha, ";
            sql = sql + "     u.nome as nome, ";
            sql = sql + "     u.sexo as sexo, ";
            sql = sql + "     DATE_FORMAT(u.nascimento,'%d/%m/%Y') as nascimento, ";
            sql = sql + "     u.cpf as cpf, ";
            sql = sql + "     u.email as email, ";
            sql = sql + "     l.lcodigo as locacaoCodigo, ";
            sql = sql + "     l.endereco as endereco, ";
            sql = sql + "     l.numero as numero, ";
            sql = sql + "     l.complemento as complemento, ";
            sql = sql + "     l.cep as cep, ";
            sql = sql + "     tl.tlcodigo tipoLocacaoCodigo, ";
            sql = sql + "     tl.descricao as tipoLocacao ";

            sql = sql + " from usuario u ";
            sql = sql + " inner join locacao l on l.lcodigo = u.lcodigo ";
            sql = sql + " inner join tipoLocacao tl on tl.tlcodigo = l.tlcodigo ";


            connection.query(sql,function(err,usuarios){
                connection.release();
                pool.end();
                if(!err) {

                    var collectionTipoLocacao = usuarios;

                    callback(collectionTipoLocacao);
                }
            });

            connection.on('error', function(err) {
                pool.end();
                callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
            });
        });

    };

    /**
     * Atualizar
     *
     * @param Usuario
     * @param callback
     */
    UsuarioBusiness.prototype.atualizar = function(usuarioModel, callback) {

        var pool = factory.getPool();
        pool.getConnection(function(err,connection){

            if (err) {
                connection.release();
                pool.end();
                callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
            }

            /**
             * SQL - Atualizar Locação
             */
            var sql = "";
            sql = sql + " UPDATE locacao SET \n";
            sql = sql + "   endereco = '" + usuarioModel.endereco +  "', \n";
            sql = sql + "   complemento = '" + usuarioModel.complemento +  "', \n";
            sql = sql + "   numero = '" + usuarioModel.numero +  "', \n";
            sql = sql + "   cep = '" + usuarioModel.cep +  "', \n";
            sql = sql + "   tlcodigo = " + usuarioModel.tipoLocacaoCodigo +  " \n";
            sql = sql + " WHERE \n";
            sql = sql + "   lcodigo = " + usuarioModel.locacaoCodigo + ";\n";

            connection.query(sql,function(err,result){
                connection.release();
                pool.end();
                if(err) {
                    callback({"code": 100, "status": "Erro ao conectar com banco de dados"});
                }
            });

            connection.on('error', function(err) {
                pool.end();
                callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
            });
        });

        var poolUsuario = factory.getPool();
        poolUsuario.getConnection(function(err,connection){

            if (err) {
                connection.release();
                poolUsuario.end();
                callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
            }

            /**
             * SQL - Atualizar Usuário
             */
            var sql = "";
            sql = sql + " UPDATE usuario SET \n";
            sql = sql + "   nome = '" + usuarioModel.nome +  "', \n";
            sql = sql + "   login = '" + usuarioModel.login +  "', \n";
            sql = sql + "   senha = '" + usuarioModel.senha +  "', \n";
            sql = sql + "   sexo = '" + usuarioModel.sexo +  "', \n";
            sql = sql + "   nascimento = str_to_date('" + usuarioModel.nascimento +  "','%e/%m/%Y'), \n";
            sql = sql + "   cpf = '" + usuarioModel.cpf +  "', \n";
            sql = sql + "   email = '" + usuarioModel.email +  "', \n";
            sql = sql + "   lcodigo = " + usuarioModel.locacaoCodigo +  " \n";
            sql = sql + " WHERE \n";
            sql = sql + "   ucodigo = " + usuarioModel.usuarioCodigo + ";\n";

            connection.query(sql,function(err,result){
                connection.release();
                poolUsuario.end();
                if(!err) {

                    /**
                     * Retornar usuário
                     */
                    new UsuarioBusiness().autenticacao(usuarioModel,callback)
                }
            });

            connection.on('error', function(err) {
                poolUsuario.end();
                callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
            });
        });

    };

    return new UsuarioBusiness();
})();

module.exports = UsuarioBusiness;