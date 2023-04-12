import styles from './Panes.module.scss';
import PaneActionItem from "../PaneActionItem/PaneActionItem";
import React from "react";
import {EditButton} from "../../Utils/EditButton/EditButton";
import UserProfileItem from "./UserProfileItem/UserProfileItem";

export function ProfilePane() {
    return (
        <div className={styles.actionItemsContainer}>
            <div className={styles.actionItemContent}>
                <PaneActionItem>
                    <UserProfileItem/>
                </PaneActionItem>
            </div>

        </div>
    )
}

export default ProfilePane