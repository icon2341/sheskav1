import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../index";
import React, {useEffect, useState} from "react";
import styles from "./SheskaList.module.css"
import MiniCard from "./MiniCard";
import Masonry from "@mui/lab/Masonry";
export function SheskaList() {
    const [user, loading, error] = useAuthState(auth);
    const [listItems, setListItems] = useState([]);
    async function getListItems(uid: string | undefined) {
        //first get the firebase items
    }
    useEffect(() => {
        console.log('attempting get partners with user: ' + user?.uid)
        getListItems(user?.uid).then(r => console.log('list data: ' + r));

    }, [user]);

    if(user){
        return(
            <div className={styles.pageContainer}>
                <script></script>
                <div className={styles.cardContainer}>
                    <h1 className={styles.pageTitle}> Your Sheska List </h1>
                    <Masonry columns={{md: 2, xs: 1}} spacing={3} id={styles['grid']}>
                            <MiniCard
                                title={"Reception at The Savant in Italy."}
                                image={}/>
                            <MiniCard/>
                    </Masonry>
                </div>
            </div>
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