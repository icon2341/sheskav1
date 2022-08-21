
import "./Dashboard.css"
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../index";

export function Dashboard(){
    console.log(auth.currentUser);

    const [user, loading, error] = useAuthState(auth);


    if(user) {
        return(
            <div>
                <a id={"email-display"}>{user?.email} shits null </a>
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
export default Dashboard

