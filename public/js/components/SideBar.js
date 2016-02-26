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
        "link": "/"
    },
    {
        "name": "Archive",
        "link": "/archive"
    },
    {
        "name": "Tags",
        "link": "/tags"
    },
    {
        "name":"Post",
        "link":"/post"
    },
    {
        "name": "Upload",
        "link": "/upload"
    },
    {
        "name": "User Center",
        "link": "/userCenter"
    },
    {
        "name": "Register",
        "link": "/register"
    },
    {
        "name": "Login",
        "link": "/login"
    },
    {
        "name": "Links",
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

    /**
     * 渲染菜单数组
     * @returns {Array}
     */
    renderMenuItem() {
        if (this.props.isLogined) {
            return ([
                {
                    "name": "Home",
                    "link": "/"
                },
                {
                    "name": "Archive",
                    "link": "/archive"
                },
                {
                    "name": "Tags",
                    "link": "/tags"
                },
                {
                    "name":"Post",
                    "link":"/post"
                },
                {
                    "name": "Upload",
                    "link": "/upload"
                },
                {
                    "name": "User Center",
                    "link": "/userCenter"
                },
                {
                    "name": "Logout",
                    "link": "/logout"
                },
                {
                    "name": "Links",
                    "link": "/links"
                }
            ]).map((item, index) => {
                    return (
                        <span key={index}><Link to={item["link"]}>{item["name"]}</Link></span>
                    );
                });
        }
        return menuList.map((item, index) => {
            return (
                <span key={index}><Link to={item["link"]}>{item["name"]}</Link></span>
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
