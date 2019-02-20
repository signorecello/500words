import React, { useEffect, useState } from "react";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import { rpcAtom } from "../atoms/scatter.js"
import { profileAtom, stateAtom } from "../atoms/state.js"


export function CheckForUser(props) {
    const setProfile = useSetRecoilState(profileAtom)
    const rpc = useRecoilValue(rpcAtom)
    const [state, setState] = useRecoilState(stateAtom)

    useEffect(() => {
        if (rpc && props.account) {
            rpc.get_table_rows({
                json: true,
                code: process.env.REACT_APP_CONTRACT,
                scope: process.env.REACT_APP_CONTRACT,
                table: process.env.REACT_APP_STATE_TABLE,
                limit: 2
            })
            .then(async (state) => {
                setState(state)
                const userData = await rpc.get_table_rows({
                    json: true,              // Get the response as json
                    code: process.env.REACT_APP_CONTRACT,     // Contract that we target
                    scope: props.account.name,         // Account that owns the data
                    table: 'profile',        // Table name
                    limit: 10,               // Maximum number of rows that we want to get
                })
                setProfile(userData)
                return {state, userData}
            })
        }

        
    }, [rpc, props.account])

    return null;
}
