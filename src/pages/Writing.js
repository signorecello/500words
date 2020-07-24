import React, { useEffect, useState } from "react";
import { Form, TextArea, Button, Container, Grid, Header, Statistic, Message, Icon } from "semantic-ui-react";

import { useRecoilValue } from "recoil";
import { pointsSelector, achievementSelector } from "../atoms/state.js";
import { ualAtom } from "../atoms/ual"

import { write } from "../utils/transactions"
import { AfterPostModal } from "../components/modals/postingModals";


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

	const points = useRecoilValue(pointsSelector)
	const challenges = useRecoilValue(achievementSelector)

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
		const count = text.split(" ").length
		setWordCount(count)
		setReachedMin(count > process.env.REACT_APP_MINIMUM_WORDS)
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

	useEffect(() => {
		const statbox = document.querySelector("#statistics_box")
		setTimeout(() => {
			statbox.style.display = writing ? "none" : "block";
		}, 550)
	}, [writing])

	function form() {
		return (
			<Grid stackable>
				<Grid.Column width={16}>
					<Statistic.Group size="tiny" widths='two' id="statistics_box" style={writing ? {
						visibility: "hidden",
						opacity: 0,
						transition: "visibility 0s .5s, opacity .5s linear"
						} : {
						visibility: "visible",
						opacity: 1,
						marginBottom: "1rem",
						transition: "opacity .5s linear"
					}}>
						<Statistic>
							<Statistic.Value>
								<Icon name="chart line"></Icon>
							</Statistic.Value>
							<Statistic.Value>
								{points}
							</Statistic.Value>
							<Statistic.Label>
								points
							</Statistic.Label>
						</Statistic>
						<Statistic>
							<Statistic.Value>
								<Icon name="rocket"></Icon>
							</Statistic.Value>
							<Statistic.Value>
								{challenges && challenges.length}
							</Statistic.Value>
							<Statistic.Label>
								Achievements
							</Statistic.Label>
						</Statistic>
					</Statistic.Group>
				</Grid.Column>
				<Grid.Column width={16}>
					<Form>
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
						{reachedMin ? <h1>Nice job!</h1> : <h1>Still {process.env.REACT_APP_MINIMUM_WORDS - wordCount} words to go!</h1>}
						<Button disabled={!reachedMin} onClick={submit}>
							Submit
						</Button>
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

