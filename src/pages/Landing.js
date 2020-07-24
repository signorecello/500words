import React from "react";
import { Container, Grid, Image, Feed, Header } from "semantic-ui-react";
import { useRecoilValue } from "recoil";
import { lastTransactionsSelector } from "../atoms/history";

const typewriter = require("../images/typewriter-sized.jpg");

function Landing() {
	const transactions = useRecoilValue(lastTransactionsSelector)
	
	return (
		<Container>
			<Grid stackable columns={2}>
				<Grid.Row>
					<Grid.Column width={11} >
						<Image src={typewriter}/>
						<Container>
							<h1
								style={{
									textAlign: "center",
									marginTop: "50px"
								}}
							>
								500 Words
							</h1>
							500 words is challenge to reach your creative limits. Write 500 words, each day. Do it in the morning or at night. Write the same word 500 times or start your first book… Do whatever you want. Your work will be signed and sent to a powerful smart contract on a blockchain. No questions asked, no one will see your work unless you decide to share it.
							<br /><br />
							As a bonus, you’ll receive achievements and will be rewarding using the QUDO ecosystem. Now go write something!
						</Container>
					</Grid.Column>
					<Grid.Column width={5} >
						<Header size="huge">Last events</Header>
						<Feed events={transactions}/>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</Container>
	);
}

export default Landing;
