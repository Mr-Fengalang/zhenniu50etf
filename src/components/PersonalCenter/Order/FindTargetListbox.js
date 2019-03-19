import React, { Component } from 'react'
import { Radio,Input,Button, message,Icon,Modal} from 'antd';
import {connect} from 'react-redux'
// import { dispatch } from 'rxjs/internal/observable/range';
import {KLINE_BOX} from '../../../stores/userInfo/actionTypes'
import { tradeApi, } from '../../../request'
import { getNumber, newGuid } from '../../../toolFn'
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
        volume: this.props.findTargetListboxlist.sumEffectiveHoldVolume,
        ygzj:'0',
        value11:1,
        orderPriceType:0,
        xjjg:''
        
    }
    this.idempotency = newGuid()

}
onChange = (e) => {
  let { value } = e.target;
  if(value<0){
    value=0
  }
  
  const reg = /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/;
  if ((!Number.isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      this.setState({
        volume:value,
      })
  }
}
    getyuguzijin=()=>{
      const yuguzijin =(Number(this.props.findTargetListboxlist.buyHy.askPrice1)+0.01)*this.props.buyAndSelllist.data.contractMultiplier+Number(this.props.buyAndSelllist.data.openFee)+Number(this.props.buyAndSelllist.data.closeFee)
      return yuguzijin
    }
    reportOrder = () => {
      const { volume ,orderPriceType} = this.state
      if (volume==0) {
        message.info('平仓数量不能为0', 1.5)       
        return 
      }
      if (!volume) {
        message.info('请输入平仓数量', 1.5)       
        return 
      }
      const contraceCode =this.props.findTargetListboxlist.instrumentCode
      const orderRef =this.props.findTargetListboxlist.orderRef
      const lastPrice = this.state.value11===1?this.props.findTargetListboxlist.lastPrice:this.state.xjjg 
      const instrumentName =this.props.findTargetListboxlist.instrumentName
      tradeApi
      .reportOrder(
          {
            openOrderRef: orderRef, contraceCode, volume, limitPrice: lastPrice, direction: 1, offsetFlag: 1, idempotency: this.idempotency,orderPriceType
          }
      )
      .then(
          (res) => {
              if(res.resCode === '200') {
                  this.idempotency = newGuid()
                  this.confirm1(instrumentName,volume,lastPrice)
                  this.props.changepage2()
                  // this.props.changepage()
                  this.setState({showModal: false})
              }
          }
      )
    }

    cancelOrder = () => {
      const contraceCode =this.props.findTargetListboxlist.instrumentCode
      const orderRef =this.props.findTargetListboxlist.orderRef
      const lastPrice = this.state.value11===1?this.props.findTargetListboxlist.lastPrice:this.state.xjjg 
      const instrumentName =this.props.findTargetListboxlist.instrumentName
      tradeApi
      .cancelOrder(
          { 
            openOrderRef: orderRef, contraceCode:contraceCode, idempotency: this.idempotency
          }
      )
      .then(
          (res) => {
            if (res.resCode === '200') {
              message.info("撤单申请已提交", 1.5)       
            }
          }
      )
    }



    componentWillUnmount(){
      const klinebox1={klinebox:false}

    return(
      this.props.dispatch(klinebox(klinebox1))
      )
    }

    volumeup=()=>{
      this.setState(()=>({
        volume:Number(this.state.volume)+1
      }))
    }
    volumedown=()=>{
      this.setState(()=>({
        volume:Number(this.state.volume)>1?Number(this.state.volume)-1:0
      }))
    }
  ontokline=(instrumentCode,instrumentMonth)=>{
    this.props.tokline(instrumentCode,instrumentMonth)
    const klinebox1={klinebox:true}
    return(
      this.props.dispatch(klinebox(klinebox1))
    )
  }
  confirm=(instrumentName,volume)=>{
    if (this.state.volume==0) {
      message.info('平仓数量不能为0', 1.5)       
      return 
    }
    if (!this.state.volume) {
      message.info('请输入平仓数量', 1.5)       
      return 
    }
    Modal.confirm({
      className:"reportOrder",
      title: '平仓委托确认',
      content: <div>
        <p>合约名称：{instrumentName}</p>
        <p>买卖类型：卖平</p>
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
  close=()=>{
    const klinebox1={klinebox:false}
    const FindTargetListbox1={FindTargetListbox:false}
    return(
      this.props.dispatch(klinebox(klinebox1)),
      this.props.dispatch(changebox(FindTargetListbox1))
    )

  }
  confirm1=(instrumentName,volume,askPrice1)=>{

    Modal.confirm({
      className:"reportOrder",

      title: '平仓委托成功',
      content:
      <div>
        <p>合约名称：{instrumentName}</p>
        <p>买卖类型：卖平</p>
        <p>委托数量：{volume}</p>
        <p>委托价格：{askPrice1}</p>
      </div>,
      okText: '查看',
      cancelText: '知道了',
      onOk:()=> {
        this.props.changepage1()
      },
      onCancel:()=>{
        this.props.changepage2()

      },
    });
  }
  onChange11 = (e) => {
    this.setState({
      value11: e.target.value,
      orderPriceType:e.target.value===1?0:1,
    });
    if (e.target.value===1) {
      this.setState({
        xjjg:''
      })
    }else{
      this.setState({
        xjjg:this.props.findTargetListboxlist.askPrice1
      });
    }
  }
  onChangexjjg=(e)=>{
      this.setState({
        xjjg:e.target.value
      })
  }
  confirm2=()=>{
    Modal.confirm({
      className:"reportOrder",
      title: '发起撤单确定',
      content:
      <div>
        <p className="ifweituo">是否确定发出该笔剩余未成交全部订单</p>
      </div>,
      okText: '确定',
      cancelText: '取消',
      onOk:()=> {
        this.cancelOrder()
      },
     
    });
  }
  render() {
    const bd =this.props.findTargetListboxlistbd[this.props.findContract.data.instrumentCode]?this.props.findTargetListboxlistbd[this.props.findContract.data.instrumentCode]:this.props.findContract.data
    const buyHy=this.props.findContract.data
    const sellHy=this.props.findTargetListboxlist
    return (
      <div className="FindTargetListbox" style={{height:document.body.clientHeight-60}}>
          <p className="instrumentName">
            {buyHy.instrumentName}
            <Icon type="fullscreen" className="ml300" onClick={
              ()=>this.ontokline(sellHy.instrumentCode,sellHy.instrumentMonth)
            } />
            <Icon type="close" className="cpont" onClick={
              ()=>this.close()
            }/>
          </p>
          <p className="lastPrice">
           {
              bd.lastPrice||buyHy.lastPrice
            }
          </p>
          <p className="changeValue">
           {
             parseFloat(bd.lastPrice-bd.preClosePrice).toFixed(4)
            }
          </p>
          <p className="changeRate">
            {
             parseFloat((bd.lastPrice-bd.preClosePrice)/bd.preClosePrice*100).toFixed(2)
            }%
          </p>
          <div className="buyHybidPrice">
          <p style={{color:'#ff5256'}}>买价</p>

            <p >
              <span className="bidPrice">
                {
                  bd.bidPrice1
                }
              </span>
              <span className="bidVolume">
                {
                  bd.bidVolume1
                }
              </span>
            </p>
            <p >
              <span className="bidPrice">
                {
                  bd.bidPrice2
                }
              </span>
              <span className="bidVolume">
                {
                  bd.bidVolume2
                }
              </span>
            </p>
            <p >
              <span className="bidPrice">
                {
                  bd.bidPrice3
                }
              </span>
              <span className="bidVolume">
                {
                  bd.bidVolume3
                }
              </span>
            </p>
            <p >
              <span className="bidPrice">
                {
                  bd.bidPrice4
                }
              </span>
              <span className="bidVolume">
                {
                  bd.bidVolume4
                }
              </span>
            </p>
            <p >
              <span className="bidPrice">
                {
                  bd.bidPrice5
                }
              </span>
              <span className="bidVolume">
                {
                  bd.bidVolume5
                }
              </span>
            </p>
          </div>
         
          <div className="sellHybidPrice">
          <p style={{color:'#34cc23'}}>卖价</p>
            <p >
              <span className="bidPrice">
                {
                  bd.askPrice1
                }
              </span>
              <span className="bidVolume">
                {
                  bd.askVolume1
                }
              </span>
            </p>
            <p >
              <span className="bidPrice">
                {
                  bd.askPrice2
                }
              </span>
              <span className="bidVolume">
                {
                  bd.askVolume2
                }
              </span>
            </p>
            <p >
              <span className="bidPrice">
                {
                  bd.askPrice3
                }
              </span>
              <span className="bidVolume">
                {
                  bd.askVolume3
                }
              </span>
            </p>
            <p >
              <span className="bidPrice">
                {
                  bd.askPrice4
                }
              </span>
              <span className="bidVolume">
                {
                  bd.askVolume4
                }
              </span>
            </p>
            <p >
              <span className="bidPrice">
                {
                  bd.askPrice5
                }
              </span>
              <span className="bidVolume">
                {
                  bd.askVolume5
                }
              </span>
            </p>
          </div>

          <div className="ohlclist">
            <p className="openPrice"> <span className="text">开盘</span> <span>{bd.openPrice}</span></p>
            <p className="openPrice"> <span className="text">最高</span> <span>{bd.highPrice}</span></p>
            <p className="openPrice"> <span className="text">昨收</span> <span>{bd.preClosePrice}</span></p>
            <p className="openPrice"> <span className="text">最低</span> <span>{bd.lowPrice}</span></p>
            <p className="openPrice"> <span className="text">涨停</span> <span>{bd.upperLimitPrice}</span></p>
            <p className="openPrice"> <span className="text">跌停</span> <span>{bd.lowerLimitPrice}</span></p>
            <p className="openPrice"> <span className="text">成交量</span> <span>{(bd.volume)}</span></p>
            <p className="openPrice"> <span className="text">持仓量</span> <span>{parseInt(bd.openInterest).toFixed(0)}</span></p>
            <p className="openPrice w100"> <span className="text ">到期日期</span> <span>{buyHy.expireDay}</span></p>
          </div>

          {
            this.props.page ==="2"&&
            <div>
              <div className="shijia">
                <p>价格 
                <RadioGroup onChange={this.onChange11} value={this.state.value11} className="jiagechange" style={{marginLeft:"27%"}}>
                    <Radio className="jiageee" value={1}>市价</Radio>
                    <Radio value={2}>限价</Radio>
                  </RadioGroup></p>
                
              </div>
              <div className="weituo">
                <p>平仓价格</p>
                <div className="volumebox">
                  <input placeholder={"平仓价格"} style={{paddingLeft:'13px'}} readOnly={this.state.value11===1?true:false}  onChange={this.onChangexjjg} value={this.state.xjjg?this.state.xjjg:sellHy.askPrice1}/>
                </div>
              </div>
              <div className="weituo">
              <p>平仓数量</p>
              <div className="volumebox">
                  <input placeholder={"开仓数量 单位/张"} style={{paddingLeft:'13px'}} onChange={this.onChange} value={this.state.volume}/>
                  <Icon  type="caret-up" onClick={this.volumeup}/>
                  <Icon type="caret-down" onClick={this.volumedown}/>
                </div>
                <p>可平仓<span className="clnum">
                  {
                    sellHy.sumEffectiveHoldVolume
                  }
                </span></p>
              </div>
              <div className="mairu">
                <Button type="primary" onClick={()=>this.confirm(sellHy.instrumentName,this.state.volume)}>平仓</Button> 
              </div>
            </div>
          }
          {
            this.props.page ==="1"&&
            this.props.findTargetListboxlist.orderStatus.split("|")[this.props.findTargetListboxlist.orderStatus.split("|").length-2]==="1"&&
              <div className="mairu">
                <Button type="primary" onClick={this.confirm2}>撤单</Button> 
              </div>
          }
          {
            this.props.page ==="1"&&
            this.props.findTargetListboxlist.orderStatus.split("|")[this.props.findTargetListboxlist.orderStatus.split("|").length-2]==="3"&&
              <div className="mairu">
                <Button type="primary" onClick={this.confirm2}>撤单</Button> 
              </div>
          }
          <p className="findtip">
          *为保证即时成交，委托价格以五档市价进行委托，根据市价成交，最终成交价格以交易所成交价为准。投资有风险，入市需谨慎。
          </p>
      </div>
    )
  }
}
const mapStateToProps = (store) => (
  {
      userInfo: store.userInfo
  }
)
export default connect(mapStateToProps)(FindTargetListbox)