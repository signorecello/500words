import React, { useEffect } from "react"
import { Statistic, Icon } from "semantic-ui-react"
import { useRecoilValue } from "recoil"
import { pointsSelector, achievementSelector, deadlineSelector } from "../atoms/state.js";
import moment from "moment-timezone"

export function StatisticsComp() {
	const points = useRecoilValue(pointsSelector)
    const challenges = useRecoilValue(achievementSelector)
    const deadline = useRecoilValue(deadlineSelector)
    
    return (

        <Statistic.Group size="tiny" widths='two' id="statistics_box">
            <Statistic>
                <Statistic.Value>
                    <Icon name="chart line"></Icon>
                </Statistic.Value>
                <Statistic.Value>
                    {points}
                </Statistic.Value>
                <Statistic.Label>
                    points
                </Statistic.Label>
            </Statistic>

            <Statistic>
                <Statistic.Value>
                    <Icon name="rocket"></Icon>
                </Statistic.Value>
                <Statistic.Value>
                    {challenges && challenges.length}
                </Statistic.Value>
                <Statistic.Label>
                    Achievements
                </Statistic.Label>
            </Statistic>

            <Statistic className="w-100">
                <Statistic.Value>
                    <Icon name="clock"></Icon>
                </Statistic.Value>
                <Statistic.Label>
                    Next post
                </Statistic.Label>
                <Statistic.Value>
                    {moment(deadline, "X").fromNow()}
                </Statistic.Value>
            </Statistic>
        </Statistic.Group>
        
    )
}