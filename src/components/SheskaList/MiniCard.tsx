import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, getDownloadURL, listAll, ref } from "firebase/storage";
import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../index";
import styles from "./MiniCard.module.css";

export function MiniCard(props:any) {
    const [slideImages, setSlideImages] = useState([] as string[]);
    const navigate = useNavigate();

    const toEditPage = () => {
        navigate("/editcard", {state: {cardID: props.cardID,
                                                title: props.title,
                                                subtitle: props.subtitle}});
    }

    const fetchImages = useCallback(async () => {
        console.log("fetching images", props.cardID)

        const pathReference = ref(storage, '/users/'+ auth.currentUser?.uid.toString() + "/" + props.cardID + "/");
        listAll(pathReference)
            .then((res) => {
                res.items.forEach((itemRef) => {
                    // All the items under listRef.
                    getDownloadURL(itemRef).then((url) => {
                        setSlideImages((prev) => [...prev, url]);
                    })
                });
            }).catch((error) => {
            // Uh-oh, an error occurred!
        });
    }, [props.cardID]);

    const prevSlideImages : MutableRefObject<string[] | null> = useRef(null);
    useEffect(() => {
        if (slideImages === prevSlideImages.current)
            return;
        fetchImages().then(r => {
            if(slideImages.length > 0) {
                console.log("image urls", props.cardID, slideImages)
            } else {
                console.log("no image urls")
            }
            prevSlideImages.current = slideImages;
        });
   }, [fetchImages, props.cardID, slideImages]);


    if(slideImages.length > 0){
        return (
            // TODO BUG, WHEN DISPLAYING CREATE YOUR FIRST CARD, IT SHOWS A DELETE SIGN WHICH IS STUPID

            <div className= {styles.cardContainer}>
                <AiFillDelete className={styles.deleteIcon} onClick={(event) => {
                    event.stopPropagation();
                    deleteCardImages(props.cardID);
                    deleteCard(props.cardID);
                }
                }/>
                <img src={slideImages[0]} alt='Slide' className={styles.cardImage} onClick={toEditPage}/>
                <h1 className={styles.cardTitle}>{props.title}</h1>
            </div>
        )
    } else {
        return (
            <div className= {styles.noImageCard} onClick={toEditPage}>
                {props.cardID !== "createCard" && <AiFillDelete className={styles.deleteIcon} onClick={(event) => {
                    event.stopPropagation();
                    deleteCardImages(props.cardID).then(r => {deleteCard(props.cardID);})
                }
                }/>}
                <h2 className={styles.noImageCardLogo}>S</h2>
                <h1 className={styles.noImageCardHeader}>{props.title}</h1>
            </div>
        )
    }
}

export default MiniCard;

async function deleteCardImages (cardID: string) {
    const pathReference = ref(storage, '/users/'+ auth.currentUser?.uid.toString() + "/" + cardID + "/");
    listAll(pathReference)
        .then((res) => {

            // res.prefixes.forEach((folderRef) => {
            //     // All the prefixes under listRef.
            //     // You may call listAll() recursively on them.
            // });
            res.items.forEach((itemRef) => {
                // All the items under listRef.
                deleteObject(itemRef).then(() => {
                    // File deleted successfully
                    console.log("deleted")
                }).catch((error) => {
                    // Uh-oh, an error occurred!
                    console.log(error)
                })
            });
        }).catch((error) => {
        // Uh-oh, an error occurred!
    });

    deleteObject(pathReference).then(() => {
        // File deleted successfully
        console.log("deleted")
    }).catch((error) => {
        // Uh-oh, an error occurred!
        console.log(error)
    });
}

async function deleteCard(cardID: string) {
    await deleteDoc(doc(db, 'users/' + auth.currentUser?.uid.toString() + "/sheska_list", cardID)).then(
        () => {console.log("deleted card from firestore")

            window.location.reload();}
    ).catch((error) => {
        console.log(error)
    });
}