import React, { Component } from 'react'
import { tradeApi } from "../../../request"
import { Table } from 'antd';
import { connect } from 'react-redux'

import { getDealStatus, getStatus, getDate } from '../../../toolFn'
const changebox = (data) => (
  {
      type: 'CHANGE_BOX',
      data
  }
)
const mapStateToProps = (store) => (
  {
      userInfo: store.userInfo
  }
)
const formatTradingDate = (date) => {
  // yyyy-MM-dd HH:mm:ss
  return  (new Date(date)).getFullYear()
          +
          '-'
          +
          ( ((new Date(date)).getMonth() + 1) > 9 ? ((new Date(date)).getMonth() + 1) : ( '0' + ((new Date(date)).getMonth() + 1) ))
          +
          '-'
          +
          ( ((new Date(date)).getDate()) > 9 ? ((new Date(date)).getDate()) : ( '0' + ((new Date(date)).getDate()) ))
          +
          ' '
          +
          ( ((new Date(date)).getHours()) > 9 ? ((new Date(date)).getHours()) : ( '0' + ((new Date(date)).getHours()) ) )
          +
          ':'
          +
          ( ((new Date(date)).getMinutes()) > 9 ? ((new Date(date)).getMinutes()) : ( '0' + ((new Date(date)).getMinutes()) ) )
          +
          ':'
          + 
          ( ((new Date(date)).getSeconds()) > 9 ? ((new Date(date)).getSeconds()) : ( '0' + ((new Date(date)).getSeconds()) ) )
}


const columns = [{
  title: '买入',
  dataIndex: 'instrumentName',
  render:(text, row, index)=> {
    return row.instrumentName
  }
}, 
{
  title: '卖价',
  dataIndex: 'askPrice',
  render:(text, row, index)=> {
    return getStatus(row.orderStatus, row.tradeVolume)
  }
}, 
{
  title: '最新',
  dataIndex: 'closeProfitLoss',
  render:(text, row, index)=> {
    return row.closeProfitLoss
  }
},{
  title: '成交量',
  dataIndex: 'volume',
  render:(text, row, index)=> {
    return row.volume
  }
},{
  title: '开仓量',
  dataIndex: 'openPrice',
  render:(text, row, index)=> {
    return row.openPrice
  }
}, 
{
  title: '平仓价',
  dataIndex: 'closePrice',
  render:(text, row, index)=> {
    return row.closePrice
  }
}, 
{
  title: '开仓权利金',
  dataIndex: 'openPremium',
  render:(text, row, index)=> {
    return row.openPremium
  }
}, 
{
  title: '开仓手续费',
  dataIndex: 'openFee',
  render:(text, row, index)=> {
    return row.openFee
  }
}, 
{
  title: '平仓权利金',
  dataIndex: 'closePremium',
  render:(text, row, index)=> {
    return row.closePremium
  }
}, 
{
  title: '平仓手续费',
  dataIndex: 'closeFee',
  render:(text, row, index)=> {
    return row.closeFee
  }
}, 
{
  title: '合约代码',
  dataIndex: 'instrumentCode',
  render:(text, row, index)=> {
    return row.instrumentCode
  }
}, 
{
  title: '成交编号',
  dataIndex: 'tradeId',
  render:(text, row, index)=> {
    return row.tradeId
  }
},
{
  title: '开仓日期',
  dataIndex: 'openTradeTime',
  render:(text, row, index)=> {
    return getDate(row.openTradeTime)
  }
}];
class Message extends Component {
  constructor(props) {
    super(props)

    this.state = {
        minDate: new Date('2018/11/01'),
        beginCreateTime: new Date( new Date().getTime() - 86400000 * 7 ),
        endCreateTime: new Date(),
        pageNum: 1,
        dataSource:[],
        refreshing: false,
        listData: [],
        loadMore: false,
        hasMore: true,
    }
  }  
  componentDidMount() {
    this.handleRefresh()
    const FindTargetListbox1={FindTargetListbox:false}
      return(
        this.props.dispatch(changebox(FindTargetListbox1))
      )
}

handleRefresh = () => {
    const { beginCreateTime, endCreateTime } = this.state
    this.setState({pageNum: 1})
    this.getTradingRecord(formatTradingDate(beginCreateTime), formatTradingDate(endCreateTime), 1)
}

getTradingRecord = (beginCreateTime, endCreateTime, pageNum ) => {
    const { listData, hasMore, loadMore } = this.state
    if(loadMore) {
            return
    }
    if( pageNum !== 1 && !hasMore) {
        return
    }

    this.setState({loadMore: true, refreshing: true})
    tradeApi
    .getOrderList(
        {
            beginCreateTime,
            endCreateTime,
            reqsOrderType: 3,
            pageNum
        }
    )
    .then(
        (res) => {
            if(res.resCode === '200') {
                this.setState({
                  dataSource:res.data
                })
            }
        }
    )
}
  render() {
    return (
      <div className="">
      <div className="infotitle">
        <p>消息列表</p>
      </div>
      <div>
      <Table
        columns={columns}
        rowKey={record => record.closeId}
        dataSource={this.state.dataSource}
      />
      </div>
    </div>
    )
  }
}
export default connect(mapStateToProps)(Message)