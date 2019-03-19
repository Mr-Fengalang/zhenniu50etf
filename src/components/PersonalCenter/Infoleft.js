import React, { Component } from 'react'
import market from './assets/market.png'
import order from './assets/order.png'
import property from './assets/property.png'
import message from './assets/message.png'
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import { fetchUserInfo } from '../../stores/userInfo'
import { getCookie } from '../../toolFn'

const mapDispatchToProps = (dispatch) => (
  {
      fetchUserInfo: (data) => {
          dispatch(fetchUserInfo(data))
      }
  } 
)

const mapStateToProps = (store) => (
  {
      userInfo: store.userInfo
  }
)
class Infoleft extends Component {
    componentDidMount() {
        this.props.fetchUserInfo()
      }
    
    relode=()=>{
        // window.location.reload()
    }
  render() {
    return (
      <div className="infoleft left" style={{height:document.body.clientHeight-60,minHeight:"917px"}}>
        <ul className="infoleft_list">
             <NavLink to="/personalcenter/market" onClick={this.relode}> 
                <li >
                    <img src={market} alt=""/>
                    <p>行情</p>
                </li>
            </NavLink>
            <NavLink to="/personalcenter/order" onClick={this.relode}>
                <li >
                    <img src={order} alt=""/>
                    <p>订单</p>
                </li>
            </NavLink>
            <NavLink  to="/personalcenter/property/zjmx" onClick={this.relode}>
                <li >
                    <img src={property} alt=""/>
                    <p>资金</p>
                </li>
            </NavLink>
            {/* <NavLink to="/personalcenter/message" onClick={this.relode}>
                <li >
                    <img src={message} alt=""/>
                    <p>消息</p>
                </li>
            </NavLink> */}
        </ul>
      </div>
    )
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Infoleft))
// export default Infoleft