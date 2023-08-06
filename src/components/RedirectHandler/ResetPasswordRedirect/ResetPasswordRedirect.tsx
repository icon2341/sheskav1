import {useAuthState} from "react-firebase-hooks/auth";
import React, {ChangeEvent, useEffect, useState} from "react";
import {redirect, useNavigate, useSearchParams} from "react-router-dom";
import {auth} from "../../../index";
import LoadingScreen from "../../LoadingUtils/LoadingScreen";
import {setUserData} from "../../../api/User/UserInformation";



//TODO on this page you should validate the JWT token that would be in the query param under the name ?token=token
// Use this to validate the token: https://firebase.google.com/docs/auth/admin/verify-id-tokens
// Once the toekn is verified you can then prompt the user to reset their password and then redirect them to the login page to login with the new password. DO NOT SIGN THEM IN AUTOMATICALLY

export function ResetPasswordRedirect() {
    const [user, loading, error] = useAuthState(auth);
    console.log(user, loading, error);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();



    // if there is no user, and it is not loading anything then redirect to the login page
    if (user === null && !loading) {
        navigate("/login");
    } else if(loading) {
        return <LoadingScreen/>
    } else  if(user && !loading && auth.currentUser?.emailVerified){
        navigate("/dashboard");
    }

    return <h1>Something went wrong</h1>




}


export default ResetPasswordRedirect;