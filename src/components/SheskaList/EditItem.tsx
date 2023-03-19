
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FilePondFile } from "filepond";
import FilePondPluginFileRename from 'filepond-plugin-file-rename';
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import 'filepond/dist/filepond.min.css';
import { addDoc, collection, doc, DocumentReference, setDoc } from "firebase/firestore";
import { deleteObject, ref, uploadBytes } from "firebase/storage";
import { Formik } from "formik";
import React, {ChangeEvent, SetStateAction, useEffect, useRef, useState} from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { FilePond, registerPlugin } from "react-filepond";
import { useAuthState } from "react-firebase-hooks/auth";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";
import { auth, db, storage } from "../../index";
import { LoadingIndicator } from "../LoadingIndicator";
import { getCardDescription, getSheskaCardImagesUrls } from "../Utils/CardUtil";
import TipTapMenuBar from "./EditorUtil";
import ImageOrganizer from "./ImageManager/ImageOrganizer";
import styles from "./NewItem.module.css";
import "./NewItemUtil.scss";

registerPlugin(FilePondPluginFileRename)
const area = 'editCard';
/**
 * The EditItem component shows an edit page (not unlike the new item page) that allows the user to edit the data, unlike
 * the new item page, it will show the page on top of a blurred background of the sheska list.
 * Users can click off the page discarding their changes rather than going to a seperate page entirely.
 *
 **/
