import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
    arrayMove,
    rectSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "grommet";
import { useState } from "react";
import imageManagerStyles from "./ImageManager.module.css";

export function ImageOrganizer({setImages, images, imageOrder, setImageOrder, cardID, setImagesToBeDeleted, imagesToBeDeleted}: any) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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



    return (
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
                className={imageManagerStyles.imageContainer}
            >

                <SortableContext items={imageOrder} strategy={rectSortingStrategy}>
                    {imageOrder.map((id: any) => <SortableItem key={id} id={id} images={images} setImages={setImages}
                                                               imageOrder={imageOrder} setImageOrder={setImageOrder}
                                                               cardID={cardID} setImagesToBeDeleted={setImagesToBeDeleted}
                                                                imagesToBeDeleted={imagesToBeDeleted}/>)}
                </SortableContext>
            </Box>
        </DndContext>
    )


}

function SortableItem(props: any) {
    const [dragDisabled, setDragDisabled] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id: props.id, disabled: dragDisabled});

    let style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: 1,
    };

    return (
        <div>
            <div ref={setNodeRef} style={style}
                 className={imageManagerStyles.draggableImageContainer} {...attributes} {...listeners}>
                <img className={isDragging ? imageManagerStyles.smallImageDragged : imageManagerStyles.smallImage}
                     src={props.images[props.id]} alt={props.id}/>
                <FontAwesomeIcon icon={faXmark} className={imageManagerStyles.imageDeleteIcon}
                                 onMouseOver={() => {
                                     setDragDisabled(true);}
                                 }
                                 onMouseOut={() => {
                                     setDragDisabled(false);}}
                                 onClick={() => {
                                     props.setImagesToBeDeleted((imagesToBeDeleted: any) => {
                                            imagesToBeDeleted.push(props.id);
                                            return imagesToBeDeleted;
                                     })
                                     props.setImagesToBeDeleted((imagesToBeDeleted: any) => {
                                         let newImagesToBeDeleted: string[] = []
                                            imagesToBeDeleted.forEach((imageID: string) => {
                                                newImagesToBeDeleted.push(imageID);
                                            })
                                            imagesToBeDeleted.push(props.id)
                                         return newImagesToBeDeleted;
                                     })


                                     console.log("Deleting image: " + props.id)
                                     props.setImages((images: any) => {
                                         delete images[props.id];
                                         return images;
                                     });

                                     props.setImageOrder((imageOrder: string[]) => {
                                         let newImageOrder: string[] = []
                                         imageOrder.forEach((imageOrderID) => {
                                                if(imageOrderID !== props.id) {
                                                    newImageOrder.push(imageOrderID);
                                                }
                                            })

                                         return newImageOrder;
                                     })


                                 }}/>
            </div>
        </div>


    );
}



export default ImageOrganizer;