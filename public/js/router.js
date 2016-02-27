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
    Post,
    SideBar,
    Archive,
    Tags,
    Tag,
    Upload,
    Login,
    Register,
    UserCenter,
    Links,
    NotFound
} from "./components";

//  引入组件

/**
 * App容器
 */

class App extends Component {

    constructor(props) {
        super(props);
    }

    /**
     * 渲染组件布局
     * @returns {XML}
     */
    render() {
        return (
            <div>
                <SideBar />
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
            <Route path="/u/:name/:day/:title" components={{content: Detail}}/>
            <Route path="archive" components={{content: Archive}}/>
            <Route path="tags" components={{content: Tags}}/>
            <Route path="tag/:tag" components={{content: Tag}}/>
            <Route path="archive" components={{content: Archive}}/>
            <Route path="upload" components={{content: Upload}}/>
            <Route path="post" components={{content: Post}}/>
            <Route path="userCenter" components={{content: UserCenter}}/>
            <Route path="register" components={{content: Register}}/>
            <Route path="login" components={{content: Login}}/>
            <Route path="links" components={{content: Links}}/>
            <Route path="*" components={{content: NotFound}}/>
        </Route>
    );
}
