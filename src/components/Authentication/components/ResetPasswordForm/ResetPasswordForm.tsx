import { Formik } from "formik";
import React from 'react';
import * as Yup from "yup";
import {useNavigate} from "react-router-dom";
import Form from "react-bootstrap/Form";
import {InputGroup} from "react-bootstrap";
import {Button} from "src/components/ui/button";
import styles from "src/components/Authentication/AuthStyles.module.scss";
import {usePromiseTracker, trackPromise} from "react-promise-tracker";
import {ButtonLoading} from "../../../ui/ButtonLoading";
import {resetPassword} from "../../../../api/Utils/Authentication/Password";
import {toast, Toaster} from "react-hot-toast";


const area = 'ResetPasswordForm'

export  default  function ResetPasswordForm( props: {token: string}) {
    const validationSchema = Yup.object({
        password: Yup.string().required('Required')
            .min(8, 'Password is too short - should be 8 chars minimum.')
            .matches(/\d/, 'Password requires a number')
            .matches(/[a-z]/, 'Password requires a lowercase letter')
            .matches(/[A-Z]/, 'Password requires an uppercase letter')
            .matches(/[^\w]/, 'Password requires a symbol'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match')
    });

    /**
     * navigation object
     */
    const navigate = useNavigate();
    const [showPass, setShowPass] = React.useState(false);
    const { promiseInProgress } = usePromiseTracker({area, delay: 0});
    const [submitted, setSubmitted] = React.useState(false);


    const handleSubmit = async (values: any, { setErrors } : any) => {
        setSubmitted(true)
        trackPromise(
            resetPassword(props.token, values.password).then((response) => {
                console.log('RESPONSE FROM SERVER: ', response)
                toast.success('Successfully reset password!')
                setTimeout(() => {
                    navigate('/login')
                }, 1000)
                }
            ).catch(
                (error) => {
                    console.error('ERROR FROM SERVER: ', error.message)
                    toast.error("Something went wrong!")
                    setErrors({password: "There was an error resetting your password, please contact support or go through the process again."})
                }
            ), area
        )
    };

    return (
            <div className={"shadow-2xl bg-white border-black border-b-neutral-200 lg:w-1/2 w-5/6 rounded lg:h-1/2 h-3/4 flex items-center justify-center flex-wrap flex-col p-2"}>
                <div><Toaster/></div>
                <div className={styles.loginWidgetHeader}>
                    <h1 className={styles.loginLogo}>Sheska</h1>
                    <h2 className={styles.loginSubText}>Memories are made together</h2>
                    <h3 className={styles.loginSubSubText}>Password Reset</h3>
                </div>

                <Formik
                    className={"w-full"}
                    validationSchema={validationSchema}
                    initialValues={{
                        password: '',
                        confirmPassword: '',
                    }}
                    onSubmit={handleSubmit}>
                    {
                        ({
                             handleSubmit,
                             handleChange,
                             handleBlur,
                             values,
                             touched,
                             isValid,
                             errors,
                         })=> (
                            <Form noValidate onSubmit={handleSubmit}>
                                <Form.Group controlId={"lemonForm02"} className={"mb-3 w-100 mx-auto"}>
                                    <InputGroup>
                                        <Form.Control
                                            type={showPass ? "text" : "password"}
                                            name={"password"}
                                            value={values.password}
                                            onChange={handleChange}
                                            placeholder={"Password"}
                                            isValid={touched.password && !errors.password}
                                            isInvalid={!!errors.password}
                                            autoComplete={"new-password"}
                                        />
                                        {/*TODO this is square and it anmoys me*/}
                                        <InputGroup.Text>

                                            <i onClick={() => {
                                                setShowPass(!showPass)
                                            }}>
                                                <i className={showPass ? 'fa fa-eye-slash' : 'fa fa-eye'}></i>
                                            </i>
                                        </InputGroup.Text>
                                        <Form.Control.Feedback  >Looks good!</Form.Control.Feedback>
                                        <Form.Control.Feedback  type={"invalid"} >{errors.password}</Form.Control.Feedback>
                                    </InputGroup>

                                </Form.Group>
                                <Form.Group controlId={"lemonForm03"} className={"mb-3 w-100 mx-auto"}>
                                    <Form.Control
                                        type={showPass ? "text" : "password"}
                                        name={"confirmPassword"}
                                        value={values.confirmPassword}
                                        onChange={handleChange}
                                        placeholder={"Confirm Password"}
                                        isValid={touched.confirmPassword && !errors.confirmPassword}
                                        isInvalid={!!errors.confirmPassword}
                                        autoComplete={"new-password"}
                                    />
                                    <Form.Control.Feedback  >Looks good!</Form.Control.Feedback>
                                    <Form.Control.Feedback  type={"invalid"} >{errors.confirmPassword}</Form.Control.Feedback>

                                </Form.Group>
                                {/*<button className="btn btn-primary" type="submit">Submit form</button>*/}
                                <div className={"d-flex justify-content-center"}>
                                    {promiseInProgress ? <ButtonLoading/> :
                                        <Button disabled={!!errors.password || !!errors.confirmPassword || submitted} type={"submit"}
                                                id={"button-signup"} className={`${"d-block w-75 mx-auto text-center"} 
                                                    ${styles.loginButton}`}>
                                            Submit
                                        </Button>
                                    }
                                </div>
                            </Form>
                        )
                    }

                </Formik>
            </div>

    )

}