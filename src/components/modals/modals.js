import React, { useEffect, useState } from "react";
import { Button, Menu, Dropdown, Image, Modal, Item, Card, Header } from "semantic-ui-react";
import styled from "styled-components";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { scatterAtom, scatterAccountAtom, eosAtom } from "../../atoms/scatter.js"
import { timezoneSelector, deadlineSelector } from "../../atoms/state"
import moment from "moment-timezone";
import { sendTimezone } from "../../utils/transactions"
import { getAvatar } from "../../utils/avatars.js";
import { CheckForUser } from "../../utils/hooks.js";
import { Link } from "react-router-dom";

const StyledModal = styled(Modal)`
    &.top {
        position: absolute;
        top: 5%;
        right: 5%;
    }
`

const StyledDescriptionModal = styled(Modal.Description)`   
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding: 1.25rem 1.5rem;

    &.text {
        display: block;
    }
`

const StyledContentModal = styled(Modal.Content)`
    display: flex !important;
    justify-content: center;

    &.list {
        padding: 3rem 10rem !important;
    }
`

const StyledItemGroup = styled(Item.Group)`
    padding: 1.25rem 1.5rem;
`

const StyledItem = styled(Item)`
    display: flex;
    align-items: center;    
`

const StyledItemContent = styled(Item.Content)`
    padding: 1rem;    
`

const StyledHeader = styled(Header)`
    text-align: center
`

export function RegisterModal() {
    return (
        <StyledModal
            trigger={<Button>Register</Button>}
            size="small">
            <Modal.Header>
                Register
            </Modal.Header>
            <StyledDescriptionModal className="text">
                <StyledHeader> Welcome to the web 3.0!</StyledHeader>
                Your data is stored nowhere, and everywhere: that's the blockchain magic.
                <StyledHeader>Is it safe?</StyledHeader>
                It is so safe that you don't even need to set up a password.
                Just create a wallet, and you're good to go.
            </StyledDescriptionModal>
            <StyledContentModal className="list" image>
                <Item.Group link divided>
                    <StyledItem 
                        href="https://chrome.google.com/webstore/detail/wombat-eos-telos-wallet/amkmjjmmflddogmhpjloimipbofnfjih">
                        <Item.Image size="small" src={require("../../images/wombat.png")}/>
                        <StyledItemContent>
                            <Item.Header>
                                Wombat Wallet
                            </Item.Header>
                            <Item.Description>
                                A browser extension. Supports EOS and TELOS blockchains,
                                so it's a great fit for this website. It's dead simple,
                                just install and follow the instructions
                            </Item.Description>
                        </StyledItemContent>
                    </StyledItem>
                    <StyledItem 
                        href="http://get-scatter.com/">
                        <Item.Image size="small" src={require("../../images/scatter.png")}/>
                        <StyledItemContent>
                            <Item.Header>
                                Scatter
                            </Item.Header>
                            <Item.Description>
                                A desktop wallet. Supports EOS, TELOS and also Ethereum,
                                so it's a nice wallet if you want to trade or interact
                                with Ethereum applications.
                            </Item.Description>
                        </StyledItemContent>
                    </StyledItem>
                </Item.Group>
            </StyledContentModal>
        </StyledModal>
    )
}

export function ProfileModal({logout, children}) {
    const [activeModal, setActiveModal] = useState("home");
    const [isModalOpen, setIsModalOpen] = useState(false)

    function resetAndShow() {
        setActiveModal("home");
        setIsModalOpen(!isModalOpen);
    }

    return (
        <StyledModal 
            className="top"
            trigger={<Button onClick={resetAndShow}>Profile</Button>}
            onClose={resetAndShow}
            open={isModalOpen}
            size="mini">
                {
                    activeModal === "home"
                    ? <ProfileHomeScreen setActiveModal={setActiveModal} close={resetAndShow}/>
                    : activeModal === "timezone"
                    ? <TimezoneModal close={resetAndShow}/>
                    :
                    <></>
                }
        </StyledModal>
    )
}

