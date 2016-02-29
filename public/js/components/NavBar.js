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

class NavBar extends Component {

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
                        <li key={index}><Link to={item["link"]}>{item["name"]}</Link></li>
                    ) : (
                        <li key={index}><Link to={"javascript:;"} onColck={this[item["event"]].bind(this)} >{item["name"]}</Link></li>
                    );
                });
        }
        return menuList.map((item, index) => {
            return item["type"] == "link" ? (
                <li key={index}><Link to={item["link"]}>{item["name"]}</Link></li>
            ) : (
                <li key={index}><Link to={"javascript:;"} onColck={this[item["event"]].bind(this)} >{item["name"]}</Link></li>
            );
        });
    }

    /**
     * 渲染组件布局
     * @returns {XML}
     */
    render() {
        return (
            <div className="navbar navbar-inverse navbar-fixed-top">
                <div className="container">
                    <div className="navbar-collapse collapse" role="navigation">
                        <ul className="nav navbar-nav">
                            {this.renderMenuItem()}
                        </ul>
                        <ul className="nav navbar-nav navbar-right hidden-sm">
                            <li><Link to={"/search"}>Search</Link></li>
                        </ul>
                    </div>
                </div>
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

export default connect(mapStateToProps,mapDispatchToProps)(NavBar);

