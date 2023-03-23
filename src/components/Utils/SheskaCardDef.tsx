import React from "react";
import MiniCard from "../SheskaList/MiniCard";

/**
 * This class is used to represent a SheskaCard. It is used to store the data for a SheskaCard and to generate the JSX for a SheskaCard.
 * @class SheskaCard - This class is used to represent a SheskaCard. It is used to store the data for a SheskaCard and to generate the JSX for a SheskaCard.
 * @property {string} _cardID - The ID of the SheskaCard
 * @property {string} _title - The title of the SheskaCard
 * @property {string} _subtitle - The subtitle of the SheskaCard
 * @property {string} _description - The description of the SheskaCard
 * @property {string[]} _imageURLs - The image URLs of the SheskaCard
 */
class SheskaCard {
    private _cardID: string;
    private _title: string;
    private _subtitle: string;
    private _description?: string;
    private _imageOrder?: string[];
    private _amountRequested: any;
    private _amountRaised: any;

    constructor(cardID: string, title: string, subtitle: string, description?: string, imageOrder?: string[],) {
        this._cardID = cardID;
        this._title = title;
        this._subtitle = subtitle;
        if(description) {
            this._description = description;
        }
        if(imageOrder) {
            this._imageOrder = imageOrder;
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
}

export default SheskaCard;