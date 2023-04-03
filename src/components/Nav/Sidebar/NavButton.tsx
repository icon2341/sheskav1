import React from 'react';
import styles from './NavButton.module.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Home, List, AlertCircle, LogOut, Settings} from "react-feather";
import {NavigateFunction, useNavigate} from "react-router-dom";

export function NavButton(props: { icon:string, text: string, location: string | undefined, selected:boolean, isSidebarOpen: boolean}) {

    const navigate = useNavigate();

    return (
        // <Home color={'black'} size={36}/>
        <div className={`${styles.navButton} ${props.selected ? styles.selectedButton : ''}`} onClick={() => {if(props.location){navigate(props.location)}}}>
            <div className={styles.iconContainer}>
                {injectedIcon(props.icon, props.selected)}
            </div>
            {props.isSidebarOpen && <h3 className={styles.navButtonText}>{props.text}</h3>}
        </div>
    )
}

function injectedIcon (icon: string, selected: boolean) {
    const color = selected ? 'white' : 'black';
    const size = 24;

    switch (icon) {
        case 'home':
            return <Home color = {color} size={size}/>
        case 'list':
            return <List color={color} size={size}/>
        case 'log-out':
            return <LogOut color={color} size={size}/>
        case 'settings':
            return <Settings color={color} size={size}/>
        default:
            return (
                <div title={"Error in defining nav icons"}>
                    <AlertCircle color = {'orange'} size={size}/>
                </div>
            )
    }
}