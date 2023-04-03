import React from 'react';
import styles from './Sidebar.module.scss';
import ToggleNavSize from "./ToggleNavSize";
import {CSS} from "@dnd-kit/utilities";
import {NavButton} from "./NavButton";
import {Home} from 'react-feather';
import {NavigateFunction, useNavigate} from "react-router-dom";
import {signOutUser} from "../../Authentication/Utils/AuthUtils";
import AuthBar from "../AuthBar/AuthBar";
import {auth} from "../../../index";

export function Sidebar(props: { navigateFunction: NavigateFunction }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [manuallyLocked, setManuallyLocked] = React.useState(false);

    const currentRelPath = window.location.pathname;

    return (
        <div>
            <AuthBar isOpen={isOpen} username={auth.currentUser?.displayName || ''}/>
            <div className={`${styles.navbarContainer} ${isOpen ? styles.navbarExtended : ''}`} onMouseEnter={() => {setIsOpen(true)}} onMouseLeave={() => {if(!manuallyLocked){setIsOpen(false)}}}>
                <h1 className={styles.navbarLogo}>S{isOpen ? 'heska' : ''}</h1>
                <div className={styles.navigationGroup}>
                    <NavButton icon={'home'} text={'Dashboard'} location={'/dashboard'} selected={'/dashboard' === currentRelPath} isSidebarOpen={isOpen}/>
                    <NavButton icon={'list'} text={'Sheska List'} location={'/sheskalist'} selected={'/sheskalist' === currentRelPath} isSidebarOpen={isOpen}/>
                </div>
                <div className={styles.settingGroup}>
                    <NavButton icon={'settings'} text={"Account"} location={undefined} selected={false} isSidebarOpen={isOpen}/>
                    <div onClick={() => {signOutUser(props.navigateFunction).then(r => {console.log('signed out user!')}).catch(reason => {console.log('failed to sign out user')})}}>
                        <NavButton icon={'log-out'} text={'Sign Out'} selected={false} isSidebarOpen={isOpen} location={undefined}/>
                    </div>
                </div>
                    {/*TODO need to add vertical header*/}

                {/*TODO Need to add signout button - DONE*/}
                {/*TODO Need to add Mobile navigation version using hamburger menu*/}
                {/*TODO Figure out how to make it so that lock open/closed button DOES NOT EFFECT HOVER This can be done by adding a second value called 'Manually locked' that
                    overrides the mouse functions - DONE*/}

            </div>
            <ToggleNavSize sidebarOpen={isOpen} setSidebarOpen={setIsOpen} setManuallyLocked={setManuallyLocked} manuallyLocked={manuallyLocked}/>


        </div>
    )

}

export default Sidebar;