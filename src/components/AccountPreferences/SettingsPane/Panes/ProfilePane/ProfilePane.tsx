import styles from './Panes.module.scss';
import PaneActionItem from "../PaneActionItem/PaneActionItem";
import React from "react";
import {EditButton} from "../../Utils/EditButton/EditButton";
import UserProfileItem from "./UserProfileItem/UserProfileItem";

/**
 * ProfilePane is a component that is used to display the profile pane in the settings pane. Contains all user profile action items.
 * @constructor - returns a react component
 */
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