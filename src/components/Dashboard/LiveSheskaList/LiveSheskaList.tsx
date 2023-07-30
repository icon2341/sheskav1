import SheskaCardDef from "../../Utils/SheskaCardDef";
import React, {ReactNode, SetStateAction, useEffect, useState} from "react";
import {getSheskaCards, queryType} from "src/api/SheskaCard/SheskaCard";
import MiniCard from "../../SheskaList/MiniCard";
import {auth} from "src/index";
import styles from "./LiveSheskaList.module.scss";
import PublishedMiniCard from "../components/PublishedMiniCard/PublishedMiniCard";
import {Modal} from "@mui/material";
import SheskaCardFinancialDetail
    from "src/components/Dashboard/components/SheskaCardFinancialDetail/SheskaCardFinancialDetail";
export function LiveSheskaList( props : any) {
    const [sheskaCardDefs, setSheskaCardDefs] = useState<{ [cardID: string]: SheskaCardDef }>({});
    const [open, setOpen] = useState(false);
    const [cardId, setCardId] = useState<SetStateAction<string | undefined>>(undefined);
    useEffect(() => {
        console.log(props.user.uid, "ELEE")
        getSheskaCards(queryType.PUBLISHED).then((sheskaCards) => {
            setSheskaCardDefs(sheskaCards);
        }).catch((reason) => {
            console.log(reason);
        });
    }, [props.user]);


    const handleCardsFound = (): ReactNode[] => {
        const cards: ReactNode[] = [];
        Object.entries(sheskaCardDefs).forEach(([id, card]) => {
            cards.push(
                <div className={"w-[300px] m-1"}>
                    <PublishedMiniCard key={id} cardSchema={card}  setIdCard={setCardId} />
                </div>
            );
        });
        return cards;
    }

    const handleClose = () => setCardId(undefined);


    return (
        <div>
            {/*/!*TODO This does not work correctly*!/*/}
            {/*<Modal*/}
            {/*    open={cardId !== undefined}*/}
            {/*    onClose={handleClose}*/}
            {/*    aria-labelledby="modal-modal-title"*/}
            {/*    aria-describedby="modal-modal-description"*/}
            {/*>*/}
            {/*    <SheskaCardFinancialDetail cardId={""} />*/}
            {/*</Modal>*/}
            <div className={styles.publishedSheskaListGrid}>
                {handleCardsFound()}
            </div>
        </div>
    )
}

export default LiveSheskaList;