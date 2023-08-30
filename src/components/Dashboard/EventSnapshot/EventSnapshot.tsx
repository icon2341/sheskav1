import {SimpleValueCard} from "../components/SimpleValueCard/SimpleValueCard";
import styles from "./EventSnapshot.module.scss";

export function EventSnapshot() {
    return (
        <div className={`${styles.snapshotContainerGrid}`}>
            <div className={"grid md:grid-cols-3 transition-all grid-cols-1 w-screen md:w-auto"} >
                <SimpleValueCard title={"Total Raised"} value={"$45,231.89"} change={"+$3,000 from last month"}/>
                <SimpleValueCard title={"Cost Per Ticket"} value={"$45.22"} change={"+$10 from last month"}/>
                <SimpleValueCard title={"Average Donation"} value={"$231.22"} change={"+$52 from last month"}/>
                <SimpleValueCard title={"Average Donation"} value={"$231.22"} change={"+$52 from last month"}/>
                <SimpleValueCard title={"Average Donation"} value={"$231.22"} change={"+$52 from last month"}/>
                <SimpleValueCard title={"Average Donation"} value={"$231.22"} change={"+$52 from last month"}/>
            </div>
        </div>
    )
}

export default EventSnapshot;