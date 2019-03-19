import React from 'react'
import {Upload, Modal,Icon} from 'antd'
import moment from 'moment';

class Example extends React.Component{
  state = {
    preview: "",
    visible: false,
    imageList: [],
    token: {
    }
  }

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const props = {
      onRemove: (file) => {
        this.setState(({ imageList }) => {
          const index = imageList.indexOf(file);
          const newFileList = imageList.slice();
          newFileList.splice(index, 1);
          return {imageList: newFileList};
        });
      },
      beforeUpload: this.beforeUpload,
      fileList: this.state.imageList,
      onPreview: this.handlePreview,
      accept: "image/*",
      listType: "picture-card"
    };
    const {preview, visible, imageList} = this.state
    return(
        <div>
            <Upload {...props}>
              {
                imageList.length >= 1 ? null : uploadButton
              }
            </Upload>
            <Modal visible={visible} footer={null} onCancel={this.handleCancel}>
               <img alt="example" style={{ width: '100%' }} src={preview} />
            </Modal>
        </div>
    )
  }

  //因为我们需要与表单一起上传,所以默认是不去上传到后台服务器.
  beforeUpload = file => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      UploadToOss(this, 'TransferVoucher', file).then(data => {
        this.setState(({ imageList }) => ({
          
          imageList: [{
            uid: file.uid,
            name: file.name,
            status: file.status,
            type: file.type,
            result: data.name,
            url: global.constants.ossurl
          }],
        }));
      })
    }
    return false;
  }

  handlePreview = (file) => {
    this.setState({
      preview: file.url || file.thumbUrl,
      visible: true,
    });
  }

  componentDidMount(){
    //使用的sts,向后台服务器请求获取token.
    // setState({token: "you get result"})
  }
}

const client = (self) => {
  const {token} = self.state
  return new window.OSS.Wrapper({
    accessKeyId: global.constants.ossaccesskeyid,
    accessKeySecret: global.constants.ossaccesskeysecret,
    // stsToken: token.security_token,
    region: 'oss-cn-shanghai', //常量,你可以自己定义
    bucket: global.constants.ossbucketname,
  });
}

const uploadPath = (path, file) => {
  return `${path}/${moment().format('YYYY-MM-DD')}/${file.name}}`
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
export default Example