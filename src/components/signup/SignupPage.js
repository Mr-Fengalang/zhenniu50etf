import React, { Component } from 'react'
import img1 from './assets/Asset14.png'

import './assets/css.css'

import routes from './routes'
class SignupPage extends Component {

  render() {
    return (
      <div>
        <div className="container">
        <div className="loginnwe clearfix">
          <div className="left logimgbox">
            <img src={img1} alt=""/>
          </div>
          {
            routes 
          }
        </div>
      </div>
      </div>
    )
  }
}
export default SignupPage