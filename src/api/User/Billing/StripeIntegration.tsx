import {getFunctions, httpsCallable} from "firebase/functions";
import {functions} from "../../../index";

/**
 * This file contains all the functions that interact with the Stripe API.
 */


/**
 * Get the Stripe onboarding link and account ID and return a promise the accountOnboardingLink.
 * @returns Promise<{accountOnboardingLink: string, accountId: string}> - the promise of the accountOnboardingLink and accountId
 */
export async function createStripeAccount() {
    const createLinkStripeAccount = httpsCallable(functions, 'StripeOnboarding-createLinkStripeAccount');
    let result : any;

    await createLinkStripeAccount().then((response) => {
        if(response.data === null) {
            console.error('NO RESPONSE FROM SERVER', response);
            return Promise.reject('No response from server');
        }

        result = response.data;

        return response.data;
    }).catch((error) => {
        console.error('ERROR CREATING STRIPE ACCOUNT', error)
        return Promise.reject('Error creating Stripe account, please try again later. Support has been alerted.')

    });

    return result.result;
}

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
    const getStripeAccount = httpsCallable(functions, 'StripeAccountUtils-getStripeAccount');

    return getStripeAccount().then((response) => {
        if(response.data === null) {
            console.error('NO RESPONSE FROM SERVER', response);
            return Promise.reject('No response from server');
        }

        return response.data;
    }).catch((error) => {
        console.error('ERROR GETTING STRIPE ACCOUNT', error)
        return Promise.reject('Error getting Stripe account, Please Try again later.')
    });
}

/**
 * Get the Stripe login link for the current user and return a promise with the login link.
 * @returns Promise<string> - the promise of the login link
 * @throws error if the user is not logged in
 * @throws error if the user does not have a Stripe account
 * @throws error if the user does not have a Stripe account ID
 */
export async  function getStripeLoginLink() {
    const getStripeLoginLink = httpsCallable(functions, 'StripeAccountUtils-getStripeLoginLink');

    return getStripeLoginLink().then((response) => {
        if(response.data === null) {
            console.error('NO RESPONSE FROM SERVER', response);
            return Promise.reject('No response from server');
        }

        return response.data;
    }).catch((error) => {
        console.error('ERROR GETTING STRIPE LOGIN LINK', error)
        return Promise.reject('Error getting Stripe login link')
    });

}
