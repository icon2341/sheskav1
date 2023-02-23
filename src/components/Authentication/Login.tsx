import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword, browserSessionPersistence, browserLocalPersistence
} from 'firebase/auth';
import React, {ChangeEvent, useEffect, useState} from 'react'
import {NavigateFunction, useNavigate} from "react-router-dom";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {app, auth, db} from "../../index";
import styles from "./SignUp.module.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast'
import {ToastContainer} from "react-bootstrap";
import {useAuthState} from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import * as Yup from "yup";
import {Formik} from "formik";

//TODO add firestore, store password and username functionality as well as next steps to proper profile creation.
//TODO ADD NEW PASSWORD SYSTEM

let showToast: any;
export function Login() {

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string().required('Required')
    });

    const navigate = useNavigate();
    const [showA, setShowA] = useState(false);
    const [checked,setChecked] = React.useState(false);

    useEffect(() => {
        /* Assign update to outside variable */
        showToast = setShowA
        /* Unassign when component unmounts */
    }, [])

    const [user, loading, error] = useAuthState(auth);
    if (user) {
        navigate('/dashboard');
        return(<div>
            <h1>REDIRECTING</h1>
        </div>)
    } else if (loading) {
        return (<div>
            <h1>Loading...</h1>
        </div>)
    } else {
        return(
            <div>
                <style> @import url('https://fonts.googleapis.com/css2?family=Pavanam&display=swap');</style>
                <div className={styles.pageContainer}>
                    <div className={styles.presentationContainer}>
                        <img src={require("../../images/peopleHavingFun.jpg")} className={styles.peopleHavingFun} alt={'people having fun'}/>
                        <h1 className={styles.presentationHeader}>Give guests one of a kind experiences, find amazing vendors, allow guests to support you, make memories together.</h1>
                    </div>
                    <div className={styles.formContainer}>
                        {/*<ToastContainer className={styles.toastContainer}>*/}
                        {/*    <Toast show={showA} onClose={() => setShowA(false)}>*/}
                        {/*        <Toast.Header>*/}
                        {/*            <strong className="me-auto">ERROR</strong>*/}
                        {/*            <small>just now</small>*/}
                        {/*        </Toast.Header>*/}
                        {/*        <Toast.Body>*/}
                        {/*            Incorrect Password!*/}
                        {/*        </Toast.Body>*/}
                        {/*    </Toast>*/}
                        {/*</ToastContainer>*/}
                        <div className={styles.loginWidget}>
                            <div className={styles.loginWidgetHeader}>
                                <h1 className={styles.loginLogo}>Sheska</h1>
                                <h2 className={styles.loginSubText}>Memories are made together</h2>
                                <h3 className={styles.loginSubSubText}>Log in</h3>
                            </div>
                            <div className={`${styles.loginWidgetFormContainer}`}>
                                <Formik validationSchema={validationSchema}
                                        onSubmit={(values) => {
                                            loginUser(values.email,values.password, navigate, checked).catch((reason) => {
                                                if (reason === "Incorrect Password") {

                                                } else if (reason === "User does not exist") {

                                                }
                                            });
                                        }}
                                        initialValues={{
                                            email: '',
                                            password: ''
                                        }}
                                        enableReinitialize>
                                    {({
                                          handleSubmit,
                                          handleChange,
                                          handleBlur,
                                          values,
                                          touched,
                                          isValid,
                                          errors,
                                      }) => (
                                        <Form noValidate onSubmit={handleSubmit}>
                                            <Form.Group controlId={"lemonForm01"} className={"mb-3 w-50 mx-auto"}>
                                                <Form.Control
                                                    type={"email"}
                                                    name={"email"}
                                                    value={values.email}
                                                    onChange={handleChange}
                                                    placeholder={"Email"}
                                                    isValid={touched.email && !errors.email}
                                                    isInvalid={!!errors.email}
                                                />
                                                <Form.Control.Feedback  type={"invalid"} >{errors.email}</Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group controlId={"lemonForm02"} className={"mb-3 w-50 mx-auto"}>
                                                <Form.Control
                                                    type={"password"}
                                                    name={"password"}
                                                    value={values.password}
                                                    onChange={handleChange}
                                                    placeholder={"Password"}
                                                    isValid={touched.password && !errors.password}
                                                    isInvalid={!!errors.password}
                                                />
                                                <Form.Control.Feedback  type={"invalid"} >{errors.password}</Form.Control.Feedback>
                                                {/*<Form.Control.Feedback  type={"invalid"}>{showA ? "incorrect password" : "incorrect password"}</Form.Control.Feedback>*/}
                                            </Form.Group>
                                            <Form.Group className={`${"mb-3 d-flex justify-content-center"} ${styles.loginWidgetCheckbox}`} controlId="formBasicCheckbox">
                                                <Form.Check type="checkbox" label="Remember Me" checked={checked} onChange={() => setChecked(!checked)}/>
                                            </Form.Group>
                                            {/*<button className="btn btn-primary" type="submit">Submit form</button>*/}
                                            <div className={"d-flex justify-content-center"}>
                                                <Button disabled={!!errors.email || !!errors.password} type={"submit"} variant="primary" id={"button-signup"} className={`${"d-block w-50 mx-auto text-center"} 
                                                    ${styles.loginButton}`} onClick={() => {handleSubmit()}}>
                                                    Submit
                                                </Button>
                                            </div>

                                        </Form>
                                    )}
                                </Formik>
                                <div className={styles.loginWidgetFooter}>
                                    <a className={`${styles.passwordFooter} ${'text-muted'} ${styles.resetPassword}`}  onClick={() => {navigate('/login')}}>Forgot your password?</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default Login


async function loginUser(txtEmail : string, txtPassword : string, navigate : NavigateFunction, rememberMe : boolean){
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
        await signInWithEmailAndPassword(auth, email, password)
        console.log("signed in my friend")
        const userRef = doc(db, 'users', auth?.currentUser?.uid ?? "")
        await getDoc(userRef).then(doc => {
            if (doc.exists()) {
                console.log("doc exists, check onboarding", doc.data())
                if(doc.data()?.passedOnboarding === false ||
                    doc.data()?.passedOnboarding === undefined) {
                    console.log("user has not passed onboarding")
                    navigate('/onboarding')
                    return;
                } else {
                    navigate('/dashboard')
                }
            } else {
                throw new Error("User does not exist")

            }
        })
    } catch (e: any) {
        console.log(`There was an error: ${e}`)
        switch (e.code) {
            case 'auth/wrong-password':
                console.log('wrong password')
                showToast(true)
                return new Promise((resolve, reject) => {
                    reject("Incorrect Password")
                });
            case 'auth/user-not-found':
                console.log('user not found')
                showToast(true)
                return new Promise((resolve, reject) => {
                    reject("User Not Found")
                });

        }
    }

    return new Promise((resolve, reject) => {
        resolve("User Signed In");
    });

}
// async function createAccount(txtEmail : string, txtPassword : string, navigate : NavigateFunction, rememberMe : boolean) {
//     // checks if user has selected remember me, sets auth state persistence naturally.
//     if(rememberMe) {
//         await auth.setPersistence(browserLocalPersistence)
//     } else {
//         await auth.setPersistence(browserSessionPersistence)
//     }
//
//     console.log(`Signup Attempted on ${txtEmail}`)
//
//     const email : string = txtEmail
//     const password : string = txtPassword
//     try {
//         await createUserWithEmailAndPassword(auth, email, password).then((cred) => {
//             console.log(cred)
//             sessionStorage.setItem('Auth Token', cred.user.refreshToken)
//
//             const userRef = doc(db, 'users', auth?.currentUser?.uid ?? "")
//             console.log("adding to doc...")
//             return (
//                 setDoc(userRef, {email: email, passedOnboarding: false}, {merge: true})
//             ).then(() => {
//                 console.log("signing up completed for: ", auth?.currentUser?.uid ?? "ERROR NULL USER")
//                 navigate('/onboarding')
//                 return;
//             });
//         })
//     }
//     catch(error : any) {
//         try {
//             await signInWithEmailAndPassword(auth, email, password)
//             console.log("signed in my friend")
//             const userRef = doc(db, 'users', auth?.currentUser?.uid ?? "")
//             await getDoc(userRef).then(doc => {
//                 if (doc.exists()) {
//                     console.log("doc exists, check onboarding", doc.data())
//                     if(doc.data()?.passedOnboarding === false ||
//                         doc.data()?.passedOnboarding === undefined) {
//                         console.log("user has not passed onboarding")
//                         navigate('/onboarding')
//                         return;
//                     } else {
//                         navigate('/dashboard')
//                     }
//                 } else {
//                     throw new Error("User does not exist")
//                 }
//             })
//         } catch (e: any) {
//             console.log(`There was an error: ${e}`)
//             switch (e.code) {
//                 case 'auth/wrong-password':
//                     console.log('wrong password')
//                     showToast(true)
//
//             }
//         }
//     }
//
// }




