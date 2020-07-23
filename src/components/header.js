import React, { useEffect, useState } from "react";
import { Button, Menu, Dropdown, Image, Modal } from "semantic-ui-react";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";

import { ualAtom } from "../atoms/ual.js"
import { achievementSelector } from "../atoms/state"

import { images } from "../copies/challenges"
import { network } from "../utils/network"

import { CheckForUser } from "../utils/hooks"
import { ProfileModal, TimezoneModal, RegisterModal } from "./modals/modals"
import styled from "styled-components";
const StyledMetaButtons = styled.div`
	padding: 0 1rem;
`

function Header(props) {
    const achievements = useRecoilValue(achievementSelector)
	const [ual, setUal] = useRecoilState(ualAtom)

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
	}, [props.ual])

	// useEffect(() => {
	// 	login();
	// }, [])

	return (
		<Menu>
			<CheckForUser />

			<Menu.Item
				name="home"
				href="/"
			/>
			{ual &&
				<>
					<Menu.Item
						name="write"
						href="/write"
					/>
					<Menu.Item
						name="achievements"
						href="/achievements"
					/>
				</>
			}

			<Menu.Menu position="right">
				<Menu.Item
					name="about"
					href="/about"
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
			</Menu.Menu>
		</Menu>
	);
}

export default Header;
