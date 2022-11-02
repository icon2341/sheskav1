
import "./Listeditor.css"
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../index";

export function Listeditor(){
    console.log(auth.currentUser);

    const [user, loading, error] = useAuthState(auth);


    if(user) {
        return(
            <div>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
                <a id={"email-display"}>{user?.email} List Editor </a>
                <a className={`pane-title`}> List Editor</a>
                <div id={"list-cards"}>
                    <span className="material-symbols-outlined">add</span>
                </div>
            </div>


        )
    } else if(loading) {
        return(
            <div>
                <a id={"email-display"}>LOADING...</a>
            </div>
        )
    } else if(error) {
        return(
            <div>
                <a id={"email-display"}>AUTH ERROR</a>
            </div>
        )
    }

    return null
}
export default Listeditor

//TODO card creation system, firestore logic
//TODO card creation UI
// brainstorm how cards should be created and the ideal workflow for cards