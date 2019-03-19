import axios from 'axios'
import { getCookie } from '../toolFn.js'

export default {
    //获取用户信息接口
    getCustomerInfo(param) {
        return axios(
            {
                method: 'POST',
                url: '/trade/appCustomer/getCustomerInfo',
                headers: {
                    'content-type': 'application/json'
                },
                responseType: 'json',
                data: JSON.stringify(
                    {
                        customerId: getCookie('customerId')
                    }
                )
            }
        )
    },

    //用户登录接口
    login({ customerTradeAccount, customerTradePassword }) {
        return axios(
                {
                    method: 'POST',
                    url: '/trade/appCustomer/login',
                    headers: {
                        'content-type': 'application/json'
                    },
                    showLoad: true,
                    responseType: 'json',
                    data: JSON.stringify(
                        {
                            customerTradeAccount,
                            customerTradePassword
                        }
                    )
                }
            )
    },

   //开户发送验证码
    sendSms({ customerTel, businessInviteCode }) {
        return axios(
            {
                method: 'POST',
                url: '/trade/appCustomer/sendSms',
                headers: {
                    'content-type': 'application/json'
                },
                showLoad: true,
                responseType: 'json',
                data: JSON.stringify(
                    {
                        customerTel,
                        businessInviteCode
                    }
                )
            }
        )
    },

    //开户
    register({ customerTel, smsCode, businessInviteCode, customerTradePassword ,agreementId}) {
        return axios(
            {
                method: 'POST',
                url: '/trade/appCustomer/register',
                headers: {
                    'content-type': 'application/json'
                },
                showLoad: true,
                responseType: 'json',
                data: JSON.stringify(
                    {
                        customerTel,
                        businessInviteCode,
                        customerTradePassword,
                        smsCode,
                        agreementId
                    }
                )
            }
        )
    },


    //实名认证
    certification(formData) {
        return axios(
            {
                method: 'POST',
                url: '/trade/appCustomer/certification',
                headers: {
                    'content-type': 'application/json'
                },
                showLoad: true,
                responseType: 'json',
                data: formData
            }
        )
    },

    //退出登录
    loginOut({ customerTel }) {
        return axios(
            {
                method: 'POST',
                url: '/trade/appCustomer/loginOut',
                headers: {
                    'content-type': 'application/json'
                },
                showLoad: true,
                responseType: 'json',
                data: JSON.stringify({customerTel})
            }
        )
    },


    //修改密码
    updatePassword({ updatePasswordType, customerTradePassword, customerCapitalPassword, smsCode, newCustomerCapitalPassword, confirmCustomerCapitalPassword, newCustomerTradePassword, confirmCustomerTradePassword }) {
        return axios(
            {
                method: 'POST',
                url: '/trade/appCustomer/updatePassword',
                headers: {
                    'content-type': 'application/json'
                },
                showLoad: true,
                responseType: 'json',
                data: JSON.stringify({
                    updatePasswordType,
                    customerTradeAccount: getCookie('customerTradeAccount'),
                    smsCode,
                    customerTradePassword,
                    customerCapitalPassword,
                    newCustomerCapitalPassword,
                    confirmCustomerCapitalPassword,
                    newCustomerTradePassword,
                    confirmCustomerTradePassword
                })
            }
        )
    },

     //重置密码
     resetPassword({ customerTel, updatePasswordType, customerTradePassword, customerCapitalPassword, smsCode, newCustomerCapitalPassword, confirmCustomerCapitalPassword, newCustomerTradePassword, confirmCustomerTradePassword }) {
        return axios(
            {
                method: 'POST',
                url: '/trade/appCustomer/resetPassword',
                headers: {
                    'content-type': 'application/json'
                },
                showLoad: true,
                responseType: 'json',
                data: JSON.stringify({
                    updatePasswordType,
                    customerTradeAccount: getCookie('customerTradeAccount'),
                    smsCode,
                    customerTel,
                    customerTradePassword,
                    customerCapitalPassword,
                    newCustomerCapitalPassword,
                    confirmCustomerCapitalPassword,
                    newCustomerTradePassword,
                    confirmCustomerTradePassword
                })
            }
        )
    },



    // 忘记交易账号获取验证码
    retrieveAccountSendSms({ customerTel }) {
        return axios(
            {
                method: 'POST',
                url: '/trade/appCustomer/retrieveAccountSendSms',
                headers: {
                    'content-type': 'application/json'
                },
                showLoad: true,
                responseType: 'json',
                data: JSON.stringify(
                    {
                        customerTel,
                    }
                )
            }
        )
    },

    // 重置密码短信发送接口
    resetPwdSendSms({ customerTel }) {
        return axios(
            {
                method: 'POST',
                url: '/trade/appCustomer/resetPwdSendSms',
                headers: {
                    'content-type': 'application/json'
                },
                showLoad: true,
                responseType: 'json',
                data: JSON.stringify(
                    {
                        customerTel,
                    }
                )
            }
        )
    },


    // 获取交易账号
    retrieveAccount({ customerTel, smsCode }) {
        return axios(
            {
                method: 'POST',
                url: '/trade/appCustomer/retrieveAccount',
                headers: {
                    'content-type': 'application/json'
                },
                showLoad: true,
                responseType: 'json',
                data: JSON.stringify(
                    {
                        customerTel,
                        smsCode
                    }
                )
            }
        )
    },

    getRegisterAgreement() {
        return axios(
            {
                method: 'POST',
                url: '/homepage/agreement/getRegisterAgreement',
                headers: {
                    'content-type': 'application/json'
                },
                showLoad: true,
                responseType: 'json',
                data: JSON.stringify(
                   
                )
            }
        )
    },
}
