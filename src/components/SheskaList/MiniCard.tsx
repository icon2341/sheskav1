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

    const fetchImages = async () => {
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
                        imageURLs.push(url);
                        console.log(cardID, imageURLs)
                    })
                });
            }).then(() => {
            setSlideImages(imageURLs);
            console.log("images", slideImages)
        }).catch((error) => {
            // Uh-oh, an error occurred!
        });

    }

    useEffect(() => {
        var lemon = fetchImages();
    }, []);

    const outputImage;
    outputImage = useEffect(() => {
        if(slideImages.length > 0) {
            console.log("images", slideImages)
            return (<img src={slideImages[1]}  className={styles.cardImage}/>))
        }
    }, [slideImages]);

    return (
        <img src={slideImages[1]}  className={styles.cardImage}/>)

}

export default MiniCard;