function ProfileHomeScreen({setActiveModal, close}) {
    const logout = () => {};
    const deadline = useRecoilValue(deadlineSelector)
    const account = useRecoilValue(scatterAccountAtom)

    return (
        <>
            <Modal.Header>
                Profile
            </Modal.Header>
            <StyledDescriptionModal>
                <Card>
                    <Image src={`https://semantic-ui.com/images/avatar/large/${getAvatar(account.name)}.jpg`} />
                    <Card.Content>
                        <Card.Header className="justify-content-center">
                            {account.name}
                        </Card.Header>
                        <Card.Description>
                            <StyledItemGroup>
                                <Item.Image src={require("../../images/fountain-pen.png")} />
                                <Item>
                                    <Item.Content>
                                        <Item.Header>Post until</Item.Header>
                                        <Item.Description>{deadline}</Item.Description>
                                    </Item.Content>
                                </Item>
                            </StyledItemGroup>
                        </Card.Description>
                    </Card.Content>
                </Card>
                
            </StyledDescriptionModal>
            <StyledContentModal>
                <Button onClick={logout}>
                    Logout
                </Button>
                <Button onClick={() => setActiveModal("timezone")}>
                    Timezone
                </Button>
                <Button onClick={close}>
                    Back
                </Button>
            </StyledContentModal>
        </>
    )
}


function ChangeTz({close}) {
	const account = useRecoilValue(scatterAccountAtom)
    const [tzNames, setTzNames] = useState();
    const [tz, setTz] = useState();
    const eos = useRecoilValue(eosAtom)
    const [success, setSuccess] = useState(null)

    useEffect(() => {
        const tzNamesArr = moment.tz.names().map((i) => {
            return ({
                key: i,
                value: i,
                text: i
            })
        })
        setTzNames(tzNamesArr)
    }, [])



    function sendEosTransaction() {
        const deadline = moment.tz({hour: 23, minute: 59, second: 59}, tz).subtract(process.env.REACT_APP_SUBMISSION_INTERVAL_DAYS, "days").unix()
        const transaction = sendTimezone({account, tz, deadline})
        eos.transact(transaction, { blocksBehind: 3, expireSeconds: 30 })
        .then((result) => {
            setSuccess("Success!")
        })
        .catch((err) => {
            setSuccess("Ooops! Something went wrong...")
        })
    }


    if (success !== null) {
        return (
            <>
            <StyledDescriptionModal>
                {success}
                <CheckForUser />
            </StyledDescriptionModal>
            <StyledContentModal>
                <Button onClick={() => close(true)}>
                    Back
                </Button>
            </StyledContentModal>
            </>
        )
    }
    return (
        <>
            <StyledDescriptionModal>
                <Dropdown
                    placeholder="What's your timezone?"
                    fluid
                    search
                    selection
                    options={tzNames}
                    onChange={(e, {value}) => setTz(value)} />
            </StyledDescriptionModal>
            <StyledDescriptionModal>
                {tz && `Set timezone as ${tz}?`}
            </StyledDescriptionModal>
            <StyledContentModal>
                <Button onClick={() => close(true)}>
                    Back
                </Button>
                {tz &&
                    <Button onClick={sendEosTransaction}>
                        Yes!
                    </Button>
                }
            </StyledContentModal>
        </>
    )
}

function TzSet({close, setChangingTz}) {
    const tz = useRecoilValue(timezoneSelector)
    const deadline = useRecoilValue(deadlineSelector)

    if (!tz) {
        return (
            <>
                <StyledDescriptionModal>
                    Oh, seems like you haven't set your timezone.
                    <br/><br/>
                    This means that you have to submit until {deadline} every day.
                    <br/><br/>
                    Do you want to set your timezone so it matches your midnight?
                </StyledDescriptionModal>

                <StyledContentModal>
                    <Button onClick={setChangingTz}>
                        Sure!
                    </Button>
                    <Button onClick={() => close(true)}>
                        Nah, it's fine
                    </Button>
                </StyledContentModal>
            </>
        )
    } else {
        return (
            <>
                <StyledDescriptionModal>
                    I think your timezone is {tz}. Is this correct?
                </StyledDescriptionModal>

                <StyledContentModal>
                    <Button onClick={() => close(true)}>
                        Sure is!
                    </Button>
                    <Button onClick={setChangingTz}>
                        Nah
                    </Button>
                </StyledContentModal>
            </>
        )
    }
    
}

export function TimezoneModal({close}) {
    const [changingTz, setChangingTz] = useState(false)

    return (
        <>
            <Modal.Header>
                Timezone
            </Modal.Header>
            {changingTz ? <ChangeTz close={close}/> : <TzSet setChangingTz={setChangingTz} close={close}/>}
        </>
    )
}