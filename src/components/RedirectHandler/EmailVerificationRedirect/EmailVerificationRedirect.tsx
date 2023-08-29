import {useAuthState} from "react-firebase-hooks/auth";
import React, {ChangeEvent, useEffect, useState} from "react";
import {redirect, useNavigate, useSearchParams} from "react-router-dom";
import {auth} from "../../../index";
import LoadingScreen from "src/components/Utils/LoadingUtils/LoadingScreen";
import {setUserData} from "../../../api/User/UserInformation";

export function EmailVerificationRedirect() {
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


export default EmailVerificationRedirect;