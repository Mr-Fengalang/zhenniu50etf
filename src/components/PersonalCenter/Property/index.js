import React, { Component } from 'react'
import { connect } from 'react-redux'
import DTtext from './DT_text'
import './assets/css.css'
import routes from './routes'
const mapStateToProps = (store) => (
  {
      userInfo: store.userInfo
  }
)
const changebox = (data) => (
    {
        type: 'CHANGE_BOX',
        data
    }
  )

class index extends Component {
  constructor(props){
    super(props)
    this.state={
    }
  }

  componentDidMount() {
    const FindTargetListbox1={FindTargetListbox:false}
      return(
        this.props.dispatch(changebox(FindTargetListbox1))
      )
  }
  render() {
    return (
      <React.Fragment>
        <div className="Property w80 left">
            <DTtext userInfo={this.props.userInfo} />
            {/* {
              this.props.userInfo.userData.authenticationStatus!==1
              ?
              ""
              : */}

              {
                routes
              }
            {/* } */}
            
        </div>
        <div className="cash_notes left">
            <p className="title">
            入金注意事项：
                <br/><br/>
            </p>
            <p>
                 1、支付过程中请勿点击浏览器“后退”按钮
                <br/><br/>
                2、如使用线上充值的方式，点击“立即充值”按钮后，将跳转进入第三方支付平台页面，请根据页面提示操作
                <br/>
                <br/>
                3、入金会收取一定的手续费，具体标依据三方支付而定
                <br/>
            </p>
            <p className="erjititle">
            若入金失败：
                <br/>
                <br/>
            </p>
            <p>
                1、稍等3分钟后再刷新充值页面
                <br/><br/>
                2、清理浏览器缓存
                <br/><br/>
                3、切换网络环境
                <br/><br/>
                4、请联系平台客服
       
                      <br/> 
            </p>
            <p className="erjititle">
            出金注意事项：
                <br/><br/>
            </p>
            <p>
            1、出金在一个工作日内到账
            <br/>
            <br/>
            2、出金会收取一定的手续费，具体标依据三方支付而定
            <br/>
            </p>
            <p className="erjititle">
            若出金失败:
                <br/><br/>
            </p>
            <p>
            1、确认是否有正在审核的出金订单
            <br/>
            <br/>
            2、选择正确的银行卡
            <br/>
            <br/>
            3、输入正确的提现金额，提现金额大于最低提现额度
            <br/>
            <br/>
            4、请联系平台客服
            
            </p>

            
        </div>
      </React.Fragment>
      
      
    )
  }
}
export default connect(mapStateToProps, null)(index)