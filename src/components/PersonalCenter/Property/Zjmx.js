import React, { Component } from 'react'
import {
  Table
} from 'antd';
import { connect } from 'react-redux'

import moment from "moment";
import { moneyApi } from '../../../request'

const columns = [{
	title: '交易类型',
	dataIndex: 'tradeType',
	width: 163.3125,
	render: (text, row, index) => {
    // return(
    //   <span>
    //     {
    //       row.type
    //     }
    //     {row.tradeType===1?"充值":"提现"}
    //   </span>
    // )
		if (row.tradeType === 3) {
			return(
				<span>赠金充值</span>
			)
		}else{
			return(
        <span>
          {row.type}{row.tradeType===1?"充值":"提现"} {row.bankNo ===""?row.bankName:''}
        </span>
			)
		}
	  }
  }, {
	title: '金额',
	width: 163.3125,
	dataIndex: 'amount',
	render: val => <span>{val+"元"}</span>
  },{
	title: '手续费',
	width: 163.3125,
	dataIndex: 'sxf',
	render: val => <span>{val?val+"元":'0元'}</span>

  }, {
	title: '交易时间',
	dataIndex: 'createTime',
	width: 163.3125,
	render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
  }, {
	title: '交易状态',
	dataIndex: 'status',
	width: 163.3125,
	
  },
];
class Zjmx extends Component {
  constructor(props){
    super(props)
    this.state={
      data:[]
    }
  }
  initMarketTitle = () => {
    moneyApi
    .customerWithdrawRecord(1)
    .then(
        (res) => {
            this.setState({
              loading: false,
              data: res.data,
              });
        }
    )

}
  componentDidMount(){
    this.initMarketTitle()
  }
  render() {
    return (
      <div className="zjmx">
        <div className="infotitle">
          <p>资金明细</p>
        </div>
        <div>
        <Table
          columns={columns}
          rowKey={record => record.id}
          dataSource={this.state.data} 
        />
        </div>
      </div>
    )
  }
}
const mapStateToProps = (store) => (
  {
      userInfo: store.userInfo
  }
)
export default connect(mapStateToProps)(Zjmx)