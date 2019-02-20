import React, {useState} from "react";
import Layout from "../components/layout";
import { Container, Grid, Image, Accordion, Icon } from "semantic-ui-react";

const typewriter = require("../images/typewriter-sized.jpg");

function About() {
    const [active, setActive] = useState(0)

    return (
        <Container>
            <Grid stackable columns={2}>
                <Grid.Row>
                    <Grid.Column width={11} >
                        <h1
                            style={{
                                textAlign: "center"
                            }}
                        >
                            FAQ
                        </h1>
                        <Accordion styled>
                            <Accordion.Title  onClick={() => setActive("motivation")}>
                                <Icon name="dropdown" />
                                What's this, and what's your motivation?
                            </Accordion.Title>
                            <Accordion.Content active={active === "motivation"}>
                                During my master thesis on improvisation as a mean to achieve intrinsic motivation on little children, 
                                I've read a lot about creativity. I learned that creativity is a muscle, a sort of skill you need to 
                                practice in order to get better and better at.
                                <br /><br />
                                However, things are not that easy. Sometimes our brain is awfully ready to critize our own work and doesn't 
                                allow us to create. Sometimes we just don’t find the opportunity to stop and think. Sometimes we are afraid 
                                of the final work and don’t allow ourselves to just do something!
                                <br /><br />
                                500 words challenges you to write something every day. You'll receive awards for taking it easy, or being as
                                fast as possible, or writing without thinking... Maybe your achievements will shape your own characteristics?
                            </Accordion.Content>




                            <Accordion.Title  onClick={() => setActive("tech")}>
                                <Icon name="dropdown" />
                                What kind of technology is being used here?
                            </Accordion.Title>
                            <Accordion.Content active={active === "tech"}>
                                You can think of this as a sort of portfolio. I did a lot of work for QUDO so I wanted to show how powerful
                                blockchain can be even for small projects like this one.
                                <br /><br />
                                This was built using <a href="http://reactjs.org" target="_blank">React</a> and 
                                <a href="http://semantic-ui.com" target="_blank"> Semantic UI</a>. I also tried the new experimental library 
                                <a href="http://recoiljs.org" target="_blank"> Recoil</a> from Facebook as a state manager. As for the blockchain component, 
                                I'm using the <a href="http://get-scatter.com" target="_blank">Scatter</a> protocol to interact with the
                                <a href="http://telos.net" target="_blank"> Telos</a> blockchain, powered by the <a href="http://eos.io" target="_blank">EOS.IO</a>
                                protocol. 
                            </Accordion.Content>



                            <Accordion.Title onClick={() => setActive("login1")}>
                                <Icon name="dropdown" />
                                I don't see a login form, how am I supposed to login?
                            </Accordion.Title>
                            <Accordion.Content active={active === "login1"}>
                                I believe the future of internet doesn't require passwords. There's a better way of
                                identifying yourself than using some piece of text.
                                <br /><br />
                                To use this website, just install <a href="https://chrome.google.com/webstore/detail/wombat-eos-telos-wallet/amkmjjmmflddogmhpjloimipbofnfjih">wombat wallet</a>
                                on the chrome store. Create your wallet in seconds and that's as simple as that. You can now login using your wombat wallet
                                on any EOSIO-powered applications. 
                                <br /><br />
                            </Accordion.Content>



                            <Accordion.Title onClick={() => setActive("login2")}>
                                <Icon name="dropdown" />
                                How is this safer than traditional login/password forms?
                            </Accordion.Title>
                            <Accordion.Content active={active === "login2"}>
                                Your wallet stores a private key that you should keep safe. Mathematicians made sure that it's almost impossible to guess
                                your private key, but it's very easy to verify that a specific message has been "signed" by the holder of that private key,
                                which is you!
                                <br /><br />
                                When you login, this website requires that special signature to your wallet, and can thus gather specific data about you from
                                the blockchain, such as the last time you posted, your achievements and challenges. Pretty cool, right?
                            </Accordion.Content>


                            
                            <Accordion.Title onClick={() => setActive("qudo1")}>
                                <Icon name="dropdown" />
                                What are QUDO rewards and how can I earn them?
                            </Accordion.Title>
                            <Accordion.Content active={active === "qudo1"}>
                                QUDO rewards are a blockchain-powered rewarding mechanism developed by BlockBastards. It's currently mobile-oriented, although
                                as this app shows, it can also be applied to web applications. 
                                <br /><br />
                                To enable rewards, we need to collect some data from you such as your account name and your public key, and send it to our servers
                                so we can interact with the QUDO ecosystem. That's why you need to accept QUDO rewards. You can still write and post and use this
                                app if you don't have QUDO rewards enabled.
                            </Accordion.Content>
                        </Accordion>
                    </Grid.Column>
                    <Grid.Column width={5}>
                            <h1
                                style={{
                                    textAlign: "center"
                                }}
                            >
                                About me
                            </h1>
                            <p>
                            I was a cello teacher for some years, after being a professional musician. I got bored of teaching stuff to kids so I thought I could start teaching things to machines… And started learning programming all by myself. I made my own opportunities and became a blockchain developer at BlockBastards in 2018. I invite you to check out our main project, qudo.io 
                            <br /><br />
                            I believe blockchain technology will shape the future of our society, and is a powerful weapon against censorship. This little project is an example on how you can do good, while learning and even buying some coffee on the way.
                            </p>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
}

export default About;
