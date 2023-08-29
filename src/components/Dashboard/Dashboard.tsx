import {useNavigate, useSearchParams} from "react-router-dom";
import {auth} from "../../index";
import {useAuthState} from "react-firebase-hooks/auth";
import LoadingScreen from "src/components/Utils/LoadingUtils/LoadingScreen";
import styles from './Dashboard.module.scss';
import {useEffect} from "react";
import EventSnapshot from "./EventSnapshot/EventSnapshot";
import LiveSheskaList from "./LiveSheskaList/LiveSheskaList";


export function Dashboard() {
    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth);
    const [searchParams, setSearchParams] = useSearchParams();
    let page = searchParams.get('page')
    useEffect(() => {
        if (page === null) {
            setSearchParams({page: 'snapshot'})
            page = 'snapshot'
        }
    })

    const navBar =  (pageId: string) => {
        return (
            <nav className={styles.navBar}>
                <ul className={styles.navBarItems}>
                    <li className={`${styles.navBarItem} ${pageId == "snapshot" ? styles.navBarItemActive : ''}`} onClick={() => {
                        setSearchParams({page: 'snapshot'})
                    }}>
                        Event Snapshot</li>
                    <li className={`${styles.navBarItem} ${pageId == "livelist" ? styles.navBarItemActive : ''}`} onClick={() => {
                        setSearchParams({page: 'livelist'})
                    }}>
                        Live Sheska List</li>
                    <li className={`${styles.navBarItem} ${pageId == "ticketmanager" ? styles.navBarItemActive : ''}`} onClick={() => {
                        setSearchParams({page: 'ticketmanager'})
                    }}>
                        Ticket Manager</li>
                    <li className={`${styles.navBarItem} ${pageId == "eventinfo" ? styles.navBarItemActive : ''}`} onClick={() => {
                        setSearchParams({page: 'eventinfo'})
                    }}>
                        Event Information</li>
                    <li className={`${styles.navBarItem} ${pageId == "financialdetails" ? styles.navBarItemActive : ''}`} onClick={() => {
                        setSearchParams({page: 'financialdetails'})
                    }}>
                        Financial Details</li>
                </ul>
            </nav>
        )
    }


    if (user) {
        return (
            <div className={styles.pageContainer}>
                {navBar(page ?? 'snapshot')}
                {page === 'snapshot' && (<EventSnapshot/>)}
                {page === 'livelist' && (<LiveSheskaList user={user}/>)}
            </div>
        )
    } else if(loading) {
        return <LoadingScreen/>
    } else if (error) {
        return (<div>AUTH ERROR</div>)
    } else {
        return <LoadingScreen/>
    }
}


export  default Dashboard;