import {HttpsError, onCall} from "firebase-functions/v2/https";
import {CallableRequest} from "firebase-functions/lib/v2/providers/https";
import {error, info} from "firebase-functions/logger";

/**
 * validateToken: Validates the token
 * @requires request.data.idToken
 * @returns {Promise<{result: string}>}
 */
exports.validateToken = onCall( {}, async (request: CallableRequest) => {
    info("Executing validateToken with request: ", request.instanceIdToken)
    const jwt = require('jsonwebtoken');
    const admin = require('firebase-admin');
    const appDefaultCred = admin.credential.applicationDefault();
    const privateKey = appDefaultCred.privateKey;

    if (!request.data.idToken) {
        error("request: ", request.instanceIdToken, "validateToken failed token check");
        throw new HttpsError("invalid-argument", "the function must be called with a JWT.")
    }

    //TODO for some reason the code is invalid even though it is not supposed to be.

    info("THE TOKEN ", request.data.idToken)
    try {
        return jwt.verify(
            request.data.idToken,
            privateKey,
            function (err : any, decoded : any) {
                if(err) {
                    console.error(`Error validating token: ${err} on validateToken function for request ${request.instanceIdToken}`);
                    throw new HttpsError("internal", "There was an internal server error");
                } else if (decoded) {
                    info('SUGMA REQ')
                    info("request: ", request.instanceIdToken, " returning decoded: ", decoded) ;
                    return Promise.resolve({result: decoded});
                } else {
                    console.error(`Error validating token: on validateToken function for request ${request.instanceIdToken}, NO ERROR THROWN`);
                    throw new HttpsError("internal", "There was an internal server error");
                }
            }
        )


    } catch (error) {
        console.error(`Error validating token: ${error} on validateToken function for request ${request.instanceIdToken}`);
        await Promise.reject("error validating token");
    }


});

/**
 * createCustomToken will create a custom token for the user with the uid passed in. JWT is signed with the private key from the service worker in the dev environment.
 * @param uid the uid of the user to create the token for
 */
export async function  createCustomToken (uid: string) {

    const admin = require('firebase-admin');


    try {
        const appDefaultCred = admin.credential.applicationDefault();
        const privateKey = appDefaultCred.privateKey;
        console.log(appDefaultCred, privateKey, 'THIS IS ADMIN CRED')
        console.log('THIS IS PRIVATE KEY', privateKey)
        const jwt = require('jsonwebtoken');
        return jwt.sign({uid: uid}, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1h',
            issuer: appDefaultCred.clientEmail as string,
            audience: '', subject: appDefaultCred.clientEmail as string
        });
    } catch (errorResult) {
        error(errorResult);
        throw new Error("could not create token");
    }

}