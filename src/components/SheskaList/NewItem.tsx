
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { addDoc, collection, doc, DocumentReference, setDoc } from "firebase/firestore";
import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import { Carousel, ToastContainer } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { FilePond, registerPlugin } from 'react-filepond';
import { useAuthState } from "react-firebase-hooks/auth";
import { NavigateFunction, useNavigate } from "react-router-dom";
import globalStyles from "../../App.module.css";
import { auth, db, storage } from "../../index";
import TipTapMenuBar from "./EditorUtil";
import styles from "./NewItem.module.css";
import "./SwitchSection/bootstrapSwitch.css";

//TODO - update sheskaCardDef to include new features
//TODO - update sheskaCardpreview to include new features
//TODO this includes updating the object to include said features.


// Import FilePond styles
import { Extension } from '@tiptap/core';
import { Color } from "@tiptap/extension-color";
import ListItem from '@tiptap/extension-list-item';
import { Placeholder } from "@tiptap/extension-placeholder";
import TextStyle from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FilePondFile } from "filepond";
import 'filepond/dist/filepond.min.css';
import { deleteObject, ref, uploadBytes } from "firebase/storage";
import Toast from "react-bootstrap/Toast";
import "./NewItemUtil.scss";
import {Formik, useFormikContext, validateYupSchema, yupToFormErrors} from "formik";
import ImageOrganizer from "./ImageManager/ImageOrganizer";
import {v4 as uuidv4} from "uuid";
import * as Yup from "yup";
import {trackPromise, usePromiseTracker} from "react-promise-tracker";
import SheskaCardGuestView from "../GuestView/SheskaCardGuestView/SheskaCardGuestView";
import SheskaCard from "../Utils/SheskaCardDef";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import imageManagerStyles from "./ImageManager/ImageManager.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import CurrencyInput from "react-currency-input-field";
import {bool} from "yup";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType)

