const { initializeApp } = require('firebase-admin/app');
// The Firebase Admin SDK to access Firestore.
initializeApp({
    credential: require('firebase-admin').credential.applicationDefault(),
});

exports.StripeOnboarding = require("./Stripe/StripeOnboarding");
exports.StripeAccountUtils = require("./Stripe/StripeAccountUtils");

exports.EmailUserUtils = require("./SendgridAPI/EmailUserUtils");

exports.TokenSystem = require("./Utils/Authentication/TokenSystem")