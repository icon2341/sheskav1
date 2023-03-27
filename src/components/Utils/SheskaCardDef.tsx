import React from "react";
import MiniCard from "../SheskaList/MiniCard";

/**
 * SheskaCard is a class that defines a card object.
 * It contains all the information needed to display a card on the SheskaList page
 * It also contains methods to display the card in different ways
 * @param cardID the id of the card
 * @param title the title of the card
 * @param subtitle the subtitle of the card
 * @param description the description of the card
 * @param imageOrder the order of the images in the card
 * @param expectedAverage the expected average of the card default is [0,0]
 * @param goal the goal of the card default is [0,0]
 * @param amountRaised the amount raised of the card default is [0,0]
 * @param guestsAbsorbFees whether or not guests absorb fees default is [0,0]
 * @param dateCreated the date the card was created
 * @param dateUpdated the date the card was last updated
 */
class SheskaCard {
    private _cardID: string;
    private _title: string;
    private _subtitle: string;
    private _description?: string;
    private _imageOrder?: string[];
    private _amountRequested?: any;
    private _amountRaised?: any;
    private _expectedAverage?: any;
    private _guestsAbsorbFees?: boolean;
    private _dateCreated?: string;
    private _dateUpdated?: string;



    constructor(cardID: string, title: string, subtitle: string, description?: string, imageOrder?: string[], expectedAverage? : string[],
                goal?: string[], amountRaised?: string[], guestsAbsorbFees?: boolean, dateCreated?: string, dateUpdated?: string) {
        this._cardID = cardID;
        this._title = title;
        this._subtitle = subtitle;
        if(description) {
            this._description = description;
        } else {
            this._description = '';
        }
        if(imageOrder) {
            this._imageOrder = imageOrder;
        } else {
            this._imageOrder = [];
        }
        if(goal) {
            this._amountRequested = goal;
        } else {
            this._amountRequested = [0,0];
        }
        if(amountRaised) {
            this._amountRaised = amountRaised;
        } else {
            this._amountRaised = [0,0];
        }
        if(expectedAverage) {
            this._expectedAverage = expectedAverage;
        } else {
            this._expectedAverage = [0,0];
        }

        if(guestsAbsorbFees) {
            this._guestsAbsorbFees = guestsAbsorbFees;
        } else {
            this._guestsAbsorbFees = false;
        }

        if(dateCreated) {
            this._dateCreated = dateCreated;
        } else {
            this._dateCreated = '';
        }

        if(dateUpdated) {
            this._dateUpdated = dateUpdated;
        } else {
            this._dateUpdated = '';
        }

    }


    get miniCard(): JSX.Element {

        return (
            <div className={``}>
                <MiniCard
                    title={this._title}
                    cardID={this._cardID}
                />
            </div>
        )
    }


    get cardID(): string {
        return this._cardID;
    }

    set cardID(value: string) {
        this._cardID = value;
    }

    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this._title = value;
    }

    get subtitle(): string {
        return this._subtitle;
    }

    set subtitle(value: string) {
        this._subtitle = value;
    }

    get description(): string | undefined {
        return this._description;
    }

    set description(value: string | undefined) {
        this._description = value;
    }

    get imageOrder(): string[] | undefined{
        return this._imageOrder;
    }

    set imageOrder(value: string[] | undefined) {
        this._imageOrder = value;
    }

    get amountRequested(): any {
        return this._amountRequested;
    }

    set amountRequested(value: any) {
        this._amountRequested = value;
    }

    get amountRaised(): any {
        return this._amountRaised;
    }

    set amountRaised(value: any) {
        this._amountRaised = value;
    }

    get expectedAverage(): any {
        return this._expectedAverage;
    }

    set expectedAverage(value: any) {
        this._expectedAverage = value;
    }

    get guestsAbsorbFees(): boolean | undefined {
        return this._guestsAbsorbFees;
    }

    set guestsAbsorbFees(value: boolean | undefined) {
        this._guestsAbsorbFees = value;
    }

    get dateCreated(): string | undefined{
        return this._dateCreated;
    }

    set dateCreated(value: string | undefined) {
        this._dateCreated = value;
    }

    get dateUpdated(): string | undefined{
        return this._dateUpdated;
    }

    set dateUpdated(value: string | undefined) {
        this._dateUpdated = value;
    }
}

export default SheskaCard;