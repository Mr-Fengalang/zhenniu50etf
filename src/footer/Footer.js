import React, { Component } from 'react';
class Footer extends Component {
  render() {
    return (
        <React.Fragment>
            <div className="footer">
                <div className="contenner ">
                    <ul className="clearfloat">
                        <li className="lfet"><p>Copyright &nbsp; ©&nbsp; 2018 {global.constants.tdmc }    &nbsp;   {global.constants.icp }    &nbsp;     入市有风险 投资需谨慎</p></li>
                        {/* <li className="lfet"><p>入市有风险 投资需谨慎</p></li> */}
                        <li className="right"><a rel="noopener noreferrer" href="http://www.miitbeian.gov.cn/publish/query/indexFirst.action" target="_blank">工信部</a></li>
                    </ul>
                </div>
            </div>
        </React.Fragment>
    );
  }
}

export default Footer;
