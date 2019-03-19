import React from 'react';

import { Route } from 'react-router-dom';

import Pcenter from './Pcenter';
import Authentication from './Authentication';
import Bankinfo from './Bankinfo';

export default (
  <div className="left pcenterbox" style={{height:document.body.clientHeight -60}} >
    <Route path="/personalcenter/pcenter/index/:name" component={ Pcenter } />
    <Route path="/personalcenter/pcenter/index" exact component={ Pcenter } />
    <Route path="/personalcenter/pcenter/authentication/:name" component={ Authentication } />
    <Route path="/personalcenter/pcenter/bankinfo/:name" component={ Bankinfo } />
    <Route path="/personalcenter/pcenter/bankinfo" exact  component={ Bankinfo } />
  </div>
)
