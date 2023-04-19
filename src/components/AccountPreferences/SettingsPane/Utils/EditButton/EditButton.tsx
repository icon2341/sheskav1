import styles from './EditButton.module.scss';
import {Edit2} from "react-feather";

/**
 * EditButton is a component that is used to display an edit button in the settings pane.
 * @param props - the props of the component contains a function to set the edit mode and the current edit mode
 * @constructor - the constructor of the component
 */
export function EditButton(props: { setEditMode: any, editMode: boolean }) {
    return (
        <div className={styles.container} onClick={() => {
            props.setEditMode(!props.editMode)
            }
        }>
            <h4 className={styles.title}>{props.editMode ? 'Done' : 'Edit'}</h4>
            <Edit2 color={'gray'} size={30}/>
        </div>
    )
}