import React, { useEffect, useState, useCallback } from "react";
import { Button, Dropdown, Image, Modal, Item, Card, List } from "semantic-ui-react";
import { useRecoilValue } from "recoil";
import { ualAtom } from "../../atoms/ual.js"
import { timezoneSelector, deadlineSelector } from "../../atoms/state"
import moment from "moment-timezone";
import { sendTimezone } from "../../utils/transactions"
import { getAvatar } from "../../utils/avatars.js";
import { CheckForUser } from "../../utils/hooks.js";
import { 
        StyledModal, 
        StyledContentModal, 
        StyledDescriptionModal, 
        StyledItemGroup, 
        StyledListImageWrapper, 
        StyledListImage, 
        StyledHeader} from "./styles"

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
                <br />
                Your data is stored nowhere, and everywhere: that's the blockchain magic.
                To continue, just install one of these wallets. That's right, no more passwords!
                <br /><br />
                Visit the <a href="/about" target="_blank" rel="noopener noreferrer">about</a> page to know more about
                this bright new technology
            </StyledDescriptionModal>
            <StyledContentModal className="list" image>
                <List celled link>
                    <List.Item as="a" href="https://www.getwombat.io/" target="_blank" rel="noopener noreferrer">
                        <StyledListImageWrapper>
                            <StyledListImage size="small" src={require("../../images/wombat.png")} />
                        </StyledListImageWrapper>
                        <List.Content>
                            A browser extension. Supports EOS and TELOS blockchains,
                            so it's a great fit for this website. It's dead simple,
                            just install and follow the instructions
                        </List.Content>
                    </List.Item>
                    <List.Item as="a" href="http://get-scatter.com" target="_blank" rel="noopener noreferrer">
                        <StyledListImageWrapper>
                            <StyledListImage size="small"  src={require("../../images/scatter.png")} />
                        </StyledListImageWrapper>
                        <List.Content>
                            A desktop wallet. Supports EOS, TELOS and also Ethereum,
                            so it's a nice wallet if you want to trade or interact
                            with Ethereum applications.
                        </List.Content>
                    </List.Item>
                </List>
            </StyledContentModal>
        </StyledModal>
    )
}

export function ProfileModal({logout, children}) {
    const [activeModal, setActiveModal] = useState("home");
    const [isModalOpen, setIsModalOpen] = useState(false)

    const account = useRecoilValue(ualAtom)
    const [accName, setAccName] = useState("");

    // async function asyncGetAccName() {
    //     const name = await account.activeUser.getAccountName()
    //     setAccName(name)
    // }

    const asyncGetAccName = useCallback(async () => {
        const name = await account.activeUser.getAccountName()
        setAccName(name)
    }, [account.activeUser])

    useEffect(() => {
        asyncGetAccName()
    }, [account, asyncGetAccName])


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
                    ? <ProfileHomeScreen accountName={accName} setActiveModal={setActiveModal} close={resetAndShow}/>
                    : activeModal === "timezone"
                    ? <TimezoneModal close={resetAndShow}/>
                    :
                    <></>
                }
        </StyledModal>
    )
}

function ProfileHomeScreen({accountName, setActiveModal, close}) {
    const logout = () => {};
    const deadline = useRecoilValue(deadlineSelector)
    // const account = useRecoilValue(scatterAccountAtom)

    return (
        <>
            <Modal.Header>
                Profile
            </Modal.Header>
            <StyledDescriptionModal>
                <Card>
                    <Image src={`https://semantic-ui.com/images/avatar/large/${getAvatar(accountName)}.jpg`} />
                    <Card.Content>
                        <Card.Header className="justify-content-center">
                            {accountName}
                        </Card.Header>
                        <Card.Description>
                            <StyledItemGroup>
                                {deadline &&
                                <>
                                <Item.Image src={require("../../images/fountain-pen.png")} />
                                <Item>
                                    <Item.Content>
                                        <Item.Header>Post until</Item.Header>
                                        <Item.Description>{deadline}</Item.Description>
                                    </Item.Content>
                                </Item>
                                </>
                                }
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
    const [tzNames, setTzNames] = useState();
    const [tz, setTz] = useState();
    const [success, setSuccess] = useState(null)
    const account = useRecoilValue(ualAtom)

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
        account.signTransaction(transaction, { blocksBehind: 3, expireSeconds: 30 })
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

export function TimezoneModal({accountName, close}) {
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