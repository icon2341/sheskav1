import {logger} from "firebase-functions";
import {HttpsError, onCall} from "firebase-functions/v2/https";
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
initializeApp();



exports.getStripeAccountLink = onCall({secrets: ["STRIPE_SECRET"]},  async (request: any) => {

    if (!request.auth) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new HttpsError("failed-precondition", "The function must be " +
            "called while authenticated.");
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET);
    const account = stripe.accounts.create({
        type: 'express'
    })
    logger.error("STRIPE ACCOUNT: ", account.id)

    //I am not able to upload the stripe account to the firestore directly either inorder to get the account id later.
    await getFirestore()
        .collection("users")
        .doc(request.auth.uid)
        .set({stripe_account_id: account.id}, {merge: true});

    try {
        stripe.accountLinks.create({
            account: account.id,
            refresh_url: process.env.STRIPE_REFERSH_URL,
            return_url: process.env.STRIPE_RETURN_URL,
            type: 'account_onboarding',
        }).then((accountLink: any) => {
            return {result: accountLink.url};
        });

    } catch (error: any) {
        logger.error(error);
        throw new HttpsError("internal", error.message)
    }



})