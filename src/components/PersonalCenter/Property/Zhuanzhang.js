import React, { Component } from 'react'
import {Upload, message ,Modal} from 'antd';
import { moneyApi } from '../../../request'
import {getCookie} from '../../../toolFn'
import oss from 'ali-oss';
import photoPickerIcon from '../../PhotoPicker/assets/photoPicker.png'
import { withRouter } from 'react-router-dom';

import moment from 'moment';
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const client = (self) => {
  const {token} = self.state
  // 当时使用的插件版本为5.2
  /*
  return new oss.Wrapper({
    accessKeyId: token.access_key_id,
    accessKeySecret: token.access_key_secret,
    region: '', //
    bucket: '',//
  });
  */
  // 2018-12-29更新
  // ali-oss v6.x版本的写法
  return new oss({
    accessKeyId: token.access_key_id,
    accessKeySecret: token.access_key_secret,
    region: 'oss-cn-shanghai', //
    bucket: global.constants.ossbucketname,//
  });
}

const uploadPath = (path, file) => {
  // 上传文件的路径，使用日期命名文件目录
  return `TransferVoucher/${moment().format('YYYY-MM-DD')}/${file.name}}`
}
const UploadToOss = (self, path, file) => {
  const url = uploadPath(path, file)
  return new Promise((resolve, reject) => {
    client(self).multipartUpload(url, file).then(data => {
      resolve(data);
    }).catch(error => {
      reject(error)
    })
  })
}
class Zhuanzhang extends Component {
  constructor(props){
    super(props);
    this.state={
      type:1,
      transferAccountsBank: '',
      bankCard: '',
      cardholderName: '',
      rechargeAmount: '',
      receivablesNumber: '',
      page: 1,
      voucherSrc: '',
      voucher: '',
      companyBankInfo: {},
      loading: false,
      token: {
        access_key_id: global.constants.ossaccesskeyid, // oss的key_id
        access_key_secret: global.constants.ossaccesskeysecret, // oss的secret
        OSS_ENDPOINT: global.constants.ossendpoint,  // 自己oss服务器的配置信息
        OSS_BUCKET: global.constants.ossurl, // 自己oss服务器的配置信息
      }
    }
    this.onchange=this.onchange.bind(this)
  }
  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      }));
    }
  }
  success=(data)=> {
    Modal.success({
      className:"asdaasdasd",
      title: '充值金额',
      content: 
      <div className="txcgbox">
        <p className="money">￥{data}</p>
        <p>审核成功后即可到账</p>
      </div>,
      okText: '查看',
      cancelText: '知道了',
      onOk:()=> {
        this.props.history.push('/personalcenter/property/zjmx')
      },
    });
  }
  beforeUpload = (file) => {

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      // 使用ossupload覆盖默认的上传方法
      UploadToOss(this, 'TransferVoucher', file).then(data => {
        var str = "";
        if (data.res.requestUrls[0].indexOf('?')>-1) {
          str = data.res.requestUrls[0].match(/(\S*)\?/)[1];
        }else{
          str=data.res.requestUrls[0]
        }
        this.setState({ imageUrl: str});
      })
    }
    return false; // 不调用默认的上传方法
  }
  onchange =(e)=>{
    this.setState({
      [e.target.name]:e.target.value
    })
  }
  changetype=()=>{
    this.setState({
      type:this.state.type+1
    })
  }
  changetype1=()=>{
    const { transferAccountsBank, bankCard, cardholderName, rechargeAmount, receivablesNumber } = this.state
    if(
        !cardholderName ||
        !transferAccountsBank ||
        !bankCard ||
        !receivablesNumber ||
        !rechargeAmount
    ) {
        message.info('请注意数据完整', 1.5)
        return
    }

    if(!(/^([1-9]{1})(\d{15}|\d{18})$/.test(bankCard))) {
        message.info('请注意银行卡格式', 1.5)
        return
    }

    if(parseFloat(rechargeAmount) <= 0) {
        message.info('充值金额必须为正数', 1.5)
        return
    }
    this.setState({
      type:this.state.type+1
    })
  }
  changeVoucher = (voucher, voucherSrc) => {
    this.setState({voucher, voucherSrc})
  }
  settype3=()=>{
    const { transferAccountsBank, bankCard, cardholderName, rechargeAmount, receivablesNumber } = this.state
    if(
        !cardholderName ||
        !transferAccountsBank ||
        !bankCard ||
        !receivablesNumber ||
        !rechargeAmount
    ) {
        message.info('请填写付款方信息', 1.5)
        this.setState({
          type:2
        })
        return
    }

    if(!(/^([1-9]{1})(\d{15}|\d{18})$/.test(bankCard))) {
        message.info('请注意银行卡格式', 1.5)
        return
    }

    if(parseFloat(rechargeAmount) <= 0) {
        message.info('充值金额必须为正数', 1.5)
        return
    }
    this.setState({
      type:3
    })
  }
  settype2=()=>{
    this.setState({
      type:2
    })
  }
  settype1=()=>{
    this.setState({
      type:1
    })
  }
  outLinePay = () => {
    if(!this.state.imageUrl) {
        message.info('请上传付款凭证', 1.5)
        return
    }
    const { transferAccountsBank, bankCard, cardholderName, rechargeAmount, receivablesNumber, imageUrl } = this.state
    const { offlinePaymentId} = this.props
    if(!this.idempotency) {
        this.idempotency = getCookie('customerId') + '/pay/payInfo/underLineRecharge' + (new Date().getTime())
    }
    let customerId= getCookie('customerId')
    let voucherPic =imageUrl
    moneyApi
    .underLineRecharge({customerId,offlinePaymentId,transferAccountsBank,bankCard,cardholderName,rechargeAmount,receivablesNumber,idempotency:this.idempotency,voucherPic})
    .then(
        (res) => {
            if(res.resCode === '200') {
               message.info('申请成功', 1.5)
               this.success(rechargeAmount)
            }
        }
    )
}
  render() {
    const uploadButton = (
      <div className="assets_add_photo">
        <img src={photoPickerIcon} alt=""/>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    const { transferAccountsBank, bankCard, cardholderName, rechargeAmount, receivablesNumber, page, voucherSrc } = this.state
    const {payee,receivablesAccount,receivablesInstitution} = this.props.ifzhuanzhange[0]
    return (
      <div className="rebinding-box">
        <div className="box-timeline">
								<ul className="text-center clearfloat">
									<li >
										收款方账户
										<div className="box-num1"  onClick={this.settype1}>
											1
										</div>
									</li>
									<li className={this.state.type===1?"ml45 ffffff2e":"ml45 "} onClick={this.settype2}>
										付款方账户
										<div className={this.state.type===2||this.state.type===3?"box-outside1":"box-outside1 outside1ab"}  id="outside1abs">
											<div className="box-num2 num2ab">
												2
											</div>
										</div>
									</li>
									<li className={this.state.type===1||this.state.type===2?"ml45 nmr ffffff2e":"ml45 nmr "} onClick={this.settype3}>
										上传转账凭证
										<div className={this.state.type===3?"box-outside2":"box-outside2 outside2a"} id="outside2as">
											<div className="box-num3 num3a">
												3
											</div>
										</div>
									</li>
									<div className="clear">
									</div>
								</ul>
							</div>

        {
          this.state.type===1&&
          <React.Fragment>
          
          <div className="tac">
            <div className="czinfo">
              <p className="w100">收款人</p> <input className="rechargeAmount"  value={payee} readOnly  name="payee" type="text"/>
              <p className="w100 m20">收款人账户</p> <input className="rechargeAmount"  value={receivablesAccount} readOnly name="receivablesAccount" type="text"/>
              <p className="w100">收款银行</p> <input className="rechargeAmount"  value={receivablesInstitution} readOnly name="receivablesInstitution" type="text"/>
            </div>
          </div>
          <div className="tac xyb">
            <p onClick={this.changetype} style={{marginLeft:'128px',marginTop:'40px'}}>下一步</p>
          </div>
          </React.Fragment>
        }
        {
          this.state.type===2&&
          <React.Fragment>
          
          <div className="czinfo">
            <p className="w100">转账银行:</p> <input className="rechargeAmount" onChange={this.onchange} value={transferAccountsBank} placeholder="请输入您的付款银行" name="transferAccountsBank" type="text"/>
            <p className="w100 m20">银行卡号:</p> <input className="rechargeAmount" onChange={this.onchange} value={bankCard} placeholder="请输入您的银行卡号" name="bankCard" type="text"/>
            <p className="w100 ">持卡人姓名:</p> <input className="rechargeAmount" onChange={this.onchange} value={cardholderName} placeholder="请输入持卡人姓名" name="cardholderName" type="text"/>
            <p className="w100 m20">充值金额:</p> <input className="rechargeAmount" onChange={this.onchange} value={rechargeAmount} placeholder="请输入充值金额" name="rechargeAmount" type="text"/>
            <p className="w100">转账流水号:</p> <input className="rechargeAmount" onChange={this.onchange} value={receivablesNumber} placeholder="请输入转账流水号 " name="receivablesNumber" type="text"/>
          </div>
          <div className="tac xyb">
            <p onClick={this.changetype1} style={{marginLeft:'128px'}}>下一步</p>
          </div>
          </React.Fragment>
        }
        {
          
          this.state.type===3&&
          <React.Fragment>
          
          <div className="czinfo">
          <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={this.beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="" style={{width:251,height:154}}/> : uploadButton}
      </Upload>
          {/* <PhotoPicker canChange={true} changePhoto={this.changeVoucher} imgSrc={voucherSrc} title="上传转账单" /> */}
          </div>
          <div className="tac xyb">
            <p onClick={this.outLinePay}>提交</p>
          </div>
          </React.Fragment>
        }
      </div>
    )
  }
}
export default withRouter(Zhuanzhang)