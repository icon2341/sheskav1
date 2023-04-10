import styles from './AccountPreferences.module.scss';
import SettingsNavButton from "./SettingsNavButton";
import {User, CreditCard, Bell, Lock} from 'react-feather'
import {useState} from "react";
import SettingsPaneSwticher from "./SettingsPane/SettingsPaneSwticher";


export function AccountPreferences(){
    const [currentSettingPane, setCurrentSettingPane] = useState('My Profile');


    return (
        <div className={styles.pageContainer}>
            <div className={styles.contentContainer}>
                <h2 className={styles.pageTitle}>Account Settings</h2>
                <div className={styles.settingsContainer} >
                    <div className={styles.navBox}>
                        <SettingsNavButton title={'My Profile'} icon={User} active={currentSettingPane === "My Profile"}
                                           setCurrentSettingPane={setCurrentSettingPane}/>
                        <SettingsNavButton title={'Billing'} icon={CreditCard} active={currentSettingPane === "Billing"}
                                           setCurrentSettingPane={setCurrentSettingPane}/>
                        <SettingsNavButton title={'Notifications'} icon={Bell} active={currentSettingPane === "Notifications"}
                                           setCurrentSettingPane={setCurrentSettingPane}/>
                        <SettingsNavButton title={'Security'} icon={Lock} active={currentSettingPane === "Security"}
                                           setCurrentSettingPane={setCurrentSettingPane}/>
                    </div>
                    <div className={styles.settingsBox}>
                        <SettingsPaneSwticher activePage={currentSettingPane}/>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default AccountPreferences;