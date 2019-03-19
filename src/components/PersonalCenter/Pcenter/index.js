import React, { Component } from 'react'
import './assets/css.css'
import { NavLink } from 'react-router-dom';
import routes from './routes'
import { connect } from 'react-redux'

const mapStateToProps = (store) => (
  {
      userInfo: store.userInfo
  }
)

 class Personalcenter extends Component {
  constructor(props){
    super(props)
    this.state={
    }
  }
  render() {
    return (
      <div className="clearfloat">
        <div className="personalcenterleft left" style={{height:document.body.clientHeight -60}}>
          <div className="userpersonal">
            个人中心
          </div>
          <div>
            <ul>
              <li >
                <NavLink  to="/personalcenter/pcenter/index">个人信息</NavLink>
              </li>
              <li>
                <NavLink  to="/personalcenter/pcenter/authentication/1">实名认证</NavLink>
              </li>
              <li>
                <NavLink  to="/personalcenter/pcenter/bankinfo">我的银行卡</NavLink>
              </li>
            </ul>
          </div>
        </div>
        {
          routes 
        }
      </div>
    )
  }
} 
export default connect(mapStateToProps)(Personalcenter)