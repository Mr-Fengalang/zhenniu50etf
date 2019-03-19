import React, { Component } from 'react'
import { marketApi } from "../../../request"
import {
    Table,Button
  } from 'antd';
import {connect} from 'react-redux'
import { tradeApi, } from '../../../request'
import moment from "moment";
import { getDealStatus, newGuid, getUpDown } from '../../../toolFn'
import {CHANGE_BOX} from '../../../stores/userInfo/actionTypes'
    const changebox = (data) => (
    {
        type: CHANGE_BOX,
        data
    }
    )


  function name(params) {
    
  }
  function setRowClassName1(record) {
    // if (record.active==='down') {
    //   return "down"
    // }else{
    //   return "up"
    // }
    return record.sumHoldVolume
  }
  
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
          showExtend: false,
          balanceShow: false,
          volume: '1',
          instrumentCode: this.props.getOrderList.instrumentCode&&this.props.getOrderList.instrumentCode,
          targetCode: this.props.getOrderList.productCode,
          optionMarket: {},
          rowId:''
        }
        // this.id = this.props.noticeData.id
        this.idempotency = newGuid()
   
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

    
    //浮动盈亏 最新价*合约乘数*张数 - 开仓价*合约乘数*张数


    xiadan=()=>{
        const FindTargetListbox1={FindTargetListbox:true}
        return(
            this.props.dispatch(changebox(FindTargetListbox1))
        )
    }
    buyAndSell = (contraceCode,tradingGoodsCode,instrumentMonth) => {
      const targetCode =tradingGoodsCode
      const contractMonthName =instrumentMonth
      tradeApi
      .buyAndSell({targetCode, contraceCode, contractMonthName})
      .then(
          (res) => {
            if(res.resCode==="200"){
              const FindTargetListbox1={FindTargetListbox:true}
              return(
                this.props.dispatch(changebox(FindTargetListbox1))
              )
            }
            this.props.greet1(res)
            this.setState({
              buyAndSelllist:res
            })
          }
      )
    }

    findContract = (instrumentCode,tradingGoodsCode,instrumentMonth) => {
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
    const columns = [{
      title: '合约名称',
      dataIndex: 'instrumentName',
      render:(text, row, index)=> {
        return row.instrumentName
      }
    }, 
    {
      title: '开平',
      dataIndex: 'direction',
      render:(text, row, index)=> {
        return getDealStatus(row.direction,row.offsetFlag)
      }
    }, {
      title: '浮动盈亏',
      dataIndex: 'reportTime',
      className:{setRowClassName1},
      render:(text, row, index)=> {
          
          const ccjj =  (parseFloat(row.sumMarkeValue) / parseFloat(row.sumVolume)) % 1 === 0
              ?
              parseFloat(row.sumMarkeValue) / parseFloat(row.sumVolume)
              :
              (parseFloat(row.sumMarkeValue) / parseFloat(row.sumVolume)).toFixed(4)
  
          return ((( row.lastPrice ? row.lastPrice : row.lastPrice ) * row.sumHoldVolume * row.contractMultiplier)
                  -
                  (ccjj * row.contractMultiplier * row.sumEffectiveHoldVolume)).toFixed(1)
      }
    }, {
      title: '持仓',
      dataIndex: 'sumHoldVolume',
      render:(text, row, index)=> {
        return row.sumHoldVolume
      }
    }, {
      title: '可平',
      dataIndex: 'sumEffectiveHoldVolume',
      render:(text, row, index)=> {
        return row.sumEffectiveHoldVolume
      }
    }, {
      title: '合约代码',
      dataIndex: 'instrumentCode',
      render:(text, row, index)=> {
        return row.instrumentCode
      }
    }, {
      title: '成本价',
      dataIndex: 'orderRef',
      render:(text, row, index)=> {
        return (row.sumMarkeValue / row.sumVolume).toFixed(4)
      }
    }
    , {
      title: '结束日期',
      dataIndex: 'instrumentExpireDay',
      render:(text, row, index)=> {
        return moment(row.instrumentExpireDay).format('YYYY-MM-DD HH:mm:ss')
      }
    }, 
    {
      title: '成交编号',
      dataIndex: 'totalFee',
      render:(text, row, index)=> {
        return row.orderRef
      }
    }, 
    {
      title: '开仓权利金',
      dataIndex: 'sumMargin',
      render:(text, row, index)=> {
        return row.sumMargin
      }
    }, 
     
    {
      title: '成交日期',
      dataIndex: 'createTime',
      render:(text, row, index)=> {
        return moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')
      }
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
          <Button type="primary" className="xiadanbtn"> 平仓</Button>
      ),
    }
    
  ]; 
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
                        this.buyAndSell(record.instrumentCode,record.tradingGoodsCode,record.instrumentMonth)
                        this.findContract(record.instrumentCode,record.productCode,record.instrumentMonth)
                        this.props.greet(record)
                        console.log(record)
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