import Button from "react-bootstrap/Button";
import {string} from "yup";
import React, {useEffect, useState} from "react";
import {getStripeOnboardingLinkAndAccountID} from "../../../../../../api/User/Billing/StripeIntegration";
import {trackPromise, usePromiseTracker} from "react-promise-tracker";
import {LoadingIndicator} from "../../../../../LoadingUtils/LoadingIndicator";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../../../../../index";


const area = "stripeOnboardingButton";
export function StripeOnboardingButton() {

    const [user, loading, error] = useAuthState(auth)
    const { promiseInProgress } = usePromiseTracker({area, delay: 0});
    const [accountLink, setAccountLink] = useState<any>(string);

    useEffect(() => {
        trackPromise(
            getStripeOnboardingLinkAndAccountID().then((result) => {console.log('RESULT GATHERED LINK', result); setAccountLink(result)}), area
        )
    }, [user]);



    if(user && !promiseInProgress && accountLink) {
        return (
            <Button href={accountLink}>
                Connect with Stripe
            </Button>
        )
    }

    return (<LoadingIndicator/>)
}