
import ScatterJS from 'scatterjs-core';

export const network = ScatterJS.Network.fromJson({
	blockchain: "eos",
	chainId: process.env.REACT_APP_CHAIN_ID,
	host: process.env.REACT_APP_TLOS_HTTP_ENDPOINT,
	name: process.env.REACT_APP_CHAIN_NAME,
	port: process.env.REACT_APP_PROTOCOL === "https" ? 443 : 80,
	protocol: process.env.REACT_APP_PROTOCOL
});
