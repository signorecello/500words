import { atom } from "recoil";

export const scatterAtom = atom({
    key: "scatter",
    dangerouslyAllowMutability: true,
    default: null
})

export const scatterAccountAtom = atom({
    key: "account",
    default: null
})

export const eosAtom = atom({
    key: "eos",
    dangerouslyAllowMutability: true,
    default: null
})

export const rpcAtom = atom({
    key: "rpc",
    default: null
})
