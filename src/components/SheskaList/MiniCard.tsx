import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db, storage} from "../../index";
import {ref, listAll, getDownloadURL, deleteObject} from "firebase/storage"
import {collection, deleteDoc, doc, DocumentData, getDocs} from "firebase/firestore";
import styles from "./MiniCard.module.css"
import React, {useEffect, useState} from "react";
import {AiFillDelete} from "react-icons/ai";
import * as url from "url";
import {useNavigate} from "react-router-dom";

export function MiniCard(props:any) {
    let image= props.image;
    let title= props.title;
    let description = props.description;
    let cardID = props.cardID;
    let expectedAmount = props.expectedAmount;
    let actualAmount = props.actualAmount;
    let numberDonors = props.numberOfDonors;
    let subtitle = props.subtitle;
    const [slideImages, setSlideImages] = useState([] as string[]);
    const navigate = useNavigate();

    const toEditPage = () => {
        navigate("/editcard", {state: {cardID: cardID,
                                                title: title,
                                                subtitle: subtitle}});
    }

    async function fetchImages() {
        console.log("fetching images", cardID)

        const pathReference = ref(storage, '/users/'+ auth.currentUser?.uid.toString() + "/" + cardID + "/");
        const imageURLs = [] as string[];
        listAll(pathReference)
            .then((res) => {

                // res.prefixes.forEach((folderRef) => {
                //     // All the prefixes under listRef.
                //     // You may call listAll() recursively on them.
                // });
                res.items.forEach((itemRef) => {
                    // All the items under listRef.
                    getDownloadURL(itemRef).then((url) => {
                        setSlideImages((prev) => [...prev, url]);
                    })
                });
            }).catch((error) => {
            // Uh-oh, an error occurred!
        });

    }

     useEffect(() => {
        fetchImages().then(r => {
            if(slideImages.length > 0) {
                console.log("image urls", cardID, slideImages)
            } else {
                console.log("no image urls")
            }
        });
    }, []);


    if(slideImages.length > 0){
        return (
            //TODOD BUG, WHEN DISPLAYING CREATE YOUR FIRST CARD, IT SHOWS A DELETE SIGN WHICH IS STUPID

            <div className= {styles.cardContainer}>
                <AiFillDelete className={styles.deleteIcon} onClick={() => {
                    deleteCardImages(cardID);
                    deleteCard(cardID);
                }
                }/>
                <img src={slideImages[0]}  className={styles.cardImage} onClick={toEditPage}/>
                <h1 className={styles.cardTitle}>{title}</h1>
            </div>
        )
    } else {
        return (
            <div className= {styles.noImageCard} onClick={toEditPage}>
                {cardID !== "createCard" && <AiFillDelete className={styles.deleteIcon} onClick={() => {
                    deleteCardImages(cardID).then(r => {deleteCard(cardID);})
                }
                }/>}
                <h2 className={styles.noImageCardLogo}>S</h2>
                <h1 className={styles.noImageCardHeader}>{title}</h1>
            </div>
        )
    }
}

export default MiniCard;

async function deleteCardImages (cardID: string) {

    const pathReference = ref(storage, '/users/'+ auth.currentUser?.uid.toString() + "/" + cardID + "/");
    const imageURLs = [] as string[];
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
    })



}

async function deleteCard(cardID: string) {
    await deleteDoc(doc(db, 'users/' + auth.currentUser?.uid.toString() + "/sheska_list", cardID)).then(
        () => {console.log("deleted card from firestore")

            window.location.reload();}
    ).catch((error) => {
        console.log(error)
    });
}