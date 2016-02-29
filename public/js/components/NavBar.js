/**
 * 页面左边菜单
 */

"use strict";

import React,{Component} from "react";
import classnames from "classnames";
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
        "name": "首页",
        "type": "link",
        "link": "/"
    },
    {
        "name": "存档",
        "type": "link",
        "link": "/archive"
    },
    {
        "name": "标签",
        "type": "link",
        "link": "/tags"
    },
    {
        "name": "发表",
        "type": "link",
        "link": "/post"
    },
    {
        "name": "注册",
        "type": "link",
        "link": "/register"
    },
    {
        "name": "登录",
        "type": "link",
        "link": "/login"
    },
    {
        "name": "关于",
        "type": "link",
        "link": "/about"
    },
    {
        "name": "友情链接",
        "type": "link",
        "link": "/links"
    }
];

class NavBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            curNav: "/"
        };
    }

    componentWillMount() {
        this.props.CheckLogin();
    }

    handleLogout() {
        this.props.logOut();
    }

    /**
     * 渲染菜单数组
     * @returns {Array}
     */
    renderMenuItem() {
        let pathname = location.pathname;
        if (this.props.isLogined) {
            return ([
                {
                    "name": "首页",
                    "type": "link",
                    "link": "/"
                },
                {
                    "name": "存档",
                    "type": "link",
                    "link": "/archive"
                },
                {
                    "name": "分类",
                    "type": "link",
                    "link": "/tags"
                },
                {
                    "name": "发表",
                    "type": "link",
                    "link": "/post"
                },
                {
                    "name": "用户中心",
                    "type": "link",
                    "link": "/userCenter"
                },
                {
                    "name": "登出",
                    "type": "event",
                    "event": "handleLogout"
                },
                {
                    "name": "友情链接",
                    "type": "link",
                    "link": "/links"
                }
            ]).map((item, index) => {
                    return item["type"] == "link" ? (
                        <li key={index} className={classnames({
                                        "cur-tab":(pathname == item["link"]) || (pathname.match(new RegExp('\^' + item["link"] + '\\b'),"g") !== null && pathname !== "/")
                })}><Link to={item["link"]}>{item["name"]}</Link></li>
                    ) : (
                        <li key={index}><Link to={"javascript:;"}
                                              onColck={this[item["event"]].bind(this)}>{item["name"]}</Link></li>
                    );
                });
        }
        return menuList.map((item, index) => {
            return item["type"] == "link" ? (
                <li key={index} className={classnames({
                                        "cur-tab":(pathname == item["link"]) || (pathname.match(new RegExp('\^' + item["link"] + '\\b'),"g") !== null && pathname !== "/")
                })}><Link to={item["link"]}>{item["name"]}</Link></li>
            ) : (
                <li key={index}><Link to={"javascript:;"}
                                      onColck={this[item["event"]].bind(this)}>{item["name"]}</Link></li>
            );
        });
    }

    /**
     * 渲染组件布局
     * @returns {XML}
     */
    render() {
        return (
            <div className="app_nav">
                <div className="nav_mask"></div>
                <div className="nav_body">
                    <div className="grid-row">
                        <ul className="nav">
                            <li><Link className="nav_logo" to="/"><i className="l-icon l-icon-layLogo"></i></Link></li>
                            {this.renderMenuItem()}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        isLogined: state.reducers.isLogined
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);

