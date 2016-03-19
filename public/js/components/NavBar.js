/**
 * 页面左边菜单
 */

"use strict";

import React,{Component,PropTypes} from "react";
import classnames from "classnames";
import {bindActionCreators} from "redux";
import {Route,Link} from "react-router";
import {connect} from "react-redux";
import * as Actions from "../actions";

export default class NavBar extends Component {

    constructor(props) {
        super(props);
    }

    showSideBar() {
        alert(11);
    }

    /**
     * 渲染组件布局
     * @returns {XML}
     */
    render() {
        return (
            <div>
                <header id="header" data-behavior="1">
                    <i id="btn-open-sidebar" onClick={this.showSideBar.bind(this)} className="fa fa-lg fa-bars"></i>
                    <h1 className="header-title">
                        <Link className="header-title-link" to="/">小宋</Link>
                    </h1>
                    <Link className="header-right-picture" to="/">
                        <img className="header-picture" src="/image/logo.png"/>
                    </Link>
                </header>
                <nav id="sidebar" data-behavior="1">
                    <div className="sidebar-profile">
                        <Link to="/">
                            <img className="sidebar-profile-picture" src="/image/logo.png"/>
                        </Link>
                        <span className="sidebar-profile-name">小宋</span>
                    </div>
                    <ul className="sidebar-buttons">
                        <li className="sidebar-button">
                            <Link className="sidebar-button-link " to="/">
                                <i className="sidebar-button-icon fa fa-lg fa-home"></i>
                                <span className="sidebar-button-desc">首页</span>
                            </Link>
                        </li>
                        <li className="sidebar-button">
                            <Link className="sidebar-button-link " to="/category">
                                <i className="sidebar-button-icon fa fa-lg fa-bookmark"></i>
                                <span className="sidebar-button-desc">专题</span>
                            </Link>
                        </li>
                        <li className="sidebar-button">
                            <Link className="sidebar-button-link " to="/tags">
                                <i className="sidebar-button-icon fa fa-lg fa-tags"></i>
                                <span className="sidebar-button-desc">标签</span>
                            </Link>
                        </li>
                        <li className="sidebar-button">
                            <Link className="sidebar-button-link " to="/all-archives">
                                <i className="sidebar-button-icon fa fa-lg fa-archive"></i>
                                <span className="sidebar-button-desc">归档</span>
                            </Link>
                        </li>
                    </ul>
                    <ul className="sidebar-buttons">
                        <li className="sidebar-button">
                            <Link className="sidebar-button-link " to="https://github.com/rwson" target="_blank">
                                <i className="sidebar-button-icon fa fa-lg fa-github"></i>
                                <span className="sidebar-button-desc">GitHub</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }
}