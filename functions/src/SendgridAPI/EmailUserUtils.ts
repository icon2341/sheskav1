//@ts-ignore
import {log, info, debug, warn, error, write} from "firebase-functions/logger";
import {CallableRequest, HttpsError, onCall} from "firebase-functions/v2/https";
import {getAuth} from "firebase-admin/auth";
import {auth} from "firebase-admin";
import UserRecord = auth.UserRecord;

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
                    return Promise.resolve("REQUEST SUCCESSFUL");
                })
                .catch((resultError: any) => {
                    error('Error sending email to ', email, ' error: ', resultError)
                    throw new HttpsError("internal", "Error Generating Email Verification Link");
                });
        }).catch((errorResult: any) => {
            error('Error generating email verification link for ', email, ' error: ', errorResult)
            throw new HttpsError("internal", "Error Generating Email Verification Link");
        });
    });

exports.sendPasswordResetEmail = onCall({secrets: ["SENDGRID_API_KEY"]},    async (request: CallableRequest ) => {
    info("Executing sendPasswordResetEmail with request: ", request.instanceIdToken);
    if (!request.data.email) {
        // Throwing an HttpsError so that the client gets the error details.
        error("request: ", request.instanceIdToken, "sendPasswordResetEmail failed precondition email check");
        throw new HttpsError("invalid-argument", "The function must be called with an email.");
    }

    const user : UserRecord = await getAuth().getUserByEmail(request.data.email)
    if (!user) {
        error("request: ", request.instanceIdToken, "sendPasswordResetEmail failed precondition user check");
        throw new HttpsError("failed-precondition", "The function must be called with a valid email.");
    } else {
        //GENERATE USER TOKEN
        getAuth().createCustomToken(user.uid).then(
            (customToken: string) => {
                //SEND EMAIL
                info("request: ", request.instanceIdToken, " sending password reset email to: ", user.email)

                const sgMail = require('@sendgrid/mail')
                sgMail.setApiKey(process.env.SENDGRID_API_KEY)

                const msg = {
                    to: request.data.email, // Change to your recipient
                    from: 'sheskasupport@sheska.co',
                    templateId: 'd-17c26613fda442d799e7405c71bb41ae',
                    dynamic_template_data: {
                        password_link: process.env.EMAIL_RESET_PASSWORD_URL + "?token=" + customToken,
                        sender_address: '16 Cobble Creek Rd, Victor, NY 14564',
                    }
                };

                sgMail
                    .send(msg)
                    .then(() => {
                        info('Password Reset Email sent to ', user.uid)
                        return Promise.resolve("REQUEST RESOLVED")
                    })
                    .catch((resultError: any) => {
                        error('Error sending email to ', user.uid, ' error: ', resultError)
                        throw new HttpsError("internal", "Internal");
                    });



            }
        ).catch(
            (errorResult: any) => {
                console.error("Error generating custom token for user: ", user.uid, " error: ", errorResult);
                throw new HttpsError("internal", "Internal");
            }
        )


    }






})

