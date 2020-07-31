import React, { useEffect, useState } from "react";

import { List, Container, Image, Card, Grid } from "semantic-ui-react";
import { achievementSelector } from "../atoms/state.js"
import { useRecoilValue } from "recoil";
import { CheckForUser } from "../utils/hooks"
import { challenges } from "../challenges"

const achievement = require("../images/icn-trophy-bronze.png")


const activeStyle = {
    backgroundColor: "#fafafa",
    cursor: "pointer"
}

const inactiveStyle = {
    cursor: "pointer"
}

export default function Achievements(props) {
    const achievements = useRecoilValue(achievementSelector)

    const [active, setActive] = useState(challenges[0])

    return (
        <Container>
            <Grid stackable className="mt-none">
                <Grid.Row>
                    <h1>Challenges</h1>
                </Grid.Row>
                <Grid.Column width={8}>
                    <List relaxed divided>
                        {challenges.map((element) => {
                            return (
                                <List.Item 
                                    key={element.name}
                                    style={active.name === element.name ? activeStyle : inactiveStyle} 
                                    onClick={() => setActive(element)}>
                                    <Image avatar src={element.thumbnail} />
                                    <List.Content>
                                        <List.Header>{element.name}</List.Header>
                                    </List.Content>
                                    {achievements && achievements.find((ach) => ach === element.alias) &&
                                        <Image src={achievement} floated="right"/>
                                    }
                                </List.Item>
                            )
                        })}
                    </List>
                </Grid.Column>
    
                <Grid.Column width={8}>
                    {<Card fluid>
                        <Image src={active.card} />
                        <Card.Content>
                            <Card.Header>
                                {active.name}
                            </Card.Header>
                            <Card.Description>
                                {active.description}
                            </Card.Description>
                        </Card.Content>
                    </Card>
                    }
            
                </Grid.Column>
            </Grid>
        </Container>
    )
    
}