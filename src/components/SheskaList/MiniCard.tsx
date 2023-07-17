import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, getDownloadURL, listAll, ref } from "firebase/storage";
import { MouseEvent, MouseEventHandler, MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { AiFillDelete as DeleteIcon } from "react-icons/ai";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../index";
import { deleteCard, deleteCardImages, getSheskaCardImagesUrls } from "../Utils/CardUtil";
import miniCardStyles from "./MiniCard.module.css";
import sheskaListStyles from "./SheskaList.module.scss";
import {toast} from "react-hot-toast";

const area = 'miniCard';
export function MiniCard(props: any) {
    const [slideImages, setSlideImages] = useState([] as string[]);
    const navigate = useNavigate();
    const { promiseInProgress } = usePromiseTracker({ area, delay: 0 })
    const toEditPage = () => {
        if (promiseInProgress)
            return;
        navigate("/editcard", {
            state: {
                cardID: props.cardID,
                title: props.title,
                subtitle: props.subtitle,
                goal: props.goal ? props.goal : [0,0],
                expectedAverage: props.expectedAverage ? props.expectedAverage : [0,0],
                guestsAbsorbFees: props.guestsAbsorbFees
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
        trackPromise(deleteCard(props.cardID).then(() => {
            props.removeCard(props.cardID);
        }), area);
    };

    const deleteButton = (
        <button style={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }} onClick={(e)=> {handleDeleteClick(e); toast.success('Card Deleted')}} disabled={promiseInProgress} >
            <DeleteIcon className={miniCardStyles.deleteIcon} size={48} />
        </button>
    )

    if(slideImages.length > 0) {
        return (
            <div className={miniCardStyles.cardContainer}>
                {deleteButton}
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
            {deleteButton}
            <h2 className={miniCardStyles.noImageCardLogo}>S</h2>
            <h1 className={miniCardStyles.noImageCardHeader}>{props.title}</h1>
        </div>
    )
}

export default MiniCard;