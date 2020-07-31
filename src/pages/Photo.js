import React, { useEffect, useState } from "react";
import { Form, TextArea, Button, Container, Grid, Header, Statistic, Message, Icon, Image } from "semantic-ui-react";

import { useRecoilValue } from "recoil";
import { pointsSelector, achievementSelector } from "../atoms/state.js";
import { ualAtom } from "../atoms/ual"

import { write } from "../utils/transactions"
import { AfterPostModal } from "../components/modals/postingModals";
import Camera from 'react-html5-camera-photo';
import ImageUploader from "react-images-upload"
import { StatisticsComp } from "../components/statistics"
import 'react-html5-camera-photo/build/css/index.css';
import styled from "styled-components";
import { capture } from "../utils/transactions"

export default function Writing(props) {
    const [isCapturing, setIsCapturing] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [photoData, setPhotoData] = useState(null)
    const account = useRecoilValue(ualAtom)
    
    const [success, setSuccess] = useState(false)
    const [failure, setFailure] = useState(false)

    function photo(data, method) {
        setIsCapturing(false)
        setIsUploading(false)
        if (method === "upload") {
            let reader = new FileReader();
            reader.onload = (e) => {
                setPhotoData({data: e.target.result, method: "upload"})
            }
            reader.readAsDataURL(data)
        } else {
            setPhotoData({data, method: "capture"})
        }
    }

    async function submit() {
        const name = await account.activeUser.getAccountName()
        const transaction = capture({name, photoData});
        console.log(transaction)
		account.activeUser.signTransaction(transaction, {
			broadcast: true
		})
		.then((result) => {
            setSuccess(true)
            console.log(result)
		})
		.catch((err) => {
			console.log(err)
			setFailure(true)
		})
    }

    function form() {
        return (
            <Grid>
                {!isCapturing &&
                <Grid.Column width={16}>
                    <Header className="justify-content-center">It's your picture!</Header>
                    {photoData ?
                    <p className="justify-content-center text-align-center">
                        Whoa! I bet it's an amazing picture! Hit submit if you're
                        happy with today's work!
                    </p>
                    :
                    <p className="justify-content-center text-align-center">
                        Take today's picture! Who knows what beautiful details
                        you'll find if you're just willing to look carefully?
                        <br /><br />
                        Don't worry, you'll be able to retrieve your picture later
                        if you want. Just remember this is all happening on your browser.
                        I don't even have a server to talk to. This is the power of the
                        blockchain
                    </p>}
                </Grid.Column>}
                <Grid.Column width={16} className="justify-content-center">
                    {photoData && 
                    <Button 
                        onClick={() => {
                            photoData.method === "capture"
                            ? setIsCapturing(true)
                            : setIsUploading(true)
                    }}>Retry</Button>}

                    {!photoData && <>
                    <Button onClick={() => setIsCapturing(true)}>
                        Capture
                    </Button>
                    <Button onClick={() => setIsUploading(true)}>
                        Upload image
                    </Button> </>}


                    {photoData && <Button onClick={() => submit()}>Submit</Button>}
                </Grid.Column>
                <Grid.Column width={16} className="justify-content-center">
                    {isCapturing && 
                    <Camera
                        idealFacingMode="environment"
                        // isFullscreen="true"
                        className="w-100"
                        onTakePhotoAnimationDone={ (dataUri) => photo(dataUri)} />}
                    {isUploading &&
                        <ImageUploader
                            withIcon={true}
                            buttonText='Choose images'
                            onChange={(dataUri) => photo(dataUri[0], "upload")}
                            imgExtension={['.jpg', '.gif', '.png', '.gif']}
                            maxFileSize={5242880}
                        />
                    }
                    {!isCapturing && !isUploading && photoData &&
                        <Image
                            src={photoData.data} />
                    }
                </Grid.Column>
            </Grid>
        )
    }

	return (
		<Container>
			{form()}
			{success && <AfterPostModal
				show={true}
                type="photo"
				photo={photoData.data} />}
			{failure && 
				<Message negative>
					<Message.Header>Oh, something went wrong! Please try again</Message.Header>
				</Message>
			}
		</Container>
	);

	
}

