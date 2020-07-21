export function sendTimezone({account, tz, deadline}) {
    console.log(tz)
    return {
        actions: [
            {
                account: process.env.REACT_APP_CONTRACT,
                name: "change",
                authorization: [
                    {
                        actor: account.name,
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