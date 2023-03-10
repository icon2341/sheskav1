import {DocumentData} from "firebase/firestore";
import SheskaCardDef from "./SheskaCardDef";
import sheskaCardDef from "./SheskaCardDef";
import {getDownloadURL, listAll, ref} from "firebase/storage";
import {FirebaseStorage} from "firebase/storage";
import {Auth} from "firebase/auth";

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
    const pathReference = ref(storage, '/users/'+ auth.currentUser?.uid.toString() + "/" + cardID + "/");
    let imageURLs: string[] = [];
    listAll(pathReference).then((res) => {
        res.items.forEach((itemRef) => {
            getDownloadURL(itemRef).then((url) => {
                imageURLs.push(url)
            }).catch((error) => {
                console.log(error);
                return new Promise((resolve, reject) => {
                    reject(error);
                })
            })
        })
    })

    return new Promise((resolve, reject) => {
        resolve(imageURLs);
    })
}