import React from "react";
import SheskaCardDef from "../../Utils/SheskaCardDef";
import styles from "./SheskaCardGuestView.module.css";
import SheskaCard from "../../Utils/SheskaCardDef";
import {Swiper, SwiperSlide} from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import ProgressBar from 'react-bootstrap/ProgressBar'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import ProductPage from "../../ProductPage/ProductPage";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShareFromSquare} from "@fortawesome/free-solid-svg-icons";
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export function SheskaCardGuestView(props: {sheskaCardDef: SheskaCard, cardImages: { [id: string]: string }}) {
    console.log("SheskaCardGuestView: " + props.sheskaCardDef.title)

    const editor = useEditor({
        content: props.sheskaCardDef.description,
        extensions: [StarterKit],
    })

    editor?.setEditable(false)

    return (
        <div className={styles.cardContainer}>
            <div className={styles.textPane}>
                <h1 className={styles.cardTitle}>{props.sheskaCardDef.title || "Title"}</h1>
                {props.sheskaCardDef.imageOrder &&
                    <div className={styles.slideShowImageContainer}>
                        <Swiper
                                modules={[Navigation, Pagination, A11y]}
                                allowTouchMove={true}
                                spaceBetween={10}
                                pagination={{ clickable: true }}
                                >
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

                <style type="text/css">
                    {`
                        .progress-bar-standard
                          background-color: purple;
                          color: purple;
                        }
                    `}
                </style>

                {/*TODO MAKE THIS THE CORRECT COLOR @COLLIN*/}
                <ProgressBar now={34} className={styles.itemProgressBar} variant={"standard"}/>
                <div className={styles.progressBarHeaders}>
                    <div className={styles.progressBarHeaderSub} >
                        <h3 className={styles.progressBarHeader}>Amount Raised</h3>
                        <h3 className={styles.progressBarHeaderNumber}>$5,622</h3>

                    </div>
                    <div className={styles.progressBarHeaderSub}>
                        <h3 className={styles.progressBarHeader}>Amount Left</h3>
                        <h3 className={`${styles.progressBarHeaderNumber} ${styles.progressBarHeaderNumberTwo}`}> {(props.sheskaCardDef.amountRequested - props.sheskaCardDef.amountRaised) || '$4,222'} </h3>
                    </div>
                </div>

                <h2 className={styles.cardSubtitle}>{props.sheskaCardDef.subtitle || "subtitle"}</h2>

                <div className={styles.userActionButtonContainer}>
                    <button className={styles.userSupportButton} >Support This Item</button>
                    <button className={styles.userShareButton} >
                        <FontAwesomeIcon icon={faShareFromSquare} size={"xl"}/>
                    </button>
                </div>
            </div>
            <EditorContent editor={editor} className={styles.editorStyle} />
        </div>
    )
}

export default SheskaCardGuestView;