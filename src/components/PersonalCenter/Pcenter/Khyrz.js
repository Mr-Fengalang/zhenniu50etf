import React, { Component } from 'react'
import { connect } from 'react-redux'
import yrz from './assets/Layer3.png'
class Khyrz extends Component {
  
    constructor(props) {
        super(props);
        this.state = {
          
        };
      }
      
      hidename=(name)=>{
        let nameArr = name.split('')
        for(let i = 0; i < nameArr.length; i++ ) {
            if(i === 0) {
                continue
            }else{
                nameArr[i] = '*'
            }
        }
        name = nameArr.join('')
        return name
      }      
  render() {
    return (
      <div>
        <div className="khyrz">
                <img src={yrz} alt=""/>
              <p className="wt64"> <span className="w100">真实姓名：</span> <span>{this.props.userInfo.name&&this.hidename(this.props.userInfo.name)}</span> </p>
              <p>  <span className="w100">身份证号码：</span> <span>{this.props.userInfo.idCard&&this.props.userInfo.idCard.replace(/^(\d{3})(\d+)(\d{4})$/gi,"$1********$3")}</span> </p>
          </div>
      </div>
    )
  }
}
const mapStateToProps = (store) => (
    {
        userInfo: store.userInfo
    }
  )
export default connect(mapStateToProps)(Khyrz)