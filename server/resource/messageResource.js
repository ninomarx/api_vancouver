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

    MessageResource.prototype.getMessageDetails = function(req,res){

        var messageModel = new Object();

        if (req){
            messageModel = req.body;
        }

        messageBusiness.getMessageDetails(messageModel, function(obj){
            res.json(obj);
        });
    }

    MessageResource.prototype.postMessage = function(req,res){

        var messageModel = new Object();

        if (req){
            messageModel = req.body;
        }

        messageBusiness.postMessage(messageModel, function(obj){
            res.json(obj);
        });
    }

    MessageResource.prototype.postMessageStudent = function(req,res){

        var messageModel = new Object();

        if (req){
            messageModel = req.body;
        }

        messageBusiness.postMessageStudent(messageModel, function(obj){
            res.json(obj);
        });
    }

    MessageResource.prototype.postMessageMultiple = function(req,res){

        var messageModel = new Object();

        if (req){
            messageModel = req.body;
        }

        messageBusiness.postMessageMultiple(messageModel, function(obj){
            res.json(obj);
        });
    }

    MessageResource.prototype.getClassCourse = function(req,res){

        var messageModel = new Object();

        if (req){
            messageModel = req.body;
        }

        messageBusiness.getClassCourse(messageModel, function(obj){
            res.json(obj);
        });
    }

    return new MessageResource();
})();

module.exports = MessageResource;