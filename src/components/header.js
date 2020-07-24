import React, { useEffect, useState } from "react";
import { Button, Menu, Sidebar, Icon } from "semantic-ui-react";
import { useRecoilState } from "recoil";

import { ualAtom } from "../atoms/ual.js"
import { CheckForUser } from "../utils/hooks"
import { ProfileModal, TimezoneModal, RegisterModal } from "./modals/profileModals"
import styled from "styled-components";

const StyledMetaButtons = styled.div`
	padding: 0 1rem;
`
const StyledHamburguer = styled(Button)`
	display: flex;
`

const TopBar = styled.div`
	position: sticky;
	height: 60px;
	width: 100%;
	z-index: 1;
	top: 0;
	background: white;
	display: flex;
	align-items: center;
	padding: 1rem;
`

function MenuItem({desktop, ual, logout, login, setActivePage}) {
	function subMenu() {
		return (
			<>
			<Menu.Item
				name="about"
				onClick={() => setActivePage("about")}
			/>
			<Menu.Item>
				{ual ? (
					<StyledMetaButtons>
						<ProfileModal>
							<TimezoneModal></TimezoneModal>
						</ProfileModal>
						<Button onClick={logout}>
							Log out
						</Button>
					</StyledMetaButtons>
				) : (
					<StyledMetaButtons>
						<Button htmltype="button" onClick={login}>
							Log in
						</Button>
						<RegisterModal />
					</StyledMetaButtons>
				)}
			</Menu.Item>
			</>
		)
	}

	return (
		<>
			<CheckForUser />
			<Menu.Item
				name="home"
				onClick={() => setActivePage("home")}/>
			{ual &&
				<Menu.Item
					name="write"
					onClick={() => setActivePage("write")}/>
			}
			{ual &&
				<Menu.Item
					name="achievements"
					onClick={() => setActivePage("achievements")}/>
			}
			{desktop ?
				<Menu.Menu position="right">
					{subMenu()}
				</Menu.Menu>
				: subMenu()
			}
		</>
	)
}

function Header(props) {
	const [ual, setUal] = useRecoilState(ualAtom)
	const [sidebar, setSidebar] = useState(false)

	window.ual = props.ual;
	async function login() {
		await props.ual.showModal()
	}

	async function logout() {
		await props.ual.logout()
	}

	useEffect(() => {
		if (props.ual.activeUser) {
			setUal(props.ual)
		} else {
			setUal(null)
		}
	}, [props.ual, setUal])


	useEffect(() => {
		const notSidebar = document.querySelector(":not(#side_nav)");
		notSidebar.addEventListener("click", () => {
			if (sidebar) setSidebar(!sidebar)
		})
	}, [sidebar])

	return (
		<>
			<Menu id="top_nav">
				<MenuItem ual={ual} login={login} logout={logout} desktop setActivePage={props.setActivePage}/>
			</Menu>
			<TopBar id="hamburguer_menu">
				<StyledHamburguer 
					icon 
					onClick={() => setSidebar(!sidebar)} 
					labelPosition='right'
					style={sidebar ? {display: "none"} : {display: "flex"}}>
					Menu
					<Icon name="bars"></Icon>
				</StyledHamburguer> 
			</TopBar>
			<Sidebar
				as={Menu}
				animation="overlay"
				direction="left"
				dimmed="true"
				visible={sidebar}
				id="side_nav"
				style={{zIndex: 2}}
				vertical>
				<MenuItem ual={ual} login={login} logout={logout} vertical setActivePage={props.setActivePage}/>
			</Sidebar>
			{/* </SideNav> */}
		</>
	);
}

export default Header;
