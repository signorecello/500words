
export const ualChainInfo = {
	chainId: process.env[`REACT_APP_CHAIN_ID${process.env.REACT_APP_ENVIRONMENT}`],
	rpcEndpoints: [{
		protocol: `${process.env.REACT_APP_PROTOCOL}`,
		host: process.env[`REACT_APP_TLOS_HTTP_ENDPOINT${process.env.REACT_APP_ENVIRONMENT}`],
		port: `${process.env.REACT_APP_PROTOCOL}` === "https" ? 443 : 80,
	}]
}