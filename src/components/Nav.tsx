import "./Nav.css"
import {NavigateFunction, useNavigate} from "react-router-dom";
import {signOut} from "firebase/auth";
import {auth} from "../index";
import Sidebar from "./Nav/Sidebar/Sidebar";

//TODO ADD HEADER BAR
export function Nav() {

    const navigate = useNavigate();

    return (
        <div>
            <nav>
                <Sidebar navigateFunction={navigate}/>
            </nav>
        </div>
    )
}

async function signOutUser(navigate : NavigateFunction) {
    await signOut(auth)
    console.log("User is Signed out")
    navigate("/");
}

export default Nav