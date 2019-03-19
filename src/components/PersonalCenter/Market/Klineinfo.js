import React, { Component } from 'react'
import Kline from './Kline'
export default class Klineinfo extends Component {
    
    constructor(props){
        super(props);
        this.state={
          data1:{}
        }
      }


  render() {
    const {instrumentCode,instrumentMonth,instrumentName} = this.props.findTargetListboxlist
    return (
      <div>
        <Kline Klinedata={this.state.data1&&this.state.data1} searchHy={this.searchHy} instrumentCode={instrumentCode} instrumentName={instrumentName} instrumentMonth={instrumentMonth} />
      </div>
    )
  }
}
