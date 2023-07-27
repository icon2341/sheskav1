import SheskaCardDef from "../../Utils/SheskaCardDef";
import React, {ReactNode, useEffect, useState} from "react";
import {getSheskaCards, queryType} from "src/api/SheskaCard/SheskaCard";
import MiniCard from "../../SheskaList/MiniCard";
import {auth} from "src/index";
import styles from "./LiveSheskaList.module.scss";
export function LiveSheskaList( props : any) {
    const [sheskaCardDefs, setSheskaCardDefs] = useState<{ [cardID: string]: SheskaCardDef }>({});

    useEffect(() => {
        console.log(props.user.uid, "ELEE")
        getSheskaCards(queryType.PUBLISHED).then((sheskaCards) => {
            setSheskaCardDefs(sheskaCards);
            console.log(sheskaCards);
        }).catch((reason) => {
            console.log(reason);
        });
    }, [props.user]);


    const handleCardsFound = (): ReactNode[] => {
        const cards: ReactNode[] = [];
        Object.entries(sheskaCardDefs).forEach(([id, card]) => {
            cards.push(
                <div className={"w-[300px] m-1"}>
                    {/*TODO REPLACE THIS WITH A BETTER MINICARD SYSTEM*/}
                    <MiniCard key={id}
                              title={card.title}
                              description={card.description}
                              cardID={card.cardID}
                              subtitle={card.subtitle}
                              goal={card.amountRequested}
                              expectedAverage={card.expectedAverage}
                              guestsAbsorbFees={card.guestsAbsorbFees}
                              published={card.published}/>
                </div>
            );
        });
        return cards;
    }

    return (
        <div className={styles.publishedSheskaListGrid}>
            {handleCardsFound()}
        </div>
    )
}

export default LiveSheskaList;