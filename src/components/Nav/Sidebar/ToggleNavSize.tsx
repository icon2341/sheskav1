import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight as rightCheveron} from "@fortawesome/free-solid-svg-icons";
import {faChevronLeft as leftCheveron} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import styles from "./ToggleNavSize.module.scss";

export function ToggleNavSize(props: {sidebarOpen: boolean, setSidebarOpen: any, setManuallyLocked: any, manuallyLocked: boolean}) {


    return (
        <div className={`${styles.navigationToggle} ${props.sidebarOpen ? styles.extended : ''}`} onClick={() => {props.setSidebarOpen(!props.sidebarOpen); props.setManuallyLocked(!props.manuallyLocked)}}>
            {props.sidebarOpen ?
                <FontAwesomeIcon icon={leftCheveron} className={styles.navigationToggleIcon} color={'gray'}/>
                :
                <FontAwesomeIcon icon={rightCheveron} className={styles.navigationToggleIcon} color={'gray'}/>
            }
        </div>

    )

}

export default ToggleNavSize;