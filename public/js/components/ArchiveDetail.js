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
            isFetching: false,
            articles: []
        };
    }

    /**
     * 在组件即将被实例化完成
     */
    componentWillMount() {
        this.setState({
            isFetching: true
        });
        const {archive} = this.props.params;
        requestMethods.GetRequest({
            "url": `${requestUrls.ArchiveDetail}/${archive}`,
            "success": (res) => {
                this.setState({
                    isFetching: false,
                    articles: res.articles
                });
            },
            "error": ((ex) => {
                alert("请求失败");
                this.setState({
                    isFetching: false
                });
            })
        });
    }

    /**
     * 渲染文章列表
     * @returns {XML}
     */
    rendList() {
        const {articles} = this.state;
        const {archive} = this.props.params;
        return (
            <div className="archive box">
                <h4 className="archive-title">
                    <Link className="link-unstyled" to={`/archives/${archive}`}>{archive}</Link>
                </h4>
                <ul className="archive-posts">
                    {articles.map((itemIn) => {
                        return (
                            <li className="archive-post" key={itemIn["_id"]}>
                                <Link className="archive-post-title"
                                      to={"/article/detail/" + itemIn["_id"]}>{itemIn["title"]}</Link>
                                <span className="archive-post-date">{itemIn["day"]["day"]}</span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }

    /**
     * 渲染组件布局
     * @returns {XML}
     */
    render() {
        const {isFetching} = this.state;
        let ele = (
            <div id="main" data-behavior="1">
                <div id="categories-archives" className="main-content-wrap">
                    {this.rendList()}
                </div>
                <Bottom />
            </div>
        );
        if (isFetching) {
            ele = <Loading />;
        }
        return ele;
    }
}