const area = 'newCard';
export function NewItem() {
    const [user, loading, error] = useAuthState(auth);
    const [imagesToBeDeleted, setImagesToBeDeleted] = useState<string[]>([]);
    const [filePondLoading, setFilePondLoading] = useState<boolean>(true);
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);
    const [documentInitialized, setDocumentInitialized] = useState<boolean>(false);
    const [imageOrder, setImageOrder] = useState<string[]>([]);
    const [images, setImages] = useState<{ [id: string]: string }>({});
    const [docRef, setDocRef] = useState<DocumentReference>();
    const navigate: NavigateFunction = useNavigate();
    const [files, setFiles] = useState<FilePondFile[]>([]);
    const [filePondFileMapping, setFilePondFileMapping] = useState<{ [id: string]: string }>({});
    const [dataUploaded, setDataUploaded] = useState<boolean>(false);
    const { promiseInProgress } = usePromiseTracker({ area, delay: 0 });
    let filePondRef :FilePond | null;
    const [previewCard, setPreviewCard] = useState<boolean>(false);


    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required').max(50, 'Must be 50 characters or less'),
        subtitle: Yup.string().required('Subtitle is required').max(100, 'Must be 300 characters or less'),
        goal: Yup.number().typeError('Goal must be a number'),
        expectedAmount: Yup.number().test(
            'Expected amount must be less than goal',
            'Expected amount must be less than goal',
            (value, context) => {
                console.log('running test', context.parent.goal, context.parent.expectedAmount);
                if(context.parent.goal && context.parent.expectedAmount){
                    return context.parent.expectedAmount < context.parent.goal;
                }
                return true;
            },
        ),
    });

    useEffect(() => {
        if (user) {
            // title: "",
            //                 subtitle: "",
            //                 images: [],
            //                 imageOrder: [],
            //                 dateCreated: new Date().toString(),
            //                 dateUpdated: new Date().toString(),

            const docRef = doc(collection(db, "users", user.uid, "sheska_list"));
            setDocRef(docRef);
            setDocumentInitialized(true);
        }
    }, [user]);

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
                    newFilePondFileMapping[file.filename] = file.id;

                    if(images){
                        if(!(file.filename in images)) {
                            newImages[file.filename] = URL.createObjectURL(file.file);
                            newImageOrder.push(file.filename);
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

    const uploadFiles = (values: any, { setErrors } : any) => {
        setSubmitDisabled(true);

        filePondRef?.processFiles();
        ;
        trackPromise(postNewSheskaCard(values, docRef, imageOrder, editor).then(() => {setDataUploaded(true)}));
    }

    return (
        <div className={styles.pageContainer} id={'pageContainerNewItem'}>


            <div className={styles.formContainer}>
                <h1 className={styles.title}>Create a Card</h1>

                <Formik
                    validate={
                        (values: any) => {
                            try {
                                validateYupSchema(values, validationSchema, true);
                            } catch (err) {
                                return yupToFormErrors(err);
                            }
                        }

                    }
                    initialValues={{
                        title: '',
                        subtitle: '',
                        goal: '',
                        expectedAmount: '',
                        GuestsAbsorbFees: false}}
                    onSubmit={uploadFiles}
                >
                    {({
                          handleSubmit,
                          handleChange,
                          values,
                          touched,
                          isValid,
                          errors,
                          dirty,
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
                            </Form.Group>

                            <Form.Group controlId={'subtitleForm'} className={"mb-3 w-75 mx-auto"}>
                                <label className={styles.sectionHeader} >Subtitle</label>
                                <p className={` ${styles.sectionSubheader} ${'text-muted'}`}>Add your subtitle, short but descriptive. (required)</p>

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

                            <div className={styles.cardEventSettingsContainer}>
                                <div className={styles.cardFinancials}>
                                    <h3 className={styles.sectionHeader}>Financials</h3>
                                    <label className={`${styles.sectionHeader} ${styles.financialHeader}`} >Goal</label>
                                    <p className={` ${styles.sectionSubheader} ${'text-muted'}`}>Specify your goal. Leave blank if you don't require a limit. ($USD)</p>
                                    <Form.Group>
                                        <CurrencyInput
                                            prefix={'$'}
                                            id="goal"
                                            name="goal"
                                            placeholder="∞"
                                            decimalsLimit={2}
                                            onValueChange={(value, name) => handleChange({target: {name: 'goal', value: value}})}
                                            className={"form-control w-75"}
                                        />
                                    </Form.Group>
                                    <label className={`${styles.sectionHeader} ${styles.financialHeader}`} >Expected Amount</label>
                                    <p className={` ${styles.sectionSubheader} ${'text-muted'}`}>Specify the average donation you expect. Should be less than goal. (optional) ($USD)</p>
                                    <Form.Group>
                                        <CurrencyInput
                                            prefix={'$'}
                                            id="expectedAmount"
                                            name="expectedAmount"
                                            placeholder="0.00"
                                            decimalsLimit={2}
                                            onValueChange={(value, name) => handleChange({target: {name: 'expectedAmount', value: value}})}
                                            className={"form-control w-75"}
                                        />
                                        <div className={"invalid-feedback d-block"}>{errors.expectedAmount}</div>
                                    </Form.Group>
                                    <label className={`${styles.sectionHeader} ${styles.financialHeader}`} >Linked Account</label>
                                    <p className={` ${styles.sectionSubheader} ${'text-muted'}`}>Specify which of your added accounts this card should funnel into. (placeholder)</p>
                                    <img src={require('../../images/Screenshot_20230304_094522.png')}/>
                                </div>
                                <div className={styles.cardEventSettings}>
                                    <h3 className={styles.sectionHeader}>Event Settings</h3>
                                    <div className={styles.itemSetting}>
                                        <div className={styles.itemSettingName}>
                                            <div className={styles.settingName}>{'Guests absorb fees'}</div>
                                            <div className={styles.settingSubtitle}>{'Service Fees total to roughly 7%' +
                                                ' including transaction fees by banks that are not in control of Sheska.' +
                                                'Guests can absorb this 7% frictionlessly.'}</div>
                                            <Form.Check defaultChecked={false} className={"form-switch-lg"} type="switch" id={'GuestsAbsorbFees'} onChange={handleChange}/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.submitButtonContainer}>
                                <Button type={'submit'}  disabled={promiseInProgress || submitDisabled || !isValid || !dirty} variant="primary" id={"button-signup"} className={`${"d-block w-75 text-center"}
                                        ${styles.loginButton}`}> Submit</Button>
                                <Button type={'button'}  disabled={promiseInProgress || submitDisabled || !isValid || !dirty} variant="secondary" id={"button-preview"} className={`${"d-block w-25 text-center"}
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
 * @param goal goal amount for card, can be empty string will be converted to 0
 * @param expected expected amount for card, can be empty string will be converted to 0
 * @param docRef reference to the document being updated in firestore, this is passed in rather then generated
 * at call time because the document reference needs to be created at the parent level because the same ref should be
 * used in firestore and google cloud.
 * @param imageOrder order of images as they appear in the card
 * @param editor editor instance with user description code
 */
async function postNewSheskaCard(values: {title: string, subtitle: string, goal: string, expectedAmount: string, GuestsAbsorbFees: boolean}, docRef: any, imageOrder: string[],editor: Editor | null) {
    console.log(values)
    try {
        let processedGoal = ['0','0'];
        if(values.goal !== ''){
            if(values.goal.includes('.')){
                processedGoal = values.goal.split('.')
            } else {
                processedGoal = [values.goal, '0']
            }
        } else {
            processedGoal = ['0','0']
        }
        let expectedAmount = ['0','0'];
        if(values.expectedAmount !== ''){
            if (values.expectedAmount.includes('.')){
                expectedAmount = values.expectedAmount.split('.')
            } else {
                expectedAmount = [values.expectedAmount, '0']
            }
        } else {
            expectedAmount = ['0','0']
        }

        await setDoc(docRef,
            {
                title: values.title,
                subtitle: values.subtitle,
                description: editor?.getHTML(),
                imageOrder: imageOrder,
                goal: processedGoal,
                expected: expectedAmount,
                guestsAbsorbFees: values.GuestsAbsorbFees,
                dateCreated: new Date().toString(),
                dateUpdated: new Date().toString(),
            }).then(() => {
                return new Promise((resolve) => {
                    resolve("success");
                });
        })
    } catch (e) {
        console.log(e);
        return new Promise((resolve, reject) => {
            reject("failure: " + e);
        });
    }
}