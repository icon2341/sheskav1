import {useAuthState} from "react-firebase-hooks/auth";
import React, {ChangeEvent, useEffect, useState} from "react";
import {redirect, useNavigate, useSearchParams} from "react-router-dom";
import {auth} from "../../../index";
import LoadingScreen from "../../LoadingUtils/LoadingScreen";
import {setUserData} from "../../../api/User/UserInformation";
import {validateToken} from "src/api/Utils/Authentication/TokenSystem";
import { signInWithCustomToken } from "firebase/auth";



//TODO on this page you should validate the JWT token that would be in the query param under the name ?token=token
// Use this to validate the token: https://firebase.google.com/docs/auth/admin/verify-id-tokens
// Once the toekn is verified you can then prompt the user to reset their password and then redirect them to the login page to login with the new password. DO NOT SIGN THEM IN AUTOMATICALLY

export function ResetPasswordRedirect() {
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();
    const [stateError, setStateError] = useState("")
    // const [token, setToken] = useState<string | null>(null)
    const token = searchParams.get('token')


    useEffect(() => {
        if(token === null) {
            console.log('NO TOKEN')
        }else {
            console.log('ATTEMPTING TO VALIDATE TOKEN: ', token)
            validateToken(token).then((response : any) => {
                if(response.result) {
                    if(response.result.uid) {
                        // token has been validated, so we can now send a password with a new token and the server will be able to change the password
                        console.log('TOKEN VALIDATED, getting sign in token')
                    }

                }
            }).catch((error) => {
                setStateError(error)
            })
        }
    }, [])

    //TODO After researching https://crackstation.net/hashing-security.htm#faq
    //    tokens are strongly tied to users and are sent to a users email, when the user clicks on the email they will be redirected to this page with the token in the query param
    //    this page will allow the user to enter in the new password and will then send the token with the password to the server to change the password, the server will decode the token and apply the new password to the users account.

    if(user) {
        return <div>SUGMA</div>
    } else if (loading) {
        return <LoadingScreen/>
    } else if (stateError || error) {
        return <div>{stateError}</div>
    } else {
        return <LoadingScreen/>
    }
}




export default ResetPasswordRedirect;