class SheskaCard {
    cardID: string;
    title: string;
    subtitle: string;
    description: string;
    imageURLs: string[];

    constructor(cardID: string, title: string, subtitle: string, description: string, imageURLs: string[]) {
        this.cardID = cardID;
        this.title = title;
        this.subtitle = subtitle;
        this.description = description;
        this.imageURLs = imageURLs;
    }



}

export default SheskaCard;