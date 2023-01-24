
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
                <h2 id={"email-display"}>{user?.email} List Editor </h2>
                <h2 className={`pane-title`}> List Editor</h2>
                <div id={"list-cards"}>
                    <span className="material-symbols-outlined">add</span>
                </div>
            </div>


        )
    } else if(loading) {
        return(
            <div>
                <h1 id={"email-display"}>LOADING...</h1>
            </div>
        )
    } else if(error) {
        return(
            <div>
                <h1 id={"email-display"}>AUTH ERROR</h1>
            </div>
        )
    }

    return null
}
export default Listeditor

//TODO card creation system, firestore logic
//TODO card creation UI
// brainstorm how cards should be created and the ideal workflow for cards