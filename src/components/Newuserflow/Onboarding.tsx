
import styles from "./Onboarding.module.css"
import React, {ChangeEvent, useState} from "react";
import Form from "react-bootstrap/Form";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useSwiper } from 'swiper/react';
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../index";
import {doc, setDoc} from "firebase/firestore";
import {NavigateFunction, useNavigate} from "react-router-dom";
// Core modules imports are same as usual
// Direct React component imports
//TODO add email verification or phone number protocol

function SlideNextButton() {
    const swiper = useSwiper();
    return (
        <button className={styles.navigationButton} onClick={() => swiper.slideNext()}>Next</button>
    );
}

function SlidePreviousButton() {
    const swiper = useSwiper();
    return (
        <button className={styles.navigationButton} onClick={() => swiper.slidePrev()}>Prev</button>
    );
}

/**
 * Onboarding function that gets critical user data for new users.
 *
 */
export function Onboarding() {
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();

    //TODO in the future there needs to be onboarding branches so that this app can be utilized
    //in a more sensitive way.
    //set so that the arrows dont show up
    const [txtPartnerLastname, setTxtPartnerLastname] = useState('');
    const [txtPartnerFirstname, setTxtPartnerFirstname] = useState('');
    const [txtUserFirstname, setTxtUserFirstname] = useState('');
    const [txtUserLastname, setTxtUserLastname] = useState('');
    const handlePartnerLastname = (event: ChangeEvent<HTMLInputElement>) => {
        setTxtPartnerLastname(event.currentTarget.value);
        console.log(txtPartnerLastname);
    }

    const handlePartnerFirstname = (event:ChangeEvent<HTMLInputElement>) => {
        setTxtPartnerFirstname(event.target.value);
        console.log(txtPartnerFirstname);
    }

    const handleUserFirstname = (event: ChangeEvent<HTMLInputElement>) => {
        setTxtUserFirstname(event.currentTarget.value);
        console.log(txtUserFirstname);
    }
    const handleUserLastname = (event: ChangeEvent<HTMLInputElement>) => {
        setTxtUserLastname(event.currentTarget.value);
        console.log(txtUserLastname);
    }

    // noinspection TypeScriptValidateTypes
    if(user) {
        return (
            <div>
                <style> @import url('https://fonts.googleapis.com/css2?family=Pavanam&display=swap');</style>
                <h1 className={styles.sheskaLogo}>Sheska</h1>
                <div className={styles.onboardingContainer}>
                    <Swiper allowTouchMove={false}>
                        <SwiperSlide>
                            <div className={styles.questionPane}>
                                <h1 className={styles.questionPaneTitle}>Thank you for choosing to make
                                    memories together!
                                    But first, tell us about yourself!</h1>
                                <div className={styles.navigationButtonsContainer}>
                                    <SlideNextButton/>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            {/*TODO this can ask for much more information and it should be refactored to utilize
                        the fancy bootstrap column crap*/}
                            <div className={styles.questionPane}>
                                <h1 className={styles.questionPaneTitle}>Just the essentials.</h1>
                                <Form>
                                    <Form.Group className={"mb-3 w-75 mx-auto"} controlId="formBasicEmail">
                                        <Form.Control placeholder="Your First Name" onChange={handleUserFirstname}/>
                                    </Form.Group>
                                    <Form.Group className={"mb-3 w-75 mx-auto"}>
                                        <Form.Control  placeholder="Your Last Name" onChange={handleUserLastname}/>
                                    </Form.Group>
                                </Form>
                                <div className={styles.navigationButtonsContainer}>
                                    <SlidePreviousButton/>
                                    <SlideNextButton/>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className={styles.questionPane}>
                                <h1 className={styles.questionPaneTitle}>Do you have a partner?</h1>
                                <Form>
                                    <Form.Group className={"mb-3 w-75 mx-auto"} controlId="formBasicEmail">
                                        <Form.Control placeholder="Partner first name" onChange={handlePartnerFirstname}/>
                                    </Form.Group>
                                    <Form.Group className={"mb-3 w-75 mx-auto"}>
                                        <Form.Control  placeholder="Partner last name" onChange={handlePartnerLastname}/>
                                    </Form.Group>
                                </Form>
                                <div className={styles.navigationButtonsContainer}>
                                    <SlidePreviousButton/>
                                    <button className={styles.navigationButton} onClick={() => {sendUserOnboardingData(navigate,
                                        txtUserFirstname, txtUserLastname, txtPartnerFirstname, txtPartnerLastname)}}>Submit</button>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
        )
    } else if(loading) {
        //TODO need to do loading
        return (<div> <h1>Loading</h1> </div>)
    } else if(error) {
        return (
            <div><h1>Error</h1></div>
        )
    }

    return null
}


async function sendUserOnboardingData(navigate : NavigateFunction, txtUserFirstname: string, txtUserLastname: string,
                                      txtPartnerFirstname: string, txtPartnerLastname: string) {
    const user = auth.currentUser;
    if (user) {
        // take the partner data and send it to the user, take the name information, set isOnboarded to true,
        // and send the user to the home page.
        const userRef = doc(db, 'users', user.uid);
        setDoc(userRef, { partners: [txtUserFirstname, txtPartnerFirstname],
                                full_name: [txtUserFirstname,txtUserLastname],
                                passedOnboarding: true}, { merge: true });

        navigate('/dashboard')
    }
}