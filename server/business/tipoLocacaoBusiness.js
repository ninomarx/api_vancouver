var factory     =    require("./../factory/dbfactory");

var TipoLocacaoBusiness = (function() {

    /**
     *
     * @constructor
     */
    var TipoLocacaoBusiness = function() {

    };

    /**
     *
     * @param TipoLocacao
     * @param callback
     */
    TipoLocacaoBusiness.prototype.getTipoLocacao = function(tipoLocacaoModel, callback) {

        var pool = factory.getPool();
        pool.getConnection(function(err,connection){

            if (err) {
                connection.release();
                pool.end();
                callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
            }

            var sql = "";
            sql = sql + " select tlcodigo as tipoLocacaoCodigo, ";
            sql = sql + "        descricao as descricao ";
            sql = sql + " from tipoLocacao ";


            connection.query(sql,function(err,tipoLocacoes){
                connection.release();
                pool.end();
                if(!err) {

                    var objLivro;
                    var collectionTipoLocacao = new Array();

                    tipoLocacoes.forEach(function(tipoLocacao) {

                        objLivro = new Object();
                        objLivro.tipoLocacaoCodigo = tipoLocacao.tipoLocacaoCodigo;
                        objLivro.descricao = tipoLocacao.descricao;

                        collectionTipoLocacao.push(objLivro);
                    });

                    callback(collectionTipoLocacao);
                }
            });

            connection.on('error', function(err) {
                pool.end();
                callback({"code" : 100, "status" : "Erro ao conectar com banco de dados"});
            });
        });

    };

    return new TipoLocacaoBusiness();
})();

module.exports = TipoLocacaoBusiness;