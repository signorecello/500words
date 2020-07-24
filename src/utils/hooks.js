import { useEffect, useCallback } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { profileAtom, stateAtom } from "../atoms/state.js"
import { ualAtom } from "../atoms/ual"


export function CheckForUser() {
    const setProfile = useSetRecoilState(profileAtom)
    const setState = useSetRecoilState(stateAtom)
    const ual = useRecoilValue(ualAtom)

    const update = useCallback(async () => {
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
                setProfile(userData)
                return {state, userData}
            })
        }
    }, [setProfile, setState, ual])

    useEffect(() => {
        update();
    }, [update])

    useEffect(() => {
        update();
    }, [ual, update])

    return null;
}
