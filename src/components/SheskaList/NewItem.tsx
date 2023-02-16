import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../index";
import {inspect} from "util";
import styles from "./NewItem.module.css";
import Form from "react-bootstrap/Form";
import React, {ChangeEvent, useState} from "react";
import Button from "react-bootstrap/Button";
import {doc, setDoc, addDoc, collection} from "firebase/firestore";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {Carousel} from "react-bootstrap";
import Dropzone from 'react-dropzone'
import ReactDOM from 'react-dom'
// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)


export function NewItem() {
    const [user, loading, error] = useAuthState(auth);

    const navigate = useNavigate();
    const [title, setTitle] = React.useState('');
    const [subtitle, setSubtitle] = React.useState('');
    const [addedSlides, setAddedSlides] = React.useState([]);
    const [addedFiles, setAddedFiles] = React.useState({});
    const [files, setFiles] = useState<any>([])
    const handleTitle = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.currentTarget.value);
        console.log(title);
    }

    const handleSubtitle = (event: ChangeEvent<HTMLInputElement>) => {
        setSubtitle(event.currentTarget.value);
        console.log(subtitle);
    }

    const addedSlideHTML = () => {if (addedSlides.length === 0) {
        return (
            <Carousel.Item>
                <div className={styles.slideContainer}>
                    <h1>Added Slides</h1>
                </div>
            </Carousel.Item>
        )
    } else {
        return addedSlides.map((slide) => {
            return (
                <Carousel.Item>
                    <div className={styles.slideContainer}>
                        <h1>{slide}</h1>
                    </div>
                </Carousel.Item>
            )
        })
    }
    }


    return (

        <div className={styles.pageContainer}>
            <div className={styles.formContainer}>
                <h1 className={styles.title}>Add New Item</h1>
                <h2 className={styles.subtitle}>Add the Title</h2>
                <Form.Group className={"mb-3 w-75 mx-auto"} controlId="formBasicEmail">
                    <Form.Control type="email" placeholder="Enter Card Title" onChange={handleTitle}/>
                </Form.Group>
            {/*    TODO ADD AN IMAGE TOOL HERE TO SHOWCASE AND ADD IMAGES TO BE UPLOADED*/}
                <FilePond
                    files={files}
                    onupdatefiles={setFiles}
                    allowMultiple={true}
                    maxFiles={3}
                    server="null"
                    instantUpload={false}
                    name="files" /* sets the file input name, it's filepond by default */
                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                    credits={false}
                />
                {/*<Carousel>*/}
                {/*    {addedSlideHTML()}*/}
                {/*</Carousel>*/}
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