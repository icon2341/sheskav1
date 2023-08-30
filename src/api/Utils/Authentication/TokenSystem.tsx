import {httpsCallable} from "firebase/functions";
import {functions} from "src/index";

/**
 * Validates the token
 * @param idToken the token to validate
 * @returns Promise<{}> the response from the server, as well as the decoded token
 */
export async function validateToken(idToken:string) {
    const validateToken = httpsCallable(functions, 'TokenSystem-validateToken');
    return validateToken({idToken: idToken}).then(
            (response) => {
                console.log('RESPONSE FROM SERVER: ', response.data)
                return Promise.resolve(response.data as {})
            }
        )
        .catch((error) => {
            console.error('ERROR FROM SERVER: ', error.message)
            return Promise.reject(error.message);
        })
}