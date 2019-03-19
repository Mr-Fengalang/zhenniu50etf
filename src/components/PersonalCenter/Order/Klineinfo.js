import React, { Component } from 'react'
import ReactKline from 'react-kline';
import { marketApi } from "../../../request"

class Kline extends Component {
    constructor(props){
      super(props)
      this.state={
        Klinedata:{}
      }
    }
    onRequestData = (param,callback) => {
      let code =param.symbol.instrumentCode
      let instrumentMonth =param.symbol.instrumentMonth
      let ranges =param.range
      if (ranges===0) {
        ranges="0"
      }
      if (ranges===60000) {
        ranges="0"
      }
      if (ranges===300000) {
        ranges="2"
      }
      if (ranges===900000) {
        ranges="3"
      }
      if (ranges===1800000) {
        ranges="4"
      }
      if (ranges===3600000) {
        ranges="5"
      }
      if (ranges===86400000) {
        ranges="7"
      }
      let klineType= ranges
      let pageNum ="0"
      var Klinedata={}
        marketApi
          .getContractKLine(
              {
                  code,
                  klineType,
                  instrumentMonth
                  ,pageNum
              }
          )
          .then(
              (res) => {
                if(res.resCode==="200"){
                  const rawData=res
                var data3={
                  "success":true,
                  "data":{
                    "lines":[
                      
                    ]
                  }
                }
                for (var i = 0, len = rawData.data.list.length; i < len; i++) {
                  var data2 = []
                  if (rawData.data.list[i].open!=="0.000"&&rawData.data.list[i].high!=="0.000"&&rawData.data.list[i].low!=="0.000"&&rawData.data.list[i].close!=="0.000") {
                    data2.push(Date.parse(new Date(rawData.data.list[i].createTime)))
                    data2.push(Number(rawData.data.list[i].open))
                    data2.push(Number(rawData.data.list[i].high))
                    data2.push(Number(rawData.data.list[i].low))
                    data2.push(Number(rawData.data.list[i].close))
                    data2.push(Number(rawData.data.list[i].volume))
                    data3.data.lines.unshift(data2)
                    }
                 
                  }
                  Klinedata=data3
                  callback(Klinedata);

                }
              }
          )
        // data=this.state.Klinedata
        // console.log(data)

      }
      
      componentWillReceiveProps(nextProps){
        this.setState({
          Klinedata:nextProps.Klinedata
        })
      }
      componentWillUnmount(){
        window.location.reload()
      }
  render() {
    const {instrumentCode,instrumentMonth,instrumentName} = this.props
    const a={instrumentCode,instrumentMonth}
    return (
      <div>
         <ReactKline
          height={document.body.clientHeight -150}
          width={document.body.clientWidth>1024?document.body.clientWidth*0.94*0.83:798}
          ranges={[ "1d", "1h", "30m", "15m", "5m", "line"]}
          symbol={a}
          instrumentMonth={instrumentMonth}
          since={instrumentName}
          symbolName={instrumentName}
          intervalTime={1000}
          depthWidth={50}
          limit={300}
          reverseColor={true}
          onRequestData={this.onRequestData}
          onRangeChange={(ranges)=>{
            if (ranges===0) {
              ranges="0"
            }
            if (ranges===60000) {
              ranges="0"
            }
            if (ranges===300000) {
              ranges="2"
            }
            if (ranges===900000) {
              ranges="3"
            }
            if (ranges===1800000) {
              ranges="4"
            }
            if (ranges===3600000) {
              ranges="5"
            }
            if (ranges===86400000) {
              ranges="7"
            }
            // this.props.searchHy(instrumentCode,ranges,instrumentMonth,'0')
          }}
        />
      </div>
    )
  }
}
export default Kline