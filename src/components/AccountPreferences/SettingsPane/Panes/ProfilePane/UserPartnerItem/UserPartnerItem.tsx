import styles from '../TextActionItem.module.scss';
import React, {useEffect, useState} from "react";
import {
    setDisplayName,
    setProfilePicture
} from "../../../../../../api/User/ProfilePicture/ProfilePicture";
import {auth, db} from "../../../../../../index";
import {Check, X, Plus} from "react-feather"
import {useAuthState} from "react-firebase-hooks/auth";
import {LoadingIndicator} from "../../../../../LoadingUtils/LoadingSecondaryIndicator";
import {storage} from "../../../../../../index";
import {v4 as uuidv4} from "uuid";
import {getPartnerName, setUserData} from "../../../../../../api/User/UserInformation";
import * as Yup from "yup";
import {Formik} from "formik";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {InputGroup} from "react-bootstrap";

const editForm = (partnerFirstName :string, partnerLastName :string, setPartnerName: any) => {
    const validationSchema = {
        partnerFirstName: Yup.string(),
        partnerLastName: Yup.string(),
    }


    return (
        <Formik
            initialValues={
                {
                    partnerFirstName: partnerFirstName,
                    partnerLastName: partnerLastName,
                }
            }
            validationSchema={Yup.object().shape(validationSchema)}
            onSubmit={(values, {setSubmitting}) => {
                console.log('Submitting', values)
                setSubmitting(true);
                setUserData(db, auth, {
                    partner_full_name: [values.partnerFirstName, values.partnerLastName]
                }).then(r => {
                        setPartnerName([values.partnerFirstName, values.partnerLastName]);
                    }
                )
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
                            <Form.Group controlId="partnerFirstName">
                                <InputGroup>
                                    <InputGroup.Text>Partner First and Last</InputGroup.Text>
                                    <Form.Control
                                        type={"text"}
                                        accept={"text/plain"}
                                        name={"partnerFirstName"}
                                        value={values.partnerFirstName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isValid={touched.partnerFirstName && !errors.partnerFirstName}
                                        isInvalid={!!errors.partnerFirstName}
                                        aria-label="Last name"
                                    />
                                    <Form.Control
                                        aria-label="Last name"
                                        type={"text"}
                                        accept={"text/plain"}
                                        name={"partnerLastName"}
                                        value={values.partnerLastName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isValid={touched.partnerLastName && !errors.partnerLastName}
                                        isInvalid={!!errors.partnerLastName}
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Button type={"submit"} className={styles.saveButton} disabled={!dirty || !!errors.partnerFirstName || !!errors.partnerLastName || isSubmitting}>Save</Button>
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
export function UserPartnerItem(props: {editMode?: boolean}) {
    const [user, loading, error] = useAuthState(auth);
    const [partnerName, setPartnerName] = useState<string[] | null>(null);



    useEffect(() => {
        if(user){
            getPartnerName(db, auth).then(partner => {
                setPartnerName(partner);
                console.log('Current Partner Name', partner)
            })
        }

    }, [user])


    if(user) {
        if(props.editMode) {
            return (
                <div className={styles.container}>
                    <div className={styles.additionalDetails}>
                        <h2 className={styles.title}>Edit Partner</h2>
                        {partnerName ? editForm(partnerName[0], partnerName[1], setPartnerName) : editForm("", "", setPartnerName)}
                    </div>
                </div>
            )
        } else {
            // if not in edit mode, read only
            return (
                <div className={styles.container}>
                    <div className={styles.additionalDetails}>
                        <h2 className={styles.title}>Edit Partner</h2>
                        <h3 className={styles.subtitle}>Edit your partner settings here, leave blank if you want to remove your partner.</h3>
                        {partnerName && partnerName[0] != "" ? <h5 className={styles.email}>{partnerName[0] + " " + partnerName[1]}</h5> : <h5 className={styles.email}>No Partner</h5>}
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

export default UserPartnerItem;