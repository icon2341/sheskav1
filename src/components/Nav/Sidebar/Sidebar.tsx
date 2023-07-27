import React from 'react';
import styles from './Sidebar.module.scss';
import ToggleNavSize from "./ToggleNavSize";
import {CSS} from "@dnd-kit/utilities";
import {NavButton} from "./NavButton";
import {Home, List, Layout, LogOut, Settings, } from "react-feather";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {signOutUser} from "../../../api/User/Auth/AuthUtils";
import AuthBar from "../AuthBar/AuthBar";
import {auth} from "../../../index";
import {LoadingIndicator} from "../../LoadingUtils/LoadingSecondaryIndicator";
import {useAuthState} from "react-firebase-hooks/auth";

export function Sidebar(props: { navigateFunction: NavigateFunction }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [manuallyLocked, setManuallyLocked] = React.useState(false);
    const [user, loading, error] = useAuthState(auth);

    const currentRelPath = window.location.pathname;

    return (
        <div>
            <AuthBar isOpen={isOpen} username={ user?.displayName || ''}/>
            <div className={`${styles.navbarContainer} ${isOpen ? styles.navbarExtended : ''}`} onMouseEnter={() => {setIsOpen(true)}} onMouseLeave={() => {if(!manuallyLocked){setIsOpen(false)}}}>
                <h1 className={styles.navbarLogo}>S{isOpen ? 'heska' : ''}</h1>
                <div className={styles.navigationGroup}>
                    <ul>
                        <li>
                            <NavButton icon={Home} text={'Home'} location={'/home'} selected={'/home' === currentRelPath} isSidebarOpen={isOpen}/>

                        </li>
                        <li>
                            <NavButton icon={Layout} text={'Dashboard'} location={'/dashboard?page=snapshot'} selected={'/dashboard' === currentRelPath} isSidebarOpen={isOpen}/>

                        </li>
                        <li>
                            <NavButton icon={List} text={'Sheska List'} location={'/sheskalist'} selected={'/sheskalist' === currentRelPath} isSidebarOpen={isOpen}/>
                        </li>
                    </ul>
                </div>
                <div className={styles.settingGroup}>
                    <NavButton icon={Settings} text={"Account"} location={'/accountsettings'} selected={'/accountsettings' === currentRelPath} isSidebarOpen={isOpen}/>
                    <div onClick={() => {signOutUser(props.navigateFunction)
                        .then(r => {console.log('signed out user!')})
                        .catch(reason => {console.log('failed to sign out user')})}}>
                        <NavButton icon={LogOut} text={'Sign Out'} selected={false} isSidebarOpen={isOpen} location={undefined}/>
                    </div>
                </div>
                {/*TODO Need to add Mobile navigation version using hamburger menu*/}

            </div>
            <ToggleNavSize sidebarOpen={isOpen} setSidebarOpen={setIsOpen} setManuallyLocked={setManuallyLocked} manuallyLocked={manuallyLocked}/>


        </div>
    )

}

export default Sidebar;