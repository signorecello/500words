import React, { useEffect, useState } from "react";

import { List, Container, Image, Card, Button, Grid } from "semantic-ui-react";
import { existingChallenges, achievementSelector } from "../atoms/state.js"
import { useRecoilValue, useRecoilState } from "recoil";
import { CheckForUser } from "../utils/hooks"
import { eosAtom, scatterAccountAtom } from "../atoms/scatter.js"
import { images, details } from "../copies/challenges"

const achievement = require("../images/icn-trophy-bronze.png")


const activeStyle = {
    backgroundColor: "#fafafa",
    cursor: "pointer"
}

const inactiveStyle = {
    cursor: "pointer"
}

export default function Achievements(props) {
    const account = useRecoilValue(scatterAccountAtom)
    const existingChals = useRecoilValue(existingChallenges)
    const achievements = useRecoilValue(achievementSelector)

    const [active, setActive] = useState(null)
    const [refreshKey, setRefreshKey] = useState(Math.random())

    // when we have the user's challenges available, set active the first of those
    useEffect(() => {
        if (existingChals) {
            setActive(existingChals[0])
        }
    }, [existingChals])
    
    // render the component only when you have the existing challenges, 
    // and you have an active item to show
    if (existingChals && active) {
        return (
            <Container key={refreshKey}>
                <Grid>
                    <CheckForUser account={account} />
                    <Grid.Row>
                        <h1>Challenges</h1>
                    </Grid.Row>
                    <Grid.Column width={8} style={{marginTop: "1rem"}}>
                        <List relaxed divided>
                            {existingChals.map((element) => {
                                return (
                                    <List.Item 
                                        key={element}
                                        style={active === element ? activeStyle : inactiveStyle} 
                                        onClick={() => setActive(element)}>
                                        {images[element] && <Image avatar src={images[element].thumbnail} />}
                                        <List.Content>
                                            <List.Header>{details[element].name}</List.Header>
                                        </List.Content>
                                        {achievements && achievements.find((ach) => ach === element) &&
                                            <Image src={achievement} floated="right"/>
                                        }
                                    </List.Item>
                                )
                            })}
                        </List>
                    </Grid.Column>
        
                    <Grid.Column width={8} style={{marginTop: "1rem"}}>
                        {<Card fluid>
                            <Image src={images[active].card} />
                            <Card.Content>
                                <Card.Header>
                                    {details[active].name}
                                </Card.Header>
                                <Card.Description>
                                    {details[active].description}
                                </Card.Description>
                            </Card.Content>
                        </Card>
                        }
                
                    </Grid.Column>
                </Grid>
            </Container>
        )
    } else {
        return(
            <Container key={refreshKey}>
                <CheckForUser account={account} />
                    Loading...
            </Container>
        )
    }
    
}