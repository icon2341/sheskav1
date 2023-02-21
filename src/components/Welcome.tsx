import {Link, useNavigate} from "react-router-dom";
import styles from "./Welcome.module.css"
import React from "react";
//TODO add sign in functionality to event dashboard as well as sign in pages.

export function Welcome() {
    const navigate = useNavigate();

    return(
        <div>
            <div className={styles.pageContainer}>


                {/*MOBILE NAV BAR */}
                <nav>
                    <div className={styles.navbar}>
                        <div className={`${styles.container} ${styles.navContainer}`}>
                            <input className={styles.checkbox} type="checkbox" name="" id=""/>
                            <div className={styles.hamburgerLines}>
                                <span className={`${styles.line} ${styles.line1}`}></span>
                                <span className={`${styles.line} ${styles.line2}`}></span>
                                <span className={`${styles.line} ${styles.line3}`}></span>
                            </div>
                            <div className={styles.logo}>
                                <h1 className={styles.mobileLogo}>S</h1>
                            </div>
                            <div className={styles.menuItems}>
                                <li><a href="#">Product</a></li>
                                <li><a href="#">Careers</a></li>
                                <li><a href="#">Blog</a></li>
                                <li><a href="#">Support</a></li>
                                <li><div className={styles.authButtons}>
                                    <button className={styles.authButtonLight} onClick={() => navigate('/login')}>Log in</button>
                                    <button className={styles.authButton} onClick={() => navigate('/signup')}>Sign Up</button>
                                </div></li>
                            </div>
                        </div>
                    </div>
                </nav>

                {/*DESKTOP NAV BAR*/}
                <div className={styles.navigationBar}>
                    <div className={styles.logoContainer}>S</div>
                    <div className={styles.navLinksContainer}>
                        <h2 className={styles.navigationLink}>Product</h2>
                        <h2 className={styles.navigationLink}>Careers</h2>
                        <h2 className={styles.navigationLink}>Blog</h2>
                        <h2 className={styles.navigationLink}>Support</h2>
                    </div>
                    <div className={styles.authButtons}>
                        <button className={styles.authButtonLight} onClick={() => navigate('/login')}>Log in</button>
                        <button className={styles.authButton} onClick={() => navigate('/signup')}>Sign Up</button>
                    </div>
                </div>


                {/*MAIN CONTENT*/}

                <section className={styles.videoSection}>
                    <video className={styles.video} playsInline={true} autoPlay={true} loop={true} muted={true} src={require("../images/SheskaLandingVideo.mp4")}>

                    </video>
                    <h1 className={styles.mainTitle}>Sheska</h1>
                    <h2 className={styles.subMainTitle}>Memories are made together</h2>
                </section>
            </div>
        </div>
    )
}

export default Welcome