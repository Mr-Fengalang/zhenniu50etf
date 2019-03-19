import React, { Component } from 'react'
import ReactKline from 'react-kline';
import { marketApi } from "../../../request"

export default class Klineinfo extends Component {
    
    constructor(props){
        super(props);
        this.state={
          data1:{}
        }

      }
    componentDidMount() {
      this.props.instrumentCode&&this.props.instrumentMonth&&
        this.searchHy(this.props.instrumentCode,'2',this.props.instrumentMonth,'0')
        window.addEventListener('scroll', this.handleScroll.bind(this)) //监听滚动
        window.addEventListener('resize', this.handleResize.bind(this)) //监听窗口大小改变
        
    }
    componentWillUnmount(){
        window.location.reload()
        window.removeEventListener('scroll', this.handleScroll.bind(this)) 
        window.removeEventListener('resize', this.handleResize.bind(this))
      }
      handleScroll = e => {

        //e.srcElement.scrollingElement.scrollTop为距离滚动条顶部高度
        // e.srcElement.scrollingElement.scrollHeight为整个文档高度
      }
    
      handleResize = e => {
          
      }

    onRequestData = (param,callback) => {
        this.state.data1&&
        callback(this.state.data1);
      }
    searchHy = (code, klineType,instrumentMonth,pageNum) => {
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
              // console.log(res)
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
                if (rawData.data.list[i].open!=="0") {
                  
                  data2.unshift(Date.parse(new Date(rawData.data.list[i].createTime)))
                  data2.unshift(Number(rawData.data.list[i].open))
                  data2.unshift(Number(rawData.data.list[i].high))
                  data2.unshift(Number(rawData.data.list[i].low))
                  data2.unshift(Number(rawData.data.list[i].close))
                  data2.unshift(Number(rawData.data.list[i].volume))
                  data3.data.lines.push(data2)
                  }
               
                }
                this.setState({
                  data1:data3
                })
            }
        )
    }
  render() {
    return (
      <div>
        {/* {this.state.data1} */}
        {this.state.data1&&
          <ReactKline
          height={document.body.clientHeight -150}
          width={document.body.clientWidth>1024?document.body.clientWidth*0.94*0.83:798}
          ranges={["1w", "1d", "line"]}
          symbol={this.state.instrumentName}
          symbolName={this.state.instrumentName}
          intervalTime={1000}
          depthWidth={50}
          onRequestData={this.state.data1===""?"":this.onRequestData}
        />
        }
      </div>
    )
  }
}
