import "./Nav.css"
import {NavigateFunction, useNavigate} from "react-router-dom";
import {signOut} from "firebase/auth";
import firebase from "firebase/compat";
import {auth} from "../index";


export function Nav() {

    const navigate = useNavigate();

    return (
        <div>
            <nav id={"nav-bar"}>
                <div id={"logo-container"} >
                    <h1 id={"logo-short-hand"}>S</h1>
                    <h1 id={"logo-long-hand"}>heska</h1>
                </div>

                <ul id={"nav-list"}>
                    <li>
                        <div className={"navItemContainer"} onClick={() => navigate('/dashboard')}>
                            <svg viewBox="0 0 49 49" className={"navIcon"}><path fill="#FFFFFF" d="M8 42V18L24.1 6 40 18v24H28.3V27.75h-8.65V42Zm3-3h5.65V24.75H31.3V39H37V19.5L24.1 9.75 11 19.5Zm13-14.65Z"/></svg>
                            <h2 className={"navText"}> Event Dashboard </h2>
                        </div>
                        <div className={"navItemContainer"} onClick={() => navigate('/listeditor')}>
                            <svg viewBox="0 0 48 48" className={"navIcon"}><path fill="#FFFFFF" d="M9 47.4q-1.2 0-2.1-.9-.9-.9-.9-2.1v-30q0-1.2.9-2.1.9-.9 2.1-.9h20.25l-3 3H9v30h30V27l3-3v20.4q0 1.2-.9 2.1-.9.9-2.1.9Zm15-18Zm9.1-17.6 2.15 2.1L21 28.1v4.3h4.25l14.3-14.3 2.1 2.1L26.5 35.4H18v-8.5Zm8.55 8.4-8.55-8.4 5-5q.85-.85 2.125-.85t2.125.9l4.2 4.25q.85.9.85 2.125t-.9 2.075Z"/></svg>
                            <h2 className={"navText"}> List Editor </h2>
                        </div>
                        <div className={"navItemContainer"}>
                            <svg viewBox="0 0 48 48" className={"navIcon"}><path fill="#FFFFFF" d="m19.4 44-1-6.3q-.95-.35-2-.95t-1.85-1.25l-5.9 2.7L4 30l5.4-3.95q-.1-.45-.125-1.025Q9.25 24.45 9.25 24q0-.45.025-1.025T9.4 21.95L4 18l4.65-8.2 5.9 2.7q.8-.65 1.85-1.25t2-.9l1-6.35h9.2l1 6.3q.95.35 2.025.925Q32.7 11.8 33.45 12.5l5.9-2.7L44 18l-5.4 3.85q.1.5.125 1.075.025.575.025 1.075t-.025 1.05q-.025.55-.125 1.05L44 30l-4.65 8.2-5.9-2.7q-.8.65-1.825 1.275-1.025.625-2.025.925l-1 6.3ZM24 30.5q2.7 0 4.6-1.9 1.9-1.9 1.9-4.6 0-2.7-1.9-4.6-1.9-1.9-4.6-1.9-2.7 0-4.6 1.9-1.9 1.9-1.9 4.6 0 2.7 1.9 4.6 1.9 1.9 4.6 1.9Zm0-3q-1.45 0-2.475-1.025Q20.5 25.45 20.5 24q0-1.45 1.025-2.475Q22.55 20.5 24 20.5q1.45 0 2.475 1.025Q27.5 22.55 27.5 24q0 1.45-1.025 2.475Q25.45 27.5 24 27.5Zm0-3.5Zm-2.2 17h4.4l.7-5.6q1.65-.4 3.125-1.25T32.7 32.1l5.3 2.3 2-3.6-4.7-3.45q.2-.85.325-1.675.125-.825.125-1.675 0-.85-.1-1.675-.1-.825-.35-1.675L40 17.2l-2-3.6-5.3 2.3q-1.15-1.3-2.6-2.175-1.45-.875-3.2-1.125L26.2 7h-4.4l-.7 5.6q-1.7.35-3.175 1.2-1.475.85-2.625 2.1L10 13.6l-2 3.6 4.7 3.45q-.2.85-.325 1.675-.125.825-.125 1.675 0 .85.125 1.675.125.825.325 1.675L8 30.8l2 3.6 5.3-2.3q1.2 1.2 2.675 2.05Q19.45 35 21.1 35.4Z"/></svg>
                            <h2 className={"navText"}> Event Settings </h2>
                        </div>
                        <div className={"navItemContainer"}>
                            <svg viewBox="0 0 48 48" className={"navIcon"}><path fill="#FFFFFF" d="M32.6 27.2q1.25 0 2.225-.975.975-.975.975-2.275 0-1.25-.975-2.2-.975-.95-2.225-.95t-2.225.95q-.975.95-.975 2.2 0 1.3.975 2.275.975.975 2.225.975ZM9 36.35V39 9 36.35ZM9 42q-1.15 0-2.075-.9Q6 40.2 6 39V9q0-1.15.925-2.075Q7.85 6 9 6h30q1.2 0 2.1.925Q42 7.85 42 9v6.7h-3V9H9v30h30v-6.65h3V39q0 1.2-.9 2.1-.9.9-2.1.9Zm17.9-8.65q-1.7 0-2.7-1-1-1-1-2.65V18.35q0-1.7 1-2.675 1-.975 2.7-.975h13.5q1.7 0 2.7.975 1 .975 1 2.675V29.7q0 1.65-1 2.65t-2.7 1Zm14.2-3V17.7H26.2v12.65Z"/></svg>
                            <h2 className={"navText"}> Your Cards </h2>
                        </div>
                        <div className={"navItemContainer"}>
                            <svg viewBox="0 0 48 48" className={"navIcon"}><path fill="#FFFFFF" d="M14 36v-3h13.95v3Zm0-9v-3h20v3ZM9 44q-1.2 0-2.1-.9Q6 42.2 6 41V10q0-1.2.9-2.1Q7.8 7 9 7h3.25V4h3.25v3h17V4h3.25v3H39q1.2 0 2.1.9.9.9.9 2.1v31q0 1.2-.9 2.1-.9.9-2.1.9Zm0-3h30V19.5H9V41Zm0-24.5h30V10H9Zm0 0V10v6.5Z"/></svg>
                            <h2 className={"navText"}> Event Information </h2>
                        </div>
                        <div className={"navItemContainer"} id={"nav-signout-button-container"} onClick={() => signOutUser(navigate)}>
                            <svg viewBox={"0 0 48 48"} id={"nav-signout-button"} className={"navIcon"}><path fill="#FFFFFF" d="M9 42q-1.2 0-2.1-.9Q6 40.2 6 39V9q0-1.2.9-2.1Q7.8 6 9 6h14.55v3H9v30h14.55v3Zm24.3-9.25-2.15-2.15 5.1-5.1h-17.5v-3h17.4l-5.1-5.1 2.15-2.15 8.8 8.8Z"/></svg>
                            <h2 className={"navText"}> Sign Out </h2>
                        </div>
                    </li>
                </ul>
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