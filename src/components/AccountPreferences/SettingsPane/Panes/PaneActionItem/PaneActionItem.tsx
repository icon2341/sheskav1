import paneActionStyles from './PaneActionItem.module.scss';
import {Grid} from "@mui/material";
import {EditButton} from "../../Utils/EditButton/EditButton";
import React, {useEffect} from "react";


export function PaneActionItem(props: any) {
    const [editMode, setEditMode] = React.useState(false);


    useEffect(() => {
        console.log(editMode)
    }, [editMode])

    return (
        <div className={`${paneActionStyles.actionItemContainer}`}>
            <h4 className={paneActionStyles.actionItemTitle}>{props.title}</h4>
            <div className={`${editMode ? paneActionStyles.actionItemContainerEditable : paneActionStyles.actionItemContainerNonEditable}`}>
                {props.children}
            </div>


            <EditButton setEditMode={setEditMode}  editMode={editMode}/>
        </div>
    )

}

export default PaneActionItem;