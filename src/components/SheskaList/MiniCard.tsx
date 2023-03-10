import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, getDownloadURL, listAll, ref } from "firebase/storage";
import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../index";
import { getSheskaCardImagesUrls } from "../Utils/CardUtil";
import styles from "./MiniCard.module.css";

export function MiniCard(props: any) {
    const [slideImages, setSlideImages] = useState([] as string[]);
    const navigate = useNavigate();

    const toEditPage = () => {
        navigate("/editcard", {state: { cardID: props.cardID,
            title: props.title,
            subtitle: props.subtitle
        }});
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

   console.log('render');
    if(slideImages.length > 0){
        return (
            // TODO BUG, WHEN DISPLAYING CREATE YOUR FIRST CARD, IT SHOWS A DELETE SIGN WHICH IS STUPID

            <div className= {styles.cardContainer}>
                <AiFillDelete className={styles.deleteIcon} onClick={(event) => {
                    event.stopPropagation();
                    props.deleteCardImages(props.cardID);
                    props.deleteCard(props.cardID);
                }}/>
                <img src={slideImages[0]} alt='Slide' className={styles.cardImage} onClick={toEditPage}/>
                <h1 className={styles.cardTitle}>{props.title}</h1>
            </div>
        )
    } else {
        return (
            <div className= {styles.noImageCard} onClick={toEditPage}>
                {props.cardID !== "createCard" && <AiFillDelete className={styles.deleteIcon} onClick={(event) => {
                    event.stopPropagation();
                    props.deleteCardImages(props.cardID).then(() => {
                        props.deleteCard(props.cardID);
                    });
                }
                }/>}
                <h2 className={styles.noImageCardLogo}>S</h2>
                <h1 className={styles.noImageCardHeader}>{props.title}</h1>
            </div>
        )
    }
}

export default MiniCard;