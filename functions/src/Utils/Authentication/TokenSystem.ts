import {HttpsError, onCall} from "firebase-functions/v2/https";
import {CallableRequest} from "firebase-functions/lib/v2/providers/https";
import {getAuth} from "firebase-admin/auth";
import {error, info} from "firebase-functions/logger";

/**
 * validateToken will take a token passed in the request called idToken and determine if it is valid or not
 * based on the auth server.
 * @requires idToken to be sent with the request denoting the JWT token.
 * @returns Promise that rejects if the token was invalid and resolves if it was valid
 */
exports.validateToken = onCall( {}, async (request: CallableRequest) => {
    info("Executing validateToken with request: ", request.instanceIdToken)

    if (!request.data.idToken) {
        error("request: ", request.instanceIdToken, "validateToken failed token check");
        throw new HttpsError("invalid-argument", "the function must be called with a JWT.")
    }

    //TODO for some reason the code is invalid even though it is not supposed to be.

    info("THE TOKEN ", request.data.idToken)
    try {
        await getAuth().verifyIdToken(request.data.idToken as string);
    } catch (error) {
        console.error(`reqest: nvalidToken on password reset ${request.data.idToken}`);
        console.error(error)

        await Promise.reject("invalid token");
    }
    return "valid token";

});

export function  createCustomToken (uid: string) {

    const admin = require('firebase-admin');


    try {
        const adminCred = admin.credential;
        console.log(adminCred, 'THIS IS ADMIN CRED')
        console.log('THIS IS PRIVATE KEY', adminCred.private_key)
        const jwt = require('jsonwebtoken');
        return jwt.sign({uid: uid}, adminCred.private_key, {
            algorithm: 'RS256',
            expiresIn: '1h',
            issuer: adminCred.client_email,
            audience: '', subject: adminCred.client_email
        });
    } catch (errorResult) {
        error(errorResult);
        throw new Error("could not create token");
    }

}