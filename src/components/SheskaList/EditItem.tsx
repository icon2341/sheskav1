
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db, storage} from "../../index";
import styles from "./NewItem.module.css";
import globalStyles from "../../App.module.css";
import Form from "react-bootstrap/Form";
import React, {ChangeEvent, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {doc, addDoc, collection, setDoc} from "firebase/firestore";
import {NavigateFunction, useLocation, useNavigate} from "react-router-dom";
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



/**
 * The EditItem component shows an edit page (not unlike the new item page) that allows the user to edit the data, unlike
 * the new item page, it will show the page on top of a blurred background of the sheska list.
 * Users can click off the page discarding their changes rather than going to a seperate page entirely.
 *
 **/
export function EditItem() {
    //first thing that needs to be done is to get the cards data from firestore, all of it.
    //then we need to create a form that will allow the user to edit the data.

    //verify authentication
    const [user, loading, error] = useAuthState(auth);
    const [images, setImages] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [docRef, setDocRef] = useState<DocumentReference>();
    const [title, setTitle] = React.useState(location.state.title);
    const [subtitle, setSubtitle] = React.useState(location.state.subtitle);
    const [files, setFiles] = useState<FilePondFile[]>([])

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
               
                <br>
                <br>
                Double click on any of the buttons above to apply styles to your text.
              </p>
            `,
    })

    // @ts-ignore
    return (
        <div>
            <h1>
                {location.state.cardID}
                CARDHERE
            </h1>
        </div>
    )

}

export default EditItem;