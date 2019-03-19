import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'
import { Modal, message } from 'antd';
import InputGroup from 'react-input-groups';
import {moneyApi} from '../../../request'
import { fetchUserInfo } from '../../../stores/userInfo'
import { connect } from 'react-redux'

const confirm = Modal.confirm;
class Cztxbox extends Component {
  constructor(props){
    super(props)
    this.state={
      ifcz:true,
      customerCapitalPassword:''
    }
  }
  getValue=(value)=> {
    this.setState({
      customerCapitalPassword:value
    })
  }
  componentDidMount(){
    this.props.fetchUserInfo()
  }
  info=()=>{
    confirm({
      className:"myzjmm",
      title: '请设置资金密码',
      okText: '确认',
      cancelText:"取消",
      content: (
        <div>
          <InputGroup
              getValue={this.getValue}
              length={6}
              type={'box'}
          />
        </div>
      ),
      onOk:()=> {
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
              this.props.history.push('/personalcenter/property/cz')
              this.props.fetchUserInfo()
            }
        }
    )
      },
      onCancel:()=>{
        this.props.fetchUserInfo()
      },
    });

  }
  info1=()=>{
    confirm({
      className:"myzjmm",
      title: '请设置资金密码',
      okText: '确认',
      cancelText:"取消",
      content: (
        <div>
          <InputGroup
              getValue={this.getValue}
              length={6}
              type={'box'}
          />
        </div>
      ),
      onOk:()=> {
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
              this.props.history.push('/personalcenter/property/tx')

            }
        }
    )
      },
      onCancel() {},
    });

  }
  warning=()=>{
    Modal.confirm({
      title: '尚未实名认证',
      content: '请前去实名认证',
      okText: '确认',
      onOk:()=>{
        this.props.history.push('/personalcenter/pcenter/authentication/cz')
      }
    });
  }
  changecz =()=>{
    
    if (this.props.userInfo.authenticationStatus!==1) {
      this.warning()
      return
    }
    if (!this.props.userInfo.customerCapitalPassword) {
      this.info()
      return
    }
    this.setState({
      ifcz:true
    })
  }
  changecz1 =()=>{
    
    if (this.props.userInfo.authenticationStatus!==1) {
      this.warning()
      return
    }
    if (!this.props.userInfo.customerCapitalPassword) {
      this.info1()
      return
    }
    this.setState({
      ifcz:false
    })
  }
  render() {
    return (
      <div className="Cztxbox">
        <Link to={!this.props.userInfo.customerCapitalPassword||this.props.userInfo.authenticationStatus!==1?"/personalcenter/property/zjmx":"/personalcenter/property/cz"} className={(this.props.location.pathname).indexOf("/cz")>=0?"cz":'tx'} onClick={this.changecz} >充值</Link>
        <Link to={!this.props.userInfo.customerCapitalPassword||this.props.userInfo.authenticationStatus!==1?"/personalcenter/property/zjmx":"/personalcenter/property/tx"} className={(this.props.location.pathname).indexOf("/tx")>=0?"cz":'tx'} onClick={this.changecz1}>提现</Link>
      </div>
    )
  }
}
const mapDispatchToProps = (dispatch) => (
  {
      fetchUserInfo: (data) => {
          dispatch(fetchUserInfo(data))
      }
  } 
)

const mapStateToProps = (store) => (
  {
      userInfo: store.userInfo
  }
)
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Cztxbox))