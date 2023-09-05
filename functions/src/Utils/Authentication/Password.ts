import {HttpsError, onCall} from "firebase-functions/v2/https";
import {info} from "firebase-functions/logger";
import {validateTokenUtil} from "./TokenSystem";
import {getAuth} from "firebase-admin/auth";
import {CallableRequest} from "firebase-functions/lib/v2/providers/https";
import {getFirestore} from "firebase-admin/firestore";
import {error} from "firebase-functions/logger";
/**
 * resetPassword: Resets the password for the user and retires the token used
 * @requires request.data.newPassword the new password to set
 * @requires request.data.idToken the idToken to validate and decode
 */
exports.resetPassword = onCall( {secrets: ["SERVICE_WORKER_PRIVATE_KEY"]}, async (request: CallableRequest) => {
    info("Executing resetPassword with request: ", request.instanceIdToken)

    const newPassword = request.data.newPassword;
    const idToken = request.data.idToken;

    if(!newPassword) {
        throw new HttpsError("invalid-argument", "The function must be called with a new password");
    }

    if(!idToken) {
        throw new HttpsError("invalid-argument", "The function must be called with a JWT");
    }

    const privateKey = process.env.SERVICE_WORKER_PRIVATE_KEY

    // check to see if this document has already been used
    if(!privateKey) {
        error("request: ", request.instanceIdToken, "sendPasswordResetEmail failed precondition private key check");
        throw new HttpsError("failed-precondition", "The function must be called with a valid private key.");
    }

    // Validate the token, if validateTokenUtilFails then the function will throw an error and the password will not be changed
    let decodedToken;
    try {
        decodedToken = await validateTokenUtil(idToken, privateKey);
        // set the token to used and create the document entry
        await getFirestore().collection('tokens').doc(idToken).set({used: true});
    } catch (error) {
        console.error(`Error validating token: ${error} on resetPassword function for request ${request.instanceIdToken}`);
        return Promise.reject(error);
    }

    const uid = decodedToken.uid;
    try {
        return getAuth().updateUser(uid, {
            password: newPassword,
            emailVerified: true,
        }).then(
            (user ) => {
                info("Successfully updated password for user: ", user.uid , "on process ", request.instanceIdToken);
                return Promise.resolve(200);
            }
        ).catch(
            (error) => {
                console.error(`Error updating password for user: ${uid} on process ${request.instanceIdToken} with error code: ${error}`);
                throw new HttpsError("internal", "Error resetting password");
            }
        )
    } catch (error) {
        console.error(`Error validating token: ${error} on resetPassword function for request ${request.instanceIdToken}`);
        throw new HttpsError("internal", "Error resetting password");
    }

})