import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../index";
import {inspect} from "util";
import styles from "./NewItem.module.css";
import Form from "react-bootstrap/Form";
import React, {ChangeEvent} from "react";
import Button from "react-bootstrap/Button";
import {doc, setDoc, addDoc, collection} from "firebase/firestore";
import {NavigateFunction, useNavigate} from "react-router-dom";

export function NewItem() {
    const [user, loading, error] = useAuthState(auth);

    const navigate = useNavigate();
    const [title, setTitle] = React.useState('');
    const [subtitle, setSubtitle] = React.useState('');
    const handleTitle = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.currentTarget.value);
        console.log(title);
    }

    const handleSubtitle = (event: ChangeEvent<HTMLInputElement>) => {
        setSubtitle(event.currentTarget.value);
        console.log(subtitle);
    }


    return (

        <div className={styles.pageContainer}>
            <div className={styles.formContainer}>
                <h1 className={styles.title}>Add New Item</h1>
                <Form.Group className={"mb-3 w-75 mx-auto"} controlId="formBasicEmail">
                    <Form.Control type="email" placeholder="Enter Card Title" onChange={handleTitle}/>
                </Form.Group>
            {/*    TODO ADD AN IMAGE TOOL HERE TO SHOWCASE AND ADD IMAGES TO BE UPLOADED*/}
                <h2 className={styles.subtitle}>Add a subtitle</h2>
                <Form.Group className={"mb-3 w-75 mx-auto"} controlId="formBasicEmail">
                    <Form.Control type="email" placeholder="Enter Subtitle" onChange={handleSubtitle}/>
                </Form.Group>
                <div className={"d-flex justify-content-center"}>
                    <Button variant="primary" id={"button-signup"} className={`${"d-block w-75 mx-auto text-center"} 
                                        ${styles.loginButton}`} onClick={() => postNewSheskaCard(title, subtitle, navigate)}>
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default NewItem;

async function postNewSheskaCard(title:string, subtitle:string, navigate: NavigateFunction) {
    try {
        await addDoc(collection(db, "users/" + auth.currentUser?.uid + "/sheska_list/"),
            {
                title: title,
                subtitle: subtitle
            }).then(() => {
                navigate('/sheskalist');
        });
    } catch (e) {
        console.log(e);
    }
}