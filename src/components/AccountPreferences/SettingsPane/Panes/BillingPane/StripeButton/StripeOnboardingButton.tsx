import Button from "react-bootstrap/Button";
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
const area = "stripeOnboardingButton";

/**
 * Stripe onboarding button that will redirect the user to Stripe to connect their account. This button will only appear if the user does not already have
 * an account and if that account has not been onboarded yet.
 * TODO - add a check to see if the user has already onboarded their account
 * TODO - add a check to see if the account has been onboarded already
 */
export function StripeOnboardingButton() {
    //TODO THIS SHIT NOT WORKING, RE DO LOGIC FLOW YOU MORON.
    //YoU SUCk IF YOU DID NOT GO TO RIT YOU WOULD NOT BE THIS
    //MUCH OF A SHITTER Seems


    const [user, loading, error] = useAuthState(auth)
    const { promiseInProgress } = usePromiseTracker({area, delay: 0});
    const [accountLink, setAccountLink] = useState<any>(string);
    const [errorWhileInitializing, setErrorWhileInitializing] = useState<any>(undefined);
    const [userData, setUserData] = useState<any>(undefined);
    const [stripeAccount, setStripeAccount] = useState<any>(undefined);

    useEffect(() => {
        trackPromise(
            //get the user data
            getUserDocument(db, auth).then(
                (result) => {
                    setUserData(result)
                }
            ).then(() => {
                //check if the user has a stripe account pre-linked
                if(userData && userData.stripe_account_id) {
                    //if they do then get it
                    getStripeAccount().then((result) => {
                        setStripeAccount(result)
                        console.log('RESULT GATHERED ACCOUNT', result)
                        // if the user details have been submitted (passed onboarding) then do nothing
                        if(!result.details_submitted) {
                            // if they haven't then run getStripeOnboardingLink
                            getStripeOnboardingLink().then((result) => {console.log('RESULT GATHERED LINK', result); setAccountLink(result)}).catch(
                                (error) => {
                                    console.log('ERROR GATHERING LINK', error, accountLink )
                                    setErrorWhileInitializing(error)
                                }
                            )
                        }
                    })
                    // if they don't then run getStripeOnboardingLink to create AND link the account
                } else {
                    getStripeOnboardingLink().then((result) => {console.log('RESULT GATHERED LINK', result); setAccountLink(result)}).catch(
                        (error) => {
                            console.log('ERROR GATHERING LINK', error, accountLink )
                            setErrorWhileInitializing(error)
                        }
                    )
                }
            }).catch(
                (error) => {
                    console.log('ERROR GATHERING USER DATA', error)
                    setErrorWhileInitializing(error)
                }
            )
        )


    }, [user]);

    const errorStyle = {
        color: red[500],
        paddingTop: '40px'
    }

    if(user && !promiseInProgress && !errorWhileInitializing) {
        if(stripeAccount.details_submitted) {
            return (
                <div>
                    <p>Your account has been submitted for review. You will receive an email from Stripe when your account has been approved.</p>
                </div>
            )
        } else {
            return (
                <Button href={accountLink}>
                    Connect with Stripe
                </Button>
            )
        }
    } else if(errorWhileInitializing) {
        return (
            <div>
                <p style={errorStyle}>There was an error while trying to connect with Stripe. Please try again later. Our team has been alerted.</p>
                <p style={errorStyle}>{`ERROR: ${errorWhileInitializing}`}</p>
            </div>
        )
    }



    return (<LoadingIndicator/>)
}