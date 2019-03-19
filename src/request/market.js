import axios from 'axios'

export default {
    //app首页接口
    getTargetList(param) {
        return axios(
            {
                method: 'POST',
                url: '/md/mdInfo/getTargetList',
                headers: {
                    'content-type': 'application/json'
                },
                responseType: 'json',
            }
        )
    },

    //获取合约列表
    findTargetList(param) {
        return axios(
            {
                method: 'POST',
                url: '/md/mdInfo/findTargetList',
                headers: {
                    'content-type': 'application/json'
                },
                responseType: 'json',
                data: JSON.stringify(param)
            }
        )
    },

    //获取合约详情
    findContract({tradingGoodsCode, instrumentMonth, instrumentCode}) {
        return axios(
            {
                method: 'POST',
                url: '/md/mdInfo/findContract',
                headers: {
                    'content-type': 'application/json'
                },
                responseType: 'json',
                data: JSON.stringify({
                    tradingGoodsCode,
                    instrumentMonth,
                    instrumentCode,
                })
            }
        )
    },

    //获取所有合约名称信息
    getContractList(){
        return axios(
            {
                method: 'POST',
                url: '/md/mdInfo/getContractList',
                headers: {
                    'content-type': 'application/json'
                },
                responseType: 'json',
            }
        )
    },

    //获取k线
    getQuotation(data) {
        return axios(
            {
                method: 'POST',
                url: '/md/mdInfo/getQuotation',
                headers: {
                    'content-type': 'application/json'
                },
                responseType: 'json',
                data: JSON.stringify(data)
            }
        )
    },
        //获取k线
        getContractKLine(data) {
            return axios(
                {
                    method: 'POST',
                    url: '/md/mdInfo/getContractKLine',
                    headers: {
                        'content-type': 'application/json'
                    },
                    responseType: 'json',
                    data: JSON.stringify(data)
                }
            )
        }

}
