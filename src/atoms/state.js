import { atom, selector } from "recoil";
import moment from "moment-timezone";


export const profileAtom = atom({
    key: "profileAtom",
    default: null
})

export const timezoneSelector = selector({
    key: "timezoneSel",
    get: async ({ get }) => {
        const profile = get(profileAtom)
        if (profile && profile.rows[0]) return profile.rows[0].timezone;
    }
})


export const lastPostSelector = selector({
    key: "lastPostSel",
    get: async ({ get }) => {
        const profile = get(profileAtom)
        if (profile && profile.rows[0]) {
            if (profile.rows[0].last_post === 0) return "never"
            return moment(profile.rows[0].last_post, "X").fromNow()
        };
    }
})

export const deadlineSelector = selector({
    key: "deadlineSelector",
    get: async ({ get }) => {
        const profile = get(profileAtom)
        if (profile && profile.rows[0]) return profile.rows[0].next_post_until;
    }
})


export const achievementSelector = selector({
    key: "achievementsSel",
    get: async ({ get }) => {
        const profile = get(profileAtom)
        if (profile && profile.rows[0]) return profile.rows[0].achievements;
    }
})

export const pointsSelector = selector({
    key: "pointsSelector",
    get: ({ get }) => {
        const profile = get(profileAtom)
        if (profile && profile.rows[0]) return profile.rows[0].points
    }
})