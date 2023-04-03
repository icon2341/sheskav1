import {NavigateFunction} from "react-router-dom";
import {signOut} from "firebase/auth";
import {auth, db} from "../../../index";
import {doc, getDoc} from "firebase/firestore";

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
                navigate('/dashboard')
            }
        } else {
            throw new Error("User does not exist")

        }
    })
}