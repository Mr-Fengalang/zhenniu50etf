import React, { Component } from 'react'
import { Radio,Button, message,Icon,Modal,Tooltip} from 'antd';
import {connect} from 'react-redux'
// import { dispatch } from 'rxjs/internal/observable/range';
import {KLINE_BOX} from '../../../stores/userInfo/actionTypes'
import { withRouter } from 'react-router-dom';
import { tradeApi, } from '../../../request'
import { newGuid,unZip } from '../../../toolFn'
import moment from "moment";
import { fetchUserInfo } from '../../../stores/userInfo'

const confirm = Modal.confirm;
const klinebox = (data) => (
  {
      type: KLINE_BOX,
      data
  }
)

const changebox = (data) => (
  {
      type: 'CHANGE_BOX',
      data
  }
)


const RadioGroup = Radio.Group;
class FindTargetListbox extends Component {
  constructor() {
    super(...arguments)


    this.state = {
        minWavePoint: '',
        contractMultiplier: '',
        tradingContractUnit: '',
        openFee: '',
        closeFee: '',
        reportMaxNum: '',
        quickOrderVolumes: '',
        showModal: false,
        volume: "",
        ygzj:'0',
        findTargetListboxlist1:'',
        page:1,
        getContractAnalysis:{},
        getMarketTradeDetail:[],
        kcc:0,
        confirm1:true,
        value11:1,
        orderPriceType:0,
        xjjg:''
      }
    

    this.idempotency = newGuid()
    this.reportOrder=this.reportOrder.bind(this)
    this.volumeup=this.volumeup.bind(this)
}


startWebsocket = () => {
  const { volume } = this.state

  const askPrice1 =this.props.findTargetListboxlist.askPrice1
  const instrumentName =this.props.findTargetListboxlist.instrumentName
  const ws = new WebSocket(global.constants.webSocket)
  const uuid = newGuid()
  ws.onopen = (evt) => {
          const websocketJson = {
              instrumentMonth: "NOW_VOLUME",
          }
          websocketJson.uuid = uuid
          if(this.props.userInfo.customerId) {
              websocketJson.customerId = this.props.userInfo.customerId
          }
        ws.send(JSON.stringify(websocketJson))
  }
  ws.onmessage = (evt) => {
      unZip(evt)
      .then(
          (res) => {
              if (res.pushType === 5&&res.data.code===this.props.findTargetListboxlist.instrumentCode) {
                var newgetMarketTradeDetail=this.state.getMarketTradeDetail
                newgetMarketTradeDetail.unshift(res.data)
                this.setState({
                  getMarketTradeDetail:newgetMarketTradeDetail
                })
              }
              if (res.pushType === 2) {
                if (res.data.statusMsg!=="成功") {
                  message.info(res.data.statusMsg,1.5)
                  this.setState({
                    confirm1:false
                  },()=>{
                   
                  })
                }
              }
          } 
      )
  }
  // setInterval(()=>{
  // var newState =JSON.parse(JSON.stringify(this.state.findTargetListdata));
  //   newState.map((j,i)=>{
  //     j.buyHy.active = false
  //     j.sellHy.active = false
  //       if (tOfferData[j.buyHy.instrumentCode]) {
  //         Object.keys(j.buyHy).map(k=>{
  //           if (tOfferData[j.buyHy.instrumentCode][k]) {
  //             if (
  //               newState[i].buyHy.openInterest !== tOfferData[j.buyHy.instrumentCode][k].openInterest||
  //               newState[i].buyHy.volume !== tOfferData[j.buyHy.instrumentCode][k].volume||
  //               newState[i].buyHy.bidPrice1 !== tOfferData[j.buyHy.instrumentCode][k].bidPrice1||
  //               newState[i].buyHy.askPrice1 !== tOfferData[j.buyHy.instrumentCode][k].askPrice1||
  //               newState[i].buyHy.openPrice !== tOfferData[j.buyHy.instrumentCode][k].openPrice
                
  //               ) {
  //             newState[i].buyHy.active = true
                
  //             }
  //             newState[i].buyHy[k]=tOfferData[j.buyHy.instrumentCode][k]
  //           }
  //         })               
  //       }
  //       if (tOfferData[j.sellHy.instrumentCode]) {
  //         Object.keys(j.sellHy).map(k=>{
  //           if (tOfferData[j.sellHy.instrumentCode][k]) {
  //             if (
  //               newState[i].sellHy.openInterest !== tOfferData[j.sellHy.instrumentCode][k].openInterest||
  //               newState[i].sellHy.volume !== tOfferData[j.sellHy.instrumentCode][k].volume||
  //               newState[i].sellHy.bidPrice1 !== tOfferData[j.sellHy.instrumentCode][k].bidPrice1||
  //               newState[i].sellHy.askPrice1 !== tOfferData[j.sellHy.instrumentCode][k].askPrice1||
  //               newState[i].sellHy.openPrice !== tOfferData[j.sellHy.instrumentCode][k].openPrice
  //               ) {
  //             newState[i].sellHy.active = true
                
  //             }
  //             newState[i].sellHy[k]=tOfferData[j.sellHy.instrumentCode][k]
  //           }
  //         })               
  //       }
  //     })
  //     this.setState({
  //       findTargetListdata:newState
  //     },()=>{
  //       this.props.greet5(tOfferData)
  //       tOfferData={}
  //     })
     
  // },1000)
}
onChange = (e) => {
  if (this.props.buyAndSelllist.resCode==="200") {
    let { value } = e.target;
    if(value<0){
      value=0
    }

    if (this.setState.value11===1) {
      if (value>this.props.buyAndSelllist.data.reportMaxNum) {
        value=this.props.buyAndSelllist.data.reportMaxNum
      }
    }else{
      if (value>this.props.buyAndSelllist.data.limitReportMaxNum) {
        value=this.props.buyAndSelllist.data.limitReportMaxNum
      }
    }

    
    const reg = /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/;
    if ((!Number.isNaN(value) && reg.test(value)) || value === '' || value === '-') {
        this.setState({
          volume:value,
        })
      // }
      
    }else{
      this.setState({
        volume:0,
      }) 
    }
    
  }

}
 showConfirm3=()=> {
  confirm({
    title: '该账号可用余额不足',
    content: '是否去充值',
    okText: '确认',
      cancelText: '取消',
    onOk:()=> {
      this.props.history.push('/personalcenter/property/cz')
    },
    onCancel() {},
  });
}

