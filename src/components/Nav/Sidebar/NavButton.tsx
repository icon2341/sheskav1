import React from 'react';
import styles from './NavButton.module.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Home, List, AlertCircle} from "react-feather";
import {NavigateFunction, useNavigate} from "react-router-dom";

export function NavButton(props: { icon:string, text: string, location: string, selected:boolean, isSidebarOpen: boolean}) {

    const navigate = useNavigate();

    return (
        // <Home color={'black'} size={36}/>
        <div className={`${styles.navButton} ${props.selected ? styles.selectedButton : ''}`} onClick={() => {navigate(props.location)}}>
            {injectedIcon(props.icon)}
            {props.isSidebarOpen && <h3 className={styles.navButtonText}>{props.text}</h3>}
        </div>
    )
}

function injectedIcon (icon: string) {
    const color = 'black'
    const size = 24;

    switch (icon) {
        case 'home':
            console.log('home')
            return <Home color = {color} size={size}/>
        case 'list':
            console.log('list')
            return <List color={color} size={size}/>
        default:
            return <AlertCircle color = {'orange'} size={size}/>
    }
}