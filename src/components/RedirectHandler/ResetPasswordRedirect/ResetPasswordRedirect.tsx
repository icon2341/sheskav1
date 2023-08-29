import {useAuthState} from "react-firebase-hooks/auth";
import React, {ChangeEvent, useEffect, useState} from "react";
import {redirect, useNavigate, useSearchParams} from "react-router-dom";
import {auth} from "../../../index";
import LoadingScreen from "src/components/Utils/LoadingUtils/LoadingScreen";
import {setUserData} from "../../../api/User/UserInformation";
import {validateToken} from "src/api/Utils/Authentication/TokenSystem";
import { signInWithCustomToken } from "firebase/auth";
import {trackPromise, usePromiseTracker} from "react-promise-tracker";
import {ErrorScreen} from "src/components/Utils/ErrorUtils/ErrorScreen";
import ResetPasswordForm from "src/components/Authentication/components/ResetPasswordForm/ResetPasswordForm";



//TODO on tshis page you should validate the JWT token that would be in the query param under the name ?token=token
// Use this to validate the token: https://firebase.google.com/docs/auth/admin/verify-id-tokens
// Once the toekn is verified you can then prompt the user to reset their password and then redirect them to the login page to login with the new password. DO NOT SIGN THEM IN AUTOMATICALLY

// TODO i would send an email with the token and clearly state it is single use and expires after 15 minutes,
//  the link should take them to the reset password page with the token in the query params, immediately check the
//  database to make sure it is a valid, non-expired, non-used token - if it is not valid, give them some error but
//  dont let them see the reset password screen
// i think it makes most sense to not even show them the page if they did not provide a valid token so we should instantly validate it on load

//TODO make tokens single use
//TODO make tokens expire after 15 minutes
//document code and clean up


const area = 'ResetPasswordRedirect'
export function ResetPasswordRedirect() {
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();
    const [stateError, setStateError] = useState("")
    // const [token, setToken] = useState<string | null>(null)
    const token = searchParams.get('token')
    const { promiseInProgress } = usePromiseTracker({area, delay: 0});
    const [isTokenValid, setIsTokenValid] = useState(false)


    useEffect(() => {
        if(token === null) {
            console.log('NO TOKEN')
            setStateError('No token provided, please check your email for a password reset link or request one from the login page.')
        }else {
            console.log('ATTEMPTING TO VALIDATE TOKEN: ', token)
            trackPromise(validateToken(token).then((response : any) => {
                if(response.result) {
                    if(response.result.uid) {
                        // token has been validated, so we can now send a password with a new token and the server will be able to change the password
                        console.log('TOKEN VALIDATED, ALLOW USER TO SUBMIT PASSWORD')
                        setIsTokenValid(true)
                    }
                }
            }).catch((error) => {
                console.log('ERROR MESSAGE: ', error)
                setStateError(error)
            }))
        }
    }, [])

    //TODO After researching https://crackstation.net/hashing-security.htm#faq
    //    tokens are strongly tied to users and are sent to a users email, when the user clicks on the email they will be redirected to this page with the token in the query param
    //    this page will allow the user to enter in the new password and will then send the token with the password to the server to change the password, the server will decode the token and apply the new password to the users account.


    // if there is a token, no errors
    if(promiseInProgress) {
        return <LoadingScreen/>
    } else if (stateError) {
        return <ErrorScreen errorMessage={stateError}/>
    } else if (token) {
        return <div className={"flex justify-center items-center h-screen"}>
            <ResetPasswordForm token={token}/>
        </div>
    } else return <div></div>
}
export default ResetPasswordRedirect;