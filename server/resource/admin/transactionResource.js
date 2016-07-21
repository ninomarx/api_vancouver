var transactionBusiness = require("./../../business/admin/transactionBusiness");

var TransactionResource = (function() {

    var TransactionResource = function() {};

    TransactionResource.prototype.select = function(req,res){

        var transModel = new Object();

        if (req){
            transModel = req.body;
        }

        transactionBusiness.select(transModel, function(obj){
            res.json(obj);
        });

    }

    return new TransactionResource();
})();

module.exports = TransactionResource;