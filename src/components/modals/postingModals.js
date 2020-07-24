import React, { useState, useEffect } from "react"
import { Modal, Input, Button, Image } from "semantic-ui-react"
import emailjs from 'emailjs-com';
import { ShareButton } from 'react-facebook';
import { 
    StyledModal, 
    StyledContentModal, 
    StyledDescriptionModal, 
    StyledHeader} from "./styles"
import styled from "styled-components";
    
const StyledInputEmail = styled(Input)`
    flex: 0 0 80%;
`

const StyledSendButton = styled(Button)`
    flex: 0 0 20%;
`

const StyledFBShareButton = styled(ShareButton)`
    flex: 0 0 40%;
    height: 40px;
    border: 0;
    border-radius: 4px;
    background-color: #4267B2;
    color: white;
    cursor: pointer;
`

export function AfterPostModal({show, accName, text}) {
    const [modalOpen, setModalOpen] = useState(show)
    const [email, setEmail] = useState("")
    const [success, setSuccess] = useState(null)

    useEffect(() => {
        console.log(email)
    }, [email])

    function sendEmail() {
        emailjs.send(
            process.env.REACT_APP_EMAIL_SERVICE_ID, 
            process.env.REACT_APP_EMAIL_TEMPLATE_ID, 
            {email, accName, text}, 
            process.env.REACT_APP_EMAIL_USER_ID)
        .then((result) => {
            setSuccess(true)
        }, (error) => {
            setSuccess(false)
        });
    }

    function message() {
        if (success === true) {
            return (
                <StyledHeader>Email sent! See you tomorrow!</StyledHeader>
            )
        } else if (success === false) {
            return (
                <>
                    <StyledHeader>Oh nuts... Something went wrong.</StyledHeader>
                    Dont' worry, your submission is secured on the blockchain!
                </>
            )
        } else {
            return (
                <div className="row">
                    <StyledInputEmail placeholder="your@email.com" onChange={(e) => setEmail(e.target.value)}/>
                    <StyledSendButton onClick={sendEmail}>Send!</StyledSendButton>
                </div>
            )
        }
    }

    return (
        <StyledModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            size="tiny">
            <>
                <Modal.Header>
                    Great job!
                </Modal.Header>
                
                <StyledDescriptionModal className="text">
                    Do you want me to send a copy of your work to your e-mail?
                    Remember that I don't store <b>anything</b> about you. I don't
                    even have a server to talk to!
                </StyledDescriptionModal>
                <StyledContentModal className="wrap">
                    {message()}
                    <div className="row justify-content-center mt-tiny">
                        <StyledFBShareButton href={process.env.REACT_APP_APP_URL} hashtag="#500words">
                            <Image src={require("../../images/fb-logo.png")} avatar className="mr-mini"/>
                            Share
                        </StyledFBShareButton>
                    </div>
                </StyledContentModal>
            </>
        </StyledModal>
    )
}