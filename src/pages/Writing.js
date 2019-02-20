import React, { useEffect, useState } from "react";
import { Form, TextArea, Button, Container, Grid, Header, Statistic, Message } from "semantic-ui-react";

import { useRecoilState, useRecoilValue } from "recoil";
import { scatterAtom, scatterAccountAtom, eosAtom } from "../atoms/scatter.js"
import { network } from "../utils/network"
import moment from "moment"
import { submittedSelector, pointsSelector, achievementSelector } from "../atoms/state.js";
import { transactionsAtom } from "../atoms/history";
const murmur = require("murmurhash-js");


export default function Writing(props) {
	let MINIMUM = 5;
	const [pauseDuration, setPauseDuration] = useState(0);
	const [maxPause, setMaxPause] = useState(0);
	const [totalTime, setTotalTime] = useState(null);
	const [text, setText] = useState("");
	const [wordCount, setWordCount] = useState(0);
	const [reachedMin, setReachedMin] = useState(false);

	const eos= useRecoilValue(eosAtom)
	const account = useRecoilValue(scatterAccountAtom)

	const lastSubmitted = useRecoilValue(submittedSelector)
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

	useEffect(() => {

	}, [success])



	function submit() {
		eos.transact({
			actions: [
				{
					account: process.env.REACT_APP_CONTRACT,
					name: "open",
					authorization: [
						{
							actor: account.name,
							permission: "active",
						},
					],
					data: {
						user: account.name,
					},
				},
				{
					account: process.env.REACT_APP_CONTRACT,
					name: "post",
					authorization: [
						{
							actor: account.name,
							permission: "active",
						},
					],
					data: {
						user: account.name,
						hash: murmur.murmur3(text, "500words!"),
						wordcount: wordCount,
						max_pause: maxPause,
						total_time: totalTime,
						type: process.env.REACT_APP_WRITE_TYPE
					},
				}
			],
		}, {
			blocksBehind: 3,
			expireSeconds: 30
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
								Last post
							</Statistic.Label>
							<Statistic.Value>
								{moment.unix(lastSubmitted).format("DD/MM/YY")}
								<br />
								{moment.unix(lastSubmitted).format("hh:mma")}
							</Statistic.Value>
						</Statistic>
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

