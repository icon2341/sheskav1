import {HttpsError, onCall} from "firebase-functions/v2/https";
import {CallableRequest} from "firebase-functions/lib/v2/providers/https";
import {error, info} from "firebase-functions/logger";

/**
 * validateToken: Validates the token from the client
 * @requires request.data.idToken
 * @returns {Promise<{result: string}>}
 */
exports.validateToken = onCall( {}, async (request: CallableRequest) => {
    info("Executing validateToken with request: ", request.instanceIdToken)


    if (!request.data.idToken) {
        error("request: ", request.instanceIdToken, "validateToken failed token check");
        throw new HttpsError("invalid-argument", "the function must be called with a JWT.")
    }

    try {
        return {result: await validateTokenUtil(request.data.idToken)}
    } catch (error) {
        console.error(`Error validating token: ${error} on validateToken function for request ${request.instanceIdToken}`);
        return Promise.reject(error);
    }


});

/**
 * validateTokenUtil: Validates the token and returns the decoded value based on the global private key
 * @param idToken the idToken to validate and decode
 */
export async function validateTokenUtil (idToken: string) {
    const jwt = require('jsonwebtoken');
    const admin = require('firebase-admin');
    const appDefaultCred = admin.credential.applicationDefault();
    const privateKey = appDefaultCred.privateKey;

    return jwt.verify(
        idToken,
        privateKey,
        function (err : any, decoded : any) {
            if(err) {
                switch (err.name){
                    case 'TokenExpiredError':
                        error(`Error validating token: ${err} on validateToken function`);
                        throw new HttpsError("invalid-argument", "The token has expired");
                    case 'JsonWebTokenError':
                        error(`Error validating token: ${err} on validateToken function for request`);
                        throw new HttpsError("invalid-argument", "The token is invalid");
                    case 'NotBeforeError':
                        error(`Error validating token: ${err} on validateToken function`);
                        throw new HttpsError("invalid-argument", "The token is not active");
                    default:
                        error(`Error validating token: ${err} on validateToken function`);
                        throw new HttpsError('internal', "internal server error" );
                }
            } else if (decoded) {
                return Promise.resolve(decoded);
            } else {
                console.error(`Error validating token: on validateToken function for request`);
                throw new HttpsError("internal", "There was an internal server error");
            }
        }
    )
}

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