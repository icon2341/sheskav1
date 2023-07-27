//@ts-ignore
import {log, info, debug, warn, error, write} from "firebase-functions/logger";
import {CallableRequest, HttpsError, onCall} from "firebase-functions/v2/https";
const {getFirestore} = require("firebase-admin/firestore");
/**
 * getStripeAccount: Gets the stripe account for the user
 * @requires request.auth.uid
 * @returns {Promise<{result: string}>}
 * @throws {HttpsError} - if the user does not have a stripe account linked to the account
 */
exports.getStripeAccount = onCall({secrets: ["STRIPE_SECRET"]},  (request: CallableRequest ) => {
    info("Executing getStripeAccount with request: ", request.instanceIdToken);
    if (!request.auth) {
        // Throwing an HttpsError so that the client gets the error details.
        error("request: ", request.instanceIdToken, " failed precondition authentication check");
        throw new HttpsError("failed-precondition", "The function must be called " + "while authenticated.");
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET);

    return getFirestore().collection("users").doc(request.auth?.uid).get().then((doc: any) => {
        if (doc.exists) {
            if (doc.data().stripe_account_id) {
                // info('STRIPE ACCOUNT LINKED, GETTING ACCOUNT', doc.data().stripe_account_id)
                return stripe.accounts.retrieve(
                    doc.data().stripe_account_id
                ).then((account: any) => {
                    info("request: ", request.instanceIdToken, " returning account: ", {result: account}) ;
                    return {result: account};
                }).catch((error: any) => {
                    error("request: ", request.instanceIdToken, " Error retrieving stripe account: ", error.message, " stack: ", error.stack);
                    throw new HttpsError("internal", "There was an internal server error");
                })
            } else {
                error("request: ", request.instanceIdToken, " user does not have a stripe account linked to the account");
                throw new HttpsError("not-found", "The user does not have a stripe account linked to the account");
            }
        } else {
            error("request: ", request.instanceIdToken, " user does not exist");
            throw new HttpsError("not-found", "The user does not exist");
        }
    });
})

/**
 * getStripeLoginLink: Gets the stripe login link for the user
 * @requires request.auth.uid
 * @returns {Promise<{result: string}>}
 * @throws {HttpsError} - if the user does not have a stripe account linked to the account
 * @throws {HttpsError} - if there is an error retrieving the stripe login link
 * @throws {HttpsError} - if the user does not exist
 * @throws {HttpsError} - if the user is not authenticated
 */
exports.getStripeLoginLink = onCall({secrets: ["STRIPE_SECRET"]},  (request: CallableRequest ) => {
    if (!request.auth) {
        // Throwing an HttpsError so that the client gets the error details.
        error("request: ", request.instanceIdToken, " failed precondition authentication check");
        throw new HttpsError("failed-precondition", "The function must be called " + "while authenticated.");
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET);

    return getFirestore().collection("users").doc(request.auth?.uid).get().then((doc: any) => {
        if(doc.exists) {
            if(doc.data().stripe_account_id) {
                return stripe.accounts.createLoginLink(
                    doc.data().stripe_account_id
                ).then((link: any) => {
                    info("request: ", request.instanceIdToken, " returning login link: ", {result: link}) ;
                    return {result: link};
                }).catch((error: any) => {
                    error("request: ", request.instanceIdToken, " Error retrieving stripe login link: ", error.message, " stack: ", error.stack);
                    throw new HttpsError("internal", "There was an internal server error");
                })
            } else {
                error("request: ", request.instanceIdToken, " user does not have a stripe account linked to the account");
                throw new HttpsError("not-found", " user does not have a stripe account linked to the account");
            }
        } else {
            error("request: ", request.instanceIdToken, " user does not exist");
            throw new HttpsError("not-found", "The user does not exist");
        }
    });

})