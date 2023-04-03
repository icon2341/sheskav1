import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./SheskaList.module.css";

export const BackButton = (props: { location: string, text: string }) => {
    const navigate = useNavigate();

    return (
        <div className={`${styles.pointerCursor} ${styles.miniCardButton}`} onClick={() => { navigate(props.location) }}>
            <FaArrowLeft size={'2em'} className={styles.backIcon} />
            <h3 className={`${styles.miniCardButtonText} ${styles.backButtonText}`}>{props.text}</h3>
        </div>
    );
};