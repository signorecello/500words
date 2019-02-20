import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";
import App from "./App";

import {
	RecoilRoot,
	atom,
	selector,
	useRecoilState,
	useSetRecoilState,
	useRecoilValue,
} from 'recoil';


ReactDOM.render(
	<Suspense fallback={<div>Loading...</div>}>
		<RecoilRoot>
			<App />
		</RecoilRoot>
	</Suspense>,

	document.getElementById("root")
);
