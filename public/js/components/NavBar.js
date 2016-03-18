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
        this.state = {
            curNav: "/"
        };
    }
    /**
     * 渲染组件布局
     * @returns {XML}
     */
    render() {
        return (
            <div>
                <header id="header" data-behavior="1">
                    <i id="btn-open-sidebar" className="fa fa-lg fa-bars"></i>
                    <h1 className="header-title">
                        <Link className="header-title-link" to="/">小宋</Link>
                    </h1>
                    <Link className="header-right-picture" to="javascript:;">
                        <img className="header-picture" src="images/logo.png" />
                    </Link>
                </header>
                <nav id="sidebar" data-behavior="1">
                    <div className="sidebar-profile">
                        <Link to="/">
                            <img className="sidebar-profile-picture" src="/images/logo.png" />
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

                        <li className="sidebar-button">
                            <Link className="sidebar-button-link st-search-show-outputs" to="http://www.maxzhang.com/#search">
                                <i className="sidebar-button-icon fa fa-lg fa-search"></i>
                                <span className="sidebar-button-desc">搜索</span>
                            </Link>
                        </li>

                        <li className="sidebar-button">
                            <Link className="sidebar-button-link " to="http://www.maxzhang.com/#about">
                                <i className="sidebar-button-icon fa fa-lg fa-question"></i>
                                <span className="sidebar-button-desc">关于我</span>
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
