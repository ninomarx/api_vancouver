var nodemailer = require('nodemailer');

//var transporter = nodemailer.createTransport('smtps://ninomarques.info%40gmail.com:@teste1988@smtp.gmail.com');
var transporter = nodemailer.createTransport('smtps://info%40cotuto.com:Empower&Connect@smtp.gmail.com');

var EmailBusiness = (function() {

    var EmailBusiness = function() {

    };

    EmailBusiness.prototype.sendEmailConfirmation = function(email_to, name) {

        //email_to = "ninomarques.info@gmail.com";

        var mailOptions = {
            from: '"Cotuto Info" <info@cotuto.com>', // sender address
            to: email_to, // list of receivers
            subject: 'Hello', // Subject line
            text: 'Hello world?', // plaintext body
            html: '<b>Hello '+ name + ', welcome to Cotuto!</b>' // html body
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });

    };

    EmailBusiness.prototype.sendPasswordRecovery = function(email_to, name, newPassword) {

        //email_to = "ninomarques.info@gmail.com";

        var mailOptions = {
            from: '"Cotuto Info" <info@cotuto.com>', // sender address
            to: email_to, // list of receivers
            subject: 'Hello', // Subject line
            text: 'Hello world?', // plaintext body
            html: '<b> Hello '+ name + ' your new password is: ' + newPassword + ' </b>' // html body
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });

    };

    return new EmailBusiness();
})();

module.exports = EmailBusiness;