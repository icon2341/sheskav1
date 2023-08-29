
import Masonry from '@mui/lab/Masonry';
import { Box } from "@mui/material";
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../index";
import { LoadingIndicator } from 'src/components/Utils/LoadingUtils/LoadingIndicator';
import LoadingScreen from "src/components/Utils/LoadingUtils/LoadingScreen";
import styles from './Home.module.scss';
import {checkIfUserHasPassedOnboarding} from "../../api/User/Auth/AuthUtils";
export function Home() {
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    const [partners, setPartners] = useState<string[]>([]);

    //TODO replace with new api
    async function getPartners(uid: string | undefined) {
        const docRef = doc(db, "users", uid + "" );
        await getDoc(docRef).then(doc => {
            if(doc.exists()) {
                if(doc.data().partner_full_name !== undefined) {
                    setPartners(doc.data().partner_full_name)
                } else {
                    setPartners(partners => [...partners, doc.data().name])
                }
            } else {
                console.log("No such document!");
            }
        })
    }

    useEffect(() => {
        if(user !== null){

            checkIfUserHasPassedOnboarding(navigate).then(
                () => {
                    getPartners(user?.uid).then(r => {
                    });
                }
            )
        }

    }, [user]);

    let welcomeSpace;
    // console.log("PARTNERSONE", partners)
    if(partners === undefined || partners.length === 0 || loading) {
        welcomeSpace = <LoadingIndicator />
    } else if(partners[1] === '') {
        welcomeSpace = <div className={`${styles.welcomeSpace} ${styles.gridItem}`}>
            <h1 id={styles["hello-message"]}> Welcome, {auth.currentUser?.displayName}!</h1>
            <h2 id={styles["start-here-message"]}> Start Here.</h2>
        </div>
    }  else {
        welcomeSpace = <div className={`${styles.welcomeSpace} ${styles.gridItem}`}>
            <h1 id={styles["hello-message"]}> Welcome, {auth.currentUser?.displayName}{partners[0] ? '' : '!'} {partners[0] ? `and ${partners[0]}!` : ''}</h1>
            <h2 id={styles["start-here-message"]}> Start Here.</h2>
        </div>
    }

    if (user && partners) {

        // console.log("FINAL PARTNERS", partners)
        return (
            <Box id={styles['box']}>
                <h1 id={styles["email-display"]}>{user?.email} Dashboard Pre-Alpha v0.3</h1>
                <Masonry columns={{md: 2, xs: 1}} spacing={2} id={styles.grid}>
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
                    <div className={`${styles.simpleFeatureCard} ${styles.gridItem}`} onClick={() => {navigate('/accountsettings')}}>
                        <h2>Account Settings</h2>
                        <p>Manage your profile, accounting, and aesthetics.</p>
                    </div>
                    <div className={`${styles.simpleFeatureCard} ${styles.gridItem}`} onClick={() => {navigate('/dashboard?page=snapshot')}}>
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
    } else if (!loading && (!user)) {
        navigate('/login')
    }

    return null;
}

export default Home

