import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Landing from "./pages/Landing";
import Writing from "./pages/Writing";
import Achievements from "./pages/Achievements";
import Layout from "./components/layout";
import About from "./pages/About";

import { scatterAccountAtom } from "./atoms/scatter.js"
import { useRecoilValue, useRecoilState } from "recoil";


function ProtectedRoutes() {

	return (
		<>
		</>
	)
}

export default function App() {
	const [scatterAccount, setScatterAccount] = useRecoilState(scatterAccountAtom)

	return (
		<BrowserRouter>
			<Layout>
				<Route exact path="/" render={() => <Landing/>} />
				<Route exact path="/about" render={() => <About/>} />
				{scatterAccount && <Route exact path="/write" render={() => <Writing/>} />}
				{scatterAccount && <Route exact path="/achievements" render={() => <Achievements/>} />}
			</Layout>
		</BrowserRouter>
	);

}
