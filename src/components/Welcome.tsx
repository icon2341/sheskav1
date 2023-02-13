import {Link, useNavigate} from "react-router-dom";
import "./Welcome.css"
//TODO add sign in functionality to event dashboard as well as sign in pages.

export function Welcome() {
    const navigate = useNavigate();

    return(
        <div>
            <span id={"page"}>
                <h1 id={"welcome-logo"}>Sheska</h1>
                <h2 id={"sub-text"}>Memories are made together</h2>
                <div id={"button-box"}>
                    <button className={"button"} onClick={()=>{navigate('/signup')}}>
                        Sign Up</button>
                    <button className={"button"} onClick={()=>{navigate('/about')}}>
                        Learn More</button>
                </div>
                <h2 id={"guest-info"}>Guest portal on the app</h2>
                <h3 id={"download"}>Download Now!</h3>
            </span>
        </div>
    )
}

export default Welcome