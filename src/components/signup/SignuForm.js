import React, { Component } from 'react'
import img2 from './assets/7192.png'
import img3 from './assets/7193.png'
import { Link } from 'react-router-dom';
import { accountApi } from "../../request"
import { storageUser } from '../../toolFn'
import { message } from 'antd';
export default class SignuForm extends Component {
    constructor(props){
        super(props);
        this.state={
          customerTradePassword:'',
          customerTradeAccount:'',
          err:'',
        }
      }
      onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value,err:'' });
      }
      login = () => {
        const { customerTradeAccount, customerTradePassword } = this.state
        accountApi
        .login(
            {
                customerTradeAccount,
                customerTradePassword
            }
        )
        .then(
            (res) => { 
                if(res.resCode === '200') {
                    storageUser(res.data)
                    message.success('登录成功', 1.5, () => {this.props.history.push('/personalcenter/market')}
                    )
                }
            }
        )
    }
  render() {
    return (
        <div className={'right1 logonnewbox'}>
            <div className="logonnewboxtitle">
              <p>登录</p>
            </div>
            <div className="pre">
              <input type="text" 
              className="form-control pl40" 
              id="customerTradeAccount" 
              name="customerTradeAccount" 
              placeholder="请输入交易帐号"
              onChange={this.onChange}
              value={this.state.customerTradeAccount}
              />
              <img src={img2} alt="" className="pab"/>
            </div>
            <div className="pre mtp28">
              <input type="password" 
              className="form-control pl40" 
              name="customerTradePassword" 
              id="customerTradePassword" 
              placeholder="请输入密码"
              onChange={this.onChange}
              value={this.state.customerTradePassword}
            />
              <img className="pab" src={img3} alt="" srcSet=""/>
					  </div>
            <span id="helpBlock2" className="help-block err ">{this.state.err}</span>
            <div className="Log_but"> 
            <div className="forget">
              <p > <Link to="/signup/retrieveAccount" className="forgnew">忘记账号</Link></p>
              <p className="right"><Link to="/signup/lostPassword" className="forgnew">忘记密码</Link></p>
            </div>
			      <button  onClick={this.login} className={!this.state.customerTradeAccount||!this.state.customerTradePassword?"desabled":""}  disabled={!this.state.customerTradeAccount||!this.state.customerTradePassword?true:false}>登录</button>
            <div className="tar">
             <p className="">没有账户？<Link to="/signup/registform" className="forgnew">立即开户</Link></p> 
            </div>
		    	</div>
        </div>
    )
  }
}
