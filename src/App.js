import React, {useEffect } from "react";
import Layout from "./components/layout";
import { transactionsAtom } from "./atoms/history"

import moment from "moment";
import { notificationsAtom } from "./atoms/notifications";
import { useSetRecoilState } from "recoil";
const HyperionSocketClient = require('@eosrio/hyperion-stream-client').default;
const client = new HyperionSocketClient(process.env.REACT_APP_TLOS_HTTP_ENDPOINT, {async: true});


export default function App(props) {
	const setTransactions = useSetRecoilState(transactionsAtom)
	const setNotification = useSetRecoilState(notificationsAtom)

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
			try {

				if (data.mode === "live" && data.content.act.name === "newach") {
					setNotification(data.content.act.data.achievement)
				}
				buffer.push(data.content);
				ack();
			} catch(err) {
				console.log(err)
			}
		}
		
		client.connect();
	}, [buffer, setNotification])

	useEffect(() => {
		setTimeout(() => {
			setTransactions(buffer)
		}, 2000)
	}, [buffer, setTransactions])

	return (
		<Layout ual={props}>
		</Layout>
	);

}
