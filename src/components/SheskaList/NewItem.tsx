
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db, storage} from "../../index";
import styles from "./NewItem.module.css";
import globalStyles from "../../App.module.css";
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
import { Editor } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import TipTapMenuBar from "./EditorUtil";


// Import FilePond styles
import 'filepond/dist/filepond.min.css'
import {FilePondFile} from "filepond";
import {ref, uploadBytes, deleteObject} from "firebase/storage";
import Toast from "react-bootstrap/Toast";
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {Placeholder} from "@tiptap/extension-placeholder";
import "./NewItemUtil.scss";
import { Extension } from '@tiptap/core'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import {Color} from "@tiptap/extension-color";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType)


export function NewItem() {
    const [user, loading, error] = useAuthState(auth);

    const navigate = useNavigate();
    const [title, setTitle] = React.useState('');
    const [subtitle, setSubtitle] = React.useState('');
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

    useEffect(() => {
        files.map((file) => {console.log("File: " + file.id, file.file.name, file.origin)})

    }, [files])

    useEffect(() => {
        if(user != null)  {
            const docRef = doc(collection(db, "users/" + auth.currentUser?.uid + "/sheska_list/"))
            setDocRef(docRef);
        }
    }, [user])


    /**
     * This is the editor that will be used to create the description of the item
     */
    const editor : any | null = useEditor({
        extensions: [
            Color.configure({ types: [TextStyle.name, ListItem.name] }),
            // @ts-ignore
            TextStyle.configure({ types: [ListItem.name] }),
            StarterKit.configure({
                bulletList: {
                },
                orderedList: {
                },
            }),
        ],
        content: `
<!--TODO use the custom documents system to make this into a placeholder text rather than REAL text like it is rn-->
              <h2>
                Hi there,
              </h2>
              <p>
                This is a WYSIWYG editor, meaning what you see is what you (and your guests) will get. Use this as your canvas
                to describe this item to your hearts content! You can add images, links videos, bullet points and beyond!
                With the power of WYSIWYG you can create a beautiful and engaging description of your item.
              </p>
              <p>Double click on any of the buttons above to apply styles to your text.</p>
            `,
    })

    return (
        <div className={styles.pageContainer}>
            <div className={`${globalStyles.backButton} ${styles.gridItem}`} title={"Warning this will discard changes"}
                 onClick={() =>{ navigate('/sheskalist')}}>
                <svg className={globalStyles.backArrowButton} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={48} color={"#0e2431"}><path fill="#FFFFFF" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
                <h3 className={`${globalStyles.backButtonText}`}>Return to List</h3>
            </div>

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
                <div className={styles.filePond}>
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
                </div>

                {/*TODO MAKE THIS A Paragraph text editor instead of a single line*/}
                <h2 className={styles.subtitle}>Add a subtitle</h2>
                <Form.Group className={"mb-3 w-75 mx-auto"} controlId="formBasicEmail">
                    <Form.Control type="text" placeholder="Enter Subtitle" onChange={handleSubtitle}/>
                </Form.Group>

                <h2 className={styles.subtitle}>Add Event Information</h2>
                <div className={styles.textEditor}>
                    <TipTapMenuBar editor={editor}/>
                    <EditorContent editor={editor}/>
                </div>


                <div className={"d-flex"}>
                    <Button variant="primary" id={"button-signup"} className={`${"d-block w-50 text-center"} 
                                        ${styles.loginButton}`} onClick={() => {
                                            console.log("SEND BUTTON PRESSED")
                                            //TODO FIX BUG 001, FILE UPLOADING IN PROGRESS IS NOT WORKING in PROD
                                            if (fileUploadingInProgress === true) {
                                                setShowB(true);
                                                console.log("SEND BUTTON PRESSED BUT FILE UPLOADING")
                                            } else if(files.length === 0 && shownEmptyFilePrompt === true) {
                                                postNewSheskaCard(title, subtitle, navigate, docRef, editor)
                                            } else if (files.length === 0 && shownEmptyFilePrompt === false) {
                                                setShownEmptyFilePrompt(true);
                                                setShowA(true);
                                            } else if (files.length !== 0) {
                                                postNewSheskaCard(title, subtitle, navigate, docRef, editor)
                                            }}}>
                        Submit
                    </Button>
                    {/*TODO ADD PREVIEW FUNCTIONALITITY ONCE GUEST WEB IS DONE*/}
                    <Button variant="secondary" id={"button-preview"} className={`${"d-block w-25 text-center"} 
                                        ${styles.previewButton}`} onClick={() => {console.log("SEND BUTTON PRESSED")}}>
                        Preview
                    </Button>

                </div>
            </div>
        </div>
    )
}

export default NewItem;

/**
 *
 * @param title the card's title
 * @param subtitle the subtitle data for card
 * @param navigate navigation high order function to move back to sheskalist after completion
 * @param docRef reference to the document being updated in firestore, this is passed in rather then generated
 * at call time because the document reference needs to be created at the parent level because the same ref should be
 * used in firestore and google cloud.
 */
async function postNewSheskaCard(title:string, subtitle:string, navigate: NavigateFunction, docRef: any, editor: Editor | null) {
    try {

        await setDoc(docRef,
            {
                title: title,
                subtitle: subtitle,
                description: editor?.getHTML()
            }).then(() => {
                navigate('/sheskalist');
        });
    } catch (e) {
        console.log(e);
    }
}