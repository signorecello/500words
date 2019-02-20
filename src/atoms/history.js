import { atom, selector } from "recoil";


import moment from "moment"
export const transactionsAtom = atom({
    key: "transactionsAtom",
    default: []
})

const avatars = ["jenny", "daniel", "ade", "chris", "christian", "elliot", "helen"]


export const lastTransactionsSelector = selector({
    key: "lastTransactionsSelector",
    get: ({ get }) => {
        const tr = get(transactionsAtom)
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
        
                const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
                if (summary) {
                    return (
                        {
                            key: Math.random(),
                            date: moment(action["@timestamp"]).fromNow(),
                            image: `https://semantic-ui.com/images/avatar/small/${randomAvatar}.jpg`,
                            summary: `${summary}`,
                            extraText: `${action.act.data.user} ${detail}`
                        }
                    )
                }
            }).filter((e) => e).slice(0, 10);
        }


    }
})