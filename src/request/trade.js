import axios from 'axios'
import { getCookie } from '../toolFn.js'

export default {
    //买入卖出接口
    buyAndSell({ targetCode, contraceCode, contractMonthName }) {
        return axios(
            {
                method: 'POST',
                url: '/trade/optionTrade/buyAndSell',
                headers: {
                    'content-type': 'application/json'
                },
                showLoad: true,
                responseType: 'json',
                data: JSON.stringify({targetCode, contraceCode, contractMonthName, customerId: getCookie('customerId') })
            }
        )
    },

    //获取订单数据接口
    getOrderList({reqsOrderType, pageNum, beginCreateTime, endCreateTime}) {
        return axios(
            {
                method: 'POST',
                url: '/trade/optionTrade/getOrderList',
                headers: {
                    'content-type': 'application/json'
                },
                responseType: 'json',
                data: JSON.stringify({reqsOrderType, pageNum, customerId: getCookie('customerId'), beginCreateTime, endCreateTime })
            }
        )
    },

    //开仓委托接口
    reportOrder({contraceCode, volume, limitPrice, direction, offsetFlag, idempotency, openOrderRef,orderPriceType}) {
        return axios(
            {
                method: 'POST',
                url: '/trade/optionTrade/reportOrder',
                headers: {
                    'content-type': 'application/json'
                },
                responseType: 'json',
                showLoad: true,
                data: JSON.stringify({customerId: getCookie('customerId'), contraceCode, volume, limitPrice, direction, offsetFlag, idempotency, openOrderRef,orderPriceType})
            }
        )
    },
        //撤单
        cancelOrder({contraceCode,  idempotency, openOrderRef}) {
            return axios(
                {
                    method: 'POST',
                    url: '/trade/optionTrade/cancelOrder',
                    headers: {
                        'content-type': 'application/json'
                    },
                    responseType: 'json',
                    showLoad: true,
                    data: JSON.stringify({customerId: getCookie('customerId'), contraceCode, idempotency, openOrderRef})
                }
            )
        },
        //合约明细接口

        getContractAnalysis({instrumentCode}) {
            return axios(
                {
                    method: 'POST',
                    url: '/md/mdInfo/getContractAnalysis',
                    headers: {
                        'content-type': 'application/json'
                    },
                    responseType: 'json',
                    showLoad: true,
                    data: JSON.stringify(
                        { instrumentCode }
                        )
                }
            )
        },
        getMarketTradeDetail({instrumentCode,instrumentMonth}) {
            return axios(
                {
                    method: 'POST',
                    url: '/md/mdInfo/getMarketTradeDetail',
                    headers: {
                        'content-type': 'application/json'
                    },
                    responseType: 'json',
                    showLoad: true,
                    data: JSON.stringify(
                        { instrumentCode,instrumentMonth,pageNum:'0'}
                    )
                }
            )
        },
}
