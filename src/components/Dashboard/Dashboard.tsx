
import styles from './Dashboard.module.css'
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../index";
import $ from "jquery"
import Masonry from 'react-masonry-css'

export function Dashboard(){
    console.log(auth.currentUser);

    const [user, loading, error] = useAuthState(auth);
    const breakpointColumnsObj = {
        default: 2,
        1400: 1
    };


    if(user) {
        return(
            <div>
                <style> @import url('https://fonts.googleapis.com/css2?family=Pavanam&display=swap'); </style>
                <a id={styles["email-display"]}>{user?.email} Dashboard </a>
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className={styles.mymasonrygrid}
                    columnClassName={styles.mymasonrygrid_column}>
                        <div className={styles.sheskalistcard}>
                            <a className={styles.cardTitle}>Sheska List</a>
                            <a className={styles.cardSubTitle}>Create beautiful cards to showcase items your guests can donate to.  </a>
                            <img src={require("../../images/weddingVenueExample.webp")}/>
                        </div>
                        <div className={styles.eventInformationCard}>Event Information</div>
                        <div className={styles.guestListCard}>Guest List</div>
                        <div className={styles.eventPreferencesCard}>Event Preferences</div>
                </Masonry>
            </div>
        )
    } else if(loading) {
        return(
            <div>
                <a id={"email-display"}>LOADING...</a>
            </div>
        )
    } else if(error) {
        return(
            <div>
                <a id={"email-display"}>AUTH ERROR</a>
            </div>
        )
    }

    return null
}
export default Dashboard

