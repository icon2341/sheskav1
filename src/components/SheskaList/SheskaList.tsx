import Masonry from "@mui/lab/Masonry";
import { Box } from "@mui/material";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { deleteObject, listAll, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsFillPlusSquareFill as AddButton } from "react-icons/bs";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { useNavigate } from "react-router-dom";
import { string } from "yup";
import { auth, db, storage } from "../../index";
import { LoadingIndicator } from "../LoadingIndicator";
import SheskaCardDef from "../Utils/SheskaCardDef";
import { BackButton } from "./BackButton";
import MiniCard from "./MiniCard";
import styles from "./SheskaList.module.css";

const area = "sheskaList";

export function SheskaList() {
    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth);
    const [cardDefs, setCardDefs] = useState({} as { [id: string]: SheskaCardDef });
    const [attemptedQuery, setAttemptedQuery] = useState(false);

    const { promiseInProgress } = usePromiseTracker({ area: area, delay: 0 });

    // TODO There's a bug sometimes where if you have already attempted to get data in the server is down or connection
    // is lost for whatever reason the application will not get your date again because attempted data is set to true
    async function getCardDefs(userID: string | undefined) {
        const querySnapshot = await getDocs(collection(db, `users/${userID}/sheska_list`));
        const sheskaCards = {} as { [cardID: string]: SheskaCardDef };
        querySnapshot.forEach((doc) => {
            // TODO might just want to export the querySnapshot instead of mapping it to lama and then looping through lama to send to listItems
            const data = doc.data();
            sheskaCards[doc.id] = new SheskaCardDef(doc.id, data.title, data.subtitle, data.description);
        });
        setCardDefs(sheskaCards)
    }

    useEffect(() => {
        if (!user)
            return;
        trackPromise(getCardDefs(user.uid), area);
    }, [user]);

    function removeCardDef(cardID: string) {
        const { [cardID]: removedCard, ...newCardDefs } = cardDefs;
        setCardDefs(newCardDefs);
    }

    const cards = [];
    if (!promiseInProgress && Object.keys(cardDefs).length === 0) {
        // Promise resolved with no data
        cards.push(
            <div key='create-card' className={styles.initCard}>
                <h2 className={styles.initCardLogo}>S</h2>
                <h3 className={styles.initCardHeader}> Create your first card. </h3>
                <h4 className={styles.initCardFooter}> Here is a guide.</h4>
            </div>
        );
        cards.push(
            <div className={`${styles.miniCardButton} ${styles.gridItem}`}  onClick={() =>{ navigate('/dashboard')}}>
                <svg className={styles.arrowButton} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={48} color={"white"}><path fill="#FFFFFF" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
                <h3 className={`${styles.miniCardButtonText}`}>Return to Home</h3>
            </div>
        );
    }
    if (promiseInProgress) {
        cards.push(
            <LoadingIndicator key='loading-spinner' />
        );
    } else {
        // Promise resolved with data
        Object.entries(cardDefs).forEach(([id, card], index) => {
            cards.push(
                <div key={id}>
                    <MiniCard
                        title={card.title}
                        description={card.description}
                        cardID={card.cardID}
                        subtitle={card.subtitle}
                        removeCard={removeCardDef}
                    />
                </div>
            );
            if (index === 0) {
                cards.push(
                    <BackButton location="/dashboard" text="Return to Home" />
                );
            }
        });
    }

    if (user) {
        return (
            <Box className={styles.gridContainer}>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
                <div className={styles.pageTitleContainer}>
                    <h1 className={styles.pageTitle}> Your Sheska List </h1>
                    <AddButton size={'3em'} className={styles.addCardButton} onClick={() => {navigate('/newitem')}} />
                </div>
                <Masonry columns={{lg: 2, xs: 1}} spacing={3} id={styles['grid']}>
                    {cards}
                </Masonry>
            </Box>
        );
    } else if (loading) {
        return (
            <LoadingIndicator />
        )
    } else if(error) {
        return(
            <div>
                {'' + error}
            </div>
        );
    }

    return null;
}

export default SheskaList;