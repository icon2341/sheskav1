import { Formik } from "formik";
import React, { useEffect } from 'react';
import { InputGroup } from "react-bootstrap";
import { Button } from "src/components/ui/button";
import Form from 'react-bootstrap/Form';
import { useAuthState } from "react-firebase-hooks/auth";
import {useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {auth} from "../../index";
import styles from "./AuthStyles.module.scss";
import LoadingScreen from "src/components/Utils/LoadingUtils/LoadingScreen";
import {loginUser} from "../../api/User/Auth/AuthUtils";

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
     * determines whether 'remember me' is checked
     */
    const [rememberChecked,setRememberRememberChecked] = React.useState(false);
    const [user, loading, error] = useAuthState(auth);
    const [showPass, setShowPass] = React.useState(false);

    useEffect(() => {
        if (user)
            navigate('/home');
    }, [user, navigate]);

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

        loginUser(values.email,values.password, navigate, rememberChecked).catch((response) => {
            const reason = response.message
            if (reason === "Incorrect Password") {
                setErrors({password: 'Incorrect Password'})
            } else if (reason === "User Not Found") {
                setErrors({email: 'User does not exist'})
            } else if (reason === "Too Many Requests") {
                setErrors({email: 'Too many requests, try again later or reset password.'})
            } else if (reason === "Server Refused Connection") {
                setErrors({email: 'Server Refused Connection, try again later. Or Visit www.sheska.co/support for help.'})
            }
        });
    };
    //if the user is logged in, redirect them to the dashboard
    if (user) {
        navigate('/home');
        return(<div>
            <LoadingScreen/>
        </div>)
    } else if (loading) {
        return (<div>
            <LoadingScreen/>
        </div>)
    } else if (error) {
        return (<div>
                <LoadingScreen/>
            </div>)
    } else {
        return(
            <div>
                <style> @import url('https://fonts.googleapis.com/css2?family=Pavanam&display=swap');</style>
                <div className={styles.pageContainer}>
                    <div className={styles.presentationSection}>
                        <img src={require("../../images/peopleHavingFun.jpg")} className={styles.peopleHavingFun} alt={'people having fun'}/>
                        <h1 className={styles.presentationHeader}>Give guests one of a kind experiences, find amazing vendors, allow guests to support you, make memories together.</h1>
                    </div>
                    <div className={styles.formSection}>
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
                                                <Button disabled={!!errors.email || !!errors.password} type={"submit"} id={"button-signup"} className={`${"d-block w-50 mx-auto text-center"}
                                                    ${styles.loginButton}`}>
                                                    Submit
                                                </Button>
                                            </div>

                                        </Form>
                                    )}
                                </Formik>

                                {/*RESET PASSWORD FOOTER*/}
                                <div className={styles.loginWidgetFooter}>
                                    <a className={`${styles.passwordFooter} ${'text-muted'} ${styles.resetPassword}`}  onClick={() => {navigate('/resetpassword')}}>Forgot your password?</a>
                                    <br/>
                                    <small className={`${styles.passwordFooter} ${'text-muted'}`}>Dont Already have an account?</small>
                                    <button className={`${styles.signInButt}`} onClick={() => {navigate('/signup')}}>Sign Up!</button>
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




