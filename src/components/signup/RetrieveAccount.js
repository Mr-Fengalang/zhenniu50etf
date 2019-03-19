import React, { Component } from 'react'
import img2 from './assets/7196.png'
import img3 from './assets/7195.png'
import { Link } from 'react-router-dom';
import { accountApi } from "../../request"
import { storageUser } from '../../toolFn'
import { message } from 'antd';
class RetrieveAccount extends Component {
    constructor(props){
        super(props)
        this.state={
            err:'',
            count: 60, // 秒数初始化为60秒
            liked: true, // 文案默认为‘获取验证码‘
            customerTel:'',
            smsCode:'',
        }
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value,err:'' });
      }
      getAccount = () => {
        const { customerTel, smsCode } = this.state
        accountApi
        .retrieveAccount(
            {
                customerTel, smsCode
            }
        )
        .then(
            (res) => {
                if(res.resCode === '200') {
                    message.info('获取交易账号成功', 1.5,()=>{
                        this.props.history.push('/signup/signuform')
                       })
                }
            }
        )
    }
    //发送验证码验证
    sendAuthVerify = () => {
        const { customerTel } = this.state
        if(!customerTel) {
            message.info('请输入手机号', 1.5)
            return
        }
        if(customerTel.length !== 11) {
            message.info('手机号格式不正确', 1.5)
            return
        }

        accountApi
        .retrieveAccountSendSms(
            {
                customerTel,
            }
        )
        .then(
            (res) => {
                if(res.resCode === '200') {
              message.info('获取验证码成功', 1.5)

                    let count = this.state.count
                    const timer = setInterval(() => {
                      this.setState({
                        count: (count--),
                        liked:false
                     },()=>{
                      if (count === 0) {
                        clearInterval(timer);
                        this.setState({
                          liked: true ,
                          count: 60
                        })
                      }
                     })
                    }, 1000);
                }
            }
        )
    }
  render() {
    return (
        <div className={'right1 logonnewbox'}>
            <div className="logonnewboxtitle">
                <p>找回交易账号</p>
            </div>
            <p className="erji">交易账号将以短信的形式发送到您的手机</p>
            <div className="pre mtp28 customerTel">
            <input type="text" 
            className="form-control pl40" 
            placeholder="请输入手机号"
            onChange={this.onChange}
            value={this.state.customerTel}
            name="customerTel"

            />
             <img className="pab" src={img2} alt="" srcSet=""/>
            </div>
            <div className="pre mtp28 input-group smsCode">
                <input type="text" 
                className="form-control pl40" 
                placeholder="请输入手机验证码"
                onChange={this.onChange}
                value={this.state.smsCode}
                name="smsCode"

                />
                <span className="input-group-addon sms" onClick={this.sendAuthVerify}>
                {
                this.state.liked 
                ? 
                '获取验证码'
                : 
                this.state.count + 's后获取'
                }

                </span>
                <img className="pab" src={img3} alt="" srcSet=""/>
            </div>
            <div className="tar">
                <p className="">已有账户？点击 <Link to="/signup/signuform" className="forgnew">登录</Link> </p> 
            </div>
            <p className="Log_but">
                <button onClick={this.getAccount}>确定</button>
            </p>
        </div>
    )
  }
}
export default RetrieveAccount
