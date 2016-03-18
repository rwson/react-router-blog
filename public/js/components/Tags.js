/**
 * 标签
 */

"use strict";

import React,{Component} from "react";
import {Route,Link} from "react-router";
import Loading from "./Loading";
import {requestMethods,requestUrls} from "../networkAPI";

export default class Tags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            tags: []
        };
    }

    componentWillMount() {
        this.setState({
            isFetching: true
        });
        requestMethods.GetRequest({
            url: requestUrls.tags,
            success: (res) => {
                this.setState({
                    isFetching: false,
                    tags: res.tags
                });
            },
            error: (ex) => {
                alert("请求失败");
                this.setState({
                    isFetching: false
                });
                console.log(ex);
            }
        });
    }

    /**
     * 渲染标签链接
     * @param data  用来渲染的数据
     * @returns {XML}
     */
    renderTagsByData(data) {
        const keys = Object.keys(data["articles"]);
        return keys.map((item) => {
            let curData = data["articles"][item];
            return (
                <div key={item} className="archive box">
                    <h4 className="archive-title">
                        <Link className="link-unstyled" to={`/tags/${item}`}>{item}</Link>
                    </h4>
                    <ul className="archive-posts">
                        {curData.map((itemIn) => {
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
        });
    }

    /**
     * 组织数据渲染标签
     * @returns {XML}
     */
    renderTags() {
        const {tags} = this.state;
        let renderData = {
            "topTag": [],
            "articles": {}
        };
        if (tags.length) {
            tags.forEach((tag) => {
                tag.tags.forEach((item) => {
                    if (renderData["topTag"].indexOf(item) == -1) {
                        renderData["topTag"].push(item);
                    }
                    if (!renderData["articles"][item]) {
                        renderData["articles"][item] = [];
                        renderData["articles"][item].push(tag);
                    } else {
                        renderData["articles"][item].push(tag);
                    }
                });
            });
            return (
                <ul className="archive-list">
                    <section>
                        {renderData["topTag"].map((item) => {
                            return (
                                <Link className="category category--small category--primary"
                                      to={`/tags/${item}`}
                                      key={item}>
                                    {item}
                                </Link>
                            );
                        })}
                    </section>
                    <section className="boxes">
                        {this.renderTagsByData(renderData)}
                    </section>
                </ul>
            );
        }
    }

    /**
     * 组件的render
     * @returns {XML}
     */
    render() {
        const {isFetching} = this.state;
        let ele = <div id="main" data-behavior="1">
            <div id="tags-archives" className="main-content-wrap">
                {this.renderTags()}
            </div>
        </div>;
        if (isFetching) {
            ele = <Loading />;
        }
        return ele;
    }
}
