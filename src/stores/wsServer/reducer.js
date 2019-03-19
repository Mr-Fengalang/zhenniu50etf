import { SAVE_WEBSOCKET, CHANGE_SOCKET_DATA, SEND_WEBSOCKET, CHANGE_ETF_DATA, CHANGE_NOTICE_DATA, CLEAR_SOCKET_DATA } from './actionTypes'

let id = 0
let initState = { ws: () => null, uuid: null, data: {}, etfData:{}, noticeData: { show: false, data: {}, id: id } }


export default ( state = initState, actions ) => {
    switch (actions.type){
        case SAVE_WEBSOCKET:
            return { ...state,  ws: actions.data.ws, uuid: actions.data.uuid }
        case SEND_WEBSOCKET:
            return { ...state, data: {}}
        case CHANGE_SOCKET_DATA:
            return {...state, data: {...state.data, [`${actions.data.instrumentCode}`]: actions.data}}
        case CHANGE_ETF_DATA:
            return {...state, etfData: actions.data}
        case CHANGE_NOTICE_DATA:
            return {...state, noticeData: { show: actions.status, data: actions.data, id: actions.status ? ++id : id }}
        case CLEAR_SOCKET_DATA:
            return {...state, data:{}}
        default :
            return state
    }
}