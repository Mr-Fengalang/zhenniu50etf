import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Steps, Button, message,Input} from 'antd';
import PhotoPicker from '../../PhotoPicker'
import {accountApi} from '../../../request'
import {getCookie} from '../../../toolFn'
import Khyrz from './Khyrz'
import {fetchUserInfo} from '../../../stores/userInfo'
const mapStateToProps = (store) => (
  {
      userInfo: store.userInfo
  }
)
class Authentication extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      idCardFront: '',
      idCardFrontSrc: '',
      idCardReverse: '',
      idCardReverseSrc: '',
      name: '',
      idCard: '',
    };
  }
  onChangePassword=(e)=>{
    this.setState({
      [e.target.name]:e.target.value
    })
  }
  next() {
    
    const { idCardFrontSrc, idCardReverseSrc } = this.state
    if(!idCardFrontSrc || !idCardReverseSrc) {
        message.info('请上传身份证正反面照片', 1.5) 
        return
    }
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }
  changeIdCardFront = (file, src) => {
    this.setState(
        {
            idCardFront: file,
            idCardFrontSrc: src
        }
    )
  }

  changeIdCardReverse = (file, src) => {
      this.setState(
          {
              idCardReverse: file,
              idCardReverseSrc: src
          }
      )
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

  acceptAuth = () => {

    const { name, idCard, idCardFront, idCardReverse } = this.state
    if(!name || !idCard) {
        message.info('请输入真实姓名和身份证号码', 1.5)
        return
    }

    let formData = new FormData()
    formData.append('idCardFront', idCardFront)
    formData.append('idCardReverse', idCardReverse)
    formData.append('name', name)
    formData.append('idCard', idCard)
    formData.append('customerId', getCookie('customerId'))

    accountApi
    .certification(formData)
    .then(
        (res) => {
            if(res.resCode === '200') {
              this.props.fetchUserInfo()
              if (this.props.match.params.name==="cz") {
                message.success('实名认证成功', 1.5, () => {
                  this.setState({
                    current:2
                  })
                  this.props.history.push('/personalcenter/property/zjmx')
                }
                )
              }else if (this.props.match.params.name==="market") {
                message.success('实名认证成功', 1.5, () => {
                  this.setState({
                    current:2
                  })
                  this.props.history.push('/personalcenter/market')
                }
                )
              }else if (this.props.match.params.name==="yhk") {
                message.success('实名认证成功', 1.5, () => {
                  this.setState({
                    current:2
                  })
                  this.props.history.push('/personalcenter/pcenter/bankinfo')
                }
                )
              }
              else{
                message.success('实名认证成功', 1.5, () => {
                  window.location.reload()
                }
                )
              }
            }
        }
    )

}
  render() {
    const Step = Steps.Step;
    const { page, idCardFrontSrc, idCardReverseSrc, name, idCard } = this.state
    const steps = [{
      title: '上传身份证',
      content: (
        <div  className="scsfzbox">
          <div className="scsfz">
            <p>上传身份证正面</p>
            <PhotoPicker canChange={true} changePhoto={this.changeIdCardFront} imgSrc={idCardFrontSrc} title="上传身份证正面" />
          </div>
          <div className="scsfz">
            <p>上传身份证反面</p>
            <PhotoPicker canChange={true} changePhoto={this.changeIdCardReverse} imgSrc={idCardReverseSrc} title="上传身份证反面" />
          </div>
        </div>
      ),
    }, {
      title: '填写信息',
      content: (
        <div>
          <div className="xgmmbox">
          <p className="xgmmboxtitle"></p>
            <div className="xgmmboxform">
             <p>真实姓名：</p><Input type="text" name="name" value={this.state.name} onChange={this.onChangePassword} placeholder="请输入真实姓名" />
            </div>
            <div className="xgmmboxform">
              <p>身份证号：</p><Input type="text" name="idCard" value={this.state.idCard}  onChange={this.onChangePassword} placeholder="请输入身份证号码" />
            </div>
          </div>
        </div>
      ),
    }, {
      title: '完成',
      content: (
        <div>
          <Khyrz/>
        </div>
      ),
    }];
    const { current } = this.state;
    return (
      <div className="">
          <div className="pcenterboxtitle">
            <span className="titleshu"></span>
            <p className="titlep">实名认证</p>
          </div>
          <div className="xgmmbox smrzbox">
           {
             this.props.userInfo&&
             this.props.userInfo.authenticationStatus===1
             ?
             <Khyrz/>
             :
             <div>
             <Steps current={current}>
               {steps.map(item => <Step key={item.title} title={item.title} />)}
             </Steps>
             <div className="steps-content">
               {steps[current].content}
             </div>
             <div className="steps-action">
               {
                 current < steps.length - 2
                 && <Button type="primary" onClick={() => this.next()}>下一步</Button>
               }
               {
                 current === steps.length - 2
                 && <Button style={{marginLeft:88}} type="primary" onClick={this.acceptAuth}>提交信息</Button>
               }
               
             </div>
           </div>
           }
          </div>
        </div>
    )
  }
}
const mapDispatchToProps = (dispatch) => (
  {
      fetchUserInfo: (data) => {
          dispatch(fetchUserInfo(data))
      }
  } 
)
export default connect(mapStateToProps,mapDispatchToProps)(Authentication)