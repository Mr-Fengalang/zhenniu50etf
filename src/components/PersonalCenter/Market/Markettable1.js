import React, { Component } from 'react'
import { marketApi } from "../../../request"
import {
    Table
  } from 'antd';
import {connect} from 'react-redux'
import { tradeApi, } from '../../../request'
import { sendWebsocket } from '../../../stores/wsServer'
import { newGuid, unZip, getCookie } from '../../../toolFn'
import {CHANGE_BOX} from '../../../stores/userInfo/actionTypes'
import Item from 'antd/lib/list/Item';
const changebox = (data) => (
  {
      type: CHANGE_BOX,
      data
  }
)
  
const klinebox = (data) => (
  {
      type: 'KLINE_BOX',
      data
  }
)
  
  
  
  
class Markettable1 extends Component {
    
    constructor(props){
        super(props)
        this.state={
          target:'',
          hyDate:'',
          etfMdInfo:'',
          findTargetListdata:[],
          FindTargetListbox:false,
          changeRate:'',
          changeValue:'',
          findTargetListboxlist:'',
          buyAndSelllist:'',
          targetCode:'',
          rowId:''
        }
    }
    componentDidMount() {
      this.startWebsocket()
      this.props.tradingGoodsCode&&this.props.instrumentMonth&&this.props.contractMonth&&
        this.searchHy(this.props.tradingGoodsCode,this.props.instrumentMonth)
        // this.selectHy1(this.props.contractMonth)
    }
    componentWillReceiveProps(nextProps){

        if (nextProps.tradingGoodsCode!==this.props.tradingGoodsCode||nextProps.instrumentMonth!==this.props.instrumentMonth) {
          this.searchHy(nextProps.tradingGoodsCode,nextProps.instrumentMonth)
        }
    }
    buyAndSell = (contraceCode) => {
      const targetCode = this.props.tradingGoodsCode
      const contractMonthName = this.props.instrumentMonth
      tradeApi
      .buyAndSell({targetCode, contraceCode, contractMonthName})
      .then(
          (res) => {
            this.props.greet1(res)
            this.setState({
              buyAndSelllist:res
            })
          }
      )
    }
    startWebsocket = () => {
          const ws = new WebSocket(global.constants.webSocket)
          const uuid = newGuid()
          var tOfferData = {}
          ws.onopen = (evt) => {
                  const websocketJson = {
                      instrumentMonth: this.props.contractMonth,
                  }
                  websocketJson.uuid = this.props.uuid
                  if(this.props.customerId) {
                      websocketJson.customerId = this.props.customerId
                  }
                ws.send(JSON.stringify(websocketJson))
          }
          ws.onmessage = (evt) => {
              unZip(evt)
              .then(
                  (res) => {
                      if(res.pushType === 1) {
                          tOfferData[res.data.instrumentCode]=res.data
                      }
                  }
              )
          }
          setInterval(()=>{
          var newState =JSON.parse(JSON.stringify(this.state.findTargetListdata));
            newState.map((j,i)=>{
              j.buyHy.active = false
              j.sellHy.active = false
                if (tOfferData[j.buyHy.instrumentCode]) {
                  Object.keys(j.buyHy).map(k=>{
                    if (tOfferData[j.buyHy.instrumentCode][k]) {
                      if (
                        newState[i].buyHy.openInterest !== tOfferData[j.buyHy.instrumentCode][k].openInterest||
                        newState[i].buyHy.volume !== tOfferData[j.buyHy.instrumentCode][k].volume||
                        newState[i].buyHy.bidPrice1 !== tOfferData[j.buyHy.instrumentCode][k].bidPrice1||
                        newState[i].buyHy.askPrice1 !== tOfferData[j.buyHy.instrumentCode][k].askPrice1||
                        newState[i].buyHy.openPrice !== tOfferData[j.buyHy.instrumentCode][k].openPrice
                        
                        ) {
                      newState[i].buyHy.active = true
                        
                      }
                      newState[i].buyHy[k]=tOfferData[j.buyHy.instrumentCode][k]
                    }
                  })               
                }
                if (tOfferData[j.sellHy.instrumentCode]) {
                  Object.keys(j.sellHy).map(k=>{
                    if (tOfferData[j.sellHy.instrumentCode][k]) {
                      if (
                        newState[i].sellHy.openInterest !== tOfferData[j.sellHy.instrumentCode][k].openInterest||
                        newState[i].sellHy.volume !== tOfferData[j.sellHy.instrumentCode][k].volume||
                        newState[i].sellHy.bidPrice1 !== tOfferData[j.sellHy.instrumentCode][k].bidPrice1||
                        newState[i].sellHy.askPrice1 !== tOfferData[j.sellHy.instrumentCode][k].askPrice1||
                        newState[i].sellHy.openPrice !== tOfferData[j.sellHy.instrumentCode][k].openPrice
                        ) {
                      newState[i].sellHy.active = true
                        
                      }
                      newState[i].sellHy[k]=tOfferData[j.sellHy.instrumentCode][k]
                    }
                  })               
                }
              })
              this.setState({
                findTargetListdata:newState
              },()=>{
                this.props.greet5(tOfferData)
                tOfferData={}
              })
             
          },1000)
      }
    findContract = (instrumentCode) => {
      const tradingGoodsCode = this.props.tradingGoodsCode
      const instrumentMonth = this.props.instrumentMonth
      marketApi
      .findContract({instrumentCode, tradingGoodsCode, instrumentMonth})
      .then(
          (res) => {
            this.props.greet2(res)
          }
      )
    }
    searchHy = (tradingGoodsCode, instrumentMonth) => {
        marketApi
        .findTargetList(
            {
                tradingGoodsCode,
                instrumentMonth
            }
        )
        .then(
            (res) => {
                if(res.resCode === '200') {
                    this.setState(
                        {
                            buyHy: res.data.buyHy,
                            exec: res.data.exec,
                            sellHy: res.data.sellHy
                        }
                    )
                }
                var a = []
               
                res.data.buyHy.map((i, index)=>{
                    a.push({
                      buyHy:res.data.buyHy[index],
                      exec:res.data.exec[index],
                      sellHy:res.data.sellHy[index],
          
                    })
                })
                this.setState({
                  findTargetListdata:a
                })

                this.setState({load: false})
            }
        )
    }
    setRowClassName = (record) => {
      if ( record.buyHy.active && record.buyHy.instrumentCode === this.state.rowId) {
        return "active clickRowStyl"
      }else if (!record.buyHy.active && record.buyHy.instrumentCode === this.state.rowId) {
        return "clickRowStyl"
      }else if (record.buyHy.active && record.buyHy.instrumentCode !== this.state.rowId) {
        return "active"
      }else{
        return " "
      }
      // return record.buyHy.instrumentCode === this.state.rowId ? 'clickRowStyl' : '';
    }
    setRowClassName1 = (record) => {
      // return record.sellHy.instrumentCode === this.state.rowId ? 'clickRowStyl' : '';
      if ( record.sellHy.active && record.sellHy.instrumentCode === this.state.rowId) {
        return "active clickRowStyl"
      }else if (!record.sellHy.active && record.sellHy.instrumentCode === this.state.rowId) {
        return "clickRowStyl"
      }else if (record.sellHy.active && record.sellHy.instrumentCode !== this.state.rowId) {
        return "active"
      }else{
        return " "
      }
    }
    ontokline=(instrumentCode,instrumentMonth)=>{
      this.props.tokline(instrumentCode,instrumentMonth)
      const klinebox1={klinebox:true}
      return(
        this.props.dispatch(klinebox(klinebox1))
      )
    }
  render() {

    const columns = [
      {
        title: '持仓量',
        dataIndex: 'buyHyopenInterest',
        render:(text, row, index)=> {
          return (
          <span onClick={() => this.props.greet(row.buyHy)}>
              {Number(row.buyHy.openInterest).toFixed(0)}
          </span> 
          )
        }
      }, 
      {
        title: '成交量',
        dataIndex: 'buyHyvolume',
        render:(text, row, index)=> {
          return (
            <span onClick={() => this.props.greet(row.buyHy)}>
                {row.buyHy.volume}
            </span> 
            )
        }
      }, {
      title: '买价',
      dataIndex: 'buyHybidPrice',
      render:(text, row, index)=> {
        return (
        <span onClick={() => this.props.greet(row.buyHy)}>
            {row.buyHy.bidPrice1}
        </span> 
        )
      }
    }, 
    {
      title: '卖价',
      dataIndex: 'askPrice',
      render:(text, row, index)=> {
        return (
          <span onClick={() => this.props.greet(row.buyHy)}>
              {row.buyHy.askPrice1}
          </span> 
          )
      }
    }, 
    {
      title: '涨跌值',
      dataIndex: 'changeValue',
      render:(text, row, index)=> {
        return (
          <span onClick={() => this.props.greet(row.buyHy)}>
              {(row.buyHy.openPrice-row.buyHy.preClosePrice).toFixed(4)}
          </span> 
        )
      }
    }, {
      title: '涨跌幅',
      dataIndex: 'sellHychangeRate',
      render:(text, row, index)=> {
        return (
          <span onClick={() => this.props.greet(row.buyHy)} className={((row.buyHy.openPrice-row.buyHy.preClosePrice)/row.buyHy.preClosePrice)>0?"zhang":"die"}>
              {((row.buyHy.openPrice-row.buyHy.preClosePrice)/row.buyHy.preClosePrice).toFixed(2)}%
          </span> 
        )
      }
    },
    {
      title: '最新',
      dataIndex: 'price',
      render:(text, row, index)=> {
        return (
          <span onClick={() => this.props.greet(row.buyHy)} className={((row.buyHy.openPrice-row.buyHy.preClosePrice)/row.buyHy.preClosePrice)>0?"zhang":"die"}>
              {row.buyHy.openPrice}
          </span> 
          )
      }
    }];
    const columns2 = [
      {
        title: '行权价',
        dataIndex: 'execstrikePrice',
        render:(text, row, index)=> {
          return (
              <span className="notclicn">
                {row.exec.strikePrice}
              </span>
            ) 
        }
      },
  ];
    const columns1 = [
 
    {
      title: '最新',
      dataIndex: 'sellHyprice',
      render:(text, row, index)=> {
        return(
          <span onClick={() => this.props.greet(row.sellHy)} className={((row.sellHy.openPrice-row.sellHy.preClosePrice)/row.sellHy.preClosePrice)>0?"zhang":"die"}>
              {row.sellHy.openPrice}
          </span> 
          )  
      }
    },     {
      title: '涨跌幅',
      dataIndex: 'sellHychangeRate',
      render:(text, row, index)=> {
        return (
          <span onClick={() => this.props.greet(row.sellHy)}  className={((row.sellHy.openPrice-row.sellHy.preClosePrice)/row.sellHy.preClosePrice)>0?"zhang":"die"}>
              {((row.sellHy.openPrice-row.sellHy.preClosePrice)/row.sellHy.preClosePrice).toFixed(2)}%
          </span> 
        )
      }
    },  {
      title: '涨跌值',
      dataIndex: 'sellHychangeValue',
      render:(text, row, index)=> {
        return (
          <span onClick={() => this.props.greet(row.sellHy)}>
              {(row.sellHy.openPrice-row.sellHy.preClosePrice).toFixed(4)}
          </span> 
        )
      }
    },    {
      title: '卖价',
      dataIndex: 'sellHyaskPrice',
      render:(text, row, index)=> {
        return (
          <span onClick={() => this.props.greet(row.sellHy)}>
              {row.sellHy.askPrice1}
          </span> 
          ) 
      }
    },{
      title: '买价',
      dataIndex: 'sellHybidPrice',
      render:(text, row, index)=> {
        return (
          <span onClick={() => this.props.greet(row.sellHy)}>
              {row.sellHy.bidPrice1}
          </span> 
          )  
      }
    } ,{
      title: '成交量',
      dataIndex: 'volume',
      render:(text, row, index)=> {
        return (
          <span onClick={() => this.props.greet(row.sellHy)}>
              {row.sellHy.volume}
          </span> 
          )
      }
    } ,{
      title: '持仓量',
      dataIndex: 'openInterest',
      render:(text, row, index)=> {
        return (
        <span onClick={() => this.props.greet(row.sellHy)}>
            {Number(row.sellHy.openInterest).toFixed(0)}
        </span> 
        )
      }
    }, ]
    return (
      <div className="Markettable markettablebox" style={{height:document.body.clientHeight-243,display:'none'}}>
            <Table 
            className="rengou"
                pagination={false}
                columns={columns} 
                dataSource={this.state.findTargetListdata} 
                rowKey={record => record.exec.strikePrice  } 
                rowClassName={this.setRowClassName}
                onRow={(record) => {
                    return {
                      onClick: () => {
                        this.buyAndSell(record.buyHy.instrumentCode)
                        this.findContract(record.buyHy.instrumentCode)
                        this.setState({
                          rowId: record.buyHy.instrumentCode,
                        })
                        
                      },   
                          // 点击行
                      // onDoubleClick:()=>{
                      //   this.ontokline(record.buyHy.instrumentCode,record.buyHy.instrumentMonth)
                      // }
                    };
                  }}
            />
            <Table
                className="exec" 
                pagination={false}
                columns={columns2} 
                dataSource={this.state.findTargetListdata} 
                rowKey={record => record.exec.strikePrice  } 
            />
            <Table
            className="rengu"
                pagination={false}
                columns={columns1} 
                dataSource={this.state.findTargetListdata} 
                rowKey={record => record.exec.strikePrice  } 
                rowClassName={this.setRowClassName1}
                
                onRow={(record) => {
                    return {
                      onClick: () => {
                        this.buyAndSell(record.sellHy.instrumentCode)
                        this.findContract(record.sellHy.instrumentCode)
                        this.setState({
                          rowId: record.sellHy.instrumentCode,
                        })
                      },     
                      
                      // onDoubleClick:()=>{
                      //   this.ontokline(record.sellHy.instrumentCode,record.sellHy.instrumentMonth)
                      // }
                    };
                  }}
            />
      </div>
    )
  }
}
const mapStateToProps = (store) => (
  {
      userInfo: store.userInfo,
      ws: store.wsInfo.ws,
      uuid: store.wsInfo.uuid,
      customerId: store.userInfo.customerId,
      // wsInfo:store.wsInfo
  }
)



// const mapDispatchToProps = (dispatch) => (
//   {
//       sendWebsocket: (ws, data) => dispatch(sendWebsocket(ws, data))
//   }
// )
export default connect(mapStateToProps,null)(Markettable1)