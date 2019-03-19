import React, { Component } from 'react'
import img2 from './assets/7194.png'
import img4 from './assets/7196.png'
import img5 from './assets/7195.png'
import img3 from './assets/7193.png'
import { Link } from 'react-router-dom';
import { accountApi } from "../../request"
import { storageUser } from '../../toolFn'
import { message } from 'antd'

class RegistForm extends Component {
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
         liked: true, // 文案默认为‘获取验证码‘
         agreementId:'',
         agreementTitle:'',
         agreementPic:'',
         isGoing: true
    }

  }


  componentDidMount(){
      this.getRegisterAgreement()
  }
   //发送验证码验证
   sendAuthVerify = () => {
    if (!this.state.liked) {
      return
     }
    const { customerTel, businessInviteCode } = this.state
    if( !businessInviteCode) {
      message.info('请输入推荐码', 1.5)
      return
  }
    if(!customerTel ) {
      message.info('请输入手机号', 1.5)
      return
  }
    
    if(customerTel.length !== 11) {
        message.info('手机号格式不正确', 1.5)
        return
    }
    accountApi
    .sendSms(
        {
            customerTel,
            businessInviteCode,
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
verifyRegister = () => {
    const { customerTel, businessInviteCode, recustomerTradePassword, customerTradePassword, smsCode,isGoing } = this.state
    if(!customerTel || !businessInviteCode || !recustomerTradePassword || !customerTradePassword || !smsCode) {
        message.info('请将数据输入完整', 1.5)
        return false
    }
    if(customerTel.length !== 11) {
        message.info('手机号格式不正确', 1.5)
        return false
    }
    if(!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,21}$/).test(recustomerTradePassword) || !(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,21}$/).test(customerTradePassword)){
      message.info('密码必须为6-24位，并且包含数字和字母!', 1.5)
    return false;
    }
    if(recustomerTradePassword !== customerTradePassword) {
        message.info('两次输入密码不一致', 1.5)
        return false
    }
    if(!isGoing) {
      message.info('请同意注册协议', 1.5)
      return false
  }
    return true
}

//开户
register = () => {
    const { customerTel, businessInviteCode, customerTradePassword, smsCode,agreementId } = this.state
    this.verifyRegister()
    &&
    accountApi
    .register(
        {
            customerTel, businessInviteCode, customerTradePassword, smsCode,agreementId
        }
    )
    .then(
        (res) => {
            if(res.resCode === '200') {
                message.info('开户成功,请查收手机短信',1.5)
                this.props.history.push('/signup/signuform')
                this.account = res.data.customerTradeAccount
                // storageUser(res.data)
                this.setState(
                    {
                        registerSuccess: true,
                    }
                )
            }
        }
    )
}

getRegisterAgreement = () => {
    
    accountApi
    .getRegisterAgreement()
    .then(
        (res) => {
            if(res.resCode === '200') {
               this.setState({
                agreementId:res.data.agreementId,
                agreementTitle:res.data.agreementTitle,
                agreementPic:res.data.agreementPic,
               })
            }
        }
    )
}
    //获取账号校验
    verifyGetAccount = () => {
        const { customerTel, smsCode } = this.state
        if(!customerTel || !smsCode) {
            message.info('请将数据输入完整', 1.5)
            return false
        }
        if(customerTel.length !== 11) {
            message.info('手机号格式不正确', 1.5)
            return false
        }
       
        return true
    }
    handleInputChange=(event)=>{
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
  
      this.setState({
        [name]: value
      });
    }

    //获取账号
    getAccount = () => {
        const { customerTel, smsCode,agreementId } = this.state
        this.verifyGetAccount()
        &&
        accountApi
        .retrieveAccount(
            {
                customerTel, smsCode,agreementId
            }
        )
        .then(
            (res) => {
                if(res.resCode === '200') {
                    message.info('获取交易账号成功', 1.5)
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
          <p>开户</p>
        </div>
        <div className="pre">
          <input type="text" 
          className="form-control pl40 businessInviteCode" 
          placeholder="请输入代理邀请码"
          onChange={this.onChange}
          value={this.state.businessInviteCode}
          name="businessInviteCode"

          />
          <img src={img2} alt="" className="pab"/>
        </div>
        <div className="pre mtp28 customerTel">
          <input type="text" 
          className="form-control pl40" 
          placeholder="请输入手机号"
          onChange={this.onChange}
          value={this.state.customerTel}
          name="customerTel"

        />
          <img className="pab" src={img4} alt="" srcSet=""/>
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
          <img className="pab" src={img5} alt="" srcSet=""/>
                  </div>
        <div className="pre mtp28">
          <input type="password" 
          className="form-control pl40 recustomerTradePassword" 
          placeholder="请输入交易密码（6-24位数字+字母组合）"
          onChange={this.onChange}
          name="recustomerTradePassword"
          value={this.state.recustomerTradePassword}
        />
          <img className="pab" src={img3} alt="" srcSet=""/>
                  </div>
        <div className="pre mtp28">
          <input type="password" 
          className="form-control pl40 confirmrecustomerTradePassword" 
          placeholder="请输入交易密码（6-24位数字+字母组合）"
          onChange={this.onChange}
          name="customerTradePassword"
          value={this.state.customerTradePassword}
        />
          <img className="pab" src={img3} alt="" srcSet=""/>
                  </div>
        <div className="tar">
         <p className="">已有账户？点击 <Link to="/signup/signuform" className="forgnew">登录</Link> </p> 
        </div>
        <span id="helpBlock2" className="help-block err ">{this.state.err}</span>
        <p className="Log_but">
            <button onClick={this.register}>开户</button>
        </p>
        <p style={{textAlign:"center",marginTop:'20px'}}>
            {
              <div>
                <input name="isGoing" type="checkbox" 
                  checked={this.state.isGoing}
                  onChange={this.handleInputChange} 
                  className="checkbox" 
                >
                </input>阅读并同意<a href={this.state.agreementPic}  target="_blank">{this.state.agreementTitle}</a>                
              </div>
            }
        </p>
      </div>
    )
  }
}
export default RegistForm