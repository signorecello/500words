import React from "react";
import Header from "./header";
import { Message } from "semantic-ui-react";
import { useRecoilValue, useRecoilState } from "recoil";

import { notificationsAtom } from "../atoms/notifications";
import { pageAtom } from "../atoms/page";
import Landing from "../pages/Landing";
import About from "../pages/About";
import Achievements from "../pages/Achievements";
import Writing from "../pages/Writing"

export default function Layout(props) {
	const notification = useRecoilValue(notificationsAtom)
	const [activePage, setActivePage] = useRecoilState(pageAtom)


	return (
		<div>
			<Header ual={props.ual.ual} setActivePage={setActivePage}/>
			{notification &&
				<Message positive>
					<Message.Header>Whoa! You just earned the {notification} achievement! Amazing!</Message.Header>
				</Message>
			}
			{activePage === "home"
			? <Landing />
			: activePage === "about" 
			? <About />
			: activePage === "write"
			? <Writing />
			: activePage === "achievements"
			? <Achievements />
			: <div>Loading...</div>
			}
			{/* {props.children} */}
		</div>
	);
}