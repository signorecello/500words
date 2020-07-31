import { useEffect, useCallback } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { profileAtom } from "../atoms/state.js"
import { ualAtom } from "../atoms/ual"


export function CheckForUser() {
    const setProfile = useSetRecoilState(profileAtom)
    const ual = useRecoilValue(ualAtom)

    const update = useCallback(async () => {
        if (ual && ual.activeUser) {
            const accName = await ual.activeUser.getAccountName();
            const userData = await ual.activeUser.rpc.get_table_rows({
                json: true,              // Get the response as json
                code: process.env[`REACT_APP_CONTRACT${process.env.REACT_APP_ENVIRONMENT}`],     // Contract that we target
                scope: accName,         // Account that owns the data
                table: 'profile',        // Table name
                limit: 10,               // Maximum number of rows that we want to get
            })
            setProfile(userData)
            return userData
        }
    }, [setProfile, ual])

    useEffect(() => {
        update();
    }, [update])

    useEffect(() => {
        update();
    }, [ual, update])

    return null;
}
