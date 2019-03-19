import React, { Component } from 'react'
import {accountApi,moneyApi} from '../../../request'
import Banklist from './Banklist'
import { connect } from 'react-redux'

import {Input,Icon, message,Select,Cascader,Modal} from 'antd'
import {getCookie} from '../../../toolFn'
import administrativeRegionData from './administrativeRegion'
import './assets/select.css'
const confirm = Modal.confirm;
const mapStateToProps = (store) => (
  {
      userInfo: store.userInfo
  }
)
const formatAdministrativeRegionData = (data) => {
  const _data = []
  for(let i in data) {
      let __data = data[i]
      if(__data.child) {
          __data.child = formatAdministrativeRegionData(__data.child)
          _data.push({
              value: __data.name,
              label: __data.name,
              children: __data.child,
          })
      }else{
          _data.push({
              value: __data,
              label: __data,
              children: [],
          })
      }
  }
  return _data
}

const _administrativeRegionData = formatAdministrativeRegionData(administrativeRegionData)
const Option = Select.Option;

class Bankinfo extends Component {
  constructor(props){
    super(props)
    this.state={
      bankList:[],
      ifbankinfo:true,
      bankListinfo:{},
      ifbangka:false,
      cardholderName:"",
      cardholderIdCard:"",
      cardholderTel:"",
      bankCode:'',
      name: '',
      idCard: '',
      accountOpeningBranch:'',
      bankList1:[],
      isClickable:true
    }
    this.handleChange=this.handleChange.bind(this)
    this.onChange=this.onChange.bind(this)
  }
  infochange=(e)=>{
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  warning=()=>{
    Modal.confirm({
      title: '尚未实名认证',
      content: '请前去实名认证',
      okText: '确认',
      onOk:()=>{
        this.props.history.push('/personalcenter/pcenter/authentication/yhk')
      }
    });
  }
  warning1=()=>{
    Modal.confirm({
      title: '确定解绑',
      content: '是否确认解绑该银行卡',
      okText: '确认',
      onOk:()=>{
        this.acceptChange()
      }
    });
  }
  onChange(value) {
    this.setState({
      openingProvince:value[0],
      openingCity:value[2],
    })

  }
  handleChange(value,title) {
    this.setState({
      openingBank:title.props.children,
      bankCode:value,
    })
  }
  componentDidMount(){
    this.getBankList()

  }
  toggleShowBank = (item) => {
    
    this.setState({
      bankListinfo:item,
      ifbankinfo:false,

    })
  }
  back=()=>{
    this.setState({
      ifbankinfo:true,
      ifbangka:false
    })
  }
  back1=()=>{
   this.props.history.goBack()
  }
  
  acceptChange=()=>{
    moneyApi
    .unbindBankCard(
        {
            customerId: getCookie('customerId'),
            bankInfoId: this.state.bankListinfo.bankInfoId
        }
    )
    .then(
        (res) => {
            if(res.resCode === '200') {
                message.success('解绑成功', 1.5,
                    () => {
                        this.setState({showBankDetail: false})
                        this.getBankList()
                          window.location.reload()
                    }
                )
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
                        bankList: res.data
                    }
                )
            }
        }
    )
  }
  addBankCard = () => {
    const { bankNo, openingBank, openingProvince, openingCity, accountOpeningBranch, cardholderName, cardholderIdCard, cardholderTel, bankCode } = this.state
    if (!cardholderName) {
      message.success('请输入持卡人姓名', 1.5)
      return false
    }
    if (!cardholderIdCard) {
      message.success('请输入持卡人身份证', 1.5)
      return false
    }
    if (!bankCode) {
      message.success('请选择银行', 1.5)
      return false
    }
    if (!bankNo) {
      message.success('请输入银行卡号', 1.5)
      return false
    }
    if (!openingProvince) {
      message.success('请选择开户省/市', 1.5)
      return false
    }
    if (!accountOpeningBranch) {
      message.success('请输入开户支行', 1.5)
      return false
    }
    if (!cardholderTel) {
      message.success('请输入预留手机号', 1.5)
      return false
    }
    moneyApi
    .customerTiedCard(
        {customerId: getCookie('customerId'), bankNo, openingBank, openingProvince, openingCity, accountOpeningBranch, cardholderName, cardholderIdCard, cardholderTel, bankCode}
    )
    .then(
        (res) => {
            if(res.resCode === '200') {

              if (this.props.match.params.name==="txbk") {
                message.success('绑卡成功', 1.5, () => {
                  this.props.history.push('/personalcenter/property/tx')
                  }
                )
              }else{
                message.success('绑卡成功', 1.5, () => {
                  window.location.reload()
                  }
                )
              }
            }
        }
    )
}  
  bangkachange=()=>{
    if (this.props.userInfo.authenticationStatus!==1) {
      this.warning()
      return 
    }
    moneyApi
    .getBankInfoList()
    .then(
        (res) => {
            if(res.resCode === '200') {
              this.setState({
                banklist1:res.data
              })
            }
        }
    )
    this.setState({
      ifbangka:true
    })
  }
  renderBank = (item) => {
    const { selectId } = this.state
    return(
        <div key={item.bankInfoId} className="banklistbox" >
            <span onClick={() => this.toggleShowBank(item)}>详情></span>
            <p>
                {item.openingBank}
            </p>
            <p>
                {item.bankNo.replace(/^(\d{3})(\d+)(\d{4})$/gi,"$1********$3")}
            </p>
            {/* <div ><img src={selectId === item.bankInfoId ? selectIcon: noSelectIcon} alt="选择"/></div> */}
        </div>
    )
}
  render() {
    const { bankList, load, addBankShow, showBankDetail, showBankInfo } = this.state

    return (
      <div className="">
        <div className="pcenterboxtitle">
          {
            this.props.location.state==="hello"&&this.state.ifbankinfo&&!this.state.ifbangka?
            <p onClick={this.back1} className="curpon"> <Icon type="left" />返回</p>
            :
            ""
          }
          {
            this.state.ifbankinfo
            ?
            ""
            :
            <p onClick={this.back} className="curpon"> <Icon type="left" />返回</p>
          }
          {
            !this.state.ifbangka
            ?
            ""
            :
            <p onClick={this.back} className="curpon"> <Icon type="left" />返回</p>
          }
          <span className="titleshu"></span>
          <p className="titlep">我的银行卡</p>
        </div>
        {
          this.state.ifbankinfo
          ?
          !this.state.ifbangka&&

          <div className="bankinfobox">
          <div>
          <p className="bankinfobox_title">我的银行卡</p>
            {
              bankList.map(
                  (item, index) => this.renderBank(item, index)
              )
            }
          </div>
            
            <div className="banklistbox bangkabox">
              <p onClick={this.bangkachange}><Icon type="plus" style={{ fontSize: '16px', color: '#ff4a4a' }}/> 添加银行卡</p>
            </div>
          </div>
          :
          !this.state.ifbangka?
            <div className="xgmmbox">
                  <p className="xgmmboxtitle">银行卡详情</p>
                <div className="xgmmboxform">
                <p>账户开户名：</p><Input type="text" name="cardholderName" value={this.state.bankListinfo.cardholderName}  readOnly />
                </div>
                <div className="xgmmboxform">
                  <p>身份证号：</p><Input type="text" name="cardholderIdCard" value={this.state.bankListinfo.cardholderIdCard} readOnly  />
                </div>
                <div className="xgmmboxform">
                  <p>银行卡号：</p><Input type="text" name="bankNo" value={this.state.bankListinfo.bankNo}  readOnly />
                </div>
                <div className="xgmmboxform">
                  <p>开户银行：</p><Input type="text" name="openingBank" value={this.state.bankListinfo.openingBank}  readOnly  />
                </div>
                <div className="xgmmboxform">
                  <p>开户省市：</p><Input type="text" name="openingProvince" value={this.state.bankListinfo.openingProvince}  readOnly  />
                </div>
                <div className="xgmmboxform">
                  <p>开户支行：</p><Input type="text" name="accountOpeningBranch" value={this.state.bankListinfo.accountOpeningBranch}  readOnly  />
                </div>
                <div className="xgmmboxform">
                  <p>预留手机号：</p><Input type="text" name="cardholderTel" value={this.state.bankListinfo.cardholderTel} readOnly  />
                </div>
                <div>
                  <button className="acceptChange" disabled={!this.state.isClickable}  onClick={this.warning1}>解绑</button>
                </div>
              </div>
              :
              ""
        }
        {
          this.state.ifbangka&&this.state.banklist1&&
          <div>
            <div className="xgmmbox">
              <p className="xgmmboxtitle">绑定银行卡</p>
              <div className="xgmmboxform">
                <p>持卡人：</p><Input onChange={this.infochange} value={this.state.cardholderName} name="cardholderName" placeholder="请输入持卡人姓名" />
              </div>
              <div className="xgmmboxform">
                <p>身份证号：</p><Input  onChange={this.infochange} value={this.state.cardholderIdCard} name="cardholderIdCard" placeholder="请输入身份证号" />
              </div>
              <div className="xgmmboxform">
                <p>银行名称：</p> 
                  <Select  placeholder="请选择银行" onChange={this.handleChange} className="asdasdasds">
                      {this.state.banklist1.map(d => <Option key={d.bankCode}>{d.bankName}</Option>)}
                  </Select>
                
              </div>
              <div className="xgmmboxform">
                <p>银行卡号：</p><Input onChange={this.infochange} value={this.state.bankNo} name="bankNo" placeholder="请输入银行卡号" />
              </div>
              <div className="xgmmboxform">
                <p>开户省/市：</p>
                <Cascader options={_administrativeRegionData}  onChange={this.onChange} placeholder="请选择开户省、市" />
              </div>
              <div className="xgmmboxform">
                <p>开户支行：</p><Input onChange={this.infochange} value={this.state.accountOpeningBranch} name="accountOpeningBranch" placeholder="请输入开户支行" />
              </div>
              <div className="xgmmboxform">
                <p>预留手机号：</p><Input onChange={this.infochange} value={this.state.cardholderTel} name="cardholderTel" placeholder="请输入预留手机号" />
              </div>
              <div>
                  <button className="acceptChange" disabled={!this.state.isClickable} onClick={this.addBankCard}>点击绑卡</button>
                </div>
            </div>
          </div>
        }
        
      </div>
    )
  }
}

export default connect(mapStateToProps)(Bankinfo)