import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, getDownloadURL, listAll, ref } from "firebase/storage";
import { MouseEvent, MouseEventHandler, MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import { AiFillDelete as DeleteButton } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../index";
import { deleteCard, deleteCardImages, getSheskaCardImagesUrls } from "../Utils/CardUtil";
import styles from "./MiniCard.module.css";

export function MiniCard(props: any) {
    const [slideImages, setSlideImages] = useState([] as string[]);
    const navigate = useNavigate();

    const toEditPage = () => {
        navigate("/editcard", {
            state: {
                cardID: props.cardID,
                title: props.title,
                subtitle: props.subtitle
            }
        });
    }

    const fetchImages = useCallback(async () => {
        return getSheskaCardImagesUrls(props.cardID, storage, auth)
        .then((response) => {
            setSlideImages(response);
        })
        .catch((error) => console.error(error));
    }, [props.cardID]);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    const handleDeleteClick = async (event: MouseEvent) => {
        event.stopPropagation();

        deleteCardImages(props.cardID);
        deleteCard(props.cardID).then(() => {
            props.removeCard(props.cardID);
        });
    };

    if(slideImages.length > 0) {
        return (
            <div className={styles.cardContainer}>
                <DeleteButton className={styles.deleteIcon} onClick={handleDeleteClick}/>
                <img src={slideImages[0]} alt='Slide' className={styles.cardImage} onClick={toEditPage}/>
                <h1 className={styles.cardTitle}>{props.title}</h1>
            </div>
        );
    }
    return (
        <div className={styles.noImageCard} onClick={toEditPage}>
            {
                props.cardID !== "createCard" &&
                <DeleteButton className={styles.deleteIcon} onClick={handleDeleteClick}/>
            }
            <h2 className={styles.noImageCardLogo}>S</h2>
            <h1 className={styles.noImageCardHeader}>{props.title}</h1>
        </div>
    )
}

export default MiniCard;