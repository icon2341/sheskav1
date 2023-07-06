import styles from './UserProfileItem.module.scss';
import React, {useEffect, useState} from "react";
import {
    getProfilePicture,
    setDisplayName,
    setProfilePicture
} from "../../../../../../api/User/ProfilePicture/ProfilePicture";
import {auth, functions} from "../../../../../../index";
import {Check, X, Plus} from "react-feather"
import {useAuthState} from "react-firebase-hooks/auth";
import {LoadingIndicator} from "../../../../../LoadingUtils/LoadingSecondaryIndicator";
import {Formik} from "formik";
import Form from "react-bootstrap/Form";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import {Box, Modal} from "@mui/material";
import {FilePond} from "react-filepond";
import {ref, uploadBytes} from "firebase/storage";
import firebase from "firebase/compat";
import {storage} from "../../../../../../index";
import {v4 as uuidv4} from "uuid";
import {toast, Toaster} from "react-hot-toast";
import {httpsCallable} from "firebase/functions";

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
    const [uploadModalOpen, setUploadModalOpen] = useState(false);



    useEffect(() => {
        if(user){
            setCurrentProfilePicture(getProfilePicture(auth));
            console.log('Current Profile Pictuer', currentProfilePicture)
        }

    }, [user])

    const server = {
        process: (fieldName: any, file:any, metadata:any, load:any, error:any, progress:any, abort:any, transfer:any, options:any) => {
            setProfilePicture(file, auth, storage).then(r => {
                console.log('FILE UPLAODED')
                progress(true, 100, 100);
                load(r);
                auth.currentUser?.reload();
            });
        }

    }


    if(user) {
        if(props.editMode) {
            return (
                <div className={styles.container}>
                    <div><Toaster/></div>
                    <Modal open={uploadModalOpen} onClose={() => {setUploadModalOpen(false)}}>
                            <Box className={styles.modalContainer}>
                                <FilePond
                                    allowMultiple={false}
                                    acceptedFileTypes={['image/png', 'image/jpeg']}
                                    instantUpload={true}
                                    allowRevert={false}
                                    server={server}
                                    fileRenameFunction={(file) => {
                                        return `${uuidv4()}${file.extension}`; }}
                                    onprocessfiles={() => {
                                        setUploadModalOpen(false);
                                        auth.currentUser?.reload();
                                        setCurrentProfilePicture(getProfilePicture(auth));
                                        toast.success("Profile Picture Updated")
                                    }}
                                />
                            </Box>
                    </Modal>

                    <div onClick={() => {setUploadModalOpen(true)}}>
                        {currentProfilePicture ? <img src={currentProfilePicture}  className={styles.profilePicture}/> : <Plus className={`${styles.profilePicture} ${styles.profilePictureEdit}`}/> }
                    </div>
                    <div className={styles.additionalDetails}>
                        {editForm()}
                        <h5 className={styles.email}>{user.email}</h5>
                        <div className={styles.verified} >
                            <h5 className={`${styles.verifiedText}`}>Verified</h5>
                            {auth.currentUser?.emailVerified ? <Check color={'green'} size={20}/> : <X color={'red'} size={20}/>}
                            {auth.currentUser?.emailVerified ? '' : <Button className={styles.verifiedButton}

                                                                            onClick={() => {
                                                                                const sendEmailVerification = httpsCallable(functions, 'EmailUserUtils-sendEmailVerification');
                                                                                sendEmailVerification().then(r =>
                                                                                    setVerificationEmailSent(true));
                                                                                    toast.success("Verification Email Sent")
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
                    {currentProfilePicture ? <img src={currentProfilePicture}  className={styles.profilePicture}/> : <img src={require("../../../../../../images/DefaultImages/defaultProfile.png")} className={styles.profilePicture} />}
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