import { Auth } from "firebase/auth";
import { DocumentData } from "firebase/firestore";
import { FirebaseStorage, getDownloadURL, listAll, ref } from "firebase/storage";
import { default as SheskaCardDef, default as sheskaCardDef } from "./SheskaCardDef";

/**
 * Returns a SheskaCardDef object from a DocumentData object
 * @param docData the DocumentData object to convert
 */
export function getCardFromDocData(docData: DocumentData) : SheskaCardDef {
    return new SheskaCardDef(docData.id, docData.title, docData.subtitle, docData.description, docData.imageURLs);
}

/**
 * Returns a promise that resolves to an array of image urls on success or an error on failure
 * @param cardID the id of the sheskaCardDef that the images belong to in the Firebase Storage Bucket
 * @param storage the Firebase Storage instance
 * @param auth the Firebase Auth instance
 */
export async function getSheskaCardImagesUrls(cardID: string, storage: FirebaseStorage, auth: Auth) : Promise<string[]> {
    const pathString = '/users/'+ auth.currentUser?.uid.toString() + "/" + cardID + "/";
    const pathReference = ref(storage, pathString);
    let imageURLs: string[] = [];
    const response = await listAll(pathReference);
    await Promise.all(response.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        imageURLs.push(url);
    }));

    return imageURLs;
}