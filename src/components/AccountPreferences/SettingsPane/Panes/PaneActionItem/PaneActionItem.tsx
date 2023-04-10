import paneActionStyles from './PaneActionItem.module.scss';
import {Grid} from "@mui/material";
import {EditButton} from "../../Utils/EditButton/EditButton";
import React from "react";



export function PaneActionItem(props: any) {
    return (
        <div className={paneActionStyles.actionItemContainer}>
            <h4 className={paneActionStyles.actionItemTitle}>{props.title}</h4>
            {props.children}

            <EditButton/>
        </div>
    )

}

export default PaneActionItem;