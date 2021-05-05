const functions = 	require('firebase-functions');
const admin = 		require('firebase-admin');
const nodemailer = 	require("nodemailer");

const confirmEmailTemplate = 	require('./templates/email-confirm');
const resetPasswordTemplate = 	require('./templates/email-reset-pass');

const smtp_config = require('../config');

const noreplyTransporter = nodemailer.createTransport({
	host: smtp_config.host, 
	port: smtp_config.port, 
	secure: false, 
	auth:{
		user: smtp_config.username, 
		pass: smtp_config.password
	}
});

exports.sendResetLink = functions.https.onCall( async (data, context) => {
	const {email} = data;
	let user = null;
    
	if( typeof(email) !== 'string' || email.length === 0 ) {
        throw new functions.https.HttpsError('invalid-argument', 'Provided e-mail has wrong format.');
    }

	try {
        user = await admin.auth().getUserByEmail(email);
	} catch(err) {
        throw new functions.https.HttpsError('not-found', 'User with provided e-mail was not found.');
	}

    let resetPasswordLink = await admin.auth().generatePasswordResetLink(user.email);
	// resetPasswordLink = 'http://localhost:3000/action?' + resetPasswordLink.split('?')[1];
    
	try {
        await noreplyTransporter.sendMail({
            from: '"Wsparcie" <no-reply@pkdev.pl>',
			to: user.email,
			subject: "Instrukcja resetowania hasła dla Twojego konta",
			text: "",
			html: resetPasswordTemplate.getTemplate(resetPasswordLink)
		});
        return true;
	} catch(err) {
        console.log(err);
        functions.logger.error(err);
        throw new functions.https.HttpsError('internal', 'E-mail could not be sent due to nodemailer error.');
	}
});

exports.sendConfirmationLink = functions.https.onCall( async (data, context) => {
	const {email} = data;
    if( typeof(email) !== 'string' || email.length === 0 ) {
        throw new functions.https.HttpsError('invalid-argument', 'Provided e-mail has wrong format.');
    }	
	try {
		user = await admin.auth().getUserByEmail(email);
	} catch(err) {
		throw new functions.https.HttpsError('not-found', 'User with provided e-mail was not found.');
	}

    let verificationLink = await admin.auth().generateEmailVerificationLink(user.email);
	// verificationLink = 'http://localhost:3000/action?' + verificationLink.split('?')[1];

	try {
		await noreplyTransporter.sendMail({
			from: '"Wsparcie" <no-reply@pkdev.pl>',
			to: email,
			subject: "Potwierdź swój adres e-mail",
			text: "",
			html: confirmEmailTemplate.getTemplate(verificationLink) 
		});
		return true;
	} catch(err) {
		console.log(err);
		throw new functions.https.HttpsError(err.code, err.message, err);
	}
});

exports.verifyEmailAddress = functions.https.onCall( async (data, context)=>{
	const oobCode = data;
	if( typeof(oobCode) !== 'string' || oobCode.length === 0 ) {
        throw new functions.https.HttpsError('invalid-argument', 'Provided oobCode is wrong.');
    }

});