export function EditItem() {
    const [user, loading, error] = useAuthState(auth);
    const [images, setImages] = useState<{ [id: string]: string }>();
    const navigate = useNavigate();
    const location: any = useLocation();
    const [docRef, setDocRef] = useState<DocumentReference>();
    const [title, setTitle] = React.useState(location?.state?.title);
    const [files, setFiles] = useState([] as FilePondFile[]);
    const [imageOrder, setImageOrder] = useState<string[]>([]);
    let filePondRef :FilePond | null;
    const [imagesToBeDeleted, setImagesToBeDeleted] = useState<string[]>([]);
    const [filePondFileMapping, setFilePondFileMapping] = useState<{ [id: string]: string }>();
    const [filePondLoading,setFilePondLoading] = useState(true);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [dataUploaded, setDataUploaded] = useState(false);
    const [cardDescription, setCardDescription] = useState(`<!--TODO use the custom documents system to make this into a placeholder text rather than REAL text like it is rn-->
              <h2>
                Hi there,
              </h2>
              <p>
                This is a WYSIWYG editor, meaning what you see is what you (and your guests) will get. Use this as your canvas
                to describe this item to your hearts content! You can add images, links videos, bullet points and beyond!
                With the power of WYSIWYG you can create a beautiful and engaging description of your item.
              </p>
              <p>Double click on any of the buttons above to apply styles to your text.</p>`
);
    const [editorInitialized, setEditorInitialized] = useState(false);
    const validationSchema = Yup.object({});

    const { promiseInProgress } = usePromiseTracker({ area, delay: 0 });

    const server = {
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
        process: (fieldName: any, file:any, metadata:any, load:any, error:any, progress:any, abort:any, transfer:any, options:any) => {
            const id = file.name;

            const fileRef = ref(storage, "users/"+ auth.currentUser?.uid + "/" + location.state.cardID + "/" +file.name);

            uploadBytes(fileRef, file).then((snapshot: any) => {
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

    }

    const editor : any | null= useEditor({
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
        content: `${cardDescription}`,
    })

    useEffect(() => {
        console.log('imagesDel', imagesToBeDeleted)
        console.log('filePondFileMapping', filePondFileMapping)

        imagesToBeDeleted.forEach((imageId: string) => {
            if(filePondRef?.getFile(filePondFileMapping![imageId]) != null){
                filePondRef?.removeFile(filePondFileMapping![imageId])
                setImagesToBeDeleted(imagesToBeDeleted.filter((id: string) => id !== imageId))
            }
            }
        )
        console.log('FILE POND REF', filePondRef)
    }, [imagesToBeDeleted, setImagesToBeDeleted])

    useEffect(() => {
        if (user) {
            const docRef = doc(collection(db, `users/${auth.currentUser?.uid}/sheska_list/`))
            setDocRef(docRef);
            getSheskaCardImagesUrls(location.state.cardID, storage, auth).then((urls) => {
                const imageMap: { [id: string]: string } = {};
                const imageOrderInternal: string[] = [];
                urls.forEach((url) => {

                    const id = ref(storage, url).name;
                    console.log(id)
                    imageMap[id] = url;
                    imageOrderInternal.push(id);

                })
                setImages(imageMap)
                setImageOrder(imageOrderInternal);
            })

            getCardDescription(location.state.cardID).then((description) => {
                setCardDescription(description);
                editor.commands.setContent(cardDescription);
                console.log('DESC FOUND USING: ', cardDescription, description);

                setEditorInitialized(true);
            }).catch((error) => {
                console.log(error);
                console.log('DESC NOT FOUND USING: ', cardDescription)
                if(editor){
                    editor.setContent(cardDescription);
                }
               setEditorInitialized(true);
            });

        }

    }, [user])

    useEffect(() => {
        if(editor ) {
            console.log('EDITOR INITIALIZED, SETTING CONTENT')
            editor.commands.setContent(cardDescription);
        }
    }, [editor, cardDescription])

    useEffect(() => {
        setImages((prevImages) => {
            console.log('FILES CHANGED, UPDATING IMAGES')
            files.forEach((file) => {
                console.log(file.file.name);

            })
            const newImages: { [id: string]: string } = {};
            const newImageOrder: string[] = [];
            const newFilePondFileMapping: { [id: string]: string } = {};

            imageOrder.forEach((id) => {
                if (prevImages) {
                    newImages[id] = prevImages[id];
                    newImageOrder.push(id);
                }
            })

            files.forEach(
                (file) => {
                    newFilePondFileMapping[file.filenameWithoutExtension] = file.id;

                    if(images){
                        if(!(file.filenameWithoutExtension in images)) {
                            newImages[file.filenameWithoutExtension] = URL.createObjectURL(file.file);
                            newImageOrder.push(file.filenameWithoutExtension);
                        }
                    }
                }
            )

            setImageOrder(newImageOrder);
            setFilePondFileMapping(newFilePondFileMapping);
            // console.log("SIZE OF FILEPOND FILE MAPPING: " + Object.keys(newFilePondFileMapping).length)
            // console.log('NEW FILE POND FILE MAPPING', newFilePondFileMapping)
            // console.log("SIZE OF IMAGES " + images?.length);
            // console.log("SIZE OF IMAGESORDER: " + imageOrder.length);
            return newImages;
        })
    }, [files])
    const uploadFiles = (values: any, { setErrors } : any) => {
        setSubmitDisabled(true);
        console.log('IMAGES THAT ARE BEING DELETED', imagesToBeDeleted)

        filePondRef?.processFiles();
        // uploadImagesOrder(imageOrder, location.state.cardID);

        imagesToBeDeleted.forEach((imageId: string) => {
            deleteImage(imageId, location.state.cardID, setImageOrder, imageOrder)
        })

        uploadCardDescription(location.state.cardID, editor.getHTML());

        const docRef = doc(db, `users/${auth.currentUser?.uid}/sheska_list/${location.state.cardID}`);
        trackPromise(setDoc(docRef, {
            description: editor.getHTML(),
            title: values.title,
            subtitle: values.subtitle,
            imageOrder,
        }, {merge: true}).then(() => {
            console.log("Document successfully updated!");
            // navigate(-1);
            setDataUploaded(true);
        }).catch((error) => {
            console.error("Error updating document: ", error);
        }), 'editItem');
    }

    useEffect(() => {
        if(dataUploaded && !filePondLoading) {
            console.log('NAVIGATING BACK', dataUploaded, filePondLoading)
            navigate(-1);
        }

        if(dataUploaded && files.length === 0) {
            console.log('NAVIGATING BACK', dataUploaded, filePondLoading, files.length)
            navigate(-1);
        }

    }, [dataUploaded, filePondLoading, files.length]);



    if (user) {
        // @ts-ignore
        return (
            <div className={styles.pageContainer}>
                <div className={styles.formContainer}>
                    <h1 className={styles.title}>Edit Card</h1>

                    <Formik
                        validationSchema={validationSchema}
                        initialValues={{
                            title: location.state.title,
                            subtitle: location.state.subtitle,}}
                        onSubmit={uploadFiles}
                    >
                        {({
                                handleSubmit,
                                handleChange,
                                values,
                                touched,
                                isValid,
                                errors,
                        }) => (
                            <Form onSubmit={(event) => {
                                event.preventDefault();
                                handleSubmit();
                            }}>
                                <Form.Group controlId={'titleForm'} className={"mb-3 w-75 mx-auto"}>
                                    <label className={styles.sectionHeader} >Title</label>
                                    <p className={` ${styles.sectionSubheader} ${'text-muted'}`}>Edit your card title. (optional) </p>
                                    <Form.Control
                                        type={"text"}
                                        name={"title"}
                                        value={values.title}
                                        onChange={(value) => {
                                            handleChange(value)
                                        }}
                                    />
                                </Form.Group>

                                <Form.Group controlId={'subtitleForm'} className={"mb-3 w-75 mx-auto"}>
                                    <label className={styles.sectionHeader} >Subtitle</label>
                                    <p className={` ${styles.sectionSubheader} ${'text-muted'}`}>Edit your subtitle, short but descriptive. (optional)</p>

                                    <Form.Control
                                        as={"textarea"}
                                        type={"text"}
                                        name={"subtitle"}
                                        value={values.subtitle}
                                        onChange={(value) => {
                                            handleChange(value)
                                        }}
                                    />
                                </Form.Group>

                                <label className={`${styles.sectionHeader} mb-3 w-100 mx-auto`}  >Manage Images</label>
                                <ImageOrganizer images={images} imageOrder={imageOrder} setImageOrder={setImageOrder} setImages={setImages} cardID={location.state.cardID}
                                                setImagesToBeDeleted={setImagesToBeDeleted} imagesToBeDeleted={imagesToBeDeleted}/>

                                <Form.Group controlId={'imageForm'} className={"mb-5 w-75 mx-auto "}>
                                    {/*s s*/}
                                    <FilePond

                                        className={styles.filePond}
                                        instantUpload={false}
                                        allowMultiple={true}
                                        server={server}
                                        onprocessfilestart={() => {setFilePondLoading(true); setSubmitDisabled(true);
                                            console.log('STARTED PROCESSING FILEs')}}
                                        onprocessfiles={() => {setFilePondLoading(false); navigate('/sheskalist'); console.log('FINISHED PROCESSING FILEs')}}

                                        onremovefile={(error: any, file: FilePondFile) => {
                                            let newFiles: FilePondFile[] = [];
                                            setImages((prevImages) => {
                                                // console.log('FILES CHANGED, UPDATING IMAGES')

                                                const newImages: { [id: string]: string } = {};
                                                const newImageOrder: string[] = [];


                                                imageOrder.forEach((id) => {
                                                    if (prevImages) {
                                                        if(id !== file.filenameWithoutExtension){

                                                            newImages[id] = prevImages[id];
                                                            newImageOrder.push(id);
                                                        }
                                                    }
                                                })

                                                setImageOrder(newImageOrder);

                                                console.log("SIZE OF IMAGES " + images?.length);
                                                console.log("SIZE OF IMAGESORDER: " + imageOrder.length);
                                                return newImages;
                                            })

                                            files.forEach((fileItem) => {
                                                if (fileItem.filenameWithoutExtension !== file.filenameWithoutExtension) {
                                                    newFiles.push(fileItem);
                                                }
                                            })

                                            setFiles(newFiles);

                                        }
                                        }

                                        onupdatefiles={(fileItems: FilePondFile[]) => {
                                            setFiles(fileItems);
                                        }}

                                        ref={ref => filePondRef = ref}
                                        fileRenameFunction={(file) => {
                                            return `${uuidv4()}${file.extension}`; }}

                                    />
                                </Form.Group>

                                <div className={styles.textEditor}>
                                    <TipTapMenuBar editor={editor}/>
                                    {(editor && (editorInitialized))? <EditorContent editor={editor} /> : <div>Loading...</div>}
                                </div>

                                <Button type={'submit'}  disabled={promiseInProgress || submitDisabled} variant="primary" id={"button-signup"} className={`${"d-block w-50 text-center"}
                                        ${styles.loginButton}`}> Submit</Button>

                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <h1>Not logged in</h1>
            </div>
        );
    }
}

// function uploadImagesOrder(imageOrder: string[], cardID: string) {
//     const docRef = doc(db, `users/${auth.currentUser?.uid}/sheska_list/${cardID}`);
//     setDoc(docRef, {
//         imageOrder
//     }, { merge: true }).then(() => {
//         console.log("Document successfully updated!");
//     }).catch((error) => {
//         console.error("Error updating document: ", error);
//     });
// }

function uploadCardDescription(cardID: string, description: string) {
    const docRef = doc(db, "users/" + auth.currentUser?.uid + "/sheska_list/" + cardID);
    setDoc(docRef, {
        description: description
    }, {merge: true}).then(() => {
        console.log("Document successfully updated!");
    }).catch((error) => {
        console.error("Error updating document: ", error);
    });
}


function deleteImage(imageID: string, cardID: string, setImageOrder: any, imageOrder: string[]) {
    const imageRef = ref(storage, "users/"+ auth.currentUser?.uid + "/" + cardID + "/" + imageID)
    deleteObject(imageRef).then(() => {
        console.log("Deleted image");
        setImageOrder(imageOrder.filter((id) => id !== imageID));
    }).catch((error: Error) => {
        console.error(error);
    });
}

export default EditItem;

