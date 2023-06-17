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
const area = 'billingPane';
export function BillingPane() {
    const [user, loading, error] = useAuthState(auth)
    const [data, setData] = React.useState<any>(undefined);
    const { promiseInProgress } = usePromiseTracker({area, delay: 0});
    useEffect(() => {
        trackPromise(
            getUserDocument(db, auth).then((doc) => {
                setData(doc);
            }), area).then(r => console.log("done"));
    }, [user]);

    const billingContent = () => {
        if(!data?.passed_stripe_onboarding) {
            return (
                <div>
                    <h3>Link your account with stripe to receive and manage payments in Sheska</h3>
                    <StripeOnboardingButton/>
                </div>
            )
        }
    }

    return (
        <div className={styles.actionItemsContainer}>
            <div className={styles.actionItemContent}>
                {promiseInProgress ? <LoadingIndicator/> : billingContent()}
            </div>

        </div>
    )
}