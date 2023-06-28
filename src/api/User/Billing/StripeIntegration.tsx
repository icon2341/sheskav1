import {getFunctions, httpsCallable} from "firebase/functions";
import {functions} from "../../../index";

/**
 * Get the Stripe onboarding link and account ID and return a promise the accountOnboardingLink. This function will also
 * create a Stripe account if one does not exist and link it to the user.
 */
export async function getStripeOnboardingLink() {
    let result : any;
    // const accountLink = await fetch(process.env.REACT_APP_STRIPE_ONBOARDING_GET_STRIPE_ACCOUNT_LINK as string)
    const getStripeAccountLink = httpsCallable(functions, 'StripeOnboarding-getStripeAccountLink');

    await getStripeAccountLink().then((response) => {
        if(response.data === null) {
            console.error('NO RESPONSE FROM SERVER', response);
            return Promise.reject('No response from server');
        }

        result = response.data;
    }).catch((error) => {
        console.error('ERROR GETTING STRIPE ACCOUNT LINK', error)
        return Promise.reject('Error getting Stripe account link')
    });
    return result.result;
}


/**
 * Get the Stripe account object from stripe servers for the current user and return a promise with the account ID.
 */
export async function getStripeAccount() {
    let result : any;
    const getStripeAccount = httpsCallable(functions, 'StripeOnboarding-getStripeAccount');

    await getStripeAccount().then((response) => {
        if(response.data === null) {
            console.error('NO RESPONSE FROM SERVER', response);
            return Promise.reject('No response from server');
        }

        result = response.data;
    }).catch((error) => {
        console.error('ERROR GETTING STRIPE ACCOUNT', error)
        return Promise.reject('Error getting Stripe account')
    });

    return result.result;
}