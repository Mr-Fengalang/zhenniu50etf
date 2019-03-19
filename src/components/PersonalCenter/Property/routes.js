import React from 'react';

import { Route } from 'react-router-dom';

import Zjmx from './Zjmx';
import Cz from './Cz';
import Tx from './Tx';

export default (
  <div className="">
    <Route path="/personalcenter/property/zjmx" component={ Zjmx } />
    <Route path="/personalcenter/property/cz" component={ Cz } />
    <Route path="/personalcenter/property/tx" component={ Tx } />
  </div>
)
