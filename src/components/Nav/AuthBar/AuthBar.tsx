import React from 'react';
import styles from './AuthBar.module.scss';
import {ChevronDown} from "react-feather";
import NotifNumber from "./NotifNumber";

export function AuthBar(props: {isOpen:boolean, username:string}) {
    return (
        <div>
            <div className={`${styles.authbarContainer} ${props.isOpen ? styles.authbarExtended : ''}`}>
                <div className={styles.authbarContent}>
                    <NotifNumber/>
                    <h3 className={`${styles.username} text-muted`}>Hi, {props.username}</h3>
                    <div className={styles.dropdownButton}>
                        <ChevronDown className={styles.chevron} color={'gray'}/>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AuthBar;