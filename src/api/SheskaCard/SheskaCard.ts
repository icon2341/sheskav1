import {collection, doc, getDocs, setDoc} from "firebase/firestore";
import {db, auth} from "src/index";
import SheskaCardDef from "../../components/Utils/SheskaCardDef";

export enum queryType {
    PUBLISHED = "published",
}

/**
 * Get all Sheska Cards from the database for the currrently authenticated user. Query based on  the query parameter.
 * @param query optional parameter that defines whether to get all cards or only published cards. ["PUBLISHED" | undefined"]
 * @requires auth to be authenticated
 */
export async function getSheskaCards(query? : queryType.PUBLISHED) {
    const querySnapshot = await getDocs(collection(db, `users/${auth.currentUser?.uid}/sheska_list`));
    const sheskaCards : { [cardID: string]: SheskaCardDef } = {};
    try {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log(data)
            console.log(query)
            if (query && query === queryType.PUBLISHED) {
                if(doc.data().published === true) {
                    sheskaCards[doc.id] = new SheskaCardDef(doc.id, data.title, data.subtitle, data.description,
                        data.imageOrder, data.expectedAverage, data.goal, data.amountRaised, data.guestsAbsorbFees,
                        data.dateCreated, data.dateUpdated, data.published);
                }
            } else {
                sheskaCards[doc.id] = new SheskaCardDef(doc.id, data.title, data.subtitle, data.description, data.imageOrder,
                    data.expectedAverage, data.goal, data.amountRaised, data.guestsAbsorbFees, data.dateCreated, data.dateUpdated, data.published);
            }
        });
    } catch {
        console.log('ERROR')
        return Promise.reject("Error getting card definitions")
    }
    console.log("RETURNING FUNCTION, ", sheskaCards)
    return sheskaCards;
}

/**
 * publish a single Sheska Card from the database for the currrently authenticated user.
 * @param cardID the ID of the card to publish
 * @requires auth to be authenticated
 * @returns Promise
 * @throws Error if user is not authenticated
 */
export async function publishSheskaCard(cardID : string) {
    if(!auth.currentUser) return Promise.reject("User not authenticated");

    const docRef = doc(db, "users/" + auth.currentUser?.uid + "/sheska_list/" + cardID);
    setDoc(docRef, {
        published: true
    }, {merge: true}).then(() => {
        return Promise.resolve("Document successfully updated!");
    }).catch((error) => {
        console.error("Error updating document: ", error);
    });
}