import {DocumentData} from "firebase/firestore";
import SheskaCardDef from "./SheskaCardDef";
import sheskaCardDef from "./SheskaCardDef";

export function getCardFromDocData(docData: DocumentData) : SheskaCardDef {
    return new SheskaCardDef(docData.id, docData.title, docData.subtitle, docData.description, docData.imageURLs);
}


export default getCardFromDocData;