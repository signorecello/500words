import moment from "moment"
const murmur = require("murmurhash-js");

export function sendTimezone({account, tz, deadline}) {
    return {
        actions: [
            {
                account: process.env[`REACT_APP_CONTRACT${process.env.REACT_APP_ENVIRONMENT}`],
                name: "change",
                authorization: [
                    {
                        actor: account.activeUser.getAccountName(),
                        permission: "active",
                    },
                ],
                data: {
                    user: account.name,
                    timezone: tz,
                    past_deadline: deadline
                },
            }
        ],
    }
}

export function write({name, wordCount, maxPause, totalTime, text}) {
    return {
        actions: [
            {
                account: process.env[`REACT_APP_CONTRACT${process.env.REACT_APP_ENVIRONMENT}`],
                name: "open",
                authorization: [
                    {
                        actor: name,
                        permission: "active",
                    },
                ],
                data: {
                    user: name,
                    timezone: moment.tz.guess(),
                    deadline: moment.tz({hour: 23, minute: 59, second: 59, millisecond: 0}, moment.tz.guess()).unix()
                },
            },
            {
                account: process.env[`REACT_APP_CONTRACT${process.env.REACT_APP_ENVIRONMENT}`],
                name: "posttext",
                authorization: [
                    {
                        actor: name,
                        permission: "active",
                    },
                ],
                data: {
                    user: name,
                    hash: murmur.murmur3(text, "500words!"),
                    wordcount: wordCount,
                    max_pause: maxPause,
                    total_time: totalTime,
                    type: process.env.REACT_APP_WRITE_TYPE
                },
            }
        ],
    }
}


export function capture({name, photoData}) {
    return {
        actions: [
            {
                account: process.env[`REACT_APP_CONTRACT${process.env.REACT_APP_ENVIRONMENT}`],
                name: "open",
                authorization: [
                    {
                        actor: name,
                        permission: "active",
                    },
                ],
                data: {
                    user: name,
                    timezone: moment.tz.guess(),
                    deadline: moment.tz({hour: 23, minute: 59, second: 59, millisecond: 0}, moment.tz.guess()).unix()
                },
            },
            {
                account: process.env[`REACT_APP_CONTRACT${process.env.REACT_APP_ENVIRONMENT}`],
                name: "postphoto",
                authorization: [
                    {
                        actor: name,
                        permission: "active",
                    },
                ],
                data: {
                    user: name,
                    hash: murmur.murmur3(photoData.data, "500words!"),
                    type: process.env.REACT_APP_PHOTO_TYPE
                },
            }
        ],
    }
}