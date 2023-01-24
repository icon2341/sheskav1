
import styles from "./Onboarding.module.css"
import React, {Component, CSSProperties} from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {Carousel} from "react-responsive-carousel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export function Onboarding() {
    var arrowStyles: CSSProperties = {
        display: 'none'
    };
    class ExternalControlledCarousel extends Component<{}, { currentSlide: number; autoPlay: boolean }> {

        constructor(props: any) {
            super(props);

            this.state = {
                currentSlide: 0,
                autoPlay: true,
            };
        }

        next = () => {
            this.setState((state) => ({
                currentSlide: state.currentSlide + 1,
            }));
        };

        prev = () => {
            this.setState((state) => ({
                currentSlide: state.currentSlide - 1,
            }));
        };

        changeAutoPlay = () => {
            this.setState((state) => ({
                autoPlay: !state.autoPlay,
            }));
        };

        updateCurrentSlide = (index: number) => {
            const {currentSlide} = this.state;

            if (currentSlide !== index) {
                this.setState({
                    currentSlide: index,
                });
            }
        };

        buttonGroup = () => {
            return(
                <div className={styles.navigationButtonsContainer}>
                    <button className={styles.navigationButton} onClick={this.prev}>
                        Prev
                    </button>
                    <button className={styles.navigationButton} onClick={this.next} >
                        Next
                    </button>
                </div>
            )
        }

        render() {
            return (
                <div>
                    <style> @import url('https://fonts.googleapis.com/css2?family=Pavanam&display=swap');</style>
                    <h1 className={styles.sheskaLogo}>Sheska</h1>
                    <div className={styles.onboardingContainer}>
                        <Carousel autoPlay={false} selectedItem={this.state.currentSlide} onChange={this.updateCurrentSlide}
                                  statusFormatter={(current, total) => ``}
                                  renderArrowPrev={(onClickHandler, hasPrev, label) =>
                                      hasPrev && (
                                          <button type="button" onClick={onClickHandler} title={label} style={{ ...arrowStyles, left: 15 }}>
                                              -
                                          </button>
                                      )
                                  }
                                  renderArrowNext={(onClickHandler, hasNext, label) =>
                                      hasNext && (
                                          <button type="button" onClick={onClickHandler} title={label} style={{ ...arrowStyles, right: 15 }}>
                                              +
                                          </button>
                                      )
                                  }
                                  {...this.props}>
                            <div className={styles.questionPane}>
                                <h1 className={styles.questionPaneTitle}>Thank you for choosing to make
                                    memories together!
                                    But first, tell us about yourself!</h1>
                                <div className={styles.navigationButtonsContainer}>
                                    <button className={styles.navigationButton} onClick={this.next} >
                                        Next
                                    </button>
                                </div>
                            </div>
                            <div className={styles.questionPane}>
                                <h1 className={styles.questionPaneTitle}>Do you have a partner? Tell us about them!</h1>
                                <Form>
                                    <Form.Group className={"mb-3 w-75 mx-auto"} controlId="formBasicEmail">
                                        <Form.Control placeholder="Partner first name" onChange={() =>{}}/>
                                    </Form.Group>
                                    <Form.Group className={"mb-3 w-75 mx-auto"}>
                                        <Form.Control  placeholder="Partner last name" onChange={() =>{}}/>
                                    </Form.Group>
                                </Form>
                                {this.buttonGroup()}
                            </div>

                        </Carousel>
                    </div>
                </div>
            )
        }
    }

    return <ExternalControlledCarousel />;
}