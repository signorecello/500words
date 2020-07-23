import React, { useEffect, useState } from "react";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import { profileAtom, stateAtom } from "../atoms/state.js"
import { ualAtom } from "../atoms/ual"


export function CheckForUser() {
    const setProfile = useSetRecoilState(profileAtom)
    const [state, setState] = useRecoilState(stateAtom)
    const ual = useRecoilValue(ualAtom)

    async function update() {
        if (ual && ual.activeUser) {
            const accName = await ual.activeUser.getAccountName();
            ual.activeUser.rpc.get_table_rows({
                json: true,
                code: process.env.REACT_APP_CONTRACT,
                scope: process.env.REACT_APP_CONTRACT,
                table: process.env.REACT_APP_STATE_TABLE,
                limit: 2
            })
            .then(async (state) => {
                setState(state)
                const userData = await ual.activeUser.rpc.get_table_rows({
                    json: true,              // Get the response as json
                    code: process.env.REACT_APP_CONTRACT,     // Contract that we target
                    scope: accName,         // Account that owns the data
                    table: 'profile',        // Table name
                    limit: 10,               // Maximum number of rows that we want to get
                })
                console.log(userData)
                setProfile(userData)
                return {state, userData}
            })
        }
    }

    useEffect(() => {
        update();
    }, [])

    useEffect(() => {
        update();
    }, [ual])

    return null;
}
