import React, { useEffect, useState } from "react";
import { Form, TextArea, Button, Container, Grid, Header, Statistic, Message, Icon } from "semantic-ui-react";

import { useRecoilValue } from "recoil";
import { ualAtom } from "../atoms/ual"

import { write } from "../utils/transactions"
import { AfterPostModal } from "../components/modals/postingModals";
import { StatisticsComp } from "../components/statistics"


export default function Writing(props) {
	const [pauseDuration, setPauseDuration] = useState(0);
	const [maxPause, setMaxPause] = useState(0);
	const [totalTime, setTotalTime] = useState(null);
	const [text, setText] = useState("");
	const [wordCount, setWordCount] = useState(0);
	const [reachedMin, setReachedMin] = useState(false);

	const [writing, setWriting] = useState()

	const account = useRecoilValue(ualAtom)
	const [accName, setAccName] = useState("")


	const [success, setSuccess] = useState(false);
	const [failure, setFailure] = useState(false);


	useEffect(() => {
		const pauseCounter = setInterval(() => { setPauseDuration(pauseDuration + 1) }, 1000);
		return () => clearInterval(pauseCounter)
	}, [pauseDuration])

	useEffect(() => {
		const totalTimeCounter = setInterval(() => { setTotalTime(totalTime + 1)}, 1000);
		return () => clearInterval(totalTimeCounter)
	}, [totalTime])


	// runs on every input (when text changes)
	useEffect(() => {
		// update state if max pause is higher than pause duration
		// then reset pause duration
		if (pauseDuration > maxPause) {
			setMaxPause(pauseDuration)
		}
		setPauseDuration(0)

		// count words and set the new words
		const count = text.split(" ").length - 1
		setWordCount(count)
		setReachedMin(count > process.env[`REACT_APP_MINIMUM_WORDS${process.env.REACT_APP_ENVIRONMENT}`])
	}, [text])


	async function submit() {
		const name = await account.activeUser.getAccountName()
		setAccName(name)
		const transaction = write({name, wordCount, maxPause, totalTime, text});
		account.activeUser.signTransaction(transaction, {
			broadcast: true
		})
		.then((result) => {
			setSuccess(true)
		})
		.catch((err) => {
			console.log(err)
			setFailure(true)
		})
	}

	function form() {
		return (
			<Grid stackable>
				{!text && 
				<Grid.Column width={16}>
					<p className="justify-content-center text-align-center">
                        Write something today. It's OK to not know what happens,
						maybe you're just not in the mood today? But forcing yourself
						to write will help clear your mind and become more creative.
                        <br /><br />
						Start something. Everything will
						be destroyed after submitting, but I'll be able to send
						you a copy to your e-mail if you want to keep your 500+ words!
                    </p>
				</Grid.Column>}
				<Grid.Column width={16}>
					<Form>
						<Grid.Row>
							<Grid.Column floated="left" width={4}>
								<Button basic color={reachedMin ? "olive" : false}>{wordCount} words</Button>
							</Grid.Column>
							<Grid.Column floated="right" width={4}>
								<Button disabled={!reachedMin} onClick={submit}>
									Submit
								</Button>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row className="mt-tiny">
							<TextArea
								style={writing === true ? {
									boxShadow: "0 0 0 100vmax rgba(0,0,0,.5)",
									height: "65vh",
									transition: "boxShadow 0s 0.5s, height 0.5s linear"
								} : {
									height: "50vh",
								}}
								placeholder="Open your mind!"
								rows={30}
								id="writing-box"
								onFocus={() => setWriting(true)}
								onBlur={() => setWriting(false)}
								onChange={(e) => setText(e.target.value)}
								value={text}
							/>
						</Grid.Row>
					</Form>
				</Grid.Column>

			</Grid>
		)
	}

	return (
		<Container>
			{success && <AfterPostModal
				show={true}
				accName={accName}
				type="text"
				text={text} />}
			{failure && 
				<Message negative>
					<Message.Header>Oh, something went wrong! Please try again</Message.Header>
				</Message>
			}
			<Header as="h1" className="text-align-center">Writing</Header>
			{form()}
		</Container>
	);

	
}

