//获取涨跌类名
export const getUpDown = (rate) => {
    if(parseFloat(rate) > 0) {
        return 'up'
    }else if(parseFloat(rate) < 0){
        return 'down'
    }else{
        return 'same'
    }
}



//解压
export const unZip = (evt) => {
    return  new Promise(
        (resolve, reject) => {
          if (evt.data instanceof Blob) {
            var blob = evt.data
            //先把blob进行拆分，第一个字节是标识
            var newblob=blob.slice(0,evt.data.size)
            //js中的blob没有没有直接读出其数据的方法，通过FileReader来读取相关数据
            var reader = new FileReader()
            reader.readAsBinaryString(newblob)        
            //当读取操作成功完成时调用.
            reader.onload = function(evt){  
                if(evt.target.readyState == FileReader.DONE){  
                    var data = evt.target.result
                    //将字符串转换为Unicode字符编码组成的数组
                    var charData  = data.toString('utf-8').split('').map(function(x){return x.charCodeAt()})
                    //将Unicode字符编码组成的数组转换为遵循Unit8格式的数组
                    //使用pako解压
                    //option to: string 可以设置转换后的数据为utf-16(javascript)字符串
                    var _data = window.pako.ungzip(charData, {to: 'string'})
                    resolve(JSON.parse(_data))
                }
            }
          }else{
            reject('error')
          }
        }
    )
}

//aes解密
export const  Decrypt = (word) => {
    var key = window.CryptoJS.enc.Utf8.parse("ideal@(zhenniub)")
    var decrypt = window.CryptoJS.AES.decrypt(word, key, {mode:window.CryptoJS.mode.ECB,padding: window.CryptoJS.pad.Pkcs7})
    return window.CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

//aes加密
export const Encrypt = (word) => {
    var key = window.CryptoJS.enc.Utf8.parse("ideal@(zhenniub)")
    var srcs = window.CryptoJS.enc.Utf8.parse(word)
    var encrypted = window.CryptoJS.AES.encrypt(srcs, key, {mode:window.CryptoJS.mode.ECB,padding: window.CryptoJS.pad.Pkcs7})
    return encrypted.toString()
}


/**
 * @method 获取cookie
 * @param {*} cookie名称 
 */
export const getCookie = (name) => { 
    let arr = []
    const reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)")

    if(arr=document.cookie.match(reg)){
        return unescape(arr[2])
    }else {
        return null 
    }
}

/**
 * @method 设置cookie默认1天
 * @param {*} name
 * @param {*} value
 */
export const setCookie = (name,value) => { 
    const Days = 1
    const exp = new Date()

    exp.setTime(exp.getTime() + Days*24*60*60*1000) 
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString() 
}

export const  delCookie = (name) => {
                var exp = new Date()
                exp.setTime(exp.getTime() - 1)
                var cval=getCookie(name)
                if(cval!=null)
                    document.cookie= name + "="+cval+";expires="+exp.toGMTString()
            }


//保存用户信息
export const storageUser = (data) => {
    setCookie('accessToken', data.accessToken)
    setCookie('customerTel', data.customerTel)
    setCookie('customerId', data.customerId)
    setCookie('customerTradeAccount', data.customerTradeAccount)
}

//删除用户信息
export const delUser = (data) => {
    document.cookie = null
}

//生成唯一字符串
export const newGuid = () => {
    let guid = ""
    for (var i = 1; i <= 32; i++){
      var n = Math.floor(Math.random()*16.0).toString(16)
      guid += n
      if((i === 8)||(i === 12)||(i === 16)||(i === 20))
        guid += "-"
    }
    return guid
}


//获取买卖信息
export const getDealStatus = (direction, offsetFlag) => {
    
    let status = ''
    direction === '0' ? status += '买' :  status += '卖'
    if (offsetFlag==="0") {
        status += '开'
    }else if (offsetFlag==="1") {
        status += '平'
    }else if (offsetFlag==="4") {
        status="强平"
    }
    return status
}

//获取订单状态
export const getStatus = (status, tradeVolume) => {
    if(!status) {
        return '正报'
    }

    const _status = status.split('|')[status.split('|').length - 2]
    if(_status === '0') {
        return '全部成交'
    }else if(_status === '3'){
        return '报单已提交'
    }else if(_status === '5' && parseInt(tradeVolume) > 0){
        return '已撤余单'
    }else if(_status === '5') {
        return '全部撤单'
    }else if(_status === '99') {
        return '错单'
    }else if(_status === '1') {
        return '部分成交'
    }else {
        return '废单'
    }
}

/**
 * @method 时间戳转换字符串
 */
export const getDate = (date) => {
    return  (new Date(date)).getFullYear() + 
            '-' 
            +  
            ( ((new Date(date)).getMonth() + 1) > 9 ? ((new Date(date)).getMonth() + 1) : ( '0' + ((new Date(date)).getMonth() + 1) ))
            + 
            '-' 
            +
            ( ((new Date(date)).getDate()) > 9 ? ((new Date(date)).getDate()) : ( '0' + ((new Date(date)).getDate()) ))
            +
            ' '
            +
            ( ((new Date(date)).getHours()) > 9 ? ((new Date(date)).getHours()) : ( '0' + ((new Date(date)).getHours()) ) )
            +
            ':'
            + 
            ( ((new Date(date)).getMinutes()) > 9 ? ((new Date(date)).getMinutes()) : ( '0' + ((new Date(date)).getMinutes()) ) )
            +
            ':'
            + 
            ( ((new Date(date)).getSeconds()) > 9 ? ((new Date(date)).getSeconds()) : ( '0' + ((new Date(date)).getSeconds()) ) )
}

/**
 * @method 时间戳转换字符串/仅日期
 */
export const getFullDate = (date) => {
    return  (new Date(date)).getFullYear() + 
            '-' 
            +  
            ( ((new Date(date)).getMonth() + 1) > 9 ? ((new Date(date)).getMonth() + 1) : ( '0' + ((new Date(date)).getMonth() + 1) ))
            + 
            '-' 
            +
            ( ((new Date(date)).getDate()) > 9 ? ((new Date(date)).getDate()) : ( '0' + ((new Date(date)).getDate()) ))
}


/**
 * @method 转换字符串为number
 */

export const getNumber = (num) => {
    if(num) {
        return parseFloat(num)
    }else{
        return 0
    }
}



