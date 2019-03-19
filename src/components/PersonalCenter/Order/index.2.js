import React, { Component } from 'react'
import { tradeApi } from "../../../request"
import { Icon} from 'antd';

import { connect } from 'react-redux'
import FindTargetListbox from './FindTargetListbox'
import Klineinfo from './Klineinfo'
import Markettable from './Markettable'
import Markettable2 from './Markettable2'
import Markettable3 from './Markettable3'
import {CHANGE_BOX,KLINE_BOX} from '../../../stores/userInfo/actionTypes'
const changebox = (data) => (
  {
      type: CHANGE_BOX,
      data
  }
)
const klinebox = (data) => (
  {
      type: KLINE_BOX,
      data
  }
)


const mapStateToProps = (store) => (
  {
      userInfo: store.userInfo
  }
)
class index extends Component {

  onGreet=(record)=>{
    this.setState({
      findTargetListboxlist:record
    })
  }
  onGreet1=(buyAndSelllist)=>{
    this.setState({
      buyAndSelllist:'',
    })
    this.setState({
      buyAndSelllist:buyAndSelllist,
    })
  }
  onGreet2=(findContract)=>{
    this.setState({
      findContract:findContract,
    })
   
  }
  ontokline=(instrumentCode,instrumentMonth)=>{
    this.setState({
      instrumentCode:instrumentCode,
      instrumentMonth:instrumentMonth
    })
  }

  constructor(props){
    super(props)
    this.state={
      target:'',
      hyDate:'',
      etfMdInfo:'',
      contractMonth:'',
      findTargetListboxlist:'',
      instrumentCode:'',
      targetCode:'',
      contraceCode:'',
      contractMonthName:'',
      buyAndSelllist:'',
      findContract:'',
      instrumentMonth:'',
      page:'1'
    }
  }
  changepage1 =()=>{
    this.setState({ page: "1" });
    this.getOrderList(2, 1)
    const FindTargetListbox1={FindTargetListbox:false}
      return(
        this.props.dispatch(changebox(FindTargetListbox1))
      )
   }
   changepage2 =()=>{
    this.setState({ page: "2" });
    this.getOrderList(1, 1)
    const FindTargetListbox1={FindTargetListbox:false}
      return(
        this.props.dispatch(changebox(FindTargetListbox1))
      )
   }
   changepage=()=>{
    this.setState({ page: "3" });
    this.setState({ page: "3" });
    this.getOrderList(3, 1)
    const FindTargetListbox1={FindTargetListbox:false}
      return(
        this.props.dispatch(changebox(FindTargetListbox1))
      )
   }
   changepage3 =()=>{
    this.setState({ page: "3" });
    this.getOrderList(3, 1)
    const FindTargetListbox1={FindTargetListbox:false}
      return(
        this.props.dispatch(changebox(FindTargetListbox1))
      )

   }
   changepage4 =()=>{
    this.setState({ page: "4" });
   }
  componentDidMount() {
    this.handleRefresh()
    const FindTargetListbox1={FindTargetListbox:false}
      return(
        this.props.dispatch(changebox(FindTargetListbox1))
      )
  }
  componentWillUnmount(){
    const FindTargetListbox1={FindTargetListbox:false}
      return(
        this.props.dispatch(changebox(FindTargetListbox1))
      )
  }
ontokline1=()=>{
  const klinebox1={klinebox:false}

  return(
    this.props.dispatch(klinebox(klinebox1))
  )
}

  topage3=(e)=>{
    this.setState({
      page:e
    })
  }

handleChange=(value)=> {
  this.setState({
    contractMonth:value
  })
}
getOrderList = (reqsOrderType, pageNum) => {
  return tradeApi
  .getOrderList(
      {
          reqsOrderType: reqsOrderType,
          pageNum: pageNum
      }
  )
  .then(
      (res) => {
        // console.log(res)
          if(res.resCode === '200') {
              res.data.map(
                  (item) => {
                      item.handleRefresh = this.handleRefresh
                  }
              )
              this.setState(
                  {
                      target: res.resCode,
                      getOrderList: res.data,
                     //  dataSource: this.state.dataSource.cloneWithRows(res.data),
                  }
              )
          }
      }
  )
}

async handleRefresh() {
  this.setState({refreshing: true})
  await this.getOrderList(2, 1)
  this.setState({refreshing: false, load: false})

}
  render() {
    return (
      <div className={ this.props.userInfo.FindTargetListbox?"infocenter w80":"infocenter"}>
        <div className="infotitle order">
           <p className={this.state.page==="1"?"active":''}  onClick={this.changepage1}>委托<span className="shu"></span></p>
          <p className={this.state.page==="2"?"active":''} onClick={this.changepage2}>持仓<span className="shu"></span></p>
          <p className={this.state.page==="3"?"active":''}  onClick={this.changepage3}>已平仓</p>
          {
            !this.props.userInfo.klinebox?"":<Icon type="left-circle" className="fanhuiicon" onClick={
              ()=>this.ontokline1() }/>
          }
        </div>
        { !this.props.userInfo.klinebox?
          <div className="infobox"> 
          { this.state.page ==="1"&&
            <Markettable  getOrderList={this.state.getOrderList} greet={this.onGreet}  greet1={this.onGreet1} greet2={this.onGreet2} tradingGoodsCode={this.state.target.tradingGoodsCode} instrumentMonth={this.state.contractMonth} />
          } 
          { this.state.page ==="2"&&
            <Markettable2 topage3={this.topage3}  getOrderList={this.state.getOrderList} greet={this.onGreet}  greet1={this.onGreet1} greet2={this.onGreet2} tradingGoodsCode={this.state.target.tradingGoodsCode} instrumentMonth={this.state.contractMonth} />
          } 
          { this.state.page ==="3"&&
            <Markettable3  getOrderList={this.state.getOrderList} greet={this.onGreet}  greet1={this.onGreet1} greet2={this.onGreet2} tradingGoodsCode={this.state.target.tradingGoodsCode} instrumentMonth={this.state.contractMonth}/>
          } 
          {/* { this.state.page ==="4"&&
            <Markettable  getOrderList={this.state.getOrderList} />
          }  */}
        </div>
        :
        <Klineinfo instrumentCode={this.state.instrumentCode} instrumentName={this.state.findTargetListboxlist.instrumentName} instrumentMonth={this.state.instrumentMonth}  />
        }
        {
          this.props.userInfo.FindTargetListbox&&this.state.findTargetListboxlist&&this.state.findContract.resCode==="200"&&
            <FindTargetListbox 
              tokline = {this.ontokline}
              findTargetListboxlist={this.state.findTargetListboxlist} 
              targetCode={this.state.targetCode}
              contraceCode={this.state.contraceCode}
              contractMonthName={this.state.contractMonthName}
              buyAndSelllist={this.state.buyAndSelllist}
              findContract={this.state.findContract}
              page={this.state.page}
              changepage={this.changepage}
              
            />
        }
      </div>
    )
  }
}
export default connect(mapStateToProps, null)(index)



