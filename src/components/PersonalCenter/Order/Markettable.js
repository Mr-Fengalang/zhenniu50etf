import React, { Component } from 'react'
import { marketApi } from "../../../request"
import {
    Table,Button
  } from 'antd';
import {connect} from 'react-redux'
import { tradeApi, } from '../../../request'
import moment from "moment";
import { getDealStatus, getStatus, getDate } from '../../../toolFn'

import {CHANGE_BOX} from '../../../stores/userInfo/actionTypes'
const changebox = (data) => (
  {
      type: CHANGE_BOX,
      data
  }
)
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
        // this.searchHy(this.props.tradingGoodsCode,this.props.instrumentMonth)
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
    },  {
      title: '报单量',
      dataIndex: 'volume',
      render:(text, row, index)=> {
        return row.volume
      }
    }, {
      title: '已成交',
      dataIndex: 'tradeVolume',
      render:(text, row, index)=> {
        return row.tradeVolume
      }
    }, 
    {
      title: '未成交',
      dataIndex: 'weitradeVolume',
      render:(text, row, index)=> {
        return (Number(row.volume)-Number(row.tradeVolume))
      }
    },
    {
      title: '成交状态',
      dataIndex: 'reportTime',
      render:(text, row, index)=> {
        return getStatus(row.orderStatus, row.tradeVolume)
      }
    }, {
      title: '合约代码',
      dataIndex: 'instrumentCode',
      render:(text, row, index)=> {
        return row.instrumentCode
      }
    }, {
      title: '报单编号',
      dataIndex: 'orderRef',
      render:(text, row, index)=> {
        return row.orderRef
      }
    }
    ,  
    {
      title: '报单日期',
      dataIndex: 'createTime',
      render:(text, row, index)=> {
        return moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')
      }
    },  {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        if (record.orderStatus) {
          if (record.orderStatus.split("|")[record.orderStatus.split("|").length-2]==="1"||record.orderStatus.split("|")[record.orderStatus.split("|").length-2]==="3") {
            return <Button type="primary"  className="xiadanbtn"> 撤单</Button>
          }
        }
        
      }
    }
  ];
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
                        // this.buyAndSell(record.instrumentCode)

                        this.findContract(record.instrumentCode,record.productCode,record.instrumentMonth)
                        
                        this.props.greet(record)
                        const FindTargetListbox1={FindTargetListbox:true}
                        return(
                          this.props.dispatch(changebox(FindTargetListbox1))
                        )
                        
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