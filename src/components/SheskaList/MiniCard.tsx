import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../index";
import styles from "./MiniCard.module.css"
import React from "react";

export function MiniCard(props:any) {
    let image= props.image;
    let title= props.title;
    let description = props.description;
    let expectedAmount = props.expectedAmount;
    let actualAmount = props.actualAmount;
    let numberDonors = props.numberOfDonors;

    var divStyle = {
        backgroundImage: 'url(' + image + ')'
    }

    return (<div className={styles.cardTest}>
        <h3 className={styles.cardTitle}>{title}</h3>
    </div>)

}

export default MiniCard;