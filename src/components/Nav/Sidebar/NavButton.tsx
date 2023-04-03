import React from 'react';
import styles from './NavButton.module.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Home, List, AlertCircle, LogOut, Settings} from "react-feather";
import {NavigateFunction, useNavigate} from "react-router-dom";

export function NavButton(props: { icon:any, text: string, location: string | undefined, selected:boolean, isSidebarOpen: boolean}) {

    const navigate = useNavigate();
    const color = props.selected ? 'white' : 'black';
    const size = 24;

    return (
        // <Home color={'black'} size={36}/>
        <div className={`${styles.navButton} ${props.selected ? styles.selectedButton : ''}`} onClick={() => {if(props.location){navigate(props.location)}}}>
            <div className={styles.iconContainer}>
                {/*{injectedIcon(props.icon, props.selected)}*/}
                <props.icon color={color} size={24}/>
            </div>
            {props.isSidebarOpen && <h3 className={styles.navButtonText}>{props.text}</h3>}
        </div>
    )
}