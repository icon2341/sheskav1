import {Auth} from "firebase/auth";
import firebase from "firebase/compat";
import {updateProfile} from "@firebase/auth";

export function getProfilePicture(auth: Auth) {
    return auth.currentUser?.photoURL || null;
}


/**
 * Sets the profile picture of the current user, uploads the file to firebase storage and updates the user profile
 * @param newprofile file to upload
 * @param auth firebase auth ref
 * @param storage firebase storage ref
 */
export function setProfilePicture(newprofile: File, auth: Auth, storage: any) {
    const storageRef = storage.ref();
    const profileRef = storageRef.child(`users/${auth.currentUser?.uid}/profilePicture`);

    profileRef.put(newprofile).then((snapshot: any) => {
        console.log('Uploaded a blob or file!');
        snapshot.ref.getDownloadURL().then((url : any) => {
            if (auth.currentUser) {
                updateProfile(auth.currentUser, {
                    photoURL: url
                })
            }

        })
    });

    return Promise.resolve();
}

export function setDisplayName(newName: string, auth: Auth) {
    if (auth.currentUser) {
        updateProfile(auth.currentUser, {
            displayName: newName
        }).then(r => {
            return Promise.resolve();
        })
    } else {
        return Promise.reject();
    }

    return Promise.reject();
}