import React, { Component } from 'react'
import { moneyApi } from '../../../request'
import { Select,message } from 'antd';
import {getCookie} from '../../../toolFn'
import { Link } from 'react-router-dom';

const Option = Select.Option;

class Xscz extends Component {
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
            bankinfo:[],
            imginfo:{},
            rechargeAmount:''
            
        }

    }
    handleChange =(value)=>{
        this.setState({
            offlinePay:value,
            bankinfo:this.state.bankList.filter(i=>{
                if (i.bankNo===value) {
                return i
                }
            }),
        })
    }

    changeimg =(value)=>{
        const channel=this.props.channel
        this.setState({
            imginfo:channel.filter(j=>{
                if (j.id==value.target.name) {
                    return j
                }
            }),
        })
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
    changerechargeAmount=(value)=>{
        this.setState({
            rechargeAmount:value.target.value
        })
    }
    doRecharge = () => {
        if(!this.state.rechargeAmount) {
            message.info('请输入充值金额', 1.5)
            return
        }

        if(parseFloat(this.state.rechargeAmount) <= 0) {
            message.info('充值金额必须为正数', 1.5)
            return
        }

        if(this.state.imginfo&&!this.state.imginfo[0]) {
            message.info('请选择充值通道', 1.5)
            return
        }

        moneyApi
        .onLineRecharge(
           {
            rechargeAmount: this.state.rechargeAmount,
            accountId: this.state.imginfo[0].id,
            accountName: this.state.imginfo[0].name,
            customerId: getCookie('customerId'),
            payMethod: 2
           }
        )
        .then(
            (res) => {
                if(res.resCode === '200') {
                    window.open(res.data.url)
                }
            }
        )

    }
    componentDidMount() {
        this.getBankList()
    }

  render() {
    return (
        <React.Fragment>
            <div className="chongzhijine">
                <p className="w100">充值金额：</p><input className="rechargeAmount" onChange={this.changerechargeAmount.bind(this)} value={this.state.rechargeAmount} placeholder="请输入您的充值金额" type="text"/><span className="yuan">元</span>
            </div>
            <div>
                <div className="w100">
                    充值方式：
                </div>   
                <div className="chongzhilogo_src">
                    {this.props.channel.map(i=>{
                            return(
                                <img src={i.logo_src} name={i.id} className={this.state.imginfo[0]&&this.state.imginfo[0].id==i.id&&"isactive"} alt="" onClick={this.changeimg.bind(this)} key={i.id} />
                            )
                        })
                    }
                </div>
            </div>
            <div className="xzyhk">
                <p className="w100">选择银行： </p>
                {
                    this.state.bankList[0]&&
                    <React.Fragment>
                    <Select 
                        onChange={this.handleChange}  
                        defaultValue=
                            {{
                                key: this.state.bankList[0].bankNo,
                                label: <span a={this.state.bankList[0]} >
                                    {this.state.bankList[0].openingBank}
                                    {this.state.bankList[0].cardholderIdCard}
                                </span>
                            }} 
                        labelInValue 
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
                        <Link to ="/personalcenter/pcenter/bankinfo">+绑定银行卡</Link>
                    </div>
                }
            </div>
            <div className="ljcz">
                <button onClick={this.doRecharge} > 立即充值  </button>
            </div>
                
        </React.Fragment>
    )
  }
}
export default Xscz