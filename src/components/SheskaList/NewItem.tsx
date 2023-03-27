import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Editor, Extension } from '@tiptap/core';
import { Color } from "@tiptap/extension-color";
import Document from '@tiptap/extension-document';
import ListItem from '@tiptap/extension-list-item';
import Paragraph from '@tiptap/extension-paragraph';
import { Placeholder } from "@tiptap/extension-placeholder";
import Text from '@tiptap/extension-text';
import TextStyle from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FilePondFile } from "filepond";
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import 'filepond/dist/filepond.min.css';
import { addDoc, collection, doc, DocumentReference, setDoc } from "firebase/firestore";
import { deleteObject, ref, uploadBytes } from "firebase/storage";
import { Formik } from "formik";
import React, { ChangeEvent, MutableRefObject, useEffect, useRef, useState } from "react";
import { Carousel, ToastContainer } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Toast from "react-bootstrap/Toast";
import { FilePond, registerPlugin } from 'react-filepond';
import { useAuthState } from "react-firebase-hooks/auth";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";
import globalStyles from "../../App.module.css";
import { auth, db, storage } from "../../index";
import SheskaCardGuestView from "../GuestView/SheskaCardGuestView/SheskaCardGuestView";
import SheskaCard from "../Utils/SheskaCardDef";
import TipTapMenuBar from "./EditorUtil";
import imageManagerStyles from "./ImageManager/ImageManager.module.css";
import { default as ImageOrganizer } from "./ImageManager/ImageOrganizer";
import styles from "./NewItem.module.css";
import "./NewItemUtil.scss";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType)

