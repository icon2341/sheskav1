import {httpsCallable} from "firebase/functions";
import {functions} from "src/index";

/**
 * Validates the token
 * @param idToken the token to validate
 * @returns Promise<{}> the response from the server, as well as the decoded token
 */
export async function validateToken(idToken:string) {
    const validateToken = httpsCallable(functions, 'TokenSystem-validateToken');
    console.log('SENDING TOKEN VALIDATION REQUEST TO SERVER: ', idToken)
    return validateToken({idToken: idToken}).then(
            (response) => {
                console.log('RESPONSE FROM SERVER: ', response.data)
                return Promise.resolve(response.data as {})
            }
        )
        .catch((error) => {
            if(error.message === "internal") {
                return Promise.reject("Internal Error")
            } else {
                return Promise.reject("Invalid Token")
            }
        })
}