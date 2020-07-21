import React, { useEffect, useState } from "react";
import { Button, Menu, Dropdown, Image, Modal } from "semantic-ui-react";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";

import { scatterAtom, scatterAccountAtom, eosAtom, rpcAtom } from "../atoms/scatter.js"
import { achievementSelector } from "../atoms/state"

import { images } from "../copies/challenges"
import { network } from "../utils/network"

import ScatterJS from '@scatterjs/core';
import ScatterEOS from '@scatterjs/eosjs2';
import {JsonRpc, Api} from 'eosjs'

import { CheckForUser } from "../utils/hooks"
import { ProfileModal, TimezoneModal } from "./modals/modals"
ScatterJS.plugins( new ScatterEOS() );


const rpc = new JsonRpc(network.fullhost());

function Header(props) {
	const [scatterAccount, setScatterAccount] = useRecoilState(scatterAccountAtom)
	const [scatterInstance, setScatterInstance] = useRecoilState(scatterAtom)
	const setRpc = useSetRecoilState(rpcAtom)
	const [eos, setEos] = useRecoilState(eosAtom)
	const [isAuth, setIsAuth] = useState(null)


    const achievements = useRecoilValue(achievementSelector)

	function login() {
		ScatterJS.connect("500words", {network}).then(connected => {
			if(!connected) {
				return false;
			}
			
			window.ScatterJS = null;
			

			const eos = ScatterJS.eos(network, Api, {rpc});
			setEos(eos)
			// const scatter = ScatterJS.scatter;
			ScatterJS.login().then(() => {
				// const account = ScatterJS.identity.accounts.find(x => x.blockchain === 'eos');
				let account = ScatterJS.account("eos")
				// // console.log(account)
				setScatterAccount(account)
				setScatterInstance(ScatterJS)
				// setEos(scatterEos)
			})
		})
	}

	function logout() {
		setScatterAccount(null)
	}


	useEffect(() => {
		setRpc(rpc)
		login();
	}, [])


	useEffect(() => {
		if (eos) setIsAuth(true)
	}, [eos])


	return (
		<Menu>
			<CheckForUser />

			<Menu.Item
				name="home"
				href="/"
			/>
			{isAuth &&
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
					{achievements && achievements.map((ach) => 
						<Image avatar verticalAlign="middle" src={images[ach].thumbnail} key={images[ach].thumbnail} alt={ach} />
					)}
				</Menu.Item>
				<Menu.Item>
					{scatterAccount ? (
						<ProfileModal logout={logout}>
							<TimezoneModal></TimezoneModal>
						</ProfileModal>
					) : (
						<Button htmltype="button" onClick={login}>
							Log in
						</Button>
					)}
				</Menu.Item>
			</Menu.Menu>
		</Menu>
	);
}

export default Header;
