/**
 * 标签
 */

"use strict";

import React,{Component} from "react";
import {Route,Link} from "react-router";
import {requestMethods,requestUrls} from "../networkAPI";

export default class Tags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: []
        };
    }

    componentWillMount() {
        requestMethods.GetRequest({
            url: requestUrls.tags,
            success: (res) => {
                this.setState({
                    tags: res.tags
                });
            },
            error: (ex) => {
                alert("请求失败");
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
                <div id="posts-list-Web产品思考" key={item} className="archive box">
                    <h4 className="archive-title">
                        <Link className="link-unstyled" to={`/categories/${item}`}>{item}</Link>
                    </h4>
                    <ul className="archive-posts">
                        {curData.map((itemIn) => {
                            return (
                                <li className="archive-post" key={itemIn["_id"]}>
                                    <Link className="archive-post-title" to={"/article/detail/" + itemIn["_id"]}>{itemIn["title"]}</Link>
                                    <span className="archive-post-date">{itemIn["day"]["day"]}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            );
        });
    }

    renderTags() {
        const {tags} = this.state;
        let renderData = {
            "topTag": [],
            "articles": {}
        };
        if (tags.length) {
            tags.forEach((tag) => {
                tag.tags.forEach((item) => {
                    if(renderData["topTag"].indexOf(item) == -1){
                        renderData["topTag"].push(item);
                    }
                    if(!renderData["articles"][item]){
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
                                      to={`/categories/${item}`}
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

    render() {
        return (
            <div id="main" data-behavior="1">
                <div id="tags-archives" className="main-content-wrap">
                    {this.renderTags()}
                </div>
            </div>
        );
    }
}
