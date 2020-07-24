import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";
import "./global.scss";
import App from "./App";
import { FacebookProvider } from 'react-facebook';

import {
	RecoilRoot,
} from 'recoil';


import { UALProvider, withUAL } from 'ual-reactjs-renderer'
import { Scatter } from 'ual-scatter'
import { Lynx } from 'ual-lynx'
import { Anchor } from "ual-anchor"
import { ualChainInfo } from "./utils/network"


const scatter = new Scatter([ualChainInfo], { appName: '500words' })
const lynx = new Lynx([ualChainInfo], { appName: '500words' })
const anchor = new Anchor([ualChainInfo], {
	// Required: The app name, required by anchor-link. Short string identifying the app
	appName: '500words',
	// Optional: A flag to disable the Greymass Fuel integration, defaults to false (enabled)
	disableGreymassFuel: true,
	// Optional: A flag to enable the Anchor Link UI request status, defaults to false (disabled)
	requestStatus: false,  
  })
  

const MyUALConsumer = withUAL(App)

ReactDOM.render(
	<UALProvider chains={[ualChainInfo]} authenticators={[scatter, lynx, anchor]} appName={'500words'}>
		<Suspense fallback={<div>Loading...</div>}>
			<RecoilRoot>
				<FacebookProvider appId={process.env.REACT_APP_FACEBOOK_APPID}>
			    	<MyUALConsumer />
				</FacebookProvider>
			</RecoilRoot>
		</Suspense>
	</UALProvider>,
	document.getElementById("root")
);
