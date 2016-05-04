var messageBusiness = require("./../business/messageBusiness");

var MessageResource = (function() {

    /**
     *
     * @constructor
     */
    var MessageResource = function() {};

    MessageResource.prototype.getMessages = function(req,res){

        var messageModel = new Object();

        if (req){
            messageModel = req.body;
        }

        messageBusiness.getMessages(messageModel, function(obj){
            res.json(obj);
        });

    }

    MessageResource.prototype.getMessagesTop = function(req,res){

        var messageModel = new Object();

        if (req){
            messageModel = req.body;
        }

        messageBusiness.getMessagesTop(messageModel, function(obj){
            res.json(obj);
        });

    }

    MessageResource.prototype.getMessagesAmout = function(req,res){

        var messageModel = new Object();

        if (req){
            messageModel = req.body;
        }

        messageBusiness.getMessagesAmout(messageModel, function(obj){
            res.json(obj);
        });

    }

    MessageResource.prototype.getMessagePages = function(req,res){

        var messageModel = new Object();

        if (req){
            messageModel = req.body;
        }

        messageBusiness.getMessagePages(messageModel, function(obj){
            res.json(obj);
        });

    }

    MessageResource.prototype.starMessage = function(req,res){

        var messageModel = new Object();

        if (req){
            messageModel = req.body;
        }

        messageBusiness.starMessage(messageModel, function(obj){
            res.json(obj);
        });
    }

    MessageResource.prototype.archiveMessage = function(req,res){

        var messageModel = new Object();

        if (req){
            messageModel = req.body;
        }

        messageBusiness.archiveMessage(messageModel, function(obj){
            res.json(obj);
        });
    }

    return new MessageResource();
})();

module.exports = MessageResource;