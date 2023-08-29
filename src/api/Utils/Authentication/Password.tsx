import {httpsCallable} from "firebase/functions";
import {functions} from "../../../index";

export async function resetPassword(idToken : string, newPassword : string) {
    const resetPassword = httpsCallable(functions, 'Password-resetPassword');
    return resetPassword({idToken: idToken, newPassword: newPassword}).then(
        (response) => {
            return Promise.resolve("Password reset successfully")
        }
    ).catch(
        (error) => {
            return Promise.reject(error.message)
        }
    )


}