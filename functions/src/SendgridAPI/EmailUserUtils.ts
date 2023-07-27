//@ts-ignore
import {log, info, debug, warn, error, write} from "firebase-functions/logger";
import {CallableRequest, HttpsError, onCall} from "firebase-functions/v2/https";
import {getAuth} from "firebase-admin/auth";

exports.sendEmailVerification = onCall({secrets: ["SENDGRID_API_KEY"]},  (request: CallableRequest ) => {
    info("Executing sendEmailVerification with request: ", request.instanceIdToken);
    if (!request.auth) {
        // Throwing an HttpsError so that the client gets the error details.
        error("request: ", request.instanceIdToken, " failed precondition authentication check");
        throw new HttpsError("failed-precondition", "The function must be called " + "while authenticated.");
    }

    if (!request.auth.token.email) {
        // Throwing an HttpsError so that the client gets the error details.
        error("request: ", request.instanceIdToken, " failed precondition email check");
        throw new HttpsError("failed-precondition", "The function must be called " + "while authenticated.");
    }

    const email = request.auth.token.email;

    const actionCodeSettings : any = {
        url: process.env.EMAIL_VERIFICATION_URL,
        handleCodeInApp: true,
    }

    getAuth().generateEmailVerificationLink(email, actionCodeSettings)
        .then((link : string) => {
            info("request: ", request.instanceIdToken, " sending email verification to: ", email, " with verification link: ", link)

            const sgMail = require('@sendgrid/mail')
            sgMail.setApiKey(process.env.SENDGRID_API_KEY)

            const msg = {
                to: email, // Change to your recipient
                from: 'sheskasupport@sheska.co',
                templateId: 'd-147c60f57dec45aba33a8a4706a946d7',
                dynamic_template_data: {
                    verification_link: link,
                    sender_address: '16 Cobble Creek Rd, Victor, NY 14564',
                }
            };
            sgMail
                .send(msg)
                .then(() => {
                    info('Email sent to ', email)
                })
                .catch((resultError: any) => {
                    error('Error sending email to ', email, ' error: ', resultError)
                });
        }).catch((errorResult: any) => {
            error('Error generating email verification link for ', email, ' error: ', errorResult)
        });
    });

