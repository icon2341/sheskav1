import {useAuthState} from "react-firebase-hooks/auth";
import {auth, storage} from "../../index";
import {ref, listAll, getDownloadURL} from "firebase/storage"
import styles from "./MiniCard.module.css"
import React, {useEffect, useState} from "react";
import * as url from "url";

export function MiniCard(props:any) {
    let image= props.image;
    let title= props.title;
    let description = props.description;
    let cardID = props.cardID;
    let expectedAmount = props.expectedAmount;
    let actualAmount = props.actualAmount;
    let numberDonors = props.numberOfDonors;
    const [slideImages, setSlideImages] = useState([] as string[]);

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

            <div className= {styles.cardContainer}>
                <img src={slideImages[0]}  className={styles.cardImage}/>
                <h1 className={styles.cardTitle}>{title}</h1>
            </div>
        )
    } else {
        return (
            <div className= {styles.cardTest}>
                <h1 className={styles.cardTitle}>{title}</h1>
            </div>
        )
    }
}

export default MiniCard;