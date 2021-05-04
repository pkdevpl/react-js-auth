const functions = 		require("firebase-functions");
const admin = 			require("firebase-admin");
const authFunctions = 	require("./auth-functions/functions");

admin.initializeApp();

exports.createUserDoc = 
functions.https.onCall( async (data, context) => {
	if (!context.auth)
		throw new functions.https.HttpsError('not-authenticated', 'You need to log in to perform this action');

	const { firstName, lastName } = data;
	const { uid, email } = context.auth.token;

	const db = admin.firestore();
	return db.doc('users/'+ uid).set({uid, firstName, lastName, email});
}); 

exports.cleanUpUserDocs = 
functions.auth.user().onDelete( async (user, context) => {
	const db = admin.firestore();
	return db.doc('users/'+ user.uid).delete();
});

exports.sendResetLink = authFunctions.sendResetLink;
exports.sendConfirmationLink = authFunctions.sendConfirmationLink;