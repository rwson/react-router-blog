/**
 * 页面左边菜单
 */

"use strict";

import React,{Component} from "react";
import {bindActionCreators} from "redux";
import {Route,Link} from "react-router";
import {connect} from "react-redux";
import * as Actions from "../actions";

/**
 * 菜单项配置
 * @type {*[]}
 */
let menuList = [
    {
        "name": "Home",
        "type":"link",
        "link": "/"
    },
    {
        "name": "Archive",
        "type":"link",
        "link": "/archive"
    },
    {
        "name": "Tags",
        "type":"link",
        "link": "/tags"
    },
    {
        "name":"Post",
        "type":"link",
        "link":"/post"
    },
    {
        "name": "Register",
        "type":"link",
        "link": "/register"
    },
    {
        "name": "Login",
        "type":"link",
        "link": "/login"
    },
    {
        "name": "Links",
        "type":"link",
        "link": "/links"
    }
];

class SideBar extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        this.props.CheckLogin();
    }

    handleLogout(){
        this.props.logOut();
    }

    /**
     * 渲染菜单数组
     * @returns {Array}
     */
    renderMenuItem() {
        if (this.props.isLogined) {
            return ([
                {
                    "name": "Home",
                    "type":"link",
                    "link": "/"
                },
                {
                    "name": "Archive",
                    "type":"link",
                    "link": "/archive"
                },
                {
                    "name": "Tags",
                    "type":"link",
                    "link": "/tags"
                },
                {
                    "name":"Post",
                    "type":"link",
                    "link":"/post"
                },
                {
                    "name": "User Center",
                    "type":"link",
                    "link": "/userCenter"
                },
                {
                    "name": "Logout",
                    "type":"event",
                    "event":"handleLogout",
                    "link": "/logout"
                },
                {
                    "name": "Links",
                    "type":"link",
                    "link": "/links"
                }
            ]).map((item, index) => {
                    return item["type"] == "link" ? (
                        <span key={index}><Link to={item["link"]}>{item["name"]}</Link></span>
                    ) : (
                        <span key={index} onClick={this[item["event"]].bind(this)}>{item["name"]}</span>
                    );
                });
        }
        return menuList.map((item, index) => {
            return item["type"] == "link" ? (
                <span key={index}><Link to={item["link"]}>{item["name"]}</Link></span>
            ) : (
                <span key={index} onClick={this[item["event"]].bind(this)}>{item["name"]}</span>
            );
        });
    }

    /**
     * 渲染组件布局
     * @returns {XML}
     */
    render() {
        return (
            <div>
                <nav>
                    {this.renderMenuItem()}
                    <div>
                        <h3>搜索</h3>

                        <form action="/search">
                            <input type="text" maxLength="10" name="keyword" placeholder="请输入搜索内容"/>
                            <input type="submit" value="搜索"/>
                        </form>
                    </div>
                </nav>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        isLogined:state.reducers.isLogined
    };
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(Actions,dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(SideBar);
