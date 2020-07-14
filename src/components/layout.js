import React, { useState, useEffect } from "react";
import Header from "./header";
import { Message } from "semantic-ui-react";
import { transactionsAtom } from "../atoms/history";
import { useRecoilState } from "recoil";
import moment from "moment";

const HyperionSocketClient = require('@eosrio/hyperion-stream-client').default;
const client = new HyperionSocketClient(`${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_TLOS_HTTP_ENDPOINT}`, {async: true});


export default function Layout(props) {

	const [newAch, setNewAch] = useState(null)
	const [transactions, setTransactions] = useRecoilState(transactionsAtom)

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
				setNewAch(data.content.act.data.achievement)
			}
			setTransactions((oldData) => [...oldData, data.content])
			ack();
		}
		
		client.connect();
	}, [])

	return (
		<div>
			<Header/>
			{ newAch &&
				<Message positive>
					<Message.Header>Whoa! You just earned the {newAch} achievement! Amazing!</Message.Header>
				</Message>
			}
			{props.children}
		</div>
	);
}