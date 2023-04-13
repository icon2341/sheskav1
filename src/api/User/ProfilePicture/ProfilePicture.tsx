import {Auth} from "firebase/auth";
import firebase from "firebase/compat";
import {updateProfile} from "@firebase/auth";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";

/**
 * Gets the profile picture of the current user
 * @param auth firebase auth ref
 */
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
    const storageRef = ref(storage,`users/${auth.currentUser?.uid}/profilePicture`);

    uploadBytes(storageRef, newprofile).then((snapshot: any) => {
        console.log('Uploaded a blob or file!');
        getDownloadURL(storageRef).then((url : any) => {
            if (auth.currentUser) {
                updateProfile(auth.currentUser, {
                    photoURL: url
                }).then(r => {
                    console.log('uploaded files')
                    console.log(url)
                    auth.currentUser?.reload();
                    return Promise.resolve(url);
                })
            }

        })
    });

    return Promise.resolve();
}

/**
 * Sets the display name of the current user
 * @param newName new display name
 * @param auth firebase auth ref
 */
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