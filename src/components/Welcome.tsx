import "./Welcome.css"
import {Link} from "react-router-dom";

//TODO add sign in functionality to event dashboard as well as sign in pages.

export function Welcome() {
    return(
        <div>
            <span id={"page"}>
                <h1 id={"welcome-logo"}>Sheska</h1>
                <h2 id={"sub-text"}>Memories are made together</h2>
                <div id={"button-box"}>
                    <Link to="/signup">
                        <button className={"button"}>Sign Up</button>
                    </Link>
                    <Link to={"/about"}>
                        <button className={"button"}>Learn More</button>
                    </Link>
                </div>
                <h2 id={"guest-info"}>Guest portal on the app</h2>
                <h3 id={"download"}>Download Now!</h3>
            </span>
        </div>
    )
}

export default Welcome