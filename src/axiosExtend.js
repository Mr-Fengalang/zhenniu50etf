
import axios from 'axios'


import createHashHistory from 'history/createHashHistory'
import { message, Modal } from 'antd'

import { Decrypt, Encrypt, getCookie, delCookie } from "./toolFn"
const confirm = Modal.confirm;

const history = createHashHistory()
function showConfirm() {
    confirm({
      title: '账号与资金密码不匹配',
      content: '是否去重置密码',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        history.push({
          pathname: '/personalcenter/pcenter/index',
          state: {
            name:"back"
          },
          query: {
            name:"back",
            price:"yourApartmentprice"
          }

        })
      },
      onCancel() {},
    });
  }

  function showConfirm3() {
    confirm({
      title: '该账号可用余额不足',
      content: '是否去充值',
      okText: '确认',
        cancelText: '取消',
      onOk() {
        history.push('/personalcenter/property/cz')
      },
      onCancel() {},
    });
  }
axios.interceptors.request.use(
    (config) => {
        config.headers.accessToken = Encrypt(getCookie('accessToken'))
        config.headers.customerTel = Encrypt(getCookie('customerTel'))
        config.headers.version = Encrypt('101')
        config.url = global.constants.website + config.url //测试
        // config.url = 'http://47.100.168.22:6000' + config.url //moke

        if(config.showLoad)  message.loading('加载中...', 60)

        if(typeof config.data === 'string') {
            // console.log(config.data)
            config.data = JSON.stringify(
              {
                enctyptData: Encrypt(config.data)
              }
            )
        }

        return config

    }
)

const alert = Modal.alert

//添加axios响应拦截器
axios.interceptors.response.use(
    (res) => {
        // console.log(res.config.showLoad)
        if(res.config.showLoad) message.destroy()
        res.data = JSON.parse(Decrypt(res.data.enctyptData))
        switch(res.data.resCode) {
            case '509':
                message.info( (getCookie('accessToken') ? '登录失效' : '请先登录'), 1.5, () => {
                    history.replace('/')
                })
                delCookie('accessToken')
                delCookie('customerId')
                delCookie('customerTel')
                delCookie('customerTradeAccount')
                localStorage.setItem('50etfUser', JSON.stringify({}))
                break
            case '512':
                // showConfirm1()
                break
                case '513':
                // showConfirm3()
                break
            case '522':
                // showConfirm()
                break
            case '200':
                return res.data
            default :
                message.info( res.data.msg, 1.5)
        }
        return res.data
    },
    (err) => {
        message.destroy()
        message.info( '服务器错误，错误代码'+err, 1.5)

        return {
            msg : err
        }
    }
)