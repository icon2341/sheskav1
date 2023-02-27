
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
import Tiptap from "../Util/Tiptap";
import { Editor } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'


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

    useEffect(() => {
        files.map((file) => {console.log("File: " + file.id, file.file.name, file.origin)})

    }, [files])

    useEffect(() => {
        if(user != null)  {
            const docRef = doc(collection(db, "users/" + auth.currentUser?.uid + "/sheska_list/"))
            setDocRef(docRef);
        }
    }, [user])

    const CustomDocument = Document.extend({
        content: 'heading block*',
    })

    // const editor = useEditor({
    //     extensions: [
    //         CustomDocument,
    //         StarterKit.configure({
    //             document: false,
    //         }),
    //         Placeholder.configure({
    //             placeholder: ({node}) => {
    //                 if (node.type.name === 'heading') {
    //                     return 'What’s the title?'
    //                 }
    //
    //                 return 'Can you add some further context?'
    //             },
    //         }),
    //     ],
    //     content: `
    //       <h1>
    //         It’ll always have a heading …
    //       </h1>
    //       <p>
    //         … if you pass a custom document. That’s the beauty of having full control over the schema.
    //       </p>
    //     `,
    //     // content: '<p>Hello. This is a WYSIWYG editor, meaning what you see is what you (and your guests) will see.</p>',
    // })

    const editor = useEditor({
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
              <h2>
                Hi there,
              </h2>
              <p>
                this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
              </p>
              <ul>
                <li>
                  That’s a bullet list with one …
                </li>
                <li>
                  … or two list items.
                </li>
              </ul>
              <p>
                Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
              </p>
              <pre><code class="language-css">body {
          display: none;
        }</code></pre>
              <p>
                I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
              </p>
              <blockquote>
                Wow, that’s amazing. Good work, boy! 👏
                <br />
                — Mom
              </blockquote>
            `,
    })

    const MenuBar = ({editor}: any) => {
        if (!editor) {
            return null
        }

        return (
            <div className={"buttonCluster"}>
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleBold()
                            .run()
                    }
                    className={editor.isActive('bold') ? 'is-active' : ''}
                >
                    bold
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleItalic()
                            .run()
                    }
                    className={editor.isActive('italic') ? 'is-active' : ''}
                >
                    italic
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleStrike()
                            .run()
                    }
                    className={editor.isActive('strike') ? 'is-active' : ''}
                >
                    strike
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleCode()
                            .run()
                    }
                    className={editor.isActive('code') ? 'is-active' : ''}
                >
                    code
                </button>
                <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
                    clear marks
                </button>
                <button onClick={() => editor.chain().focus().clearNodes().run()}>
                    clear nodes
                </button>
                <button
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={editor.isActive('paragraph') ? 'is-active' : ''}
                >
                    paragraph
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
                >
                    h1
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                >
                    h2
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
                >
                    h3
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                    className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
                >
                    h4
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                    className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
                >
                    h5
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                    className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
                >
                    h6
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'is-active' : ''}
                >
                    bullet list
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'is-active' : ''}
                >
                    ordered list
                </button>
                {/*<button*/}
                {/*    onClick={() => editor.chain().focus().toggleCodeBlock().run()}*/}
                {/*    className={editor.isActive('codeBlock') ? 'is-active' : ''}*/}
                {/*>*/}
                {/*    code block*/}
                {/*</button>*/}
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor.isActive('blockquote') ? 'is-active' : ''}
                >
                    blockquote
                </button>
                <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                    horizontal rule
                </button>
                <button onClick={() => editor.chain().focus().setHardBreak().run()}>
                    hard break
                </button>
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .undo()
                            .run()
                    }
                >
                    undo
                </button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .redo()
                            .run()
                    }
                >
                    redo
                </button>
                <button
                    onClick={() => editor.chain().focus().setColor('#958DF1').run()}
                    className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
                >
                    purple
                </button>
            </div>
        )
    }

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
                    <MenuBar editor={editor}/>
                    <EditorContent editor={editor}/>
                </div>


                <div className={"d-flex justify-content-center"}>
                    <Button variant="primary" id={"button-signup"} className={`${"d-block w-75 mx-auto text-center"} 
                                        ${styles.loginButton}`} onClick={() => {
                                            console.log("SEND BUTTON PRESSED")
                                            //TODO FIX BUG 001, FILE UPLOADING IN PROGRESS IS NOT WORKING in PROD
                                            if (fileUploadingInProgress === true) {
                                                setShowB(true);
                                                console.log("SEND BUTTON PRESSED BUT FILE UPLOADING")
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