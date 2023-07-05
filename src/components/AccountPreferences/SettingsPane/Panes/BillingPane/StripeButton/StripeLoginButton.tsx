import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../../../../../index";
import {useEffect, useState} from "react";
import {LoadingIndicator} from "../../../../../LoadingUtils/LoadingSecondaryIndicator";
import {trackPromise, usePromiseTracker} from "react-promise-tracker";
import {getStripeLoginLink} from "../../../../../../api/User/Billing/StripeIntegration";
import React from "react";
import Button from "react-bootstrap/Button";

const area = 'stripeLoginButton';

/**
 * This button will redirect the user to the stripe login page and will use FETCH to request the link from the server
 */
export function StripeLoginButton() {
    const [user, loading, error] = useAuthState(auth);
    const [errorText, setErrorText] = useState<string | undefined>(undefined);
    const { promiseInProgress } = usePromiseTracker({area, delay: 0});
    const [stripeLoginLink, setStripeLoginLink] = useState<string | undefined>(undefined);

    useEffect(() => {
        if(user) {
            trackPromise(
                getStripeLoginLink().then(
                    (result : any) => {
                        if(result) {
                            setStripeLoginLink(result.result.url)
                            console.log(result.result.url);
                        } else {
                            throw new Error("No login was returned from the server. Please try again later");
                        }
                    }).catch(
                        (error) => {
                            setErrorText(error);
                            console.error(error)
                        }
                )
            )
        }
    }, [user]);



    if(user && !loading && !error && !errorText && !promiseInProgress) {
        return (
            <Button
                color="primary"
                href={stripeLoginLink}
            >
                Login to manage your account
            </Button>
        )
    } else {
        return <LoadingIndicator/>
    }


}

export default StripeLoginButton;