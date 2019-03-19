import React, { Component } from 'react'

import styles from './assets/index.module.scss'

import select from './assets/select.png'
import noSelect from './assets/noSelect.png'

class OnlinePayForm extends Component {
    constructor() {
        super(...arguments)
    }

    // bankInfoId	是	string	银行卡id
    // customerId	是	string	客户id
    // rechargeAmount	是	string	充值金额
    // accountId	是	string	衫德 易贝 等 支付三方的id
    // accountName	是	string	衫德 易贝 等 支付三方的名字
    // payMethod

    render(){
        const { channel, changeChannel, selectChannel, rechargeAmount, changeAmount } = this.props
        return(
           <React.Fragment>
                <div className={styles.rechargeAmount}>
                    <div className={styles.title}>
                        充值金额
                    </div>
                    <div className={styles.inputContainer}>
                        <input placeholder="请输入充值金额" value={rechargeAmount} type="number" onChange={changeAmount} />
                        <span className={styles.label}>¥</span>
                        <span className={styles.label} style={{left: 'auto', right: 0}}>元</span>
                    </div>
                </div>
                <div className={styles.payTypeSelect}>
                    <div className={styles.title}>
                        <span className="bordSide"></span>充值方式
                    </div>
                    {
                        channel.map(
                            (item) => {
                                return(
                                    <div className={[styles.payTypeSelectItem, selectChannel.id === item.id ? styles.active: '' ].join(' ')} key={item.id} onClick={() => changeChannel(item)} >
                                        <img src={item.logo_src} alt="logo"/>
                                        {item.name}
                                        <img src={selectChannel.id === item.id ? select : noSelect} alt="select" className={styles.selectIcon} />
                                    </div>
                                )
                            }
                        )
                    }
                </div>
           </React.Fragment>
        )
    }
}
export default OnlinePayForm