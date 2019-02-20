import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Landing from "./pages/Landing";
import Writing from "./pages/Writing";
import Achievements from "./pages/Achievements";
import Layout from "./components/layout";
import About from "./pages/About";

// Tester account
// 511wdtestera
// EOS74ktSdC26Xo4jCexW5pfWTowjLVmqFdCp4xqfDu21sSCjtGdT5


export default function App() {
	return (
		<BrowserRouter>
			<Layout>
				<Route exact path="/" render={() => <Landing/>} />
				<Route exact path="/write" render={() => <Writing/>} />
				<Route exact path="/achievements" render={() => <Achievements/>} />
				<Route exact path="/about" render={() => <About/>} />
			</Layout>
		</BrowserRouter>
	);
}
