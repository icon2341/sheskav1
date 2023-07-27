import "./Nav.css"
import {useNavigate} from "react-router-dom";
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

export default Nav