import styles from './EditButton.module.scss';
import {Edit2} from "react-feather";

export function EditButton() {
    return (
        <div className={styles.container}>
            <h4 className={styles.title}>Edit</h4>
            <Edit2 color={'gray'} size={30}/>
        </div>
    )
}