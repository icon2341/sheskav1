import paneActionStyles from './PaneActionItem.module.scss';
import {Grid} from "@mui/material";
import {EditButton} from "../../Utils/EditButton/EditButton";
import React, {useEffect} from "react";
import {bool} from "yup";


/**
 * PaneActionItem is a component that is used to display a single action item in the settings pane.
 * It passes the editMode prop to its children.
 * It also contains an edit button that allows the user to edit the action item.
 * @param props - the props of the component contains children
 * @constructor - the constructor of the component
 */
export function PaneActionItem(props: any) {
    const [editMode, setEditMode] = React.useState(false);

    const childrenWithProps = React.Children.map(props.children, (child) => {
        // checking isValidElement is the safe way and avoids a typescript error too
        if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
                editMode: editMode });
        }
        return child;
    });


    return (
        <div className={`${paneActionStyles.actionItemContainer}`}>
            <h4 className={paneActionStyles.actionItemTitle}>{props.title}</h4>
            <div className={`${editMode ? paneActionStyles.actionItemContainerEditable : paneActionStyles.actionItemContainerNonEditable}`}>
                {childrenWithProps}
            </div>


            <EditButton setEditMode={setEditMode}  editMode={editMode}/>
        </div>
    )

}

export default PaneActionItem;