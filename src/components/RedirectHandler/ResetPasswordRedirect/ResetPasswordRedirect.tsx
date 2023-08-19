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
            signInWithCustomToken(auth, token).then(
                ()=> {
                    console.log('SIGNED IN')
                }
            )
            .catch(
                (error) => {
                    setStateError(error.message)
                }
            )
        }
    }, [])

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