const area = 'newCard';
export function NewItem() {
    const [user] = useAuthState(auth);
    const [imagesToBeDeleted, setImagesToBeDeleted] = useState<string[]>([]);
    const [filePondLoading, setFilePondLoading] = useState<boolean>(true);
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);
    const [imageOrder, setImageOrder] = useState<string[]>([]);
    const [images, setImages] = useState<{ [id: string]: string }>({});
    const [docRef, setDocRef] = useState<DocumentReference>();
    const [files, setFiles] = useState<FilePondFile[]>([]);
    const [filePondFileMapping, setFilePondFileMapping] = useState<{ [id: string]: string }>({});
    const [dataUploaded, setDataUploaded] = useState<boolean>(false);
    const { promiseInProgress } = usePromiseTracker({ area, delay: 0 });
    const navigate: NavigateFunction = useNavigate();
    let filePondRef: FilePond | null = null;
    const [previewCard, setPreviewCard] = useState<boolean>(false);

    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required').max(50, 'Must be 50 characters or less'),
        subtitle: Yup.string().required('Subtitle is required').max(300, 'Must be 300 characters or less'),
    });

    useEffect(() => {
        if (!user)
            return;
        const docRef = doc(collection(db, "users", user.uid, "sheska_list"));
        setDocRef(docRef);
    }, [user]);

    const prevImagesRef: MutableRefObject<null | { [id: string]: string }> = useRef(null);
    const prevImageOrderRef: MutableRefObject<null | string[]> = useRef(null);
    useEffect(() => {
        if (prevImagesRef.current === images && prevImageOrderRef.current === imageOrder)
            return;
        setImages((prevImages) => {
            console.log('FILES CHANGED, UPDATING IMAGES')
            files.forEach((file) => {
                console.log(file.file.name);
            })
            const newImages: { [id: string]: string } = {};
            const newImageOrder: string[] = [];
            const newFilePondFileMapping: { [id: string]: string } = {};

            if (prevImages) {
                imageOrder.forEach((id) => {
                    newImages[id] = prevImages[id];
                    newImageOrder.push(id);
                });
            }

            files.forEach((file) => {
                newFilePondFileMapping[file.filename] = file.id;

                if (images && !(file.filename in images)) {
                    newImages[file.filename] = URL.createObjectURL(file.file);
                    newImageOrder.push(file.filename);
                }
            })

            setImageOrder(newImageOrder);
            setFilePondFileMapping(newFilePondFileMapping);
            prevImagesRef.current = newImages;
            prevImageOrderRef.current = newImageOrder;
            return newImages;
        });
    }, [files, imageOrder, images])

    useEffect(() => {
        if (!dataUploaded)
            return;

        if(!filePondLoading || files.length === 0) {
            console.log('NAVIGATING BACK', dataUploaded, filePondLoading, files.length)
            navigate(-1);
        }

    }, [dataUploaded, filePondLoading, files, navigate]);

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
                to describe this item to your heart's content! You can add images, links, videos, bullet points, and beyond!
                With the power of WYSIWYG, you can create a beautiful and engaging description of your item.
              </p>
              <p>Double-click on any of the buttons above to apply styles to your text.</p>
            `,
    })

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

            const fileRef = ref(storage, "users/"+ auth.currentUser?.uid + "/" + docRef?.id + "/" +file.name);

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
    useEffect(() => {
        console.log('imagesDel', imagesToBeDeleted);
        console.log('filePondFileMapping', filePondFileMapping);

        imagesToBeDeleted.forEach((imageId: string) => {
            if(filePondRef?.getFile(filePondFileMapping[imageId]) != null) {
                filePondRef?.removeFile(filePondFileMapping[imageId])
                setImagesToBeDeleted(imagesToBeDeleted.filter((id: string) => id !== imageId));
            }
        });
        console.log('FILE POND REF', filePondRef);
    }, [imagesToBeDeleted, setImagesToBeDeleted, filePondFileMapping, filePondRef])

    const uploadFiles = (values: any, { setErrors } : any) => {
        setSubmitDisabled(true);

        filePondRef?.processFiles();
        trackPromise(
            postNewSheskaCard(values.title, values.subtitle, docRef, imageOrder, editor)
            .then(() => setDataUploaded(true))
        );
    };

    return (
        <div className={styles.pageContainer} id={'pageContainerNewItem'}>


            <div className={styles.formContainer}>
                <h1 className={styles.title}>Create a Card</h1>

                <Formik
                    validationSchema={validationSchema}
                    initialValues={{
                        title: '',
                        subtitle: '',}}
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

                            {previewCard && <div className={styles.previewCardContainer}>
                                <FontAwesomeIcon icon={faXmark} className={styles.previewCloseIcon} onClick={() => {setPreviewCard(false); console.log('setPreviewFalse')}}/>
                                <SheskaCardGuestView sheskaCardDef={new SheskaCard(docRef?.id.toString() || "",
                                    values.title, values.subtitle, editor.getHTML(), imageOrder)} cardImages={images}/>
                            </div>}

                            <Form.Group controlId={'titleForm'} className={"mb-3 w-75 mx-auto"}>
                                <label className={styles.sectionHeader} >Title</label>
                                <p className={` ${styles.sectionSubheader} ${'text-muted'}`}>Add your card title. (required) </p>
                                <Form.Control
                                    type={"text"}
                                    name={"title"}
                                    value={values.title}
                                    placeholder={"Title"}
                                    onChange={(value) => {
                                        handleChange(value)
                                    }}
                                    isValid={touched.title && !errors.title}
                                    isInvalid={!!errors.title}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.title}
                                </Form.Control.Feedback>
                                <Form.Control.Feedback>
                                    {errors.title}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId={'subtitleForm'} className={"mb-3 w-75 mx-auto"}>
                                <label className={styles.sectionHeader} >Subtitle</label>
                                <p className={` ${styles.sectionSubheader} text-muted`}>Add your subtitle, short but descriptive. (required)</p>

                                <Form.Control
                                    as={"textarea"}
                                    type={"text"}
                                    name={"subtitle"}
                                    value={values.subtitle}
                                    onChange={(value) => {
                                        handleChange(value)
                                    }}
                                    placeholder={"Subtitle"}
                                    isValid={touched.subtitle && !errors.subtitle}
                                    isInvalid={!!errors.subtitle}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.subtitle}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <label className={`${styles.sectionHeader} mb-3 w-100 mx-auto`}  >Manage Images</label>
                            <ImageOrganizer images={images} imageOrder={imageOrder} setImageOrder={setImageOrder} setImages={setImages} cardID={docRef?.id}
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
                                {(editor)? <EditorContent editor={editor} /> : <div>Loading...</div>}
                            </div>

                            <div className={styles.submitButtonContainer}>
                                <Button type={'submit'}  disabled={promiseInProgress || submitDisabled} variant="primary" id={"button-signup"} className={`${"d-block w-75 text-center"}
                                        ${styles.loginButton}`}> Submit</Button>
                                <Button type={'button'}  disabled={promiseInProgress || submitDisabled} variant="secondary" id={"button-preview"} className={`${"d-block w-25 text-center"}
                                        ${styles.loginButton}`} onClick={() => {setPreviewCard(true); console.log('setpreviewtrue')}}> Preview</Button>
                            </div>

                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default NewItem;

/**
 *
 * @param title the card's title
 * @param subtitle the subtitle data for card
 * @param docRef reference to the document being updated in firestore, this is passed in rather then generated
 * at call time because the document reference needs to be created at the parent level because the same ref should be
 * used in firestore and google cloud.
 * @param imageOrder order of images as they appear in the card
 * @param editor editor instance with user description code
 */
async function postNewSheskaCard(title: string, subtitle: string, docRef: any, imageOrder: string[], editor: Editor | null) {
    try {
        const currentISOTimestamp = new Date().toISOString();
        await setDoc(docRef,
            {
                title,
                subtitle,
                description: editor?.getHTML(),
                imageOrder,
                dateCreated: currentISOTimestamp,
                dateUpdated: currentISOTimestamp,
            }
        );
        return 'Success';
    } catch (e) {
        console.error(e);
        throw new Error(`Failed to create new card: ${e}`);
    }
}