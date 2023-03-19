
import Masonry from '@mui/lab/Masonry';
import { Box } from "@mui/material";
import { doc, getDoc } from 'firebase/firestore';
import { data } from "jquery";
import { useEffect, useState } from "react";
import Spinner from 'react-bootstrap/Spinner';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../index";
import { LoadingIndicator } from '../LoadingIndicator';
import styles from './Dashboard.module.css';
import LoadingScreen from "../LoadingScreen";

export function Dashboard() {
    // TODO CLEAN THIS UP, ADD LINKS ETC.
    //TODO FIX BUG WHERE IT DOES NOT LOAD THIS COMPONENT IF PARTNER DATA IS MISSING. ADD NULL CHECK
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    const [partners, setPartners] = useState<string[]>([]);

    async function getPartners(uid: string | undefined) {
        const docRef = doc(db, "users", uid + "" );
        console.log('getting partners')
        //docSnapShopt
        await getDoc(docRef).then(doc => {
            if(doc.exists()) {
                console.log("Document data:", doc.data());
                if(doc.data().partners !== undefined) {
                    setPartners(doc.data().partners)
                } else {
                    console.log("No partners found");
                    setPartners(partners => [...partners, doc.data().name])
                }
            } else {
                console.log("No such document!");
            }
        })
    }

    useEffect(() => {
        if(user !== null){
            console.log('Attempt to get partners ' + user)
            getPartners(user?.uid).then(r => {
                console.log('partner data: ' + r);
            });
        }

    }, [user]);

    let welcomeSpace;
    console.log("PARTNERSONE", partners)
    if(partners === undefined || partners.length === 0 || loading) {
        welcomeSpace = <LoadingIndicator />
    } else if(partners[1] === '') {
        welcomeSpace = <div className={`${styles.welcomeSpace} ${styles.gridItem}`}>
            <h1 id={styles["hello-message"]}> Welcome {partners[0] ?? 'Add Name in settings'}!</h1>
            <h2 id={styles["start-here-message"]}> Start Here.</h2>
        </div>
    }  else {
        welcomeSpace = <div className={`${styles.welcomeSpace} ${styles.gridItem}`}>
            <h1 id={styles["hello-message"]}> Welcome {partners[0] ?? 'Add Name in settings'} and {partners[1] ?? 'Ashar'}!</h1>
            <h2 id={styles["start-here-message"]}> Start Here.</h2>
        </div>
    }

    if (user && partners) {

        console.log("FINAL PARTNERS", partners)
        return (
            <Box id={styles['box']}>
                <style> @import url('https://fonts.googleapis.com/css2?family=Pavanam&display=swap');</style>
                <style> @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap');
                </style>
                <link rel="stylesheet"
                      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"/>
                <h1 id={styles["email-display"]}>{user?.email} Dashboard Pre-Alpha v0.2</h1>
                <Masonry columns={{md: 2, xs: 1}} spacing={2} id={styles['grid']}>
                    {welcomeSpace}
                    <div className={`${styles.largeFeatureCard}`}>
                        <h2>Guest List</h2>
                        <p>View and manage guests, dining, seating, and invitations.</p>

                        <img src={require("../../images/guestListImage.jpg")} id={styles["feature-card-image-guest"]}
                             alt={"invitation"}/>
                    </div>
                    <div className={`${styles.largeFeatureCard} ${styles.gridItem}`} onClick={() => {navigate('/sheskalist')}}>
                        <h2>Sheska List</h2>
                        <p>Create beautiful cards to showcase items your guests can donate to.</p>
                        <img src={require("../../images/weddingVenueExample.webp")}
                             id={styles["feature-card-image-sheska"]} alt={"Shed with venue"}/>
                    </div>
                    <div className={`${styles.smallFeatureCard} ${styles.gridItem}`}>
                        <h2>Event Information</h2>
                        <p>Create informative panels to guide your guests on your special day.</p>
                        <svg className={styles.arrow} height="48" width="48">
                            <path fill="white"
                                  d="m28.05 35.9-2.15-2.1 8.4-8.4H8v-3h26.3l-8.45-8.45 2.15-2.1L40.05 23.9Z"/>
                        </svg>
                    </div>
                    <div className={`${styles.simpleFeatureCard} ${styles.gridItem}`}>
                        <h2>Event Preferences</h2>
                        <p>Set up your event preferences and customize your event.</p>
                    </div>
                    <div className={`${styles.simpleFeatureCard} ${styles.gridItem}`}>
                        <h2>User Profile</h2>
                        <p>Mange your profile, accounting, and aesthetics.</p>
                    </div>
                    <div className={`${styles.simpleFeatureCard} ${styles.gridItem}`}>
                        <h2>Dashboard</h2>
                        <p>View your event analytics and manage your event.</p>
                    </div>
                </Masonry>


            </Box>
        )
    } else if (loading) {
        return (
            <LoadingScreen/>
        )
    } else if (error) {
        return (
            <div>
                <h1 id={"email-display"}>AUTH ERROR</h1>
            </div>
        )
    }

    return null
}

export default Dashboard

