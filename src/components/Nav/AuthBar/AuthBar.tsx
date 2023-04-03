import React from 'react';
import styles from './AuthBar.module.scss';
import {ChevronDown} from "react-feather";
import NotifNumber from "./NotifNumber";
import {LoadingIndicator} from "../../LoadingUtils/LoadingSecondaryIndicator";

export function AuthBar(props: {isOpen:boolean, username:string}) {
    return (
        <div>
            <div className={`${styles.authbarContainer} ${props.isOpen ? styles.authbarExtended : ''}`}>
                {props.username
                    ?
                    <div className={styles.authbarContent}>
                        <NotifNumber/>
                        <h3 className={`${styles.username} text-muted`}>Hi, {props.username}</h3>
                        <div className={styles.dropdownButton}>
                            <ChevronDown className={styles.chevron} color={'gray'}/>
                        </div>
                    </div>
                    :
                    <div className={styles.authbarContent}>
                        <LoadingIndicator/>
                    </div>
                }


            </div>
        </div>
    )
}

export default AuthBar;