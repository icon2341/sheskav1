import Masonry from '@mui/lab/Masonry';
import { Box } from '@mui/material';
import { ReactNode } from 'react';
import { BsFillPlusSquareFill as AddButton } from 'react-icons/bs';
import { useNavigate } from 'react-router';
import { LoadingIndicator } from '../LoadingUtils/LoadingIndicator';
import { BackButton } from './BackButton';
import styles from './SheskaList.module.css';
import {Toaster} from "react-hot-toast";

export const SheskaListContent = (props: { loading: boolean, cards: ReactNode[] }) => {
    const navigate = useNavigate();

    return (
        <Box className={styles.gridContainer}>
            <div><Toaster/></div>
            <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200' />
            <div className={styles.pageTitleContainer}>
                <h1 className={styles.pageTitle}> Your Sheska List </h1>
                <AddButton size={'3em'} className={styles.addCardButton} onClick={() => {navigate('/newitem')}} />
            </div>
            <Masonry columns={{lg: 2, xs: 1}} spacing={3} id={styles.grid}>
                {
                    props.loading
                    ?
                    <LoadingIndicator />
                    :
                    props.cards[0] as NonNullable<ReactNode>
                }
                <BackButton key='back-button' location='/dashboard' text='Return to Home' />
                {
                    !props.loading
                    &&
                    props.cards.slice(1)
                }
            </Masonry>
        </Box>
    );
}