import Masonry from "@mui/lab/Masonry";
import { Box } from "@mui/material";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { deleteObject, listAll, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsFillPlusSquareFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { string } from "yup";
import { auth, db, storage } from "../../index";
import SheskaCardDef from "../Utils/SheskaCardDef";
import MiniCard from "./MiniCard";
import styles from "./SheskaList.module.css";

export function SheskaList() {
    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth);
    const [listItems, setListItems] = useState({} as { [id: string]: SheskaCardDef });
    const [attemptedQuery, setAttemptedQuery] = useState(false);

    //TODO There's a bug sometimes where if you have already attempted to get data in the server is down or connection
    // is lost for whatever reason the application will not get your date again because attempted data is set to true
    async function getListItems(uid: string | undefined) {

        const querySnapshot = await getDocs(collection(db, "users/" + uid + "/sheska_list"));
        // console.log("users/" + uid + "/sheska_list");
        const sheskaCards = {} as { [id: string]: SheskaCardDef, };
        querySnapshot.forEach((doc) => {
            //TODO might just want to export the querySnapshot instead of mapping it to lama and then looping through lama to send to listItems

            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            sheskaCards[doc.id] = new SheskaCardDef(doc.id, doc.data().title, doc.data().subtitle, doc.data().description);
        });
        setListItems(sheskaCards)
        //log message console.log("inside data",doc)
        // Object.entries(sheskaCards).forEach(([id, cardDef]) => {})
        return querySnapshot.docs;
    }
    useEffect(() => {
        if(user !== null){
            // console.log('Attempt to get cards ' + user)
            getListItems(user?.uid).then(r => {
                // console.log('list data: ' + r);
                setAttemptedQuery(true);
            });
        }

    }, [user]);

    useEffect(() => {
        if(attemptedQuery){
            // console.log('Attempted query: ' + attemptedQuery)
        }
    }, [attemptedQuery]);

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

    function removeListItem(cardID: string) {
        const { [cardID]: removedCard, ...newListItems } = listItems;
        setListItems(newListItems);
    }

    async function deleteCard(cardID: string) {
        await deleteDoc(doc(db, 'users/' + auth.currentUser?.uid.toString() + "/sheska_list", cardID))
        .then(() => {
            console.log("deleted card from firestore")

            removeListItem(cardID);

            // window.location.reload();
        })
        .catch((error : Error) => {
            console.log(error)
        });
    }

    var cards;
    if (Object.keys(listItems).length === 0 && attemptedQuery) {
        cards = [1].map((item: any) => {
            return (
                <div className={styles.initCard}>
                    {/*<MiniCard*/}
                    {/*    title={"Create your first card."}*/}
                    {/*    cardID={"createCard"}*/}
                    {/*/>*/}
                    <h2 className={styles.initCardLogo}>S</h2>
                    <h3 className={styles.initCardHeader}> Create your first card. </h3>
                    <h4 className={styles.initCardFooter}> Here is a guide.</h4>
                </div>
            )
        })
    } else if(Object.keys(listItems).length === 0) {
        cards = [1].map((item: any) => {
            return (
                <div className={`${styles.gridItem} ${styles.loadingSpinner}`}>
                    <Spinner animation="border" role="status" style={{ width: "4rem", height: "4rem"}}>
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )
        })
    } else {
        cards = Object.entries(listItems).map(([id, card]) => {
            return (
                <div key={id}>
                    <MiniCard
                        title={card.title}
                        description={card.description}
                        cardID={card.cardID}
                        subtitle={card.subtitle}
                        deleteCard={deleteCard}
                        deleteCardImages={deleteCardImages}
                    />
                </div>

            )
        });
    }

    cards.splice(1, 0, (

        <div className={`${styles.miniCardButton} ${styles.gridItem}`}  onClick={() =>{ navigate('/dashboard')}}>
            <svg className={styles.arrowButton} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={48} color={"white"}><path fill="#FFFFFF" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
            <h3 className={`${styles.miniCardButtonText}`}>Return to Home</h3>
        </div>))

    if(user){
        return(
            <Box className={styles.gridContainer}>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
                <div className={styles.pageTitleContainer}>
                    <h1 className={styles.pageTitle}> Your Sheska List </h1>
                    <BsFillPlusSquareFill size={'3em'} className={styles.addCardButton} onClick={() => {navigate('/newitem')}}/>
                </div>
                <Masonry columns={{lg: 2, xs: 1}} spacing={3} id={styles['grid']}>
                    {cards}
                </Masonry>
            </Box>
        )
    } else if(loading) {
        return (<div>
        {/*TODO LOADING SPINNER*/}
        </div>)

    } else if(error) {
        return(<div>

        </div>)

    }

    return null

}

export default SheskaList;