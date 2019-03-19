import { SAVE_USER_INFO } from './actionTypes.js'

export const saveUserInfo = (data) => (
    {
        type: SAVE_USER_INFO,
        data
    }
)