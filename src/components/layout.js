import React, { useState, useEffect } from "react";
import Header from "./header";
import { Message } from "semantic-ui-react";
import { transactionsAtom } from "../atoms/history";
import { useRecoilValue } from "recoil";

import { notificationsAtom } from "../atoms/notifications";

export default function Layout(props) {
	const notification = useRecoilValue(notificationsAtom)


	return (
		<div>
			<Header ual={props.ual.ual}/>
			{notification &&
				<Message positive>
					<Message.Header>Whoa! You just earned the {notification} achievement! Amazing!</Message.Header>
				</Message>
			}
			{props.children}
		</div>
	);
}