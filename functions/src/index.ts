// // The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
// import {logger} from "firebase-functions";
// @ts-ignore
import {log, info, debug, warn, error, write} from "firebase-functions/logger";
// import {onRequest} from "firebase-functions/v2/https";
//
// import {onDocumentCreated} from "firebase-functions/v2/firestore";
require("firebase-functions/logger/compat");


// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");
// const {getFirestore} = require("firebase-admin/firestore");

initializeApp();

exports.StripeOnboarding = require("./Stripe/StripeOnboarding");
exports.StripeAccountUtils = require("./Stripe/StripeAccountUtils");

exports.EmailUserUtils = require("./SendgridAPI/EmailUserUtils");