import { Auth } from "firebase/auth";
import {deleteDoc, doc, DocumentData, getDoc} from "firebase/firestore";
import { deleteObject, FirebaseStorage, getDownloadURL, listAll, ref } from "firebase/storage";
import { auth, db, storage } from "../../index";
import { default as SheskaCardDef, default as sheskaCardDef } from "./SheskaCardDef";

/**
 * Returns a SheskaCardDef object from a DocumentData object
 * @param docData the DocumentData object to convert
 */
export function getCardFromDocData(docData: DocumentData) : SheskaCardDef {
    return new SheskaCardDef(docData.id, docData.title, docData.subtitle, docData.description, docData.imageOrder,
        docData.expectedAverage, docData.goal, docData.amountRaised, docData.guestsAbsorbFees, docData.dateCreated,
        docData.dateUpdated);
}

/**
 * Returns a promise that resolves to an array of image urls on success or an error on failure
 * @param cardID the id of the sheskaCardDef that the images belong to in the Firebase Storage Bucket
 * @param storage the Firebase Storage instance
 * @param auth the Firebase Auth instance
 */
export async function getSheskaCardImagesUrls(cardID: string, storage: FirebaseStorage, auth: Auth) : Promise<string[]> {
    const pathString = '/users/'+ auth.currentUser?.uid.toString() + "/" + cardID + "/";
    const storeRef = await doc(db, 'users/' + auth.currentUser?.uid.toString() + "/sheska_list/" + cardID);
    const docSnap = await getDoc(storeRef);
    let imageURLs: string[] = [];


    if(docSnap.exists()) {
        const docData = docSnap.data();
        if(docData?.imageOrder) {
            await Promise.all(docData?.imageOrder.map(async (imageName: string) => {
                const url = await getDownloadURL(ref(storage, pathString + imageName));
                imageURLs.push(url);
            }));
        } else {
            const pathReference = ref(storage, pathString);
            const response = await listAll(pathReference);
            await Promise.all(response.items.map(async (itemRef) => {
                const url = await getDownloadURL(itemRef);
                imageURLs.push(url);
            }));
        }
    }

    return imageURLs;
}

/**
 * gets the description of a card from the database
 * @param cardID the id of the card to get the description of
 * @returns a promise that resolves to the description of the card on success or an error on failure. Note if there is no
 *  description present it will return reject 'Document does not have a description'
 *
 */
export async function getCardDescription (cardID: string): Promise<string> {
    try {
        const docRef = doc(db, 'users/' + auth.currentUser?.uid.toString() + "/sheska_list/" + cardID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log('GETTING CARD DESC', docSnap.data()?.description, cardID);

            if (docSnap.data().description) {
                return new Promise((resolve, reject) => {
                    resolve(docSnap.data()?.description);
                    // console.log(docSnap.data()?.description, 'DESCRIPTION');
                });
            } else {
                return new Promise((resolve, reject) => {
                    reject("Document does not have a description");
                });
            }
        } else {
            return new Promise((resolve, reject) => {
                reject("Document does not exist");
            });
        }
    } catch (error) {
        return new Promise((resolve, reject) => {
            reject(error);
            console.log('ERROR GETTING CARD DESCRIPTION: ' + error);
        });
    }
}


export async function deleteCardImages (cardID: string) {
    const pathReference = ref(storage, '/users/'+ auth.currentUser?.uid.toString() + "/" + cardID + "/");
    listAll(pathReference)
    .then((res) => {
        res.items.forEach((itemRef) => {
            deleteObject(itemRef)
            .catch((error) => {
                console.log(error)
            })
        });
    }).catch((error) => {
        console.error(error);
    });
}

export async function deleteCard(cardID: string) {
    await deleteDoc(doc(db, 'users/' + auth.currentUser?.uid.toString() + "/sheska_list", cardID))
    .catch((error) => {
        console.error(error);
    });
}
