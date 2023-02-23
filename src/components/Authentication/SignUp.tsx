import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword, browserSessionPersistence, browserLocalPersistence
} from 'firebase/auth';
import React, {ChangeEvent, useEffect, useState} from 'react'
import {NavigateFunction, useNavigate} from "react-router-dom";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {app, auth, db} from "../../index";
import styles from "./SignUp.module.css"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast'
import {ToastContainer} from "react-bootstrap";
import {useAuthState} from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import {Formik} from "formik";
import * as Yup from 'yup';

//TODO add firestore, store password and username functionality as well as next steps to proper profile creation.
//TODO ADD NEW PASSWORD SYSTEM

let showToast: any;
export function SignUp() {

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string().required('Required')
            .min(8, 'Password is too short - should be 8 chars minimum.')
            .matches(/[0-9]/, 'Password requires a number')
            .matches(/[a-z]/, 'Password requires a lowercase letter')
            .matches(/[A-Z]/, 'Password requires an uppercase letter')
            .matches(/[^\w]/, 'Password requires a symbol'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match')
    });

    const navigate = useNavigate();
    const [txtEmail, setTxtEmail] = useState('')
    const [txtPassword, setTxtPassword] = useState('')
    const [showA, setShowA] = useState(false);
    const [checked,setChecked] = React.useState(false);

    useEffect(() => {
        /* Assign update to outside variable */
        showToast = setShowA
        /* Unassign when component unmounts */
    }, [])
    const handleEmail = (event: ChangeEvent<HTMLInputElement>) => {
        setTxtEmail(event.currentTarget.value);
        console.log(txtEmail);
    }

    const handlePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setTxtPassword(event.target.value);
        console.log(txtPassword);
    }

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
                        <ToastContainer className={styles.toastContainer}>
                            <Toast show={showA} onClose={() => setShowA(false)}>
                                <Toast.Header>
                                    <strong className="me-auto">ERROR</strong>
                                    <small>just now</small>
                                </Toast.Header>
                                <Toast.Body>
                                    Incorrect Password!
                                </Toast.Body>
                            </Toast>
                        </ToastContainer>
                        <div className={styles.loginWidget}>
                            <div className={styles.loginWidgetHeader}>
                                <h1 className={styles.loginLogo}>Sheska</h1>
                                <h2 className={styles.loginSubText}>Memories are made together</h2>
                                <h3 className={styles.loginSubSubText}>Sign Up</h3>
                            </div>
                            <div className={`${styles.loginWidgetFormContainer}`}>
                                {/*<Form>*/}
                                {/*    <Form.Group className={"mb-3 w-75 mx-auto"} controlId="formBasicEmail">*/}
                                {/*        <Form.Control type="email" placeholder="Enter email" onChange={handleEmail}/>*/}
                                {/*    </Form.Group>*/}
                                {/*    <Form.Group className={"mb-3 w-75 mx-auto"}>*/}
                                {/*        <Form.Control type="password" placeholder="Password" onChange={handlePassword}/>*/}
                                {/*    </Form.Group>*/}
                                {/*    <Form.Group className={`${"mb-3 d-flex justify-content-center"} ${styles.loginWidgetCheckbox}`} controlId="formBasicCheckbox">*/}
                                {/*        <Form.Check type="checkbox" label="Remember Me" checked={checked} onChange={() => setChecked(!checked)}/>*/}
                                {/*    </Form.Group>*/}
                                {/*    <div className={"d-flex justify-content-center"}>*/}
                                {/*        <Button variant="primary" id={"button-signup"} className={`${"d-block w-75 mx-auto text-center"} */}
                                {/*        ${styles.loginButton}`} onClick={() => createAccount(txtEmail,txtPassword, navigate, checked)}>*/}
                                {/*            Submit*/}
                                {/*        </Button>*/}
                                {/*    </div>*/}
                                {/*</Form>*/}

                                <Formik validationSchema={validationSchema}
                                        onSubmit={console.log}
                                        initialValues={{
                                            email: '',
                                            password: '',
                                            confirmPassword: ''
                                        }}>
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
                                                <Form.Control.Feedback  >Looks good!</Form.Control.Feedback>
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
                                                <Form.Control.Feedback  >Looks good!</Form.Control.Feedback>
                                                <Form.Control.Feedback  type={"invalid"} >{errors.password}</Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group controlId={"lemonForm03"} className={"mb-3 w-50 mx-auto"}>
                                                <Form.Control
                                                    type={"password"}
                                                    name={"confirmPassword"}
                                                    value={values.confirmPassword}
                                                    onChange={handleChange}
                                                    placeholder={"Confirm Password"}
                                                    isValid={touched.confirmPassword && !errors.confirmPassword}
                                                    isInvalid={!!errors.confirmPassword}
                                                />
                                                <Form.Control.Feedback  >Looks good!</Form.Control.Feedback>
                                                <Form.Control.Feedback  type={"invalid"} >{errors.confirmPassword}</Form.Control.Feedback>
                                            </Form.Group>
                                            {/*<button className="btn btn-primary" type="submit">Submit form</button>*/}
                                                <div className={"d-flex justify-content-center"}>
                                                    <Button disabled={!!errors.email || !!errors.password || !!errors.confirmPassword} type={"submit"} variant="primary" id={"button-signup"} className={`${"d-block w-50 mx-auto text-center"} 
                                                    ${styles.loginButton}`} onClick={() => createAccount(values.email,values.password, navigate, checked)}>
                                                        Submit
                                                    </Button>
                                                </div>

                                        </Form>
                                        )}
                                </Formik>
                                <div className={styles.loginWidgetFooter}>
                                    <h2 className={`${styles.passwordFooter} ${'text-muted'}`}>Passwords must be at least 8 characters long, contain upper and lowercase letters, numbers, and at least one special character</h2>
                                    <br/>
                                    <text className={`${styles.passwordFooter} ${'text-muted'}`}>Already have an account?</text>
                                    <button className={`${styles.signInButt}`} onClick={() => {navigate('/login')}}>Sign In!</button>
                                </div>





                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default SignUp


async function createAccount(txtEmail : string, txtPassword : string, navigate : NavigateFunction, rememberMe : boolean) {
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

            const userRef = doc(db, 'users', auth?.currentUser?.uid ?? "")
            console.log("adding to doc...")
            return (
                setDoc(userRef, {email: email, passedOnboarding: false}, {merge: true})
            ).then(() => {
                console.log("signing up completed for: ", auth?.currentUser?.uid ?? "ERROR NULL USER")
                navigate('/onboarding')
                return;
            });
        })
    }
    catch(error : any) {
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

            }
        }
    }

}