    reportOrder = () => {
      const  {volume,orderPriceType}  = this.state
      if (volume==0) {
        message.info('开仓数量不能为0', 1.5)       
        return 
      }
      if (!volume) {
        message.info('请输入开仓数量', 1.5)       
        return 
      }
      const contraceCode =this.props.findTargetListboxlist.instrumentCode
      const askPrice1 = this.state.value11===1?this.props.findTargetListboxlist.askPrice1:this.state.xjjg
      const instrumentName =this.props.findTargetListboxlist.instrumentName
      tradeApi
      .reportOrder(
          {
              contraceCode, volume, limitPrice:askPrice1, direction: 0, offsetFlag: 0, idempotency: this.idempotency,orderPriceType
          }
      )
      .then(
          (res) => {
              if(res.resCode === '200') {
                setTimeout(
                  ()=>{
                    if (this.state.confirm1) {
                      this.confirm1(instrumentName,volume,askPrice1)
                    }
                  }
                  ,1000
                )
                this.idempotency = newGuid()
              }
          }
      )
    }
    getOrderList=()=>{
      tradeApi
    .getOrderList(
        {
            reqsOrderType: 1,
        }
    )
    .then(
        (res) => {
            if(res.resCode === '200') {
               
            }
        }
    )
    }
    
    confirm=(instrumentName,volume)=>{

      this.setState({
        confirm1:true
      })

      if (this.state.volume==0) {
        message.info('开仓数量不能为0', 1.5)       
        return 
      }
      if (!this.state.volume) {
        message.info('请输入开仓数量', 1.5)       
        return 
      }
      Modal.confirm({
        className:"reportOrder",
        title: '开仓委托确认',
        content: <div>
          <p>合约名称：{instrumentName}</p>
          <p>买卖类型：买开</p>
          <p>委托数量：{volume}</p>
          <p className="ifweituo">是否确定发出该笔委托？</p>
        </div>,
        okText: '确认',
        cancelText: '取消',
        onOk:()=> {
          this.reportOrder()
        },
      });
    }
    confirm1=(instrumentName,volume,askPrice1)=>{

      Modal.confirm({
        className:"reportOrder",

        title: '开仓委托成功',
        content:
        <div>
          <p>合约名称：{instrumentName}</p>
          <p>买卖类型：买开</p>
          <p>委托数量：{volume}</p>
          <p>委托价格：{askPrice1}</p>
        </div>,
        okText: '查看',
        cancelText: '知道了',
        onOk:()=> {
          this.props.history.push('/personalcenter/order')
        },
      });
    }

