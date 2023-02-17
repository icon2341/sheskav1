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
import {BsFillPlusSquareFill} from "react-icons/bs";
import {useNavigate} from "react-router-dom";

export function SheskaList() {
    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth);
    const [listItems, setListItems] = useState([] as any);
    const [attemptedQuery, setAttemptedQuery] = useState(false);

    //TODO There's a bug sometimes where if you have already attempted to get data in the server is down or connection
    // is lost for whatever reason the application will not get your date again because attempted data is set to true
    async function getListItems(uid: string | undefined) {

        const querySnapshot = await getDocs(collection(db, "users/" + uid + "/sheska_list"));
        // console.log("users/" + uid + "/sheska_list");
        const lama = [] as DocumentData[]
        querySnapshot.forEach((doc) => {
            //TODO might just want to export the querySnapshot instead of mapping it to lama and then looping through lama to send to listItems

            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            lama.push(doc);
        });
        setListItems(lama)
        //log message console.log("inside data",doc)
        lama.forEach((doc) => {})
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
        cards = listItems.map((item: DocumentData) => {
            return (
                <div className={``}>
                    <MiniCard
                        title={item.data().title}
                        description={item.data().description}
                        cardID={item.id}
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