import { SAVE_USER_INFO, CLEAR_USER_INFO ,CHANGE_BOX,KLINE_BOX} from './actionTypes'

let initState = {}

if(localStorage.getItem('50etfUser')) initState.userData = JSON.parse(localStorage.getItem('50etfUser'))

else initState = { customerCapital: 0, customerFreezeCapital: 1 ,}

initState.FindTargetListbox1={FindTargetListbox:false}
export default ( state = initState, actions ) => {
    switch (actions.type){
        case SAVE_USER_INFO:
            return { ...state,  ...actions.data }
        case CHANGE_BOX:
            return {...state,  ...actions.data}
        case KLINE_BOX:
             return {...state,  ...actions.data}
        case CLEAR_USER_INFO:
            return { customerCapital: 0, customerFreezeCapital: 0  }
        default :
            return state
    }
}