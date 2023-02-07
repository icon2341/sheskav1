import {useAuthState} from "react-firebase-hooks/auth";
import {auth, storage} from "../../index";
import {ref, listAll} from "firebase/storage"
import styles from "./MiniCard.module.css"
import React, {useEffect} from "react";

export function MiniCard(props:any) {
    let image= props.image;
    let title= props.title;
    let description = props.description;
    let cardID = props.cardID;
    let expectedAmount = props.expectedAmount;
    let actualAmount = props.actualAmount;
    let numberDonors = props.numberOfDonors;

    useEffect(() => {
        const fetchImages = async () => {

            const pathReference = ref(storage, 'users/'+ auth.currentUser?.uid.toString() + "/" + cardID +"/");
            listAll(pathReference)
                .then((res) => {
                    res.prefixes.forEach((folderRef) => {
                        // All the prefixes under listRef.
                        // You may call listAll() recursively on them.
                    });
                    res.items.forEach((itemRef) => {
                        // All the items under listRef.
                    });
                }).catch((error) => {
                // Uh-oh, an error occurred!
            });

        }
    }, []);

    var divStyle = {
        backgroundImage: 'url(' + image + ')'
    }

    return (<div className={`${styles.cardTest}`}>
        <h3 className={styles.cardTitle}>{title}</h3>
    </div>)

}

export default MiniCard;