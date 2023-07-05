import PaneActionItem from "../PaneActionItem/PaneActionItem";
import UserProfileItem from "../ProfilePane/UserProfileItem/UserProfileItem";
import React, {useEffect} from "react";
import styles from "../ProfilePane/Panes.module.scss";
import UserPartnerItem from "../ProfilePane/UserPartnerItem/UserPartnerItem";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../../../../index";
import {trackPromise, usePromiseTracker} from "react-promise-tracker";
import {getUserDocument} from "../../../../../api/User/UserInformation";
import {LoadingIndicator} from "../../../../LoadingUtils/LoadingIndicator";
import Button from "react-bootstrap/Button";
import {StripeOnboardingButton} from "./StripeButton/StripeOnboardingButton";
import {getStripeAccount} from "../../../../../api/User/Billing/StripeIntegration";
import Stripe from "stripe";
import StripeLoginButton from "./StripeButton/StripeLoginButton";
import {red} from "@mui/material/colors";
const area = 'billingPane';
export function BillingPane() {
    const [user, loading, error] = useAuthState(auth)
    const [data, setData] = React.useState<any>(undefined);
    const [stripeAccount, setStripeAccount] = React.useState<Stripe.Account | undefined>(undefined);
    const { promiseInProgress } = usePromiseTracker({area, delay: 0});
    const [errorState, setErrorState] = React.useState<any>(undefined);

    useEffect(() => {
        trackPromise(
            getUserDocument(db, auth).then((doc) => {
                setData(doc);
                if(doc.stripe_account_id) {
                    getStripeAccount().then(
                        (account : any) => {
                            setStripeAccount(account.result);
                            console.log(account.result);
                        }
                    ).catch(
                        (error) => {
                            console.error(error);
                            setErrorState(error);
                        }
                    )
                }
            }), area).catch(
            (error) => {
                console.error(error);
                setErrorState(error)
            }
        )
    }, [user]);

    const billingContent = () => {
        if(!data?.stripe_account_id) {
            return (
                <div>
                    <h3>Link your account with stripe to receive and manage payments in Sheska</h3>
                    <StripeOnboardingButton/>
                </div>
            )
        } else if(stripeAccount?.details_submitted) {
            return (
                <div>
                    <h3>Manage your Stripe account</h3>
                    <StripeLoginButton/>
                </div>
            )
        } else if(stripeAccount?.details_submitted === false) {
            return (
                <div>
                    <h3>Continue Onboarding</h3>
                    <StripeOnboardingButton/>
                </div>
            )
        } else {
            return <LoadingIndicator/>
        }
    }

    const errorStyle = {
        color: red[500],
        paddingTop: '40px'
    }

    return (
        <div className={styles.actionItemsContainer}>
            {
                errorState ?
                    <h3 style={errorStyle}>{errorState}</h3>
                    :
                    <div className={styles.actionItemContent}>
                        {promiseInProgress ? <LoadingIndicator/> : billingContent()}
                    </div>
            }

        </div>
    )
}