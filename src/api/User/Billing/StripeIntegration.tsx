import {getFunctions, httpsCallable} from "firebase/functions";
import {functions} from "../../../index";

export async function getStripeOnboardingLinkAndAccountID() {
    let result = {};
    console.log('GETTING STRIPE ACCOUNT LINK', process.env.REACT_APP_STRIPE_ONBOARDING_GET_STRIPE_ACCOUNT_LINK)
    // const accountLink = await fetch(process.env.REACT_APP_STRIPE_ONBOARDING_GET_STRIPE_ACCOUNT_LINK as string)
    const getStripeAccountLink = httpsCallable(functions, 'StripeOnboarding-getStripeAccountLink');

    await getStripeAccountLink().then((response) => {
        console.log('GOT STRIPE ACCOUNT LINK', response.data)
        result = response.data as string;
    });

    return result;
}