/**
 * 程序主文件
 */

"use strict";

import React, {Component} from "react";
import ReactDOM from "react-dom";
import {createStore,combineReducers,compose,applyMiddleware} from "redux";
import {Provider} from "react-redux";
import {Router, Route} from "react-router";
import thunk from "redux-thunk";
import createBrowserHistory from "history/lib/createBrowserHistory";

import {routerReducer,routerMiddleware} from "react-router-redux";

import reducers from "./reducers";
import getRoutes from "./router";

import "../css/style.css";
import "../css/Draft.css";

const reducer = combineReducers({
    reducers,
    routing: routerReducer
});

const store = createStore(
    reducer,
    applyMiddleware(thunk)
);

const history = createBrowserHistory();

ReactDOM.render(
    <div>
        <Provider store={store}>
            <Router history={history} routes={getRoutes()}/>
        </Provider>
    </div>,
    document.getElementById("app")
);
