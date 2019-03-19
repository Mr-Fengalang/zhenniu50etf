import { SAVE_WEBSOCKET, SEND_WEBSOCKET, CHANGE_SOCKET_DATA, CHANGE_ETF_DATA, CHANGE_NOTICE_DATA, CLEAR_SOCKET_DATA } from './actionTypes.js'

import { fetchUserInfo } from '../userInfo/'

import { newGuid, unZip, getCookie } from '../../toolFn'

//通告栏标识符
let noticeId = 0

export const saveWebSocket = (ws, uuid) => {
    return {
        type: SAVE_WEBSOCKET,
        data: {ws, uuid}
    }
}

export const sendWebsocket = (ws, data) => {
    return (dispatch) => {
       try{
            ws.send(data)
            dispatch({type: SEND_WEBSOCKET,})
       }catch (e) {
            dispatch({type: SEND_WEBSOCKET,})
       }
    }
}

export const changeSocketData = (data) => {
    return {
        type: CHANGE_SOCKET_DATA,
        data,
    }
}


export const change50etfData = (data) => {
    return {
        type: CHANGE_ETF_DATA,
        data,
    }
}

export const changeNoticeData = (status, data) => {
    return {
        type: CHANGE_NOTICE_DATA,
        status,
        data,
    }
}

export const clearSocketData = () => {
    return {
        type: CLEAR_SOCKET_DATA,
    }
}

export const startWebsocket = () => {
    return (dispatch) => {
        const ws = new WebSocket(global.constants.webSocket)
        const uuid = newGuid()
        ws.onopen = (evt) => {
            dispatch(saveWebSocket(ws, uuid))
            const websocketJson = {uuid}
            if(getCookie('customerId')) {
                websocketJson.customerId = getCookie('customerId')
            }
        }


        // ws.onclose = () => {
        //     dispatch(startWebsocket)
        // }


        ws.onmessage = (evt) => {
            unZip(evt)
            .then(
                (res) => {
                    //1:首页合约价格  2:报单 3:成交 4:50etf价格

                    // console.group('socket')
                    // console.log(res.pushType)
                    // console.log(res.data)
                    // console.groupEnd()

                    // else if(res.pushType === 2){
                    //     console.log('type2', res.data)
                    // }

                    if(res.pushType === 1) {
                        dispatch(changeSocketData(res.data))
                        setTimeout(
                            () => {
                                dispatch( clearSocketData(res.data) )
                            },
                            5000
                        )
                    }else if(res.pushType === 3 || res.pushType === 2){
                        dispatch(fetchUserInfo())
                        noticeId++
                        const timeOutId = noticeId
                        dispatch(changeNoticeData(true, res.data))
                        setTimeout(
                            () => {
                                if(timeOutId === noticeId) {
                                    dispatch(changeNoticeData(false, {}))
                                }
                            },
                            5000
                        )
                    }else if(res.pushType === 4) {
                        dispatch(change50etfData(res.data))
                    }
                }
            )
        }

    }
}