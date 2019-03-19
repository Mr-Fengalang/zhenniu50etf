import React, { Component } from 'react'
import { moneyApi } from '../../../request'
import { Select,message ,Modal} from 'antd';
import {getCookie} from '../../../toolFn'
import { Link} from 'react-router-dom';
import { connect } from 'react-redux'

const Option = Select.Option;
const mapStateToProps = (store) => (
  {
      userInfo: store.userInfo
  }
)

class Tx extends Component {
  constructor(props) {
    super(props)

    this.state = {
        bankList: [],
        load: true,
        addBankShow: false,
        showBankDetail: false,
        showBankInfo: {},
        select: false,
        selectId: '',
        bankinfo:{},
        imginfo:{},
        rechargeAmount:'',
        customerCapitalPassword:'',
        clickWithdraw:false
    }

  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  success=(data)=> {
    Modal.confirm({
      className:"asdaasdasd",
      title: '提现金额',
      content: 
      <div className="txcgbox">
        <p className="money">￥{data}</p>
        <p>审核成功后即可到账</p>
      </div>,
      okText: '知道了',
      cancelText: '取消',
      onOk:()=> {
        this.props.history.push('/personalcenter/property/zjmx')
      },
    });
  }
  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  handleChange =(value)=>{
    this.setState({
        offlinePay:value,
        bankinfo:this.state.bankList.filter(i=>{
            if (i.bankNo===value) {
                return i
            }
        })[0] || {}
    })

}
    componentDidMount() {
      this.getBankList()
      moneyApi.
      clickWithdraw()
      .then(
          (res) => {
              if(res.resCode === '200') {
                this.setState({
                  clickWithdraw:true,
                  msginfo:res.msg
                })
              }else{
                this.setState({
                  msginfo:res.msg
                })
              }
          }
      )
    }
    changerechargeAmount=(value)=>{
      this.setState({
          rechargeAmount:value.target.value
      })
    }
    customerCapitalPassword=(value)=>{
      this.setState({
        customerCapitalPassword:value.target.value
      })
    }
    showConfirm=()=>{
      Modal.confirm({
        title: '账号与资金密码不匹配',
        content: '是否去重置密码',
        okText: '确认',
        cancelText: '取消',
        onOk:()=>{
          this.props.history.push('/personalcenter/pcenter/index/csmm',)
        },
        onCancel() {},
      });
    }
    doRecharge = () => {

      if (!this.state.clickWithdraw) {
        message.info(this.state.msginfo, 1.5)
        return false
      }

      const { bankinfo, rechargeAmount ,customerCapitalPassword} = this.state



      if(!rechargeAmount) {
          message.info('请输入提现金额', 1.5)
          return
      }

      if(parseFloat(rechargeAmount) <= 0) {
        message.info('提现金额必须为正数', 1.5)
          return
      }

      if (parseFloat(rechargeAmount)>(this.props.userInfo.customerCapital-this.props.userInfo.customerFreezeCapital)) {
        message.info('提现金额不能大于可用余额', 1.5)
          return
      }

      if(!customerCapitalPassword) {
        message.info('请输入资金密码', 1.5)
          return
      }
      if(!bankinfo) {
        message.info('请先绑定银行卡', 1.5)
          return
      }
      
        moneyApi.
        customerWithdraw(
            {
                customerId: getCookie('customerId'),
                customerBankId: bankinfo.bankInfoId,
                withdrawAmount:rechargeAmount,
                customerCapitalPassword: customerCapitalPassword,
                withdrawType: 1
            }
        )
        .then(
            (res) => {
                if (res.resCode === '522') {
                  this.showConfirm()
                }
                if(res.resCode === '200') {
                     this.success(rechargeAmount)
                    message.info("提现申请成功",1.5,()=>{
                    })
                }
            }
        )
    

  }
    getBankList = () => {
      moneyApi
      .getcustomerBankInfoList()
      .then(
          (res) => {
              if(res.resCode === '200') {
                  this.setState(
                      {   
                          load: false,
                          bankList: res.data,
                          bankinfo:res.data[0]
                      }
                  )
              }
          }
      )
      
  }
  render() {
    return (
      <div className="zjmx">
        <div className="infotitle">
          <p>提现</p>
        </div>
        {
          // this.state.clickWithdraw&&
          <div className="czinfobox">
          <div className="w450">
          <div className="chongzhijine">
           <p className="w100">提现金额：</p><input className="rechargeAmount" onChange={this.changerechargeAmount.bind(this)} value={this.state.rechargeAmount} placeholder="请输入您的提现金额" type="text"/><span className="yuan">元</span>
          </div>
          <div className="chongzhijine">
           <p className="w100">资金密码：</p><input className="rechargeAmount w338" type="password" onChange={this.customerCapitalPassword.bind(this)} value={this.state.customerCapitalPassword} placeholder="请输入您资金密码"  />
          </div>
        <div className="xzyhk">
            <p className="w100">选择银行卡：</p>
            {
                this.state.bankList[0]&&
                <React.Fragment>
                <Select 
                    onChange={this.handleChange}  
                    defaultValue={this.state.bankList[0].bankNo}
                        
                > 
                {
                    this.state.bankList.map(
                    (i)=>{
                        return(
                            <Option key={i.customerId} value={i.bankNo}  ><span a={i} >{i.openingBank}{i.bankNo}</span></Option>
                        )
                    }
                    )
                }
                </Select>
                    <Link to={{
                        pathname: `/personalcenter/pcenter/bankinfo`,
                        state: 'hello',
                        }}>
                        <p className="pl117" onClick={this.showModal}>银行卡详情</p>
                    </Link>
                </React.Fragment>

            }
            {
                !this.state.bankList[0]&&
                <div className="ml100">
                        <Link to ="/personalcenter/pcenter/bankinfo/txbk">+绑定银行卡</Link>
                </div>
            }
        </div>
        <div className="ljcz">
            <button onClick={this.doRecharge}  className={this.state.clickWithdraw?" ":"zhihui"} > 立即提现  </button>
        </div>
          </div>
        </div>
        }
      </div>
    )
  }
}
export default connect(mapStateToProps, null)(Tx)