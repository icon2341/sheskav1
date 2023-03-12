
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { addDoc, collection, doc, DocumentReference, setDoc } from "firebase/firestore";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Carousel, ToastContainer } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { FilePond, registerPlugin } from 'react-filepond';
import { useAuthState } from "react-firebase-hooks/auth";
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import globalStyles from "../../App.module.css";
import { auth, db, storage } from "../../index";
import styles from "./NewItem.module.css";


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
import {deleteObject, FirebaseStorage, getDownloadURL, listAll, ref, uploadBytes} from "firebase/storage";
import Toast from "react-bootstrap/Toast";
import "./NewItemUtil.scss";
import {Swiper} from "swiper/react";
import {getSheskaCardImagesUrls} from "../Utils/CardUtil";
import {Auth} from "firebase/auth";
import {string} from "yup";
import {v4 as uuidv4} from "uuid";

// import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import {DragDropContext} from "@hello-pangea/dnd";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors, useDraggable, useDroppable,
    DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove, horizontalListSortingStrategy,
    rectSwappingStrategy,
    rectSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates, useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {CSS} from '@dnd-kit/utilities';
import zIndex from "@mui/material/styles/zIndex";
import { Box } from "grommet";


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
    const [images, setImages] = useState<{ [id: string]: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [docRef, setDocRef] = useState<DocumentReference>();
    const [title, setTitle] = React.useState(location.state.title);
    const [subtitle, setSubtitle] = React.useState(location.state.subtitle);
    const [files, setFiles] = useState<FilePondFile[]>([]);
    const [imageOrder, setImageOrder] = useState<string[]>([]);


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

    useEffect(() => {
        if(user) {
            getSheskaCardImagesUrls(location.state.cardID, storage, auth).then((urls) => {
                const imageMap: { [id: string]: string } = {};
                const imageOrderInternal: string[] = [];
                urls.forEach((url) => {
                    let id = uuidv4();
                    imageMap[id] = url;
                    imageOrderInternal.push(id);

                })
                setImages(imageMap)
                setImageOrder(imageOrderInternal);
            })

        }
    }, [user])

    useEffect(() => {
        console.log("Images: " + images);
        console.log("Image Order: " + imageOrder);
    }, [images, imageOrder])

    const [activeId, setActiveId] = useState(null);

    function handleDragStart(event: any) {
        setActiveId(event.active.id);
    }

    function handleDragEnd(event: any) {
        const {active, over} = event;
        setActiveId(null);
        if (active.id !== over.id) {

            setImageOrder((items : any) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    //TODO integrate FILEPOND or some other DnD file uploader into this
    //TODO add 'x' button to remove images from the list and from storage via Filepond API
    //TODO add fileOrderFunctionality so that the user can reorder the images and it can show up elewhere in the list
    //TODO add custom drag and drop UI
    //TODO add error message and success message UI
    //Abstract the DND image manager so that it can be used elsewhere


    if(user) {
        // @ts-ignore
        return (
            <div className={styles.pageContainer}>
                <div className={styles.formContainer}>
                    <h1 className={styles.title}>Edit Card</h1>
                    <h2 className={styles.subtitle}>Title:</h2>
                    <Form.Group className={"mb-3 w-75 mx-auto"} controlId="formBasicEmail">
                        <Form.Control type="text" placeholder={location.state.title} onChange={handleTitle}/>
                    </Form.Group>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        onDragStart={handleDragStart}
                    >
                        <Box
                            flex={true}
                            wrap={true}
                            direction="row"
                            className={styles.imageContainer}
                        >

                            <SortableContext items={imageOrder} strategy={rectSortingStrategy}>
                                {imageOrder.map(id => <SortableItem key={id} id={id} images={images} />)}
                            </SortableContext>
                        </Box>
                    </DndContext>


                </div>

            </div>
        )
    } else {
        return (
        <div>
            <h1>Not logged in</h1>
        </div>
            )
    }

}

export default EditItem;


function Draggable(props: any) {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: props.id,
    });
    const style = transform ? {
        transform: CSS.Translate.toString(transform),
    } : undefined;


}

function Droppable(props: any) {
    const {isOver, setNodeRef} = useDroppable({
        id: 'droppable',
    });
    const style = {
        color: isOver ? 'green' : undefined,
    };


    return (
        <div ref={setNodeRef} style={style}>
            {props.children}
        </div>
    );
}

function SortableItem(props: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: props.id});

    let style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: 1000,
    };

    const imageStyle = {
        width: '150px',
        height: '100px',
        borderRadius: '10px',
        margin: '10px',
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <img style={imageStyle} src={props.images[props.id]} alt={'SUGMA'} className={styles.image}/>
        </div>
    );
}

