import React, { Component } from 'react'
import { marketApi } from "../../../request"
import { Select ,Icon} from 'antd';
import { connect } from 'react-redux'
import FindTargetListbox from './FindTargetListbox'
import Klineinfo from './Klineinfo'
import Markettable from './Markettable'
import Markettable1 from './Markettable1'
import { sendWebsocket } from '../../../stores/wsServer'

// import { dispatch } from 'rxjs/internal/observable/range';
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
const Option = Select.Option;
const mapStateToProps = (store) => (
  {
      userInfo: store.userInfo,
      // ws: store.wsInfo.ws,
      // uuid: store.wsInfo.uuid,
      // customerId: store.userInfo.customerId,
      // wsInfo:store.wsInfo
  }
)
const mapDispatchToProps = (dispatch) => (
  {
      // sendWebsocket: (ws, data) => dispatch(sendWebsocket(ws, data)),
      changebox: (data) => dispatch(changebox(data))
  }
)


class index extends Component {

  onGreet=(record)=>{
    this.setState({
      findTargetListboxlist:record
    })
    const FindTargetListbox1={FindTargetListbox:true}
    this.props.changebox(FindTargetListbox1)
  }
  ongreet5=(data)=>{
    this.setState({
      findTargetListboxlist1:data
    })
  }
  onGreet1=(buyAndSelllist)=>{
    if (buyAndSelllist.resCode==="514") {
      this.setState({
        kfjy:false,
      })
    }
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
  gettype4=(data)=>{
    this.setState({
      etfMdInfo:data,
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
      findTargetListboxlist1:'',
      kfjy:true,
      sfsm:true
    }
  }
  componentDidMount() {
    this.initMarketTitle()
    const klinebox1={klinebox:false}
    const FindTargetListbox1={FindTargetListbox:false}
    return(
      this.props.changebox(klinebox1),
      this.props.changebox(FindTargetListbox1)
    )
     }
    

  ontokline1=()=>{
    const klinebox1={klinebox:false}
    this.props.changebox(klinebox1)
  }
  componentWillReceiveProps(nextProps){
    // console.log(nextProps)
  }
handleChange=(value)=> {
  this.setState({
    contractMonth:value
  })
}
//载入行情头部信息
initMarketTitle = () => {
    marketApi
    .getTargetList()
    .then(
        (res) => {
            if(res.resCode === '200') {
                this.setState(
                    {
                        target: res.data.target[0],
                        hyDate: res.data.hyDate,
                        etfMdInfo: res.data.etfMdInfo[0],
                        contractMonth:res.data.hyDate[0].contractMonth
                    }
                )
            }

            this.setState({load: false})
        }
    )

}
  render() {
    return (
      <div className={ this.props.userInfo.FindTargetListbox?"infocenter w80":"infocenter"}>
      
        <div className="infotitle">
          <p>
            {
              !this.state.findTargetListboxlist&&
              <span className="infotitlename">50ETF</span>
            }
            
          {
            this.state.findTargetListboxlist&&
            this.state.findTargetListboxlist.instrumentName
            }
          </p> 
          {
            !this.props.userInfo.klinebox?"":
            <Icon type="left-circle" className="fanhuiicon" onClick={
              ()=>this.ontokline1() }/>
          }
        </div>
        { !this.props.userInfo.klinebox?
          <div className="infobox" style={{height:document.body.clientHeight-130}}>
          <div className="infobox828">
            <p>标的名称 <span>{this.state.etfMdInfo&&this.state.etfMdInfo.etfName}</span> </p>
            <p>最新价 <span>{this.state.etfMdInfo&&this.state.etfMdInfo.price}</span> </p>
            <p>涨跌值 <span>{this.state.etfMdInfo&&this.state.etfMdInfo.changeValue}</span> </p>
            <p>涨跌幅 <span>{this.state.etfMdInfo&&this.state.etfMdInfo.changeRate}%</span> </p>
          </div>
          
          <div className="buyandsell">
            <p className="buy">认购</p>
            {
              this.state.hyDate[0] && 
              this.state.hyDate[0].contractMonth &&
              <Select defaultValue={this.state.hyDate[0].contractMonth}  onChange={this.handleChange}>
                {
                  this.state.hyDate.map(d =><Option key={d.contractMonth} value={d.contractMonth}>{d.contractMonth}</Option>)
                }
              </Select>
            }
            <p className="sell">认沽</p>
             
          </div>   
          {
              this.state.target&&<Markettable gettype4={this.gettype4} tokline = {this.ontokline} greet={this.onGreet} greet5={this.ongreet5} contractMonth={this.state.contractMonth}  greet1={this.onGreet1} greet2={this.onGreet2} tradingGoodsCode={this.state.target.tradingGoodsCode} instrumentMonth={this.state.contractMonth}/>
          } 
        </div> 
        :
        <React.Fragment>
          {
            this.state.target&&<Markettable1  tokline = {this.ontokline} greet={this.onGreet} greet5={this.ongreet5} contractMonth={this.state.contractMonth}  greet1={this.onGreet1} greet2={this.onGreet2} tradingGoodsCode={this.state.target.tradingGoodsCode} instrumentMonth={this.state.contractMonth}/>
          } 
        
        <Klineinfo findTargetListboxlist={this.state.findTargetListboxlist}  instrumentCode={this.state.instrumentCode} instrumentName={this.state.findTargetListboxlist.instrumentName} instrumentMonth={this.state.instrumentMonth}  />

        </React.Fragment>
        }
            {
              this.props.userInfo.FindTargetListbox&&
                <FindTargetListbox 
                  tokline = {this.ontokline}
                  findTargetListboxlist={this.state.findTargetListboxlist} 
                  targetCode={this.state.targetCode}
                  contraceCode={this.state.contraceCode}
                  contractMonthName={this.state.contractMonthName}
                  buyAndSelllist={this.state.buyAndSelllist}
                  findContract={this.state.findContract}
                  findTargetListboxlist1={this.state.findTargetListboxlist1}
                  kfjy={this.state.kfjy}
                />
            }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(index)