import React, { Component } from 'react'
import Infoleft from './Infoleft'
import inforouter from './inforoutes'
import './assets/css.css'

import { withRouter } from 'react-router-dom'

class PersonalCenter extends Component {
  render() {
    return (
     <React.Fragment>
         <Infoleft/>
         <div className="e31 clearfloat">
            {
              inforouter
            }
         </div>
         
     </React.Fragment>
    )
  }
}
export default withRouter(PersonalCenter)