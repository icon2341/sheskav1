import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, getDownloadURL, listAll, ref } from "firebase/storage";
import { MouseEvent, MouseEventHandler, MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import { AiFillDelete as DeleteButton } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../index";
import { deleteCard, deleteCardImages, getSheskaCardImagesUrls } from "../Utils/CardUtil";
import miniCardStyles from "./MiniCard.module.css";
import sheskaListStyles from "./SheskaList.module.css";

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

        await deleteCardImages(props.cardID);
        deleteCard(props.cardID).then(() => {
            props.removeCard(props.cardID);
        });
    };

    if(slideImages.length > 0) {
        return (
            <div className={miniCardStyles.cardContainer}>
                <DeleteButton className={miniCardStyles.deleteIcon} onClick={handleDeleteClick}/>
                <img src={slideImages[0]} alt='Slide' className={miniCardStyles.cardImage} onClick={toEditPage}/>
                <h1 className={miniCardStyles.cardTitle}>{props.title}</h1>
            </div>
        );
    }
    if (props.cardID === 'create-card') {
        return (
            <div className={sheskaListStyles.initCard}>
                <h2 className={sheskaListStyles.initCardLogo}>S</h2>
                <h3 className={sheskaListStyles.initCardHeader}> Create your first card. </h3>
                <h4 className={sheskaListStyles.initCardFooter}> Here is a guide.</h4>
            </div>
        );
    }
    return (
        <div className={miniCardStyles.noImageCard} onClick={toEditPage}>
            <DeleteButton className={miniCardStyles.deleteIcon} size={48} onClick={handleDeleteClick}/>
            <h2 className={miniCardStyles.noImageCardLogo}>S</h2>
            <h1 className={miniCardStyles.noImageCardHeader}>{props.title}</h1>
        </div>
    )
}

export default MiniCard;