import React, { Component } from 'react'
import { Select } from 'antd';
import { moneyApi } from '../../../request'
import { getCookie } from '../../../toolFn'
import Xscz from './Xscz'
import Zhuanzhang from './Zhuanzhang'
import Shaoma from './Shaoma'
const Option = Select.Option;


function pFn(p){return p.payType == 1 ;}
function pFn1(p){return p.payType == 2 ;}


export default class Cz extends Component {

  constructor() {
    super(...arguments)

    this.state = {
        load: true,
        payType: [],
        companyBankInfo: {},
        selectType: '',
        selectChannel: {},
        rechargeAmount: '',
        offlinePaymentList:'',
        offlinePay:'',
        ifzhuanzhange:[],
        ifshaoma:[],
        channel:[],
        offlinePaymentId:'',
        clickWithdraw:false
    }

}
handleChange =(value)=>{
  this.setState({
    offlinePay:value,
    offlinePaymentId:value,
    ifzhuanzhange:this.state.offlinePaymentList.filter(i=>{
      if (i.offlinePaymentId===value&&i.offlinePaymentType===2) {
        return i
      }
    }),
    ifshaoma:this.state.offlinePaymentList.filter(i=>{
      if (i.offlinePaymentId===value&&i.offlinePaymentType===1) {
        return i
      }
    }),
  })
}
componentDidMount() {

  moneyApi
  .getPayList()
  .then(
      (res) => {
          if(res.resCode === '200') {
            res.data.offlinePaymentList.forEach((i,j)=>{
              if (i.offlinePaymentName==="支付宝转账"||i.offlinePaymentName==="微信转账") {
                (res.data.offlinePaymentList).splice(i,1)
              }
            })
              this.setState({
                load: false, 
                payType: res.data.type,
                offlinePaymentList: res.data.offlinePaymentList, 
                companyBankInfo: res.data.companyBankInfo || {}, channel: res.data.channel || [] },
                  ()=>{
                      if (this.state.payType.findIndex(pFn)>-1) {
                      this.setState({
                        offlinePay:"88",
                        offlinePaymentId:this.state.offlinePaymentList[0].offlinePaymentId
                      })
                    }else{
                      if (this.state.payType.findIndex(pFn1)>-1) {
                        if (this.state.offlinePaymentList[0].offlinePaymentType===1) {
                          this.setState({
                            ifshaoma:this.state.offlinePaymentList,
                            offlinePaymentId:this.state.offlinePaymentList[0].offlinePaymentId
                          })
                        }else{
                          this.setState({
                            ifzhuanzhange:this.state.offlinePaymentList,
                            offlinePaymentId:this.state.offlinePaymentList[0].offlinePaymentId
                          })
                        }
                        
                      }
                    }
                  }
                )
              if(res.data.type.length > 0) {
                  this.setState({selectType: res.data.type[0].payType})
              }

          }
      }
  )
}

  render() {
  
    return (
      <div className="zjmx">
        <div className="infotitle">
          <p>充值</p>
        </div>
        {
            this.state.offlinePaymentList[0]&& 
            this.state.companyBankInfo!=={}&&
            <div className="czinfobox">
            <div className="w450">
                <div className="payType">
  
                <p className="w100">
                  选择支付类型：
                </p>
                  {
                    <Select onChange={this.handleChange} defaultValue={this.state.payType.findIndex(pFn)>-1?"88":this.state.payType.findIndex(pFn1)>-1?this.state.offlinePaymentList[0].offlinePaymentId:"none"}>
                      {
                        this.state.payType.findIndex(pFn)>-1&&
                        <Option key={88} value="88">线上入金</Option>
                      }
                      { 
                        this.state.payType.findIndex(pFn1)>-1&&
                        this.state.offlinePaymentList.map(
                          (i)=>{
                            if (!i.offlinePaymentUrl) {
                              return(
                              <Option key={i.offlinePaymentId} value={i.offlinePaymentId}>{i.offlinePaymentName}</Option>
                              )
                            }
                            
                          }
                        )
                      }
                    </Select>
                  }
                </div>
                <div className="offlinePaymentType">
                {
                  this.state.offlinePay=="88"&&
                <Xscz channel={this.state.channel} offlinePaymentId={this.state.offlinePaymentId}  />
                }
                {
                  this.state.ifzhuanzhange[0]&&
                  <Zhuanzhang ifzhuanzhange={this.state.ifzhuanzhange} offlinePaymentId={this.state.offlinePaymentId}  />
                }
                {
                  this.state.ifshaoma[0]&&
                  <Shaoma ifzhuanzhange={this.state.ifshaoma} offlinePaymentId={this.state.offlinePaymentId}  />
                }
              </div>
            </div>
          </div>
        }
        {
          !this.state.offlinePaymentList[0]&&
          <div className="czinfobox">
            <div className="w450">
              <h2 >
              暂无支付方式
              </h2>
              
            </div>
          </div>
        }
      </div>
    )
  }
}
