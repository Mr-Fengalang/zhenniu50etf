import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import NavigationBar from './components/navigation/NavigationBar';
import './app.css'
import {createStore,applyMiddleware,combineReducers} from 'redux'
import {Provider} from 'react-redux'
import { reducer as userReducer } from './stores/userInfo'
import { reducer as wsReducer } from './stores/wsServer/'
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import {withRouter} from 'react-router'
import './axiosExtend'
import { HashRouter as Router } from 'react-router-dom';
import routes from './routes';
import './constants'

const reducer = combineReducers(
    {
        userInfo: userReducer,
        wsInfo: wsReducer
    }
)
const WithRouterNavigationBar = withRouter(NavigationBar)
const store = createStore(
    reducer,
    composeWithDevTools(
        applyMiddleware(thunk)
      )
)
ReactDOM.render(
    <Provider store ={store}>
        <Router routes={ routes }>
        <LocaleProvider locale={zhCN}>
            <div style={{height:"100%"}}>
                <WithRouterNavigationBar  />
                { routes }
            </div>  
            </LocaleProvider>
        </Router>
    </Provider>, 
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
