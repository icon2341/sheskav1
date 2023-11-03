import styles from './ProductPage.module.css';
import React, {useRef} from "react";
import {useNavigate} from "react-router-dom";
import {useTrail, a} from "react-spring";
import { Button } from "src/components/ui/button";
import CrowdImage from '../../images/Crowdsourcing.png'

export function ProductPage() {
    const navigate = useNavigate();
    const laptopRef = React.createRef<HTMLDivElement>();
    const Trail: React.FC<{ open: boolean, children: any }> = ({ open, children }) => {
        const items = React.Children.toArray(children)
        const trail = useTrail(items.length, {
            config: { mass: 5, tension: 2000, friction: 200},
            opacity: open ? 1 : 0,
            x: open ? 0 : 20,
            height: open ? 130 : 0,
            from: { opacity: 0, x: 20, height: 0 },
            delay: 400
        })
        return (
            <div>
                {trail.map(({ height, ...style }, index) => (
                    <a.div key={index} className={styles.trailsText} style={style}>
                        <a.div style={{ height }}>{items[index]}</a.div>
                    </a.div>
                ))}
            </div>
        )
    }

    return (
        <div className={"flex-col flex"}>
            {/*DESKTOP NAV BAR*/}
            <div className={"flex-row flex flex-auto full justify-between p-3"}>
                <div className={"font-serif text-5xl text-primary font-black"}>S</div>
                {/*<div className={styles.navLinksContainer}>*/}
                {/*    /!*<h2 onClick={() =>  {navigate('/product')}} className={styles.navigationLink}>Coming Summer 2023</h2>*!/*/}
                {/*    /!*<h2 className={styles.navigationLink}>Careers</h2>*!/*/}
                {/*    /!*<h2 className={styles.navigationLink}>Blog</h2>*!/*/}
                {/*    /!*<h2 className={styles.navigationLink}>Support</h2>*!/*/}
                {/*</div>*/}
                <div className={"flex-row flex"}>
                    <Button className={"m-1"}  variant={'outline'} onClick={() => navigate('/signup')}>Sign Up</Button>
                    <Button className={"m-1"} onClick={() => navigate('/login')}>Log in</Button>
                </div>
            </div>

            {/*Hero*/}
            <div className={"flex flex-col justify-center items-center"}>
                <div className={"flex flex-col items-center w-11/12 md:w-50"}>
                    <div className={"hidden md:block mt-64"}>
                        <Trail open={true}>
                            <h1 className={`${styles.textGradient} font-mono font-black text-xl md:text-4xl lg:text-5xl xl:text-6xl text-center text-black`}>Supercharge Event<br/>Funding.</h1>
                        </Trail>
                    </div>
                    <h1 className={`${styles.textGradient} md:hidden pt-10 mb-5 font-mono font-black text-xl md:text-4xl lg:text-5xl xl:text-6xl text-center text-black`}>Supercharge Event<br/>Funding.</h1>
                    <h2 className={"text-center font-sans text-xl md:text-2xl lg:text-3xl xl:text-4xl w-75 mb-10 max-w-3xl"}>
                        A comprehensive platform designed to seamlessly connect with your guests, from financial transactions to open communication.
                    </h2>

                    <div className={"flex flex-row justify-center w-50"}>
                        <Button className={"m-2 w-50"} size={"lg"} onClick={() => navigate('/signup')}>Sign Up</Button>
                        <Button className={"m-2 w-50"} variant={'outline'} size={"lg"} onClick={() => navigate('/login')}>Learn More</Button>
                    </div>
                </div>
            </div>

            {/*Features*/}

            <section className={"md:mt-96"}>
                <div className={"flex flex-col md:p-10 p-5"}>
                    <div className={"flex flex-col md:flex-row align-middle justify-center radi"}>
                        <div className={"bg-slate-900 rounded-lg px-10 py-20"}>
                            <div className={"flex flex-col md:flex-row grow mx-30 justify-center md:align-middle"}>
                                <div className={"md:w-1/4"}>
                                    <img src={CrowdImage} alt={"Many doors with glowing balls exiting them"}></img>
                                </div>
                                <div className={"flex flex-col md:ml-20 md:mt-0 mt-10 justify-center"}>
                                    <h1 className={"text-3xl text-white font-mono font-black max-w-sm"}>Guest Crowdsourced
                                        Funding.</h1>
                                    <h2 className={"text-xl text-white max-w-md mt-3 text-serif"}>Sheska offers hosts a seamless way to raise funds while enabling guests to fulfill their desires for gift giving, philanthropy, or community-driven event participation</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
}

export default ProductPage;