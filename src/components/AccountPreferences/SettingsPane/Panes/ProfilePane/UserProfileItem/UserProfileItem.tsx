import styles from './UserProfileItem.module.scss';
import React, {useEffect, useState} from "react";
import {getProfilePicture, setDisplayName} from "../../../../../../api/User/ProfilePicture/ProfilePicture";
import {auth} from "../../../../../../index";
import {Check, X} from "react-feather"
import {useAuthState} from "react-firebase-hooks/auth";
import {LoadingIndicator} from "../../../../../LoadingUtils/LoadingSecondaryIndicator";
import {Formik} from "formik";
import Form from "react-bootstrap/Form";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import {sendEmailVerification} from "firebase/auth";

/**
 * Contains formik form to edit display name
 */
const editForm = () => {
    const validationSchema = {
        displayName: Yup.string().required("Required"),
    }


    return (
        <Formik
            initialValues={
                {
                    displayName: auth.currentUser?.displayName || "",
                }
            }
            validationSchema={Yup.object().shape(validationSchema)}
            onSubmit={(values, {setSubmitting}) => {
                setSubmitting(true);
                setDisplayName(values.displayName, auth).then(r => {
                    setSubmitting(false);
                    auth.currentUser?.reload();
                })
            }}
        >
            {props => {
                const {
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    values,
                    touched,
                    dirty,
                    errors,
                    isSubmitting,
                } = props;
                return (
                    <Form onSubmit={(event) => {
                        event.preventDefault();
                        handleSubmit();
                    }}>
                        <div className={styles.editDisplayNameContainer}>
                            <Form.Group controlId="displayName">
                                <Form.Control
                                    type={"text"}
                                    name={"displayName"}
                                    value={values.displayName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={touched.displayName && !errors.displayName}
                                    isInvalid={!!errors.displayName}
                                />
                            </Form.Group>
                            <Button type={"submit"} className={styles.saveButton} disabled={!dirty || !!errors.displayName || isSubmitting}>Save</Button>
                        </div>
                    </Form>
                )
            }}

        </Formik>
    )
}

/**
 * Displays user profile picture and email and allows user to edit items.
 * @param props editMode?: boolean - a non required boolean that determines whether the component is in edit mode or not.
 * @constructor - returns a react component
 */
export function UserProfileItem(props: {editMode?: boolean}) {
    const [currentProfilePicture, setCurrentProfilePicture] = useState<string | null>(null);
    const [user, loading, error] = useAuthState(auth);
    const [verificationEmailSent, setVerificationEmailSent] = useState(false);



    useEffect(() => {
        if(user){
            setCurrentProfilePicture(getProfilePicture(auth));
        }

    }, [user])


    if(user) {
        if(props.editMode) {
            return (
                <div className={styles.container}>
                    {currentProfilePicture ? <img src={currentProfilePicture}  className={styles.profilePicture}/> : null}
                    <div className={styles.additionalDetails}>
                        {editForm()}
                        <h5 className={styles.email}>{user.email}</h5>
                        <div className={styles.verified} >
                            <h5 className={`${styles.verifiedText}`}>Verified</h5>
                            {auth.currentUser?.emailVerified ? <Check color={'green'} size={20}/> : <X color={'red'} size={20}/>}
                            {auth.currentUser?.emailVerified ? '' : <Button className={styles.verifiedButton}

                                                                            onClick={() => {
                                                                                sendEmailVerification(auth.currentUser!).then(r =>
                                                                                    setVerificationEmailSent(true));
                                                                            }}
                                                                            disabled={verificationEmailSent} type={'button'}> Send Verification Email </Button>}
                        </div>
                    </div>
                </div>
            )
        } else {
            // if not in edit mode, read only
            return (
                <div className={styles.container}>
                    {currentProfilePicture ? <img src={currentProfilePicture}  className={styles.profilePicture}/> : null}
                    <div className={styles.additionalDetails}>
                        <h4 className={styles.name}>{user.displayName}</h4>
                        <h5 className={styles.email}>{user.email}</h5>
                        <div className={styles.verified} >
                            <h5 className={`${styles.verifiedText}`}>Verified</h5>
                            {auth.currentUser?.emailVerified ? <Check color={'green'} size={20}/> : <X color={'red'} size={20}/>}
                        </div>

                    </div>
                </div>
            )
        }
    } else if(loading) {
        return (
            <div className={styles.container}>
                <LoadingIndicator/>
            </div>
        )
    } else {
        return (
            <div className={styles.container}>
                <h1>Something went wrong</h1>
            </div>
        )
    }
}

export default UserProfileItem;