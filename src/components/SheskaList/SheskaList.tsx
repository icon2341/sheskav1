import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { deleteObject, listAll, ref } from 'firebase/storage';
import React, { ReactNode, useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useAuthState } from 'react-firebase-hooks/auth';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { string } from 'yup';
import { auth, db, storage } from '../../index';
import { LoadingIndicator } from '../LoadingIndicator';
import SheskaCardDef from '../Utils/SheskaCardDef';
import { BackButton } from './BackButton';
import MiniCard from './MiniCard';
import styles from './SheskaList.module.css';
import { SheskaListContent } from './SheskaListContent';

const area = 'sheskaList';

export type CardDef = { [id: string]: SheskaCardDef };
export function SheskaList() {
    const [user, loading, error] = useAuthState(auth);
    const [cardDefs, setCardDefs] = useState<CardDef>({});
    const { promiseInProgress } = usePromiseTracker({ area, delay: 0 });

    // TODO There's a bug sometimes where if you have already attempted to get data in the server is down or connection
    // is lost for whatever reason the application will not get your date again because attempted data is set to true
    const getCardDefs = async(userID: string | undefined) => {
        try {
            const querySnapshot = await getDocs(collection(db, `users/${userID}/sheska_list`));
            const sheskaCards = {} as { [cardID: string]: SheskaCardDef };
            querySnapshot.forEach((doc) => {
                // TODO might just want to export the querySnapshot instead of mapping it to lama and then looping through lama to send to listItems
                const data = doc.data();
                sheskaCards[doc.id] = new SheskaCardDef(doc.id, data.title, data.subtitle, data.description);
            });
            setCardDefs(sheskaCards)
        } catch (error) {
            console.error('Error getting card definitions:', error);
        }
    }

    useEffect(() => {
        if (!user)
            return;
        trackPromise(getCardDefs(user.uid), area);
    }, [user]);

    const removeCardDef = (cardID: string) => {
        const { [cardID]: removedCard, ...newCardDefs } = cardDefs;
        setCardDefs(newCardDefs);
    }

    const noCardsFound = (): boolean => Object.keys(cardDefs).length === 0;
    const handleNoCardsFound = (): ReactNode[] => ([
        <MiniCard key='create-card' cardID='create-card' />,
    ]);
    const handleCardsFound = (): ReactNode[] => {
        const cards: ReactNode[] = [];
        Object.entries(cardDefs).forEach(([id, card], index) => {
            cards.push(
                <MiniCard key={id}
                    title={card.title}
                    description={card.description}
                    cardID={card.cardID}
                    subtitle={card.subtitle}
                    removeCard={removeCardDef}
                    className={styles.card}
                />
            );
        });
        return cards;
    }
    const assembleCards = (): ReactNode[] => {
        if (!promiseInProgress && noCardsFound())
            return handleNoCardsFound();
        else if (!promiseInProgress) {
            return handleCardsFound();
        }

        return [];
    }

    const cards = assembleCards();

    if (user) {
        return (
            <SheskaListContent loading={promiseInProgress || loading} cards={cards} />
        );
    } else if(error) {
        return(
            <div>
                {error.message}
            </div>
        );
    }

    return null;
}

export default SheskaList;