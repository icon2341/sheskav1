import {NavigateFunction} from "react-router-dom";
import {signOut} from "firebase/auth";
import {auth} from "../../../index";

export async function signOutUser(navigate : NavigateFunction) {
    await signOut(auth).then(value => {return Promise.resolve("User Signed Out")}).catch(reason => {return Promise.reject("User Not Signed Out")});
    navigate("/");
}