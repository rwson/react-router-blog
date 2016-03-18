/**
 * 路由配置
 */

"use strict";

import React,{Component} from "react";
import {Route,Link,IndexRoute} from "react-router";
import {connect} from "react-redux";
import {createStore,bindActionCreators} from "redux";
import {routeActions} from "react-router-redux";

import {
    Main,
    Detail,
    NavBar,
    Archive,
    ArchiveDetail,
    Tags,
    Tag,
    Category,
    NotFound
} from "./components";

import Loading from "./components/Loading";

//  引入组件

/**
 * App容器
 */

class App extends Component {

    /**
     * 构造器
     * @param props
     */
    constructor(props) {
        super(props);
    }

    /**
     * 渲染组件布局
     * @returns {XML}
     */
    render() {
        const {routes} = this.props;
        const curRouter = routes[routes.length - 1];
        const props = {
            curRouter: curRouter
        };
        return (
            <div className="body_container">
                <NavBar/>
                {this.props.content}
            </div>
        );
    }
}

/**
 * 路由配置
 * @returns {XML}
 */
export default function getRoutes() {
    return (
        <Route path="/" component={App}>
            <IndexRoute components={{content: Main}}/>
            <Route path="article/detail/:id" components={{content: Detail}}/>
            <Route path="all-archives" components={{content: Archive}}/>
            <Route path="archives/:archive" components={{content: ArchiveDetail}}/>
            <Route path="tags" components={{content: Tags}}/>
            <Route path="tags/:tag" components={{content: Tag}}/>
            <Route path="category" components={{content: Category}}/>
            <Route path="*" components={{content: NotFound}}/>
        </Route>
    );
}
