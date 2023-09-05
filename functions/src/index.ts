const { initializeApp } = require('firebase-admin/app');
// The Firebase Admin SDK to access Firestore.
initializeApp();

exports.StripeOnboarding = require("./Stripe/StripeOnboarding");
exports.StripeAccountUtils = require("./Stripe/StripeAccountUtils");

exports.EmailUserUtils = require("./SendgridAPI/EmailUserUtils");

exports.TokenSystem = require("./Utils/Authentication/TokenSystem")
exports.Password = require("./Utils/Authentication/Password")