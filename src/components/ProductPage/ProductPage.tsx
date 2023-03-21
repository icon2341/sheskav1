import styles from './ProductPage.module.css';
import React, {useRef} from "react";
import {useNavigate} from "react-router-dom";

export function ProductPage() {
    const navigate = useNavigate();
    const laptopRef = React.createRef<HTMLDivElement>();

    return (
        <div className={styles.pageContainer}>
            <div className={styles.navigationBar}>
                <div className={styles.logoContainer}>S</div>
                <div className={styles.navLinksContainer}>
                    <h2 className={styles.navigationLink}>Coming Summer 2023</h2>
                    {/*<h2 className={styles.navigationLink}>Careers</h2>*/}
                    {/*<h2 className={styles.navigationLink}>Blog</h2>*/}
                    {/*<h2 className={styles.navigationLink}>Support</h2>*/}
                </div>
                <div className={styles.authButtons}>
                    <button className={styles.authButtonLight} onClick={() => navigate('/login')}>Log in</button>
                    <button className={styles.authButton} onClick={() => navigate('/signup')}>Sign Up</button>
                </div>
            </div>

            <section className={styles.headerSection}>
                <img src={require("../../images/GreenWall.jpeg")} className={styles.headerImage}/>
                <h1 className={styles.pageHeader}> Manage your event in every aspect. </h1>
                <div className={styles.nextButtonContainer}>
                    <div className={styles.nextButton} onClick={() => {document.getElementById('laptopSect')?.scrollIntoView()}}>Find out More.</div>
                </div>
            </section>
            <section className={styles.laptopSection} ref={laptopRef} id={"laptopSect"}>
                <h2 className={styles.sectionHeader}>An all encompassing event planner, vendor sourcer, guest manager,
                and crowdfunding tool.</h2>
                <img src={require("../../images/DashboardView.png")} className={styles.laptopImage}/>

            </section>
            <section className={styles.laptopSection} ref={laptopRef} id={"laptopSect2"}>
                <h2 className={styles.sectionHeader}>Create beautiful and dynamic Cards to showcase options that they can <u>support.</u></h2>
                <img src={require("../../images/RotatoSheskaList.png")} className={styles.laptopImage}/>
            </section>
            <section className={styles.phoneSection}>
                <div className={styles.phoneBox}>
                    <h3 className={styles.phoneHeader}>Unique sign in and auth validation for each guest.</h3>
                    <video className={styles.phoneVideo} autoPlay={true} loop={true} muted={true} src={require('../../images/LoginTogether.mov')}></video>
                </div>
                <div className={styles.phoneBox}>
                    <h3 className={styles.phoneHeader}>Guests can seamlessly support you and your event.</h3>
                    <video className={styles.phoneVideo} autoPlay={true} loop={true} muted={true} src={require('../../images/DonateTogether.mov')}></video>
                </div>
            </section>
        </div>
    );
}

export default ProductPage;