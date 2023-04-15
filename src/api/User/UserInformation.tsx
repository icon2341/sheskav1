import {doc, getDoc, setDoc} from "firebase/firestore";
import {Auth} from "firebase/auth";
//TODO export error codes for API instaed of manually typing them in
export async function getUserDocument(db: any, auth: Auth): Promise<any> {
    if (auth.currentUser === null) {
        return Promise.reject("User is not logged in.");
    }

    const docRef = doc(db, "users", auth.currentUser?.uid as string);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return Promise.reject(`No such document for user: ${auth.currentUser.uid}`);
    }

}

export async function getUserFullName(db: any, auth: Auth, uid: string) {
    let userDocument : any = undefined;
    await getUserDocument(db, auth).then((doc) => {
        userDocument = doc;
    }).catch((error) => {
        return Promise.reject(error);
    });

    if (userDocument) {
        return userDocument.full_name;
    } else {
        return Promise.reject(`No such document for user: ${uid}`);
    }
}

export async function getPartnerName(db:any, auth:Auth, uid?:string) {
    let userDocument : any= undefined;
    await getUserDocument(db, auth).then((doc) => {
        userDocument = doc;
    }).catch((error) => {
        return Promise.reject(error);
    });

    if (userDocument) {
        return userDocument.partner_full_name as string[];
    } else {
        return Promise.reject(`No such document for user: ${auth.currentUser?.uid}`);
    }
}

export async function setUserData(db:any, auth:Auth, newData: {}) {
    if (auth.currentUser === null) {
        return Promise.reject("User is not logged in.");
    }

    const docRef = doc(db, "users", auth.currentUser?.uid as string);

    await setDoc(docRef, newData, {merge: true});
    console.log("Document successfully written!");
}