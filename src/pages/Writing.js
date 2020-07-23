import React, { useEffect, useState } from "react";
import { Form, TextArea, Button, Container, Grid, Header, Statistic, Message } from "semantic-ui-react";

import { useRecoilState, useRecoilValue } from "recoil";
import { network } from "../utils/network"
import {  pointsSelector, achievementSelector } from "../atoms/state.js";
import { transactionsAtom } from "../atoms/history";
import { ualAtom } from "../atoms/ual"

import { write } from "../utils/transactions"


export default function Writing(props) {
	let MINIMUM = 5;
	const [pauseDuration, setPauseDuration] = useState(0);
	const [maxPause, setMaxPause] = useState(0);
	const [totalTime, setTotalTime] = useState(null);
	const [text, setText] = useState("");
	const [wordCount, setWordCount] = useState(0);
	const [reachedMin, setReachedMin] = useState(false);

	const account = useRecoilValue(ualAtom)

	const points = useRecoilValue(pointsSelector)
	const challenges = useRecoilValue(achievementSelector)
	const transactions = useRecoilValue(transactionsAtom)

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
		setReachedMin(count > MINIMUM)
	}, [text])


	async function submit() {
		const accname = await account.activeUser.getAccountName()
		const transaction = write({accname, wordCount, maxPause, totalTime, text});
		console.log(transaction)
		account.activeUser.signTransaction(transaction, {
			// blocksBehind: 3,
			// expireSeconds: 30
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
				<Grid.Column width={10}>
					<Form>
						<TextArea
							autoHeight
							placeholder="Open your mind!"
							rows={30}
							onChange={(e) => setText(e.target.value)}
							value={text}
						/>
						{reachedMin ? <h1>Nice job!</h1> : <h1>Still {MINIMUM - wordCount} words to go!</h1>}
						<Button disabled={!reachedMin} onClick={submit}>
							Submit
						</Button>
					</Form>
				</Grid.Column>
				<Grid.Column width={6}>
					<Statistic.Group size="tiny" widths='two' style={{marginBottom: "1rem"}}>
						<Statistic>
							<Statistic.Label>
								Total points
							</Statistic.Label>
							<Statistic.Value>
								{points}
							</Statistic.Value>
						</Statistic>
					</Statistic.Group>
					<Statistic.Group size="tiny" widths='two'>
						<Statistic>
							<Statistic.Label>
								Your achievements
							</Statistic.Label>
							<Statistic.Value>
								{challenges && challenges.length}
							</Statistic.Value>
						</Statistic>
					</Statistic.Group>
				</Grid.Column>
			</Grid>
		)
	}

	return (
		<Container>
			{success && 
				<Message positive>
					<Message.Header>Good job! Do you want to give me a little bit more of your amazigness?</Message.Header>
				</Message>
			}
			{failure && 
				<Message negative>
					<Message.Header>Oh, something went wrong! Please try again</Message.Header>
				</Message>
			}
			<Header as="h1">Writing</Header>
			{form()}
		</Container>
	);

	
}

