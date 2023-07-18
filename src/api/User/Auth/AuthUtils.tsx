import {NavigateFunction} from "react-router-dom";
import {
    browserLocalPersistence,
    browserSessionPersistence,
    createUserWithEmailAndPassword, signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
import {auth, db, functions} from "../../../index";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {httpsCallable} from "firebase/functions";

export async function signOutUser(navigate : NavigateFunction) {
    await signOut(auth)
        .then(value => {return "User Signed Out"})
        .catch(reason => {return "User Not Signed Out"});
    navigate("/");
}

export async function checkIfUserHasPassedOnboarding(navigate : NavigateFunction) {
    const userRef = doc(db, 'users', auth?.currentUser?.uid ?? "")
    //determines where to redirect user
    await getDoc(userRef).then(doc => {
        if (doc.exists()) {
            console.log("doc exists, check onboarding", doc.data())
            // make sure user has passed onboarding, redirects them accordingly
            if(doc.data()?.passedOnboarding === false ||
                doc.data()?.passedOnboarding === undefined) {
                console.log("user has not passed onboarding")
                return;
            } else {
                navigate('/home')
            }
        } else {
            throw new Error("User does not exist")

        }
    })
}

/**
 * Creates a new user account with the given email and password. Also adds them to Firestore
 * //TODO MAKE THE user sign in redirection way better
 * @param txtEmail users email
 * @param txtPassword user's password
 * @param navigate navigate function
 * @param rememberMe if user has selected remember me
 */
export async function createAccount(txtEmail : string, txtPassword : string, navigate : NavigateFunction, rememberMe : boolean) {
    // checks if user has selected remember me, sets auth state persistence naturally.
    if(rememberMe) {
        await auth.setPersistence(browserLocalPersistence)
    } else {
        await auth.setPersistence(browserSessionPersistence)
    }

    console.log(`Signup Attempted on ${txtEmail}`)

    const email : string = txtEmail
    const password : string = txtPassword
    try {
        await createUserWithEmailAndPassword(auth, email, password).then((cred) => {
            console.log(cred)
            sessionStorage.setItem('Auth Token', cred.user.refreshToken)

            // sendEmailVerification(cred.user)
            const sendEmailVerification = httpsCallable(functions, 'EmailUserUtils-sendEmailVerification');
            sendEmailVerification()


            const userRef = doc(db, 'users', auth?.currentUser?.uid ?? "")
            console.log("adding to doc...")
            return (
                setDoc(userRef, {email: email, passedOnboarding: false}, {merge: true})
            ).then(() => {
                console.log("signing up completed for: ", auth?.currentUser?.uid ?? "ERROR NULL USER")
                navigate('/onboarding')
                return;
            }).catch((error: any) => {
                console.log(error)
                return new Promise((resolve, reject) => {
                    reject("Error adding user to database")

                });
            })
        })
    }
    catch(error : any) {
        console.log(error)
        //handle various errors
        console.log(`There was an error: ${error}`)

        switch (error.code) {
            case 'auth/email-already-in-use':
                console.log('email already in use')
                return new Promise((resolve, reject) => {
                    reject("Email in Use")
                });
            case 'auth/network-request-failed':
                console.log('network request failed')
                return new Promise((resolve, reject) => {
                    reject("Server Refused Connection")
                });

        }
    }

    return new Promise((resolve, reject) => {
        resolve("Success");
    });

}


//TODO ADD OVERLOAD FUNCTIONS FOR DIFFERENT SORTS OF AUTHENTICATION
/**
 * This function will attempt to login a user with the given email and password and will redirect them, it will also
 * return promises that denote the errors observed.
 * @param txtEmail email of user as string
 * @param txtPassword passowrd of user as string
 * @param navigate navigate object to redirect user
 * @param rememberMe remember me checkbox to change browser session details
 */
export async function loginUser(txtEmail : string, txtPassword : string, navigate : NavigateFunction, rememberMe : boolean){
    // checks if user has selected remember me, sets auth state persistence naturally.
    if(rememberMe) {
        await auth.setPersistence(browserLocalPersistence)
    } else {
        await auth.setPersistence(browserSessionPersistence)
    }

    console.log('Login Attempted on ' + txtEmail);
    const email : string = txtEmail;
    const password : string = txtPassword;

    try {
        // tries to sign in user with email and password auth
        await signInWithEmailAndPassword(auth, email, password).then((cred)=> {
            console.log('checking if email is verified')
            if(!cred.user.emailVerified) {
                console.log('email not verified, sending verification email')
                const sendEmailVerification = httpsCallable(functions, 'EmailUserUtils-sendEmailVerification');
                sendEmailVerification()
            }
        })
        // console.log("signed in my friend")
        const userRef = doc(db, 'users', auth?.currentUser?.uid ?? "")
        //determines where to redirect user
        await getDoc(userRef).then(doc => {
            if (doc.exists()) {
                console.log("doc exists, check onboarding", doc.data())
                // make sure user has passed onboarding, redirects them accordingly
                if(doc.data()?.passedOnboarding === false ||
                    doc.data()?.passedOnboarding === undefined) {
                    console.log("user has not passed onboarding")
                    navigate('/onboarding')
                    return;
                } else {
                    navigate('/home')
                }
            } else {
                throw new Error("User does not exist")

            }
        })
    } catch (e: any) {
        //handle various errors
        console.log(`There was an error: ${e}`)
        switch (e.code) {
            case 'auth/wrong-password':
                console.log('wrong password')
                return new Promise((resolve, reject) => {
                    reject("Incorrect Password")
                });
            case 'auth/user-not-found':
                console.log('user not found')
                return new Promise((resolve, reject) => {
                    reject("User Not Found")
                });
            case 'auth/too-many-requests':
                console.log('too many requests, account is temporarily locked out')
                return new Promise((resolve, reject) => {
                    reject("Too Many Requests")
                });

        }
    }

    //Returns a promise that denotes that the user has signed in
    return new Promise((resolve, reject) => {
        resolve("User Signed In");
    });

}