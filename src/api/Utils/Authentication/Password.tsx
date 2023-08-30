import {httpsCallable} from "firebase/functions";
import {functions} from "../../../index";

/**
 * This function will send a password reset email to the user, will also return an error that the client will catch
 * @param idToken - the password reset token from the server that began the transaction (it is assumed this is valid although it is reverified on the server)
 * @param newPassword - the new password to set
 */
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