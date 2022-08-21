import "./SignUp.css"
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';
import {ChangeEvent, useState} from 'react'
import {NavigateFunction, useNavigate} from "react-router-dom";
import { doc, setDoc} from "firebase/firestore";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../index";
//TODO add firestore, store password and username functionality as well as next steps to proper profile creation.


export function SignUp() {
    const navigate = useNavigate();
    const [txtEmail, setTxtEmail] = useState('')
    const [txtPassword, setTxtPassword] = useState('')

    const handleEmail = (event: ChangeEvent<HTMLInputElement>) => {
        setTxtEmail(event.currentTarget.value);
    }

    const handlePassword = (event:ChangeEvent<HTMLInputElement>) => {
        setTxtPassword(event.target.value);
    }

    const [user, loading, error] = useAuthState(auth);

    return(
        <div>
            <span id={"page"}>
                <h1 id={"welcome-logo"}>Sheska</h1>
                <h2 id={"sub-text"}>Memories are made together</h2>
                <div id={"input-area"}>
                    <div id={"text-box"}>
                        <input id={"txtEmail"}
                               name={"txtEmail"}
                               placeholder={"Email"}
                               onChange={handleEmail}
                               value={txtEmail}
                               type={"email"}
                        />
                    </div>
                    <div id={"text-box"}>
                        <input id={"txtPassword"}
                               name={"txtPassword"}
                               placeholder={"Password"}
                               onChange={handlePassword}
                               value={txtPassword}
                               type={"password"}
                        />
                    </div>
                </div>
                <div id={"button-box"}>
                    <button id={"button-signup"} onClick={() => createAccount(txtEmail,txtPassword, navigate)} className={"button"}>Sign Up</button>
                </div>

                <h2 id={"guest-info"}>Guest portal on the app</h2>
                <h3 id={"download"}>Download Now!</h3>
            </span>
        </div>
    )
}

export default SignUp


async function createAccount(txtEmail : string, txtPassword : string, navigate : NavigateFunction) {

    console.log(`Signup Attempted on ${txtEmail}`)
    const email : string = txtEmail
    const password : string = txtPassword
    try {
        await createUserWithEmailAndPassword(auth, email, password).then((cred) => {
            console.log(cred)
            sessionStorage.setItem('Auth Token', cred.user.refreshToken)

            const userRef = doc(db, 'users', auth?.currentUser?.uid ?? "")
            return (
                setDoc(userRef, {email: email}, {merge: true})
            ).then(() => {
                console.log("signing up completed for: ", auth?.currentUser?.uid ?? "ERROR NULL USER")
                navigate('/dashboard')
            });
        })
    }
    catch(error) {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            console.log("signed in my friend")
        } catch (error) {
            console.log(`There was an error: ${error}`)
        }
    }

}




