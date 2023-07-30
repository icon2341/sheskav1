import { Button } from "src/components/ui/button";
import {string} from "yup";
import React, {useEffect, useState} from "react";
import {getStripeAccount, getStripeOnboardingLink} from "../../../../../../api/User/Billing/StripeIntegration";
import {trackPromise, usePromiseTracker} from "react-promise-tracker";
import {LoadingIndicator} from "../../../../../LoadingUtils/LoadingIndicator";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../../../../../index";
import {red} from "@mui/material/colors";
import {getUserDocument, setUserData} from "../../../../../../api/User/UserInformation";
import * as stripe from "stripe";
import {Link} from "react-router-dom";
const area = "stripeOnboardingButton";

/**
 * Stripe onboarding button that will redirect the user to Stripe to connect their account. This button will only appear if the user does not already have
 * an account or if their account has not been onboarded yet. To enter this the user must have NOT passed stripe onboarding OR not have a stripe account associated with their account.
 * TODO - add a check to see if the user has already onboarded their account
 * TODO - add a check to see if the account has been onboarded already
 */
export function StripeOnboardingButton() {
    const [user, loading, error] = useAuthState(auth)
    const { promiseInProgress } = usePromiseTracker({area, delay: 0});
    const [stripeOnboardingLink, setStripeOnboardingLink] = useState<string | undefined>(undefined);
    const [errorText, setErrorText] = useState<string | undefined>(undefined);

    const errorStyle = {
        color: red[500],
        paddingTop: '40px'
    }

    useEffect(() => {
        trackPromise(
            getStripeOnboardingLink().then((link) => {
                if(link) {
                    setStripeOnboardingLink(link);
                } else {
                    throw new Error("There was an error connecting with Stripe. Please try again later.");
                }
            }).catch(
                (error) => {
                    console.error(error);
                    setErrorText(error);
                }
            )
        )
    }, [user]);

    if(!promiseInProgress && !errorText && stripeOnboardingLink) {
        return (
            <Button
                asChild
            >
                <Link to={stripeOnboardingLink ?? ''}>
                    Connect with Stripe
                </Link>

            </Button>
        )
    } else if (errorText) {
        return (
            <div style={errorStyle}>
                <p>There was an error connecting with Stripe. Please try again later.</p>
            </div>
        )
    } else {
        return <LoadingIndicator/>
    }

}