import {inspect} from "util";
import styles from './NotifNumber.module.scss';

export function NotifNumber() {
    return (
        <div className={styles.notifNumber}>
            <h3 className={styles.number}>0</h3>
        </div>
    )
}

export default NotifNumber;