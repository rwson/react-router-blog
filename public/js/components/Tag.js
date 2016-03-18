/**
 * 某个具体的标签
 */

"use strict";

import React,{Component} from "react";
import {Route,Link} from "react-router";
import Loading from "./Loading";
import {requestMethods,requestUrls} from "../networkAPI";

export default class tag extends Component {

    /**
     * 构造器
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            article: []
        };
    }

    /**
     * 组件即将被实例化完成
     */
    componentWillMount() {
        const {tag} = this.props.params;
        this.setState({
            isFetching: true
        });
        requestMethods.GetRequest({
            url: `${requestUrls.tag}/${tag}`,
            success: (res) => {
                this.setState({
                    isFetching: false,
                    article: res.article
                });
            },
            error: (ex) => {
                this.setState({
                    isFetching: false
                });
                console.log(ex);
            }
        });
    }

    /**
     * 渲染文章列表
     * @returns {XML}
     */
    renderList(){
        const {tag} = this.props.params;
        const {article} = this.state;
        return (
            <div className="archive box">
                <h4 className="archive-title">
                    <Link className="link-unstyled" to={`/tags/${tag}`}>{tag}</Link>
                </h4>
                <ul className="archive-posts">
                    {article.map((itemIn) => {
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
                <div id="tags-archives" className="main-content-wrap">
                    {this.renderList()}
                </div>
            </div>
        );
        if (isFetching) {
            ele = <Loading />;
        }
        return ele;
    }
}
