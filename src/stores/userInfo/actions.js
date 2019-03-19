import { SAVE_USER_INFO, CLEAR_USER_INFO,CHANGE_BOX } from './actionTypes.js'

import { accountApi } from '../../request'


export const saveUserInfo = (data) => (
    {
        type: SAVE_USER_INFO,
        data: data
    }
)


export const clearUserInfo = () => (
    {
        type: CLEAR_USER_INFO,
    }
)

export const fetchUserInfo = () => {
    return (dispatch) => {
        accountApi
        .getCustomerInfo()
        .then(
            (res) => {
                if(res.resCode === '200') {
                    localStorage.setItem('50etfUser', JSON.stringify(res.data))
                    dispatch(saveUserInfo(res.data))
                }
            }
        )
    }
}