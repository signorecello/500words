import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Landing from "./pages/Landing";
import Writing from "./pages/Writing";
import Achievements from "./pages/Achievements";
import Layout from "./components/layout";
import About from "./pages/About";
import { transactionsAtom } from "./atoms/history"
import { ualAtom } from "./atoms/ual"

import moment from "moment";
import { notificationsAtom } from "./atoms/notifications";
import { useRecoilValue, useRecoilState } from "recoil";
const HyperionSocketClient = require('@eosrio/hyperion-stream-client').default;
const client = new HyperionSocketClient(process.env.REACT_APP_TLOS_HTTP_ENDPOINT, {async: true});


export default function App(props) {
	const [transactions, setTransactions] = useRecoilState(transactionsAtom)
	const [notification, setNotification] = useRecoilState(notificationsAtom)
	const [ual, setUal] = useRecoilState(ualAtom)


	// function logout() {
	// 	setScatterAccount(null)
	// }


	// useEffect(() => {
	// 	login()
	// }, [props.ual])

	let buffer = [];
	useEffect(() => {	
		client.onConnect = () => {
			client.streamActions({
				contract: process.env.REACT_APP_CONTRACT,
				action: '',
				account: process.env.REACT_APP_CONTRACT,
				start_from: moment().subtract(process.env.REACT_APP_STREAM_FROM_INTERVAL_DAYS, "day").format(),
				read_until: 0,
				filters: [],
			  });
		}
		
		client.onData = async (data, ack) => {
			if (data.mode === "live" && data.content.act.name === "newach") {
				setNotification(data.content.act.data.achievement)
			}
			buffer.push(data.content);
			ack();
		}
		
		client.connect();
	}, [])

	useEffect(() => {
		setTimeout(() => {
			setTransactions(buffer)
		}, 2000)
	}, [])

	return (
		<BrowserRouter>
			<Layout ual={props}>
				<Route exact path="/" render={() => <Landing/>} />
				<Route exact path="/about" render={() => <About/>} />
				{ual && <Route exact path="/write" render={() => <Writing/>} />}
				{ual && <Route exact path="/achievements" render={() => <Achievements/>} />}
			</Layout>
		</BrowserRouter>
	);

}
