import React, { Component } from 'react'
import { marketApi } from "../../../request"
import {
    Table
  } from 'antd';
import {connect} from 'react-redux'
import { tradeApi, } from '../../../request'
import moment from "moment";
import { getDealStatus, getStatus, getUpDown } from '../../../toolFn'

import {CHANGE_BOX} from '../../../stores/userInfo/actionTypes'
const changebox = (data) => (
  {
      type: CHANGE_BOX,
      data
  }
)
  const columns = [{
    title: '合约名称',
    dataIndex: 'instrumentName',
    render:(text, row, index)=> {
      return row.instrumentName
    }
  }, 
  {
    title: '价格',
    dataIndex: 'limitPrice',
    render:(text, row, index)=> {
      if (row.orderPriceType===1) {
        return row.limitPrice
      }else{
        return "市价"
      }
    }
  },
  {
    title: '开平',
    dataIndex: 'direction',
    render:(text, row, index)=> {
      return getDealStatus(row.direction,row.offsetFlag)
    }
  }, {
    title: '平仓盈亏',
    dataIndex: 'reportTime',
    render:(text, row, index)=> {
      return row.closeProfitLoss
    }
  }, {
    title: '成交量',
    dataIndex: 'volume',
    render:(text, row, index)=> {
      return row.volume
    }
  }, {
    title: '开仓价',
    dataIndex: 'openPrice',
    render:(text, row, index)=> {
      return row.openPrice
    }
  }, {
    title: '平仓价',
    dataIndex: 'closePrice',
    render:(text, row, index)=> {
      return row.closePrice
    }
  }, {
    title: '开仓权利金',
    dataIndex: 'kcqlj',
    render:(text, row, index)=> {
      return (row.openPrice * row.volume * 10000).toFixed(2)
    }
  }
  , {
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
    dataIndex: 'orderRef',
    render:(text, row, index)=> {
      return row.orderRef
    }
  }, 
  {
    title: '开仓日期',
    dataIndex: 'createTime',
    render:(text, row, index)=> {
      return moment(row.openTradeTime).format('YYYY-MM-DD HH:mm:ss')
    }
  }, 
  {
    title: '平仓日期',
    dataIndex: 'tradeTime',
    render:(text, row, index)=> {
      return moment(row.tradeTime).format('YYYY-MM-DD HH:mm:ss')
    }
  }, 
  
];
  
  
  
  
class Markettable extends Component {
    
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
      const FindTargetListbox1={FindTargetListbox:false}
      return(
        this.props.dispatch(changebox(FindTargetListbox1))
      )
    }
    componentWillReceiveProps(nextProps){
        // this.searchHy(nextProps.tradingGoodsCode,nextProps.instrumentMonth)
    }
    // componentWillUnmount(){
    //   const FindTargetListbox1={FindTargetListbox:false}
    //   return(
    //     this.props.dispatch(changebox(FindTargetListbox1))
    //   )
    // }

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
    setRowClassName = (record) => {
      return record.orderRef === this.state.rowId ? 'clickRowStyl' : '';
    }
       //查找合约
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
  render() {
    // console.log(this.props)
    return (
      <div>

          <Table 
                // scroll={{ y:document.body.clientHeight -300 }}
                pagination={false}
                columns={columns} 
                dataSource={this.props.getOrderList} 
                rowKey={record => record.orderRef  } 
                rowClassName={this.setRowClassName}

                onRow={(record) => {
                    return {
                      onClick: () => {
                        this.setState({
                          rowId: record.orderRef,
                        })
                        // console.log(record)
                        // this.buyAndSell(record.instrumentCode)
                        // this.findContract(record.instrumentCode,record.productCode,record.instrumentMonth)
                        // this.props.greet(record)
                        // const FindTargetListbox1={FindTargetListbox:true}
                        // return(
                        //   this.props.dispatch(changebox(FindTargetListbox1))
                        // )
                        
                      },       // 点击行
                     
                    };
                  }}
            /> 

      </div>
    )
  }
}
const mapStateToProps = (store) => (
  {
      userInfo: store.userInfo
  }
)

export default connect(mapStateToProps)(Markettable)