// // The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
// import {logger} from "firebase-functions";
// @ts-ignore
import {log, info, debug, warn, error, write} from "firebase-functions/logger";
import {credential} from "firebase-admin";
// import {applicationDefault} from "firebase-admin/lib/app";
// import {onRequest} from "firebase-functions/v2/https";
//
// import {onDocumentCreated} from "firebase-functions/v2/firestore";
import applicationDefault = credential.applicationDefault;

("firebase-functions/logger/compat");

const { initializeApp } = require('firebase-admin/app');
// The Firebase Admin SDK to access Firestore.
initializeApp(
    {
        credential: applicationDefault()
    }
);

// const {getFirestore} = require("firebase-admin/firestore");

exports.StripeOnboarding = require("./Stripe/StripeOnboarding");
exports.StripeAccountUtils = require("./Stripe/StripeAccountUtils");

exports.EmailUserUtils = require("./SendgridAPI/EmailUserUtils");

exports.TokenSystem = require("./Utils/Authentication/TokenSystem")