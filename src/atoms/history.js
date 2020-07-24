import { atom, selector } from "recoil";
import { getAvatar } from "../utils/avatars"

import moment from "moment"
export const transactionsAtom = atom({
    key: "transactionsAtom",
    default: []
})

export const lastTransactionsSelector = selector({
    key: "lastTransactionsSelector",
    get: ({ get }) => {
        const tr = get(transactionsAtom)
        const knownUsers = [];
        if (tr) {
            return tr.map((action) => {
                let summary;
                let detail;
                if (action.act.name === "post") {
                    summary = "Post"
                    detail = "posted something! oh yeah! keep it up!"
                } else if (action.act.name === "newach") {
                    summary = `Achievement` 
                    detail = `just earned ${action.act.data.achievement}! Great work`
                }
        
                if (summary) {
                    const user = action.act.data.user
                    const known = knownUsers.find((knownuser) => knownuser.accname === user)
                    let avatar;
                    if (known) {
                        avatar = known.avatar
                    } else {
                        avatar = getAvatar(user)
                        knownUsers.push({accname: user, avatar: avatar})
                    }
                    return (
                        {
                            key: Math.random(),
                            date: moment(action["@timestamp"]).fromNow(),
                            image: `https://semantic-ui.com/images/avatar/small/${avatar}.jpg`,
                            summary: `${summary}`,
                            extraText: `${user} ${detail}`
                        }
                    )
                } else {
                    return null
                }
            }).filter((e) => e).slice(0, 10);
        }


    }
})