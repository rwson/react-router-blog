/**
 * 具体的archive
 */

"use strict";

import React,{Component} from "react";
import {Route,Link} from "react-router";

import Bottom from "./Bottom";
import Loading from "./Loading";
import {requestMethods,requestUrls} from "../networkAPI";

export default class ArchiveDetail extends Component {

    /**
     * 构造器
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            isFetching:false,
            articles:[]
        };
    }

    /**
     * 在组件即将被实例化完成
     */
    componentWillMount() {
        this.setState({
            isFetching:true
        });
        const {archive} = this.props.params;
        requestMethods.GetRequest({
            "url":`${requestUrls.ArchiveDetail}/${archive}`,
            "success":(res) => {
                this.setState({
                    isFetching:false,
                    articles:res.articles
                });
            },
            "error":((ex) => {
                alert("请求失败");
                this.setState({
                    isFetching:false
                });
            })
        });
    }

    /**
     * 渲染组件布局
     * @returns {XML}
     */
    render() {
        return (
            <div id="main" data-behavior="1">
                <div id="categories-archives" className="main-content-wrap">

                </div>
                <Bottom />
            </div>
        );
    }
}
