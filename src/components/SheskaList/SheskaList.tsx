import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../index";
import React, {useEffect, useState} from "react";
import styles from "./SheskaList.module.css"
import MiniCard from "./MiniCard";
import Masonry from "@mui/lab/Masonry";
import {collection, doc, getDoc, getDocs} from "firebase/firestore";
import firebase from "firebase/app";
import {DocumentData} from "firebase/firestore";
import Spinner from "react-bootstrap/Spinner";
import {Box, Skeleton} from "@mui/material";

export function SheskaList() {
    const [user, loading, error] = useAuthState(auth);
    const [listItems, setListItems] = useState([] as any);
    const [attemptedQuery, setAttemptedQuery] = useState(false);
    async function getListItems(uid: string | undefined) {

        const querySnapshot = await getDocs(collection(db, "users/" + uid + "/sheska_list"));
        console.log("users/" + uid + "/sheska_list");
        const lama = [] as DocumentData[]
        querySnapshot.forEach((doc) => {

            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            lama.push(doc.data());
        });
        setListItems(lama)
        lama.forEach((doc) => {console.log("inside data",doc)})
        return querySnapshot.docs;
    }
    useEffect(() => {
        if(user !== null){
            console.log('Attempt to get cards ' + user)
            getListItems(user?.uid).then(r => {
                console.log('list data: ' + r);
                setAttemptedQuery(true);
            });
        }

    }, [user]);

    useEffect(() => {
        if(attemptedQuery){
            console.log('Attempted query: ' + attemptedQuery)
        }
    }, [attemptedQuery]);

    var cards;
    if (listItems.length === 0 && attemptedQuery) {
        cards = [1].map((item: any) => {
            return (
                <div className={``}>
                    <MiniCard
                        title={"Create your first card."}
                    />
                </div>
            )
        })
    } else if(listItems.length === 0) {
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
        cards = listItems.map((item: any) => {
            return (
                <div className={``}>
                    <MiniCard
                        title={item.title}
                        description={item.description}
                        image={item.image}
                        link={item.link}
                    />
                </div>
            )
        })
    }

    if(user){
        return(
            <Box className={styles.gridContainer}>
                <div className={styles.pageTitleContainer}>
                    <h1 className={styles.pageTitle}> Your Sheska List </h1>
                </div>
                <Masonry columns={{md: 2, xs: 1}} spacing={3} id={styles['grid']}>
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