    componentWillUnmount(){
      // const klinebox1={klinebox:false}
      // return(
      //   this.props.dispatch(klinebox(klinebox1))
      // )
    }
   
    componentDidMount(){
      fetchUserInfo()
      if (this.props.buyAndSelllist.resCode==="200") {
        this.setState({
          kcc:Math.floor((this.props.userInfo.customerCapital-this.props.userInfo.customerFreezeCapital)/((Number(this.props.findTargetListboxlist.askPrice1)+0.005)*this.props.buyAndSelllist.data.contractMultiplier+Number(this.props.buyAndSelllist.data.openFee)+Number(this.props.buyAndSelllist.data.closeFee)))
        })
      }
      this.getContractAnalysis()
      this.getMarketTradeDetail()
      this.startWebsocket()
    }
    warning=()=>{
      Modal.confirm({
        title: '尚未实名认证',
        content: '请前去实名认证',
        okText: '确认',
        onOk:()=>{
          this.props.history.push('/personalcenter/pcenter/authentication/market')
        }
      });
    }
  getContractAnalysis = () => {
    const instrumentCode =this.props.findTargetListboxlist.instrumentCode
    tradeApi
    .getContractAnalysis(
        {
          instrumentCode
        }
    )
    .then(
        (res) => {
            if(res.resCode === '200') {
                this.setState({
                  getContractAnalysis:res.data
                })
            }
        }
    )
  }
  onChange11 = (e) => {
    if (this.props.buyAndSelllist.resCode==="200") {

    if (this.state.value11===1) {
      this.setState({
        kcc:Math.floor((this.props.userInfo.customerCapital-this.props.userInfo.customerFreezeCapital)/((Number(this.props.findTargetListboxlist.askPrice1)+0.005)*this.props.buyAndSelllist.data.contractMultiplier+Number(this.props.buyAndSelllist.data.openFee)+Number(this.props.buyAndSelllist.data.closeFee)))
      })
    }else{
      this.setState({
        kcc:Math.floor((this.props.userInfo.customerCapital-this.props.userInfo.customerFreezeCapital)/((Number(this.state.xjjg))*this.props.buyAndSelllist.data.contractMultiplier+Number(this.props.buyAndSelllist.data.openFee)+Number(this.props.buyAndSelllist.data.closeFee)))
      })
    }
    }
    if (e.target.value===1) {
      this.setState({
        xjjg:''
      })
    }else{
      this.setState({
        xjjg:this.props.findTargetListboxlist.askPrice1
      });
    }
    this.setState({
      value11: e.target.value,
      orderPriceType:e.target.value===1?0:1,
    });
  }
  getMarketTradeDetail = () => {
    const instrumentCode =this.props.findTargetListboxlist.instrumentCode
    const instrumentMonth =this.props.findTargetListboxlist.instrumentMonth
    tradeApi
    .getMarketTradeDetail(
        {
          instrumentCode,instrumentMonth
        }
    )
    .then(
        (res) => {
            if(res.resCode === '200') {
                this.setState({
                  getMarketTradeDetail:res.data
                })
            }
        }
    )
  }
  ontokline=(instrumentCode,instrumentMonth)=>{
    this.props.tokline(instrumentCode,instrumentMonth)
    const klinebox1={klinebox:true}
    return(
      this.props.dispatch(klinebox(klinebox1))
    )
  }
  pagechange=(e)=>{
    this.setState({
      page:e
    })
  }
  onChangexjjg=(e)=>{
    if (this.props.buyAndSelllist) {
      this.setState({
        kcc:Math.floor((this.props.userInfo.customerCapital-this.props.userInfo.customerFreezeCapital)/((Number(e.target.value))*this.props.buyAndSelllist.data.contractMultiplier+Number(this.props.buyAndSelllist.data.openFee)+Number(this.props.buyAndSelllist.data.closeFee)))
      })
      this.setState({
        xjjg:e.target.value
      })
    }
    
  }
  volumeup=()=>{
    if (this.props.buyAndSelllist) {
      if (this.state.value11===1) {
        this.setState(()=>({
          volume:(Number(this.state.volume)+1)>this.props.buyAndSelllist.data.reportMaxNum?this.props.buyAndSelllist.data.reportMaxNum:Number(this.state.volume)+1
        }))
      }else{
        this.setState(()=>({
          volume:(Number(this.state.volume)+1)>this.props.buyAndSelllist.data.limitReportMaxNum?this.props.buyAndSelllist.data.limitReportMaxNum:Number(this.state.volume)+1
        }))
      }
    
  }
  }
  volumedown=()=>{
    if (this.props.buyAndSelllist) {
    this.setState(()=>({
      volume:Number(this.state.volume)>1?Number(this.state.volume)-1:0
    }))
  }
  }
  close=()=>{
    const klinebox1={klinebox:false}
    const FindTargetListbox1={FindTargetListbox:false}
    return(
      this.props.dispatch(klinebox(klinebox1)),
      this.props.dispatch(changebox(FindTargetListbox1))
    )

  }
  componentWillReceiveProps(next){
        this.getOrderList()
        if (next.findTargetListboxlist1[this.props.findTargetListboxlist.instrumentCode]) {
          this.setState({
            findTargetListboxlist1:next.findTargetListboxlist1
          })
        }else{
          this.setState({
            findTargetListboxlist1:next.findTargetListboxlist
          })
        }
        if (next.buyAndSelllist.resCode==="200") {
          if (this.state.value11===1) {
            this.setState({
              kcc:Math.floor((this.props.userInfo.customerCapital-this.props.userInfo.customerFreezeCapital)/((Number(next.findTargetListboxlist.askPrice1)+0.005)*next.buyAndSelllist.data.contractMultiplier+Number(next.buyAndSelllist.data.openFee)+Number(next.buyAndSelllist.data.closeFee)))
            })
          }else{
            this.setState({
              kcc:Math.floor((this.props.userInfo.customerCapital-this.props.userInfo.customerFreezeCapital)/((Number(this.state.xjjg)+0.005)*next.buyAndSelllist.data.contractMultiplier+Number(next.buyAndSelllist.data.openFee)+Number(next.buyAndSelllist.data.closeFee)))
            })
          }
        }
  }
  render() {
    const buyHy=this.state.findTargetListboxlist1[this.props.findTargetListboxlist.instrumentCode]?this.state.findTargetListboxlist1[this.props.findTargetListboxlist.instrumentCode]:this.props.findTargetListboxlist
    const sellHy=this.state.findTargetListboxlist1[this.props.findTargetListboxlist.instrumentCode]?this.state.findTargetListboxlist1[this.props.findTargetListboxlist.instrumentCode]:this.props.findTargetListboxlist
    buyHy.instrumentName=this.props.findTargetListboxlist.instrumentName
    buyHy.expireDay=this.props.findTargetListboxlist.expireDay
    sellHy.instrumentName=this.props.findTargetListboxlist.instrumentName
    sellHy.expireDay=this.props.findTargetListboxlist.expireDay
    sellHy.instrumentMonth=this.props.findTargetListboxlist.instrumentMonth
    const getContractAnalysis= this.state.getContractAnalysis
    return (
      <div className="FindTargetListbox" style={{height:document.body.clientHeight-60}}>
          {
            this.state.page===1&&
            <div>
              <p className="instrumentName">
            {
              buyHy.instrumentName
            }
            <Icon type="fullscreen" className="ml300" onClick={ 
              ()=>this.ontokline(sellHy.instrumentCode,sellHy.instrumentMonth)
            } />
            <Icon type="close" className="cpont" onClick={
              ()=>this.close()
            }/>
            
          </p>
          <p className="lastPrice">
           {
              buyHy.lastPrice
            }
          </p>
          <p className="changeValue">
           {
             parseFloat(buyHy.lastPrice-buyHy.preClosePrice).toFixed(4)
            }
          </p>
          <p className="changeRate">
            {
             parseFloat((buyHy.lastPrice-buyHy.preClosePrice)/buyHy.preClosePrice*100).toFixed(2)
            }%
          </p>
          <div className="buyHybidPrice">
          <p style={{color:'#ff5256'}}>买价</p>
            <p >
              <span className="bidPrice">
                {
                  buyHy.bidPrice1
                }
              </span>
              <span className="bidVolume">
                {
                  buyHy.bidVolume1
                }
              </span>
            </p>
            <p >
              <span className="bidPrice">
                {
                  buyHy.bidPrice2
                }
              </span>
              <span className="bidVolume">
                {
                  buyHy.bidVolume2
                }
              </span>
            </p>
            <p >
              <span className="bidPrice">
                {
                  buyHy.bidPrice3
                }
              </span>
              <span className="bidVolume">
                {
                  buyHy.bidVolume3
                }
              </span>
            </p>
            <p >
              <span className="bidPrice">
                {
                  buyHy.bidPrice4
                }
              </span>
              <span className="bidVolume">
                {
                  buyHy.bidVolume4
                }
              </span>
            </p>
            <p >
              <span className="bidPrice">
                {
                  buyHy.bidPrice5
                }
              </span>
              <span className="bidVolume">
                {
                  buyHy.bidVolume5
                }
              </span>
            </p>
          </div>
         
          <div className="sellHybidPrice">
              <p style={{color:'#34cc23'}}>卖价</p>
            <p >
              <span className="bidPrice">
                {
                  sellHy.askPrice1
                }
              </span>
              <span className="bidVolume">
                {
                  sellHy.askVolume1
                }
              </span>
            </p>
            <p >
              <span className="bidPrice">
                {
                  sellHy.askPrice2
                }
              </span>
              <span className="bidVolume">
                {
                  sellHy.askVolume2
                }
              </span>
            </p>
            <p >
              <span className="bidPrice">
                {
                  sellHy.askPrice3
                }
              </span>
              <span className="bidVolume">
                {
                  sellHy.askVolume3
                }
              </span>
            </p>
            <p >
              <span className="bidPrice">
                {
                  sellHy.askPrice4
                }
              </span>
              <span className="bidVolume">
                {
                  sellHy.askVolume4
                }
              </span>
            </p>
            <p >
              <span className="bidPrice">
                {
                  sellHy.askPrice5
                }
              </span>
              <span className="bidVolume">
                {
                  sellHy.askVolume5
                }
              </span>
            </p>
          </div>

          <div className="ohlclist">
            <p className="openPrice"> <span className="text">开盘</span> <span>{buyHy.openPrice}</span></p>
            <p className="openPrice"> <span className="text">最高</span> <span>{buyHy.highPrice}</span></p>
            <p className="openPrice"> <span className="text">昨收</span> <span>{buyHy.preClosePrice}</span></p>
            <p className="openPrice"> <span className="text">最低</span> <span>{buyHy.lowPrice}</span></p>
            <p className="openPrice"> <span className="text">涨停</span> <span>{buyHy.upperLimitPrice}</span></p>
            <p className="openPrice"> <span className="text">跌停</span> <span>{buyHy.lowerLimitPrice}</span></p>
            <p className="openPrice"> <span className="text">成交量</span> <span>{(buyHy.volume)}</span></p>
            <p className="openPrice"> <span className="text">持仓量</span> <span>{parseInt(buyHy.openInterest).toFixed(0)}</span></p>
            <p className="openPrice w100"> <span className="text ">到期日期</span> <span>{buyHy.expireDay}</span></p>
          </div>
          {/* <div className="kaiping">
             <p>开平</p>
             <RadioGroup onChange={this.onChange} value={this.state.value}>
                <Radio value={1}>平仓</Radio>
                <Radio value={2}>开仓</Radio>
              </RadioGroup>
          </div> */}
          {
            <div>
              <div className="shijia">
                <p>价格
                  <RadioGroup onChange={this.onChange11} value={this.state.value11} className="jiagechange" style={{marginLeft:"27%"}}>
                    <Radio className="jiageee" value={1}>市价</Radio>
                    <Radio value={2}>限价</Radio>
                  </RadioGroup>
                </p>
                
              </div>
              <div className="weituo">
                <p>委托价格</p>
                <div className="volumebox">
                  <input placeholder={"开仓数量 单位/张"} style={{paddingLeft:'13px'}} readOnly={this.state.value11===1?true:false}  onChange={this.onChangexjjg} value={this.state.xjjg?this.state.xjjg:"市价"}/>
                </div>
              </div>
              <div className="weituo">
                <p>委托数量</p>
                <div className="volumebox">
                  <input placeholder={"开仓数量 单位/张"} style={{paddingLeft:'13px'}} onChange={this.onChange} value={this.state.volume}/>
                  <Icon  type="caret-up" onClick={this.volumeup}/>
                  <Icon type="caret-down" onClick={this.volumedown}/>
                </div>
                <p className="kakaicang">可开仓
                <span className="clnum">
                {
                  (this.props.buyAndSelllist.resCode==="200"&&this.props.buyAndSelllist.resCode==="200")
                  ?
                  this.state.kcc
                  :
                  "0"
                }
                  
                </span> 
                </p>
                
              </div>
              
              <div className="yuguzijin">
                <p>预估资金  &nbsp;
                <Tooltip placement="topLeft" overlayClassName="weinhao" title= {this.state.value11===2?"委托价*10000*委托数量+开仓手续费*委托数量+开仓手续费*委托数量，预估资金为申请下单时的冻结资金，订单成交后，多冻结的资金立即返还。":"（卖一价+0.005）*10000*委托数量+开仓手续费*委托数量+开仓手续费*委托数量，预估资金为申请下单时的冻结资金，订单成交后，多冻结的资金立即返还。"}  arrowPointAtCenter>
                  <Icon type="question-circle"  className="f4f"  style={{marginBottom:10}}/>
                </Tooltip>
                <br/>
                  <span>
                    {this.props.buyAndSelllist.resCode==="200"?
                    this.state.value11===1
                      ?
                      Number(((Number(sellHy.askPrice1)+0.005)*Number(this.props.buyAndSelllist.data.contractMultiplier)+Number(this.props.buyAndSelllist.data.openFee)+Number(this.props.buyAndSelllist.data.closeFee))*this.state.volume).toFixed(2)
                      :
                      Number(((Number(this.state.xjjg))*Number(this.props.buyAndSelllist.data.contractMultiplier)+Number(this.props.buyAndSelllist.data.openFee)+Number(this.props.buyAndSelllist.data.closeFee))*this.state.volume).toFixed(2)
                      :
                      "0"
 
                    }
                </span>
                </p>
              </div>
              <div className="mairu">
              
                {
                  // this.props.buyAndSelllist.resCode==="200"?
                  <div>
            
                    <Button className="ant-btn ant-btn-primary" onClick={  
                      this.props.userInfo.authenticationStatus!==1
                      ?
                      ()=>this.warning()
                      :
                      (
                        !this.props.kfjy
                          ? 
                          ()=>{
                          message.info("当前非交易时间")
                          }
                          :
                          (
                            this.state.volume<=this.state.kcc
                            ?
                            ()=>this.confirm(sellHy.instrumentName,this.state.volume)
                            :
                            ()=>this.showConfirm3()
                          )
                        
                      )
                      
                      }>买入</Button>
                  
                  </div>
                  
                  
                }
                
              </div>
            </div>
          }
            <p className="findtip">
            *为保证即时成交，委托价格以五档市价进行委托，根据市价成交，最终成交价格以交易所成交价为准。投资有风险，入市需谨慎。
            </p>
            </div>
          }
          {
            this.state.page===2&&
            <div className="page3">
            <p className="instrumentName">
              {
                buyHy.instrumentName
              }
              <Icon type="fullscreen" className="ml300" onClick={
                ()=>this.ontokline(sellHy.instrumentCode,sellHy.instrumentMonth)
              } />
              <Icon type="close" className="cpont" onClick={
                ()=>this.close()
              }/>
            </p>
            <div>
              <p>
              <span className="page2span1 tgc">时间</span>
              <span className="page2span1 tgc">价位</span>
              <span className="page2span1 tgc">现手</span>
              </p>
            {
              this.state.getMarketTradeDetail&&
              this.state.getMarketTradeDetail.map((i,j)=>{
                if (j<18&&j>0) {
                  return(
                      <p><span className="page2span1">{ typeof(i.marketTime)!=="number"?i.marketTime.substring(10, 19):moment(i.marketTime).format('HH:mm:ss')}</span> <span className="page2span1">{i.lastPrice}</span> <span className="page2span1">{this.state.getMarketTradeDetail[j-1].volume-Number(i.volume)||0}</span></p> 
                  )
                }else{
                  return false
                }
                
              })
            }
            </div>


          </div>
          }
          {
            this.state.page===3&&
            <div className="page3">
            <p className="instrumentName">
              {
                buyHy.instrumentName
              }
              <Icon type="fullscreen" className="ml300" onClick={
                ()=>this.ontokline(sellHy.instrumentCode,sellHy.instrumentMonth)
              } />
              <Icon type="close" className="cpont" onClick={
                ()=>this.close()
              }/>
              
            </p>
            <p> <span className="page2span1">交易代码</span>  <span className="page2span">{getContractAnalysis.tradeCode}</span></p> 
            <p><span className="page2span1">理论价值</span> <span className="page2span">{getContractAnalysis.theoryPrice}</span></p> 
            <p><span className="page2span1">价值状态</span> <span className="page2span">{getContractAnalysis.priceStatus}</span></p> 
            {/* <p>内在价值<span className="page2span">{getContractAnalysis.tradeCode}</span></p> 
            <p>时间价值<span className="page2span">{getContractAnalysis.tradeCode}</span></p>  */}
            <p><span className="page2span1">成交量</span> <span className="page2span">{getContractAnalysis.volume}</span></p> 
            <p><span className="page2span1">Delta</span> <span className="page2span">{getContractAnalysis.delta}</span></p> 
            <p><span className="page2span1">Gamma</span> <span className="page2span">{getContractAnalysis.gamma}</span></p> 
            <p><span className="page2span1">Theta</span> <span className="page2span">{getContractAnalysis.theta}</span></p> 
            <p><span className="page2span1">Vega</span> <span className="page2span">{getContractAnalysis.vega}</span></p> 
            <p><span className="page2span1">隐含波动率</span> <span className="page2span">{getContractAnalysis.wavePrice}</span></p> 
            <p><span className="page2span1">最高价</span> <span className="page2span">{getContractAnalysis.highPrice}</span></p> 
            <p><span className="page2span1">最低价</span> <span className="page2span">{getContractAnalysis.lowPrice}</span></p> 

          </div>
          }
          <div className="sanfenbox">
            <div className={this.state.page===1?"sanfen page":"sanfen"}  name="1" onClick={()=>this.pagechange(1)}>交易 </div>
            <div className={this.state.page===2?"sanfen borlr page":"sanfen borlr"} name="2" onClick={()=>this.pagechange(2)}>明细</div>
            <div className={this.state.page===3?"sanfen page":"sanfen"} name="3" onClick={()=>this.pagechange(3)}>详情</div>
          </div>
      </div>
    )
  }
}
const mapStateToProps = (store) => (
  {
      userInfo: store.userInfo
  }
)
const mapDispatchToProps = (dispatch) => (
  {
      fetchUserInfo: (data) => {
          dispatch(fetchUserInfo(data))
      }
  } 
)
export default withRouter(connect(mapStateToProps)(FindTargetListbox))