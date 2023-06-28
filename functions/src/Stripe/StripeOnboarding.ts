//@ts-ignore
import {log, info, debug, warn, error, write} from "firebase-functions/logger";
import {CallableRequest, HttpsError, onCall} from "firebase-functions/v2/https";
const {getFirestore} = require("firebase-admin/firestore");

require("firebase-functions/logger/compat");

/**
 * getStripeAccountLink: Creates a stripe account using Stripe api, and returns a url to the user to complete the onboarding process. Will also add the account number to the user's firestore document.
 *
 * @requires request.auth.uid
 * @returns {Promise<{result: string}>}
 */
exports.getStripeAccountLink = onCall({secrets: ["STRIPE_SECRET"]},  (request: CallableRequest ) => {
    info("Executing getStripeAccountLink with request: ", request.instanceIdToken);
    // info("REQUEST INFO", request)

    if (!request.auth) {
        // Throwing an HttpsError so that the client gets the error details.
        error("request: ", request.instanceIdToken, " failed precondition authentication check");
        throw new HttpsError("failed-precondition", "The function must be called " + "while authenticated.");
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET);

    //Check to see if the user already has a stripe account linked to the account
    return getFirestore().collection("users").doc(request.auth?.uid).get().then((doc: any) => {
        if (doc.exists) {
            //If there already is a acount id
            if (doc.data().stripe_account_id) {
                info("request: ", request.instanceIdToken, " user already has a stripe account linked to the account");
                return stripe.accounts.retrieve(
                    doc.data().stripe_account_id
                ).catch((error: any) => {
                    error("request: ", request.instanceIdToken, " Error retrieving stripe account: ", error.message, " stack: ", error.stack);
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
                //Otherwise create a new account
                return stripe.accounts.create(
                    {
                        type: 'express',
                    }
                ).then((account: any) => {
                    //Then add the account to firestore to commence the linkage
                    return getFirestore()
                        .collection("users")
                        .doc(request.auth?.uid)
                        .update({stripe_account_id: account.id})
                        .catch((error: any) => {
                            error(" Error posting stripe account id to firestore: ", error.message, " stack: ", error.stack, "request: ", request.instanceIdToken);
                            throw new HttpsError("internal", "There was an internal server error");
                        })
                        //Then create the account link
                        .then(() => {
                            //Finally get the account link and return it to the client.
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

                }).catch((requestError: any) => {
                    error("request: ", request.instanceIdToken, " internal error: ", requestError.message, " stack: ", requestError.stack);
                    throw new HttpsError("internal", "There was an internal server error");
                })
            }
        } else {
            error("request: ", request.instanceIdToken, " user does not exist");
            throw new HttpsError("not-found", "The user does not exist");
        }
    })
})

exports.getStripeAccount = onCall({secrets: ["STRIPE_SECRET"]},  (request: CallableRequest ) => {
    if (!request.auth) {
        // Throwing an HttpsError so that the client gets the error details.
        error("request: ", request.instanceIdToken, " failed precondition authentication check");
        throw new HttpsError("failed-precondition", "The function must be called " + "while authenticated.");
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET);

    return getFirestore().collection("users").doc(request.auth?.uid).get().then((doc: any) => {
        if (doc.exists) {
            if (doc.data().stripe_account_id) {
                return stripe.accounts.retrieve(
                    doc.data().stripe_account_id
                ).then((account: any) => {
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