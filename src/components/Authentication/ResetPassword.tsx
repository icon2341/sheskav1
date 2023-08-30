import {

    signInWithEmailAndPassword, browserSessionPersistence, browserLocalPersistence

} from 'firebase/auth';
import React from 'react'
import {NavigateFunction, useNavigate} from "react-router-dom";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {auth, db} from "../../index";
import styles from "./AuthStyles.module.scss";
import { Button } from "src/components/ui/button";
import Form from 'react-bootstrap/Form';
import {useAuthState} from "react-firebase-hooks/auth";
import * as Yup from "yup";
import {Formik} from "formik";
import LoadingScreen from "src/components/Utils/LoadingUtils/LoadingScreen";
import {sendPasswordResetEmail} from "src/api/User/Auth/AuthUtils";

let showToast: any;
export function ResetPassword() {

    /**
     * Schema that denotes that password and email should be valid and required, used by Formik
     */
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Required')
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
        sendPasswordResetEmail(values.email)
        .catch(
            (error) => {
                console.error("There was an issue sending the password reset email, please contact support or try again later.")
                setErrors({email: "There was an issue sending the password reset email, please contact support or try again later."})
            }
        ).then(() => {
            console.log("email sent")
        })
    };

    const [user, loading, error] = useAuthState(auth);
    if (user) {
        navigate('/dashboard');
        return(<div>
            <LoadingScreen/>
        </div>)
    } else if (loading) {
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
                                <h3 className={styles.loginSubSubText}>Password Reset</h3>
                            </div>
                            <div className={`${styles.loginWidgetFormContainer}`}>
                                <Formik validationSchema={validationSchema}
                                        onSubmit={handleSubmit}
                                        initialValues={{
                                            email: ''
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
                                                <Form.Control.Feedback type={"valid"}>Great, if an account exists with that email, you will get a password reset email.</Form.Control.Feedback>
                                            </Form.Group>
                                            {/*<button className="btn btn-primary" type="submit">Submit form</button>*/}
                                            <div className={"d-flex justify-content-center"}>
                                                <Button disabled={!!errors.email} type={"submit"} id={"button-signup"} className={`${"d-block w-50 mx-auto text-center"} 
                                                    ${styles.loginButton}`}>
                                                    Submit
                                                </Button>
                                            </div>

                                        </Form>
                                    )}
                                </Formik>
                                <div className={styles.loginWidgetFooter}>
                                    <a className={`${styles.passwordFooter} ${'text-muted'} ${styles.resetPassword}`}  onClick={() => {navigate('/login')}}>Nevermind</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default ResetPassword




