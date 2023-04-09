import styles from './AccountPreferences.module.scss';
import SettingsNavButton from "./SettingsNavButton";
import {User} from 'react-feather'


export function AccountPreferences(){
    return (
        <div className={styles.pageContainer}>
            <div className={styles.settingsPage}>
                <div className={styles.settingsNav}>
                    <h2 className={styles.pageTitle}>Account Settings</h2>
                    <SettingsNavButton title={'Profile'} icon={User} active={true}/>
                </div>

            </div>
        </div>
    )
}

export default AccountPreferences;