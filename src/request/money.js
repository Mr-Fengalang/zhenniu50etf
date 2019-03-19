import axios from 'axios'
import { getCookie } from '../toolFn.js'

export default {
    //设置资金密码
    initCustomerCapitalPassword({ customerCapitalPassword }) {
        return axios(
            {
                method: 'POST',
                url: '/trade/appCustomer/initCustomerCapitalPassword',
                headers: {
                    'content-type': 'application/json'
                },
                showLoad: true,
                responseType: 'json',
                data: JSON.stringify({customerCapitalPassword, customerId: getCookie('customerId')})
            }
        )
    },

    //获取客户银行卡列表
    getcustomerBankInfoList() {
        return axios(
            {
                method: 'POST',
                url: '/pay/bankInfo/getcustomerBankInfoList',
                headers: {
                    'content-type': 'application/json'
                },
                responseType: 'json',
                data: JSON.stringify({ customerId: getCookie('customerId')})
            }
        )
    },

    //获取支付列表
    getPayList() {
        return axios(
            {
                method: 'POST',
                url: '/pay/payInfo/getPayList',
                headers: {
                    'content-type': 'application/json'
                },
                responseType: 'json',
                data: JSON.stringify({ customerId: getCookie('customerId'), payMethod: '2'})
            }
        )
    },

    //获取银行列表
    getBankInfoList() {
        return axios(
            {
                method: 'POST',
                url: '/pay/bankInfo/getBankInfoList',
                headers: {
                    'content-type': 'application/json'
                },
                responseType: 'json',
            }
        )
    },

    //线下充值入金
    underLineRecharge({customerId,offlinePaymentId,transferAccountsBank,bankCard,cardholderName,rechargeAmount,receivablesNumber,idempotency,voucherPic}) {
        return axios(
            {
                method: 'POST',
                url: '/pay/payInfo/underLineRecharge',
                headers: {
                    'content-type': 'application/json'
                },
                showLoad: true,
                responseType: 'json',
                data: JSON.stringify({customerId,offlinePaymentId,transferAccountsBank,bankCard,cardholderName,rechargeAmount,receivablesNumber,idempotency,voucherPic})
            }
        )
    },

    //线上充值入金
    onLineRecharge(data) {
        return axios(
            {
                method: 'POST',
                url: '/pay/payInfo/onLineRecharge',
                headers: {
                    'content-type': 'application/json'
                },
                showLoad: true,
                responseType: 'json',
                data: JSON.stringify(data)
            }
        )
    },

    //用户绑卡
    customerTiedCard(data){
        return axios(
            {
                method: 'POST',
                url: '/pay/bankInfo/customerTiedCard',
                headers: {
                    'content-type': 'application/json'
                },
                showLoad: true,
                responseType: 'json',
                data: JSON.stringify(data)
            }
        )
    },

    //解绑
    unbindBankCard(data) {
        return axios(
            {
                method: 'POST',
                url: '/pay/bankInfo/unbindBankCard',
                headers: {
                    'content-type': 'application/json'
                },
                showLoad: true,
                responseType: 'json',
                data: JSON.stringify(data)
            }
        )
    },

    //提现进入
    clickWithdraw(data) {
        return axios(
            {
                method: 'POST',
                url: '/pay/payInfo/clickWithdraw',
                headers: {
                    'content-type': 'application/json'
                },
                showLoad: true,
                responseType: 'json',
                data: JSON.stringify({ customerId: getCookie('customerId')})
            }
        )
    },

    //用户提现
    customerWithdraw(data) {
        return axios(
            {
                method: 'POST',
                url: '/pay/payInfo/customerWithdraw',
                headers: {
                    'content-type': 'application/json'
                },
                showLoad: true,
                responseType: 'json',
                data: JSON.stringify(data)
            }
        )
    },


    //资金记录
    customerWithdrawRecord(pageNum) {
        return axios(
            {
                method: 'POST',
                url: '/pay/payInfo/customerWithdrawRecord',
                headers: {
                    'content-type': 'application/json'
                },
                responseType: 'json',
                data: JSON.stringify({customerId: getCookie('customerId'), pageNum})
            }
        )
    },


    //用户选卡接口
    customerSelectBank(bankInfoId) {
        return axios(
            {
                method: 'POST',
                url: '/pay/bankInfo/customerSelectBank',
                headers: {
                    'content-type': 'application/json'
                },
                showLoad: true,
                responseType: 'json',
                data: JSON.stringify({customerId: getCookie('customerId'), bankInfoId})
            }
        )
    }
}
