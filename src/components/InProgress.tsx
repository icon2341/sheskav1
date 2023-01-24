import "./InProgress.css"


//TODO add functionaility and buttons to navigate to signup, login, welcomepage
export function InProgress() {
    return (
        <div id={"page-body"}>
            <section id={"title-section"}>
                <h1 id={"logo"}>Sheska</h1>
                <div id={"title-text-container"}>
                    <text id={"title-subtext"}> Where memories are made together</text>
                    <h1 id={"title-text"}>Bear with us while we get up and running.</h1>
                </div>
            </section>
            <section  id={"leading-section"}>
                <h1 id={"leading-text"}>Come See What is Next</h1>
            </section>
            <section id={"product-card-section"}>
                <div className={"product-card"}>
                    <img src={require("../images/dv.gif")} alt="Interface example" className={"product-card-image"}/>
                    <div className={"product-card-text-container"}>
                        <h3 className={"product-card-title"}>
                            Easy to navigate interface
                        </h3>
                        <p className={"product-card-paragraph"}>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium animi architecto, autem culpa
                            dicta ducimus, eligendi harum ipsa laudantium minima mollitia necessitatibus odio perferendis quae
                            repellat repudiandae tenetur ut veniam.
                        </p>
                    </div>
                </div>
                <div className={"product-card"}>
                    <img src={require("../images/ci.gif")} alt="product card example" className={"product-card-image"}/>
                    <div className={"product-card-text-container"}>
                        <h3 className={"product-card-title"}>
                            Collect Guest Info Easily
                        </h3>
                        <p className={"product-card-paragraph"}>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium animi architecto, autem culpa
                            dicta ducimus, eligendi harum ipsa laudantium minima mollitia necessitatibus odio perferendis quae
                            repellat repudiandae tenetur ut veniam.
                        </p>
                    </div>
                </div>
                <div className={"product-card"}>
                    <img src={require("../images/DF.gif")} className={"product-card-image"}/>
                    <div className={"product-card-text-container"}>
                        <h3 className={"product-card-title"}>
                            Intuitive Donation Flow
                        </h3>
                        <p className={"product-card-paragraph"}>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium animi architecto, autem culpa
                            dicta ducimus, eligendi harum ipsa laudantium minima mollitia necessitatibus odio perferendis quae
                            repellat repudiandae tenetur ut veniam.
                        </p>
                    </div>
                </div>
                <div className={"product-card"}>
                    <img src={require("../images/AV.gif")} className={"product-card-image"}/>
                    <div className={"product-card-text-container"}>
                        <h3 className={"product-card-title"}>
                            View details at a glance
                        </h3>
                        <p className={"product-card-paragraph"}>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium animi architecto, autem culpa
                            dicta ducimus, eligendi harum ipsa laudantium minima mollitia necessitatibus odio perferendis quae
                            repellat repudiandae tenetur ut veniam.
                        </p>
                    </div>
                </div>
                <div className={"product-card"}>
                    <img alt={'Item details'} src={require("../images/ID.gif")} className={"product-card-image"}/>
                    <div className={"product-card-text-container"}>
                        <h3 className={"product-card-title"}>
                            View Items in Detail
                        </h3>
                        <p className={"product-card-paragraph"}>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium animi architecto, autem culpa
                            dicta ducimus, eligendi harum ipsa laudantium minima mollitia necessitatibus odio perferendis quae
                            repellat repudiandae tenetur ut veniam.
                        </p>
                    </div>
                </div>
            </section>
        </div>

    )
}


export default InProgress