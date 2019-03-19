import React from 'react';

import { Route } from 'react-router-dom';
import Market from './Market'
import Order from './Order'
import Property from './Property'
import Message from './Message'
import Pcenter from './Pcenter'
export default (
  
  <div className="left w9525">
    <Route path="/personalcenter/market" component={ Market } />
    <Route path="/personalcenter/order" component={ Order } />
    <Route path="/personalcenter/property" component={ Property } />
    <Route path="/personalcenter/message" component={ Message } />
    <Route path="/personalcenter/pcenter" component={ Pcenter } />
  </div>
)