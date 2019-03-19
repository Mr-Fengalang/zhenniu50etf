import React, { Component } from 'react'
import img2 from './assets/7196.png'
import img4 from './assets/7195.png'
import img3 from './assets/7193.png'
import { Link } from 'react-router-dom';
import { accountApi } from "../../request"
import { storageUser } from '../../toolFn'
import { message } from 'antd'
class lostPassword extends Component {
  constructor() {
    super(...arguments)

    this.state = {
        businessInviteCode: '',
        customerTel: '',
        smsCode: '',
        customerTradePassword: '',
        acceptCustomerTradePassword: '',
        recustomerTradePassword:'',
        registerSuccess: false,
        confirmrecustomerTradePassword:'',
        count: 60, // 秒数初始化为60秒
         liked: true // 文案默认为‘获取验证码‘
    }

  }
   //发送验证码验证
   sendAuthVerify = () => {
    if (!this.state.liked) {
      return
     }
    const { customerTel, businessInviteCode } = this.state

    if(customerTel.length !== 11) {
        message.info('手机号格式不正确', 1.5)
        return
    }
    accountApi
    .resetPwdSendSms(
        {
            customerTel
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

    //开户校验
    verifyReset = () => {
        const { customerTel, smsCode, newCustomerTradePassword, confirmCustomerTradePassword } = this.state
        if(!customerTel ||  !newCustomerTradePassword || !confirmCustomerTradePassword || !smsCode) {
            message.info('请将数据输入完整', 1.5)
            return false
        }
        if(customerTel.length !== 11) {
            message.info('手机号格式不正确', 1.5)
            return false
        }
        if( !(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,24}$/.test(newCustomerTradePassword)) ) {
            message.info('密码格式不正确', 1.5)
            return false
        }
        if(newCustomerTradePassword !== confirmCustomerTradePassword) {
            message.info('两次输入密码不一致', 1.5)
            return false
        }
        return true
    }

    //重置交易密码
    reset = () => {
        const { customerTel, customerTradePassword, smsCode, newCustomerTradePassword, confirmCustomerTradePassword } = this.state
        this.verifyReset()
        &&
        accountApi
        .resetPassword(
            {
                updatePasswordType: 1, customerTel, customerTradePassword, smsCode, newCustomerTradePassword, confirmCustomerTradePassword
            }
        )
        .then(
            (res) => {
                if(res.resCode === '200') {
                   message.info('重置交易密码成功', 1.5,()=>{
                    this.props.history.push('/signup/signuform')
                   })
                }
            }
        )
    }

      onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value,err:'' });
      }
  render() {
    return (
        <div className={'right1 logonnewbox registbox'}>
        <div className="logonnewboxtitle">
          <p>忘记密码</p>
        </div>

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
          <img className="pab" src={img4} alt="" srcSet=""/>
                  </div>
        <div className="pre mtp28">
          <input type="password" 
          className="form-control pl40 newCustomerTradePassword" 
          placeholder="请输入登录密码（6-24位数字+字母组合）"
          onChange={this.onChange}
          name="newCustomerTradePassword"
          value={this.state.newCustomerTradePassword}
        />
          <img className="pab" src={img3} alt="" srcSet=""/>
                  </div>
        <div className="pre mtp28">
          <input type="password" 
          className="form-control pl40 confirmCustomerTradePassword" 
          placeholder="请确认登录密码"
          onChange={this.onChange}
          name="confirmCustomerTradePassword"
          value={this.state.confirmCustomerTradePassword}
        />
          <img className="pab" src={img3} alt="" srcSet=""/>
                  </div>
        <div className="tar">
         <p className="">已有账户？点击 <Link to="/signup/signuform" className="forgnew">登录</Link> </p> 
        </div>
        <span id="helpBlock2" className="help-block err ">{this.state.err}</span>
        <p className="Log_but">
            <button onClick={this.reset}>确定</button>
        </p>
      </div>
    )
  }
}

export default lostPassword