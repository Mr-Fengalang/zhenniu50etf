import React, { Component } from 'react'

import { Flex } from 'antd-mobile'

import styles from './assets/index.module.scss'

class OutlinePayForm extends Component {
    constructor() {
        super(...arguments)
    }

    render(){
        const {companyBankInfo} = this.props
        return(
            <div className={styles.outLineForm}>
                <div className={styles.title}>
                    收款方账户
                </div>
                <Flex className={styles.outLineFormListItem}>
                    <span className={styles.label}>
                        收款人
                    </span>
                    {
                        companyBankInfo.companyOpeningName
                    }
                </Flex>
                <Flex className={styles.outLineFormListItem}>
                    <span  className={styles.label}>
                        收款人账户
                    </span>
                    {
                        companyBankInfo.companyBankNo
                    }
                </Flex>
                <Flex className={styles.outLineFormListItem}>
                    <span  className={styles.label}>
                        收款银行
                    </span>
                    {
                        companyBankInfo.companyBank
                    }
                </Flex>
                <p className={styles.describeText}>
                    注意: 官方收款账户，请仔细核对信息
                </p>
            </div>
        )
    }
}
export default OutlinePayForm