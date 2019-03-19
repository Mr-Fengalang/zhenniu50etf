import React, { Component } from 'react'
import customerPic from './assets/avator.png'
import { connect } from 'react-redux'
import moment from "moment";
import { Icon ,Input, message} from 'antd';
import {accountApi,moneyApi} from '../../../request'
import {delCookie} from '../../../toolFn'
import { fetchUserInfo} from '../../../stores/userInfo'

const mapStateToProps = (store) => (
  {
      userInfo: store.userInfo
  }
)

class Pcenter extends Component {
  constructor(props){
    super(props)
    this.state={
      page: this.props.match.params.name==='csmm'?"xiugaizijinmima":"info",
      customerTradePassword:'',
      newCustomerTradePassword:'',
      confirmCustomerTradePassword:'',
      customerCapitalPassword:'',
      confirmCustomerCapitalPassword:'',
      newCustomerCapitalPassword:'',
      count: 60, // 秒数初始化为60秒
      liked: true, // 文案默认为‘获取验证码‘
      customerTel:'',
      smsCode:""
    }
  }
  onChangePassword=(e)=>{
    this.setState({
      [e.target.name]:e.target.value
    })
  }
  xiugaimima=() =>{
    this.setState({
      page:"xiugaimima"
    })
  }
  xiugaizijinmima=() =>{
    this.setState({
      page:"xiugaizijinmima"
    })
  }
  shezizijinmima=()=>{
    this.setState({
      page:"shezizijinmima"
    })
  }
  back= () =>{
    if (this.props.match.params.name==='csmm') {
      window.history.back(-1)
    }else{
      this.setState({
        page:"info"
      })
    }
    
  }

      //确定更改
      acceptChange = () => {
        const { customerTradePassword, newCustomerTradePassword, confirmCustomerTradePassword } = this.state
        if(!customerTradePassword || !newCustomerTradePassword || !confirmCustomerTradePassword) {
            message.info('请将数据输入完整', 1.5)
            return
        }
        if( !(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,24}$/.test(newCustomerTradePassword)) ) {
            message.info('新密码格式不正确', 1.5)
            return
        }
        if(newCustomerTradePassword !== confirmCustomerTradePassword) {
            message.info('两次输入密码不一致', 1.5)
            return
        }

        accountApi
        .updatePassword(
            {
                updatePasswordType: 1,
                customerTradePassword,
                newCustomerTradePassword,
                confirmCustomerTradePassword,
            }
        )
        .then(
            (res) => {
                if(res.resCode === '200') {
                  this.props.history.push('/signup/signuform')
                    message.info('修改交易密码成功', 1.5, () => {
                        delCookie('accessToken')
                        delCookie('customerId')
                        delCookie('customerTel')
                        delCookie('customerTradeAccount')
                    } )
                }
            }
        )
    }
    initCustomerCapitalPassword = () => {
        const { customerCapitalPassword } = this.state
        if(customerCapitalPassword.length !== 6 || isNaN(customerCapitalPassword)) {
          message.info('密码必须为6位数字', 1.5)
            return
        }
        moneyApi
        .initCustomerCapitalPassword({customerCapitalPassword})
        .then(
            (res) => {
                if(res.resCode === '200') {
                  message.info('资金密码设置成功', 1.5)
                  this.props.fetchUserInfo()
                }
            }
        )
    }
       //发送验证码验证
   sendAuthVerify = () => {
    if (!this.state.liked) {
      return
     }
    const { customerTel } = this.state

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
              message.info('获取密码成功', 1.5)
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
    capitaltChange = () => {
      const { customerTel, smsCode, newCustomerCapitalPassword ,confirmCustomerCapitalPassword} = this.state
      if(!customerTel || !smsCode || !newCustomerCapitalPassword|| !confirmCustomerCapitalPassword) {
          message.info('请将数据输入完整', 1.5)
          return
      }
      if( newCustomerCapitalPassword.length !==6 || isNaN(newCustomerCapitalPassword) ) {
          message.info('新密码必须为6位数字', 1.5)
          return
      }
      if(newCustomerCapitalPassword !== confirmCustomerCapitalPassword) {
          message.info('两次输入密码不一致', 1.5)
          return
      }

      accountApi
      .resetPassword(
          {
              updatePasswordType: 2,
              customerTel: customerTel,
              smsCode:smsCode,
              newCustomerCapitalPassword,
              confirmCustomerCapitalPassword,
          }
      )
      .then(
          (res) => {
              if(res.resCode === '200') {
                  message.info('修改资金密码成功', 1.5, () => {
                    this.props.fetchUserInfo()
                    if (this.props.match.params.name==='csmm') {
                      this.props.history.push('/personalcenter/property/tx')
                    }else{
                      window.location.reload()
                    }
                  } )
              }
          }
      )
  }
  render() {
    const userInfo=this.props.userInfo
    if (this.state.page==="info") {
      return (
        <div >
          <div className="pcenterboxtitle">
            <span className="titleshu"></span>
            <p className="titlep">个人信息</p>
          </div>
          <div className="user clearfloat">
            <div className="touxiangbox">
                <img src={userInfo.customerPic?userInfo.customerPic:customerPic} alt=""/>
            </div>
            <div className="userinfobox">
              <p >登录账号：{userInfo.customerTradeAccount}</p>
              <p >手机号：{userInfo.customerTel&&userInfo.customerTel.replace(/^(\d{3})(\d+)(\d{4})$/gi,"$1****$3")}</p>
              <p >开户时间：{moment(userInfo.createTime).format('YYYY-MM-DD HH:mm:ss')}</p>
            </div>
          </div>
          <div className="xiugaimima">
            <p className="xiugaimimatitle">登录密码：</p>
            <p className="xiugaimimainfo">建议您定期更换密码，设置6-24位数字和字母组合的密码</p>
            <p className="ifdenglu">已设置</p>
            <p className="xiugai" onClick={this.xiugaimima}>修改</p>
          </div>
          <div className="xiugaimima borderbottom">
            <p className="xiugaimimatitle">资金密码：</p>
            <p className="xiugaimimainfo">建议您定期更换密码，设置6位数字的密码</p>
            {
              userInfo.customerCapitalPassword
              ?
              <React.Fragment>
                <p className="ifdenglu">已设置</p>
                <p className="xiugai" onClick={this.xiugaizijinmima}>重置</p>
              </React.Fragment>
              :
              <React.Fragment>
                <p className="ifdenglu">未设置</p>
                <p className="xiugai" onClick={this.shezizijinmima}>立即设置</p>
              </React.Fragment>
            }
          </div>
        </div>
      )
    }else if(this.state.page==="xiugaimima"){
      return(
        <div className="">
          <div className="pcenterboxtitle">
            <p onClick={this.back} className="curpon"> <Icon type="left" />返回</p>
            <span className="titleshu"></span>
            <p className="titlep">修改登录密码</p>
          </div>
          <div className="xgmmbox">
              <p className="xgmmboxtitle">修改登录密码</p>
            <div className="xgmmboxform">
             <p>原密码：</p><Input type="password" name="customerTradePassword" value={this.state.customerTradePassword} onChange={this.onChangePassword} placeholder="请输入原密码（6~24位数字+字母组合）" />
            </div>
            <div className="xgmmboxform">
              <p>新密码：</p><Input type="password" name="newCustomerTradePassword" value={this.state.newCustomerTradePassword}  onChange={this.onChangePassword} placeholder="请输入新密码（6~24位数字+字母组合）" />
            </div>
            <div className="xgmmboxform">
            <p>确认新密码：</p><Input type="password" name="confirmCustomerTradePassword" value={this.state.confirmCustomerTradePassword}  onChange={this.onChangePassword} placeholder="请确认新密码（6~24位数字+字母组合）" />
            </div>
            <div>
              <button className="acceptChange" onClick={this.acceptChange}>保存</button>
            </div>
          </div>
        </div>
      )
    }else if(this.state.page==="xiugaizijinmima"){
      return(
        <div className="">
          <div className="pcenterboxtitle">
            <p onClick={this.back} className="curpon"> <Icon type="left" />返回</p>
            <span className="titleshu"></span>
            <p className="titlep">重置资金密码</p>
          </div>
          <div className="xgmmbox">
              <p className="xgmmboxtitle">重置资金密码</p>
            <div className="xgmmboxform ">
            <p>手机号：</p><Input type="text" name="customerTel" value={this.state.customerTel} onChange={this.onChangePassword} placeholder="请输入手机号" />

             {/* <p>原密码：</p><Input type="password" name="customerCapitalPassword" value={this.state.customerCapitalPassword} onChange={this.onChangePassword} placeholder="请输入原密码（6位数字）" /> */}
            </div>
            <div className="xgmmboxform posr">
              <p>验证码：</p><Input type="text" name="smsCode" value={this.state.smsCode}  onChange={this.onChangePassword} placeholder="请输入验证码" />
              <span className="input-group-addon sms"  onClick={this.sendAuthVerify}>
                {
                this.state.liked 
                ? 
                '获取验证码'
                : 
                this.state.count + 's后获取'
                }

             </span>
              {/* <p>新密码：</p><Input type="password" name="newCustomerCapitalPassword" value={this.state.newCustomerCapitalPassword}  onChange={this.onChangePassword} placeholder="请输入新密码（6位数字）" /> */}
            </div>
            <div className="xgmmboxform">
              <p>资金密码：</p><Input type="password" name="newCustomerCapitalPassword" value={this.state.newCustomerCapitalPassword}  onChange={this.onChangePassword} placeholder="请输入新资金密码（6位数字）" />
            </div>
            <div className="xgmmboxform">
              <p>确认资金密码：</p><Input type="password" name="confirmCustomerCapitalPassword" value={this.state.confirmCustomerCapitalPassword}  onChange={this.onChangePassword} placeholder="请确认资金密码（6位数字）" />
            </div>
            <div>
              <button className="acceptChange" onClick={this.capitaltChange}>保存</button>
            </div>
          </div>
        </div>
      )
    }else if(this.state.page==="shezizijinmima"){
      return(
        <div className="">
          <div className="pcenterboxtitle">
            <p onClick={this.back} className="curpon"> <Icon type="left" />返回</p>
            <span className="titleshu"></span>
            <p className="titlep">设置资金密码</p>
          </div>
          <div className="xgmmbox">
              <p className="xgmmboxtitle">设置资金密码</p>
            <div className="xgmmboxform">
             <p>资金密码：</p><Input type="password" name="customerCapitalPassword" value={this.state.customerCapitalPassword} onChange={this.onChangePassword} placeholder="请输入资金密码（6位数字）" />
            </div>
            <div>
              <button className="acceptChange" onClick={this.initCustomerCapitalPassword}>保存</button>
            </div>
          </div>
        </div>
      )
    }

  }
}
const mapDispatchToProps = (dispatch) => (
  {
      fetchUserInfo: (data) => {
          dispatch(fetchUserInfo(data))
      }
  } 
)
export default connect(mapStateToProps,mapDispatchToProps)(Pcenter)