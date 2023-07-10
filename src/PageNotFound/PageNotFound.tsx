import {LoadingIndicator} from "../components/LoadingUtils/LoadingIndicator";
import React, {useEffect} from "react";
import styles from "./PageNotFound.module.scss";
import Button from "react-bootstrap/Button";
import {useNavigate} from "react-router-dom";

export function PageNotFound() {
    const navigate = useNavigate();

    const elem  : HTMLElement | null = document.querySelector("#parallax");

    return (
        <div className={styles.bg}>
            <img  id={styles["parallax"]} className={styles.backGroundImage} src={require("./PSX_20230709_193817.jpg")}/>
            <h1 className={styles.logo}>Sheska</h1>
            <div className={styles.content}>
                <div className={styles.mainContent}>
                    <div className={styles.titleContainer}>
                        <h1 className={styles.title}>Oh Crap!</h1>
                        <h2 className={styles.subtitle}>Seems you chose the scenic route.</h2>
                        <button className={styles.returnButton}
                                onClick={
                            ()=> { navigate("/dashboard")}
                        }>
                            Get back home.
                        </button>
                    </div>
                    <div className={styles.Image}>

                    </div>
                </div>
            </div>

        </div>
    );
}

export default PageNotFound;