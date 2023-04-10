import styles from './Panes.module.scss';
import PaneActionItem from "../PaneActionItem/PaneActionItem";
import React from "react";
import {EditButton} from "../../Utils/EditButton/EditButton";

export function ProfilePane() {
    return (
        <div className={styles.actionItemsContainer}>
            <div className={styles.actionItemContent}>
                <PaneActionItem>


                </PaneActionItem>
            </div>

        </div>
    )
}

export default ProfilePane