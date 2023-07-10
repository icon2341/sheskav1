//@ts-ignore
import {log, info, debug, warn, error, write} from "firebase-functions/logger";
import {CallableRequest, HttpsError, onCall} from "firebase-functions/v2/https";
const {getFirestore} = require("firebase-admin/firestore");

require("firebase-functions/logger/compat");

/**
 * getStripeAccountLink: Gets the stripe account link for the user
 * @requires request.auth.uid
 * @returns {Promise<{result: string}>}
 */
exports.getStripeAccountLink = onCall({secrets: ["STRIPE_SECRET"]},  (request: CallableRequest ) => {
    info("Executing getStripeAccountLink with request: ", request.instanceIdToken);
    // info("REQUEST INFO", request)

    if (!request.auth) {
        // Throwing an HttpsError so that the client gets the error details.
        console.error("request: ", request.instanceIdToken, " failed precondition authentication check");
        throw new HttpsError("failed-precondition", "The function must be called " + "while authenticated.");
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET);

    //Check to see if the user already has a stripe account linked to the account
    return getFirestore().collection("users").doc(request.auth?.uid).get().then((doc: any) => {
        if (doc.exists) {
            //If there already is a account id
            if (doc.data().stripe_account_id) {
                info("request: ", request.instanceIdToken, " user already has a stripe account linked to the account");
                return stripe.accounts.retrieve(
                    doc.data().stripe_account_id
                ).catch((errorFound: any) => {
                    error("request: ", request.instanceIdToken, " Error retrieving stripe account: ", errorFound.message, " stack: ", errorFound.stack);
                    throw new HttpsError("internal", "There was an internal server error");
                }).then((account: any) => {
                    return stripe.accountLinks.create({
                        account: account.id,
                        refresh_url: process.env.STRIPE_REFERSH_URL,
                        return_url: process.env.STRIPE_RETURN_URL,
                        type: 'account_onboarding',
                    }).then((accountLink : any) => {
                        info("request: ", request.instanceIdToken, " returning account link: ", {result: accountLink.url}) ;
                        return {result: accountLink.url};
                    })
                })
            } else {
                console.error("request: ", request.instanceIdToken, " user does not have a stripe account linked to the account");
                throw new HttpsError("not-found", "The user does not have a stripe account linked to the account");
            }
        } else {
            console.error("request: ", request.instanceIdToken, " user does not exist");
            throw new HttpsError("not-found", "The user does not exist");
        }
    })
})

/**
 * createLinkStripeAccount: Creates a stripe account using Stripe api, and returns the account id to the user to
 * complete the onboarding process. Will also add the account number to the user's firestore document.
 *
 * @requires request.auth.uid
 * @returns {Promise<{result: string}>}
 */
exports.createLinkStripeAccount = onCall({secrets: ["STRIPE_SECRET"]},  (request: CallableRequest ) => {
    info("Executing createLinkStripeAccount with request: ", request.instanceIdToken);

    if (!request.auth) {
        // Throwing an HttpsError so that the client gets the error details.
        console.error("request: ", request.instanceIdToken, " failed precondition authentication check");
        throw new HttpsError("failed-precondition", "The function must be called " + "while authenticated.");
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET);

    //Check to see if the user already has a stripe account linked to the account
    return getFirestore().collection("users").doc(request.auth?.uid).get().then((doc: any) => {
        if (doc.exists) {
            // if there already is an account id
            if (doc.data().stripe_account_id) {
                console.error("request: ", request.instanceIdToken, " user already has a stripe account linked to the account");
                throw new HttpsError("already-exists", "The user already has a stripe account linked to the account");
            } else {
                //Then create the account
                return stripe.accounts.create(
                    {
                        type: 'express',
                    }).then((account: any) => {
                        return getFirestore()
                            .collection("users")
                            .doc(request.auth?.uid)
                            .update({
                                stripe_account_id: account.id
                            }).then(() => {
                                info("request: ", request.instanceIdToken, " returning account id: ", account.id) ;
                                return {result: account.id};
                            })
                            .catch((requestError: any) => {
                            error(" Error posting stripe account id to firestore: ", requestError.message, " stack: ", requestError.stack, "request: ", request.instanceIdToken);
                            throw new HttpsError("internal", "There was an internal server error");
                        });
                })
            }
        }
    }).catch(
        (requestError: any) => {
            console.error("request: ", request.instanceIdToken, " internal error: ", requestError.message, " stack: ", requestError.stack);
            throw new HttpsError("internal", "There was an internal server error");
        }
    )


})