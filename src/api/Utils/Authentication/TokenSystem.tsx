import {httpsCallable} from "firebase/functions";
import {functions} from "src/index";

export async function validateToken(idToken:string) {
    const validateToken = httpsCallable(functions, 'TokenSystem-validateToken');

    validateToken({idToken: idToken}).then(
            () => {
                return Promise.resolve("SUCCESS")
            }
        )
        .catch(() => {
            Promise.reject("FAILURE")
        })
}