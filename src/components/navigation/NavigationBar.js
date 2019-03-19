import React, { Component } from 'react';
import { getCookie ,delCookie} from '../../toolFn'
import { accountApi} from '../../request'
import { Link } from 'react-router-dom';
import logo from '../../img/logo.png'
import { connect } from 'react-redux'
import { fetchUserInfo, clearUserInfo} from '../../stores/userInfo'
import { Menu, Dropdown, Icon, message } from 'antd';
import { startWebsocket } from '../../stores/wsServer'


class NavigationBar extends Component {
  componentDidMount() {
      this.props.startWebsocket()
      getCookie('accessToken')&&
      this.props.fetchUserInfo()

      document.addEventListener("keydown", this.onKeyDown)
      
  }
 onKeyDown = (e) => {
   if (e.keyCode===122) {
    window.location.reload()
   }
  }
  logOut = () => {
    accountApi
    .loginOut({ customerTel: this.props.userInfo.customerTel })
    .then(
        (res) => {
            if(res.resCode === '200') {
              this.props.history.push('/')
                message.success('退出成功', 1.5, () => {
                    delCookie('accessToken')
                    delCookie('customerId')
                    delCookie('customerTel')
                    delCookie('customerTradeAccount')
                    localStorage.setItem('50etfUser', JSON.stringify({}))
                    this.props.clearUserInfo()
                } )
            }
        }
    )
}
  render() {
    const menu = (
      <Menu>
        <Menu.Item>
          <Link  to="/personalcenter/pcenter/index" rel="noopener noreferrer">个人信息</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/personalcenter/pcenter/authentication/1" rel="noopener noreferrer">实名认证</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/personalcenter/pcenter/bankinfo" rel="noopener noreferrer">我的银行卡</Link>
        </Menu.Item>
        <Menu.Item>
          <a  rel="noopener noreferrer" onClick={this.logOut.bind(this)}>退出</a>
        </Menu.Item>
      </Menu>
    );
    return (
      <nav className="top">
        <div className="contenner">
          <Link className="logo" to="/"><img src={logo} alt="" srcSet=""/></Link>
          <div className="right">
            <ul>
              {
                this.props.userInfo&&
                getCookie('accessToken')?
                <React.Fragment>
                  <li>
                    <p style={{color:'#ffffff8c'}}>{this.props.userInfo.customerTradeAccount}</p>
                  </li>
                  {/* <li className="avator">
                    <img src={avator} alt=""/>
                  </li> */}
                  <li>
                  <Dropdown overlay={menu}>
                    <Link className="ant-dropdown-link c8d8d" to="/personalcenter/market" >
                      个人中心 <Icon type="down" />
                    </Link>
                  </Dropdown>
                  </li>
                </React.Fragment> 
                :
                <React.Fragment>
                  <li><Link to="/signup/signuform" className="denglutop">登录</Link></li>
                  <li><Link to="/signup/registform" className="kaihutop">开户</Link></li>
                </React.Fragment>
              }
              
              <li>
                {
                  this.props.location.pathname==='/'
                  ?
                  getCookie('accessToken')
                  ?
                  <Link  to="/personalcenter/market" className="jiaoyizhongxtop">交易中心</Link>
                  :
                  <Link  to="/signup/signuform" className="jiaoyizhongxtop">交易中心</Link>
                  :
                  <Link  to="/" className="toguanwang">官网</Link>
                }
                
              </li>
            </ul> 
          </div>
        </div>
      </nav>
    );
  }
}

const mapDispatchToProps = (dispatch) => (
  {
      fetchUserInfo: (data) => {
          dispatch(fetchUserInfo(data))
      },
      clearUserInfo: (data) => dispatch(clearUserInfo(data)),
      startWebsocket: () =>  dispatch(startWebsocket())
  } 
)

const mapStateToProps = (store) => (
  {
      userInfo: store.userInfo,
      
  }
)

// export default connect(mapStateToProps, { logout })(NavigationBar);
export default connect(mapStateToProps, mapDispatchToProps)(NavigationBar);
