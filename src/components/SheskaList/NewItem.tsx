import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db, storage} from "../../index";
import styles from "./NewItem.module.css";
import Form from "react-bootstrap/Form";
import React, {ChangeEvent, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {doc, addDoc, collection, setDoc} from "firebase/firestore";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {Carousel, ToastContainer} from "react-bootstrap";
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import {DocumentReference} from "firebase/firestore";
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

// Import FilePond styles
import 'filepond/dist/filepond.min.css'
import {FilePondFile} from "filepond";
import {ref, uploadBytes, deleteObject} from "firebase/storage";
import Toast from "react-bootstrap/Toast";


registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType)


export function NewItem() {
    const [user, loading, error] = useAuthState(auth);

    const navigate = useNavigate();
    const [title, setTitle] = React.useState('');
    const [subtitle, setSubtitle] = React.useState('');
    const [addedSlides, setAddedSlides] = React.useState([]);
    const [addedFiles, setAddedFiles] = React.useState({});
    const [files, setFiles] = useState<FilePondFile[]>([])
    const [docRef, setDocRef] = useState<DocumentReference>();
    const [fileUploadingInProgress, setFileUploadingInProgress] = useState(false);
    const [shownEmptyFilePrompt, setShownEmptyFilePrompt] = useState(false);
    const [showA, setShowA] = useState(false);
    const [showB, setShowB] = useState(false);
    //initialize potential document reference



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

    useEffect(() => {
        files.map((file) => {console.log("File: " + file.id, file.file.name, file.origin)})

    }, [files])

    useEffect(() => {
        if(user != null)  {
            const docRef = doc(collection(db, "users/" + auth.currentUser?.uid + "/sheska_list/"))
            setDocRef(docRef);
        }
    }, [user])

    // const server={
    //     server: {
    //         revert: (uniqueFileId: string, load: any, error: any   ) => {
    //             // Should remove the earlier created temp file here
    //             // ...
    //             const fileRef = ref(storage, uniqueFileId);
    //             deleteObject(fileRef).then(() => {
    //                 console.log('file removed:' + uniqueFileId);
    //             }).catch((error: any) => {
    //                 console.log(error);
    //             });
    //
    //             // Can call the error method if something is wrong, should exit after
    //
    //
    //             // Should call the load method when done, no parameters required
    //             load();
    //         },
    //
    //             process: (fieldName:string, file : FilePondFile, metadata : any, load: any, error:any, progress: any, abort:any,
    //                       transfer: any, options: any) => {
    //
    //                 const id = file.file.name;
    //
    //                 const fileRef = ref(storage, file.file.name);
    //
    //                 uploadBytes(fileRef, file.file).then((snapshot) => {
    //                     progress(true, 100, 100);
    //                     load(id);
    //
    //                 });
    //
    //                 return {
    //                     abort: () => {
    //                         // This function is entered if the user has tapped the cancel button
    //                         // TODO MAKE SURE TO IMPLEMENT THIS SO THAT THE FILE IS NOT UPLOADED ON FIREBASE, CURERENTLY THIS DOES NOTHING
    //                         abort();
    //                     }
    //                 }
    //
    //
    //         // your processing code here
    //     },
    //         load: (source: string, load: any, error: any, progress: any, abort: any, headers: any) => {
    //         // Should load the image and provide image information to FilePond
    //         // ...
    //
    //         // Should call the progress method to update the progress to 100% before calling load
    //         progress(true, 0, 1024);
    //
    //         // Should call the load method when done and pass the url to the image
    //         load(source);
    //
    //         // Should expose an abort method so the request can be cancelled
    //         return {
    //             abort: () => {
    //                 // This function is entered if the user has tapped the cancel button
    //                 abort();
    //             }
    //         };
    //     }
    //
    // }
    //
    // }

    return (

        <div className={styles.pageContainer}>
            {/*<ToastContainer className={styles.toastContainer}>*/}
            {/*    <Toast show={showA} onClose={() => setShowA(false)}>*/}
            {/*        <Toast.Header>*/}
            {/*            <strong className="me-auto">ERROR</strong>*/}
            {/*            <small>just now</small>*/}
            {/*        </Toast.Header>*/}
            {/*        <Toast.Body>*/}
            {/*            Are you sure you don't want to add any images?*/}
            {/*        </Toast.Body>*/}
            {/*    </Toast>*/}
            {/*</ToastContainer>*/}
            <ToastContainer className={styles.toastContainer}>
                <Toast show={showB} onClose={() => setShowB(false)}>
                    <Toast.Header>
                        <strong className="me-auto">ERROR</strong>
                        <small>just now</small>
                    </Toast.Header>
                    <Toast.Body>
                        Wait till images are uploaded
                    </Toast.Body>
                </Toast>
            </ToastContainer>

            <div className={styles.formContainer}>
                <h1 className={styles.title}>Add New Item</h1>
                <h2 className={styles.subtitle}>Add the Title</h2>
                <Form.Group className={"mb-3 w-75 mx-auto"} controlId="formBasicEmail">
                    <Form.Control type="text" placeholder="Enter Card Title" onChange={handleTitle}/>
                </Form.Group>
            {/*    TODO ADD AN IMAGE TOOL HERE TO SHOWCASE AND ADD IMAGES TO BE UPLOADED*/}
                <FilePond
                    onupdatefiles={setFiles}
                    allowMultiple={true}
                    instantUpload={true}
                    name="files" /* sets the file input name, it's filepond by default */
                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                    credits={false}
                    server={{
                        revert: (uniqueFileId: string, load: any, error: any   ) => {
                            // Should remove the earlier created temp file here
                            // ...
                            const fileRef = ref(storage, "users/"+ auth.currentUser?.uid + "/" + docRef?.id + "/" +uniqueFileId);
                            deleteObject(fileRef).then(() => {
                                console.log('file removed:' + uniqueFileId);
                            }).catch((error: any) => {
                                console.log(error);
                            });

                            // Can call the error method if something is wrong, should exit after


                            // Should call the load method when done, no parameters required
                            load();
                        },
                        process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                        const id = file.name;

                        const fileRef = ref(storage, "users/"+ auth.currentUser?.uid + "/" + docRef?.id + "/" +file.name);

                        uploadBytes(fileRef, file).then((snapshot) => {
                        progress(true, 100, 100);
                        load(id);

                    });

                        return {
                        abort: () => {
                        // This function is entered if the user has tapped the cancel button
                        // TODO MAKE SURE TO IMPLEMENT THIS SO THAT THE FILE IS NOT UPLOADED ON FIREBASE, CURERENTLY THIS DOES NOTHING
                            const fileRef = ref(storage, "users/"+ auth.currentUser?.uid + "/" + docRef?.id + "/" +file.name);
                            deleteObject(fileRef).then(() => {
                                console.log('file removed:' + file.name);
                            }).catch((error: any) => {
                                console.log(error);
                            });
                        abort();
                    }
                    }
                    }

                    }}
                    acceptedFileTypes={['image/*']}
                    allowProcess={true}
                    onprocessfilestart={() =>{
                        console.log("File upload started")
                        setFileUploadingInProgress(true);
                    }
                    }
                    onprocessfiles={() =>
                    {
                        console.log("Files uploaded")
                        setFileUploadingInProgress(false);
                    }}

                />
                {/*<Carousel>*/}
                {/*    {addedSlideHTML()}*/}
                {/*</Carousel>*/}
                <h2 className={styles.subtitle}>Add a subtitle</h2>
                <Form.Group className={"mb-3 w-75 mx-auto"} controlId="formBasicEmail">
                    <Form.Control type="text" placeholder="Enter Subtitle" onChange={handleSubtitle}/>
                </Form.Group>
                <div className={"d-flex justify-content-center"}>
                    <Button variant="primary" id={"button-signup"} className={`${"d-block w-75 mx-auto text-center"} 
                                        ${styles.loginButton}`} onClick={() => {
                                            console.log("SEND BUTTONG PRESSED")
                                            //TODO FIX BUG 001, FILE UPLOADING IN PROGRESS IS NOT WORKING in PROD
                                            if (fileUploadingInProgress === true) {
                                                setShowB(true);
                                                console.log("SEND BUTTONG PRESSED BUT FILE UPLOADING")
                                            } else if(files.length === 0 && shownEmptyFilePrompt === true) {
                                                postNewSheskaCard(title, subtitle, navigate, docRef)
                                            } else if (files.length === 0 && shownEmptyFilePrompt === false) {
                                                setShownEmptyFilePrompt(true);
                                                setShowA(true);
                                            } else if (files.length !== 0) {
                                                postNewSheskaCard(title, subtitle, navigate, docRef)
                                            }
                    }}>
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default NewItem;

async function postNewSheskaCard(title:string, subtitle:string, navigate: NavigateFunction, docRef: any) {
    try {
        await setDoc(docRef,
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