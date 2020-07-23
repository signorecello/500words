
export const ualChainInfo = {
	chainId: process.env.REACT_APP_CHAIN_ID,
	rpcEndpoints: [{
		protocol: process.env.REACT_APP_PROTOCOL,
		host: process.env.REACT_APP_TLOS_HTTP_ENDPOINT,
		port: process.env.REACT_APP_PROTOCOL === "https" ? 443 : 80,
	}]
}