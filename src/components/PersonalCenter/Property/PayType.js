import React from 'react'

import { Flex } from 'antd-mobile'

import styles from './assets/index.module.scss'

import select from './assets/select.png'
import noSelect from './assets/noSelect.png'

export default ({payType, selectType, changeSelectType}) => {
    return(
        <div className={styles.payType}>
            <div className={styles.title}>
                <span className="bordSide"></span>
                充值类型
            </div>
            <Flex className={styles.typeSelect} >
                {
                    payType.map(
                        (item) => (
                            <Flex.Item key={item.payType} onClick={() => changeSelectType(item.payType)}>
                                {
                                    selectType === item.payType
                                    ?
                                    <img src={select} alt="选择框"/>
                                    :
                                    <img src={noSelect} alt="选择框"/>
                                }
                                 {item.payTypeDescribe}
                            </Flex.Item>
                        )
                    )
                }
            </Flex>
        </div>
    )
}