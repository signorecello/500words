import { atom, selector } from "recoil";
import moment from "moment-timezone";

// export const challengesAtom = atom({
//     key: "challenges",
//     default: []
// })

export const stateAtom = atom({
    key: "stateAtom",
    default: null
})

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

export const deadlineSelector = selector({
    key: "deadlineSelector",
    get: async ({ get }) => {
        const profile = get(profileAtom)
        if (profile && profile.rows[0]) return moment(profile.rows[0].next_post_until, "X").format("dddd, MMMM Do YYYY, H:mm:ss");
    }
})


export const achievementSelector = selector({
    key: "achievementsSel",
    get: async ({ get }) => {
        const profile = get(profileAtom)
        if (profile && profile.rows[0]) return profile.rows[0].achievements;
    }
})

export const existingChallenges = selector({
    key: "challengesSel",
    get: async ({ get }) => {
        const state = get(stateAtom)
        if (state) return state.rows[0].existing_challenges;
    }
})


export const pointsSelector = selector({
    key: "pointsSelector",
    get: ({ get }) => {
        const profile = get(profileAtom)
        if (profile && profile.rows[0]) return profile.rows[0].points
    }
})