import React from "react";
import SheskaCardDef from "../../Utils/SheskaCardDef";
import styles from "./SheskaCardGuestView.module.css";
import SheskaCard from "../../Utils/SheskaCardDef";
import {Swiper, SwiperSlide} from "swiper/react";

export function SheskaCardGuestView(props: {sheskaCardDef: SheskaCard, cardImages: { [id: string]: string }}) {
    console.log("SheskaCardGuestView: " + props.sheskaCardDef.title)

    return (
        <div className={styles.cardContainer}>
            <div className={styles.textPane}>
                <h1 className={styles.cardTitle}>{props.sheskaCardDef.title || "Title"}</h1>
                {props.sheskaCardDef.imageOrder &&
                    <div className={styles.slideShowImageContainer}>
                        <Swiper allowTouchMove={true}
                                spaceBetween={10}>
                            {props.sheskaCardDef.imageOrder.map((imageID) => {
                                return (
                                    <SwiperSlide>
                                        <img className={styles.slideShowImage} src={props.cardImages[imageID]} alt={imageID}/>
                                    </SwiperSlide>
                                )
                            })
                            }
                        </Swiper>
                    </div>
                }
                <h2 className={styles.cardSubtitle}>{props.sheskaCardDef.subtitle || "subtitle"}</h2>
            </div>
        </div>
    )
}

export default SheskaCardGuestView;