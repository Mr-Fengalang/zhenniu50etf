import React, { Component } from 'react'
import Cztxbox from './Cztxbox'
export default class DT_text extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
}

  render() {
    const userinfo=this.props.userInfo
    return (
      <div className="info w80">
               
        <div className="customerCapital">
            <p>总资产余额:</p>
            <p className="infomoney">
                ￥{
                    userinfo.customerCapital||"0"
                }
            </p>
        </div>
        <div className="customerCapital">
            <p>可用余额:</p>
            <p className="infomoney">
                ￥{
                    userinfo.customerCapital-userinfo.customerFreezeCapital||"0"
                }
            </p>
        </div>
        
        <div className="customerCapital cztx">
            <Cztxbox />
        </div>
      </div>
    )
  }
}
