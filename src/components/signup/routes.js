import React from 'react';

import { Route } from 'react-router-dom';

import SignuForm from './SignuForm';
import RegistForm from './RegistForm';
import RetrieveAccount from './RetrieveAccount';
import lostPassword from './lostPassword';

export default (
  <div className="">
    <Route path="/signup/signuform" component={ SignuForm } />
    <Route path="/signup/registform" component={ RegistForm } />
    <Route path="/signup/retrieveAccount" component={ RetrieveAccount } />
    <Route path="/signup/lostPassword" component={ lostPassword } />
  </div>
)
