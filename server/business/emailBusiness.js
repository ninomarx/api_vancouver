var nodemailer = require('nodemailer');

//var transporter = nodemailer.createTransport('smtps://ninomarques.info%40gmail.com:@teste1988@smtp.gmail.com');
var transporter = nodemailer.createTransport('smtps://info%40cotuto.com:Empower&Connect2014@smtp.gmail.com');

var EmailBusiness = (function() {

    var EmailBusiness = function() {

    };

    EmailBusiness.prototype.sendEmailConfirmation = function(email_to, name, link) {

        //email_to = "ninomarques.info@gmail.com";

        var mailOptions = {
            from: '"Cotuto Info" <info@cotuto.com>', // sender address
            to: email_to, // list of receivers
            subject: 'Welcome to Cotuto', // Subject line
            text: 'Welcome to Cotuto', // plaintext body
            html: '<div style="width: 100%;text-align: center;margin-top:30px;"><img src="https://s3.amazonaws.com/cotutoweb/logo2.png" style="height:40px;"></div><div style="text-align: center;"><p style="font-size: 25px;color: #00669B;">Thank you '+name+' for signing up for Cotuto</p><p style="font-size: 20px;">Click on link below to confirm your email:</p><a href="'+link+'" style="font-size: 30px;font-weight: bold;color: #00669B;">Click here</a><div style="text-align: center;margin-top:60px;"><a href="https://www.facebook.com/cotutoeducation/"><img src="https://s3.amazonaws.com/cotutoweb/facebook.png" style="max-height:25px;"></a><a href="https://www.instagram.com/cotuto/"><img src="https://s3.amazonaws.com/cotutoweb/instagram.png" style="max-height:25px;"></a><a href="https://blog.cotuto.com/"><img src="https://s3.amazonaws.com/cotutoweb/blog2.png" style="max-height:25px;"></a><p style="font-size: 14px;margin-top: 4px;color: #6C6B6B;">Never Stop Learning</p></div></div>'
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
            subject: 'Cotuto - Password Recovery', // Subject line
            text: 'Cotuto - Password Recovery', // plaintext body
            html: '<div style="width: 100%;text-align: center;margin-top:30px;"><img src="https://s3.amazonaws.com/cotutoweb/logo2.png" style="height:40px;"></div><div style="text-align: center;"><p style="font-size: 25px;color: #00669B;">Hey '+name+' did you forget your password?</p><p style="font-size: 20px;margin-top: -15px;width: 32%;margin-left: 34%;">Access your account using this password ('+newPassword+') and change this on account page.</p><div style="text-align: center;margin-top:60px;"><a href="https://www.facebook.com/cotutoeducation/"><img src="https://s3.amazonaws.com/cotutoweb/facebook.png" style="max-height:25px;"></a><a href="https://www.instagram.com/cotuto/"><img src="https://s3.amazonaws.com/cotutoweb/instagram.png" style="max-height:25px;"></a><a href="https://blog.cotuto.com/"><img src="https://s3.amazonaws.com/cotutoweb/blog2.png" style="max-height:25px;"></a><p style="font-size: 14px;margin-top: 4px;color: #6C6B6B;">Never Stop Learning</p></div></div>'
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });

    };

    EmailBusiness.prototype.sendEmailConfirmationAdmin = function(email_to,password, link) {

        //email_to = "ninomarques.info@gmail.com";

        var mailOptions = {
            from: '"Cotuto Info" <info@cotuto.com>', // sender address
            to: email_to, // list of receivers
            subject: 'Welcome to Cotuto', // Subject line
            text: 'Welcome to Cotuto', // plaintext body
            html: '<div style="width: 100%;text-align: center;margin-top:80px;"><img src="https://s3.amazonaws.com/cotutoweb/CotutoLogo1.png" style="height:120px;"></div><div style="text-align: center;font-family: helvetica;"><p style="font-size: 25px;color: #00669B;">Welcome to Cotuto!</p><p style="font-size: 20px;margin-top: -15px;width: 35%;margin-left: 32%;">To login into your account use the following email address and password combination:</p><p style="font-size: 20px;margin-top: -15px;">Email: ' + email_to + ' - Password: ' + password + '</p><p style="font-size: 16px;">To change your password, go to the Account Page.</p><p style="font-size: 16px;margin-top: -15px;">To fill in your profile, go to the Profile Page.</p><p style="font-size: 20px;margin-top: 50px;margin-bottom:3px;">Click on link below to confirm your email:</p><a href="'+link+'" style="font-size: 30px;font-weight: bold;color: #00669B;">Click here</a><p style="font-size: 16px;margin-top: 50px;">If you have any questions, send us an email to info@cotuto.com.</p><p style="font-size: 16px;margin-top: -15px;">Thanks,</p><p style="font-size: 16px;margin-top: -15px;">The Cotuto Team</p><div style="text-align: center;margin-top:60px;"><a href="https://www.facebook.com/cotutoeducation/"><img src="https://s3.amazonaws.com/cotutoweb/facebook.png" style="max-height:25px;"></a><a href="https://www.instagram.com/cotuto/"><img src="https://s3.amazonaws.com/cotutoweb/instagram.png" style="max-height:25px;"></a><a href="https://blog.cotuto.com/"><img src="https://s3.amazonaws.com/cotutoweb/blog2.png" style="max-height:25px;"></a><p style="font-size: 14px;margin-top: 4px;color: #6C6B6B;">Never Stop Learning</p></div></div>'
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


