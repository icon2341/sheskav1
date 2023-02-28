import {
    signInWithEmailAndPassword, browserSessionPersistence, browserLocalPersistence
} from 'firebase/auth';
import React, {useEffect, useState} from 'react'
import {NavigateFunction, useNavigate} from "react-router-dom";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {auth, db} from "../../index";
import styles from "./SignUp.module.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {useAuthState} from "react-firebase-hooks/auth";
import * as Yup from "yup";
import {Formik} from "formik";
import {InputGroup} from "react-bootstrap";

//TODO add firestore, store password and username functionality as well as next steps to proper profile creation.
//TODO ADD NEW PASSWORD SYSTEM

let showToast: any;
export function Login() {

    /**
     * Schema that denotes that password and email should be valid and required, used by Formik
     */
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string().required('Required')
    });
    /**
     * Allows for navigating a user
     */
    const navigate = useNavigate();
    /**
     * Allows for showing a toast (deprecated)
     */
    // const [showA, setShowA] = useState(false);
    /**
     * determines whether 'remember me' is checked
     */
    const [rememberChecked,setRememberRememberChecked] = React.useState(false);

    const [showPass, setShowPass] = React.useState(false);

    //Allows for calling the toast whenever showA is changed (DEPRECATED)
    // useEffect(() => {
    //     /* Assign update to outside variable */
    //     showToast = setShowA
    //     /* Unassign when component unmounts */
    // }, [])

    /**
     * Logs a user in, also manages Formik updates
     *
     * @param values setErrors is passed inside formik onSubmit and allows for managing errors
     * @param setErrors current form states also managed by formik
     */
    const handleSubmit = async (values: any, { setErrors } : any) => {
        //login the user and return a promise that can do two things on error (for now, here is where you add error handling)

        loginUser(values.email,values.password, navigate, rememberChecked).catch((reason) => {
            console.log("LOL", reason)
            if (reason === "Incorrect Password") {
                setErrors({password: 'Incorrect Password'})
            } else if (reason === "User Not Found") {
                setErrors({email: 'User does not exist'})
            } else if (reason === "Too Many Requests") {
                setErrors({password: 'Too many requests, try again later or reset password.'})
            }
        });

    };

    const [user, loading, error] = useAuthState(auth);
    //if the user is logged in, redirect them to the dashboard
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
                        {/*LOGIN WIDGET*/}
                        <div className={styles.loginWidget}>
                            <div className={styles.loginWidgetHeader}>
                                <h1 className={styles.loginLogo}>Sheska</h1>
                                <h2 className={styles.loginSubText}>Memories are made together</h2>
                                <h3 className={styles.loginSubSubText}>Log in</h3>
                            </div>

                            {/*LOGIN FORM WITH FORMIK*/}
                            <div className={`${styles.loginWidgetFormContainer}`}>
                                {/*Formik will handle the form, states, and submission
                                validation Schema*/}
                                <Formik validationSchema={validationSchema}
                                        onSubmit={handleSubmit}
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
                                                    autoComplete={"email"}
                                                />
                                                <Form.Control.Feedback  type={"invalid"} >{errors.email}</Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group controlId={"lemonForm02"} className={"mb-3 w-50 mx-auto"}>
                                                <InputGroup>
                                                    <Form.Control
                                                        type={showPass ? "text" : "password"}
                                                        name={"password"}
                                                        value={values.password}
                                                        onChange={handleChange}
                                                        placeholder={"Password"}
                                                        isValid={touched.password && !errors.password}
                                                        isInvalid={!!errors.password}
                                                        autoComplete={"current-password"}
                                                    />
                                                    {/*TODO this is square and it annoys me*/}
                                                    <InputGroup.Text>

                                                        <i onClick={() => {
                                                            setShowPass(!showPass)

                                                        }}>
                                                            <i className={showPass ? 'fa fa-eye-slash' : 'fa fa-eye'}></i>
                                                        </i>
                                                    </InputGroup.Text>
                                                    <Form.Control.Feedback  type={"invalid"} >{errors.password}</Form.Control.Feedback>{/*<Form.Control.Feedback  type={"invalid"}>{showA ? "incorrect password" : "incorrect password"}</Form.Control.Feedback>*/}

                                                </InputGroup>
                                            </Form.Group>
                                            <Form.Group className={`${"mb-3 d-flex justify-content-center"} ${styles.loginWidgetCheckbox}`} controlId="formBasicCheckbox">
                                                <Form.Check type="checkbox" label="Remember Me" checked={rememberChecked} onChange={() => setRememberRememberChecked(!rememberChecked)}/>
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

                                {/*RESET PASSWORD FOOTER*/}
                                <div className={styles.loginWidgetFooter}>
                                    <a className={`${styles.passwordFooter} ${'text-muted'} ${styles.resetPassword}`}  onClick={() => {navigate('/resetpassword')}}>Forgot your password?</a>
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

//TODO ADD OVERLOAD FUNCTIONS FOR DIFFERENT SORTS OF AUTHENTICATION
/**
 * This function will attempt to login a user with the given email and password and will redirect them, it will also
 * return promises that denote the errors observed.
 * @param txtEmail email of user as string
 * @param txtPassword passowrd of user as string
 * @param navigate navigate object to redirect user
 * @param rememberMe remember me checkbox to change browser session details
 */
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
        // tries to sign in user with email and password auth
        await signInWithEmailAndPassword(auth, email, password)
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
                    navigate('/dashboard')
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



