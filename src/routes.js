import React from 'react';

import { Route } from 'react-router-dom';

import App from './components/home/App';

import SignupPage from './components/signup/SignupPage';
import PersonalCenter from './components/PersonalCenter/PersonalCenter'
// import LoginPage from './components/login/LoginPage';
// import NewEventPage from './components/events/NewEventPage';

// import requireAuth from './utils/requireAuth';
export default (
  <div className="clearfloat  boxcontenner " style={{height:document.body.clientHeight-60}}>
    <Route exact path="/" component={ App } />
    <Route path="/signup" component={ SignupPage } />
    <Route path="/personalcenter" component={ PersonalCenter } />
    {/* <Route path="/login" component={ LoginPage } /> */}
    {/* <Route path="/new-event" component={ requireAuth(NewEventPage) } /> */}
  </div>
)


