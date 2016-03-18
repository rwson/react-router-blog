/**
 * 文章详情
 */

"use strict";

import React,{Component} from "react";
import {Route,Link} from "react-router";

import Bottom from "./Bottom";
import Loading from "./Loading";
import {requestMethods,requestUrls} from "../networkAPI";

export default class Detail extends Component {

    /**
     * 构造器
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            "fetching": false,
            "detail": {}
        };
    }

    /**
     * 组件即将被实例化完成
     */
    componentDidMount() {
        this.setState({
            "fetching":true
        });
        this.fetchDetail();
    }

    /**
     * 查询文章详情
     */
    fetchDetail() {
        const {id} = this.props.params;
        requestMethods.GetRequest({
            url: `${requestUrls.articleDetail}/${id}`,
            success: (res) => {
                this.setState({
                    "fetching": false,
                    "detail": res.detail
                });
            },
            error: (ex) => {
                alert("请求失败");
                console.log(ex);
            }
        });
    }

    /**
     * 渲染标签
     * @param tags  标签数组
     * @returns {XML}
     */
    rendTags(tags) {
        return (
            <div className="post-footer-tags">
                <span className="text-color-light text-small">标签</span><br/>
                {tags.map((tag) => {
                    return (
                        <Link className="tag tag--primary tag--small t-link" key={tag} to={`/tag/${tag}`}>{tag}</Link>
                    );
                })}
            </div>
        );
    }

    /**
     * 渲染文章正文及标题
     * @param detail    文章对象
     * @returns {*}
     */
    renderDetail(detail) {
        if (Object.keys(detail).length) {
            return (
                <div id="main" data-behavior="1">
                    <article className="post" itemScope="" itemType="http://schema.org/BlogPosting">
                        <div className="post-header main-content-wrap">
                            <h1 className="post-title" itemProp="headline">{detail["title"]}</h1>

                            <div className="post-meta">
                                <time itemProp="datePublished" content={detail["day"]["day"]}>
                                    {detail["day"]["day"]}
                                </time>
                            </div>
                        </div>
                        <div className="post-content markdown main-content-wrap" itemProp="articleBody"
                             dangerouslySetInnerHTML={{"__html": detail["post"]}}>
                        </div>
                        <div className="post-footer main-content-wrap">
                            {this.rendTags(detail.tags)}
                        </div>
                    </article>
                    <Bottom />
                </div>
            );
        }
    }

    /**
     * 渲染组件布局
     * @returns {XML}
     */
    render() {
        const {fetching,detail} = this.state;
        let ele = <Loading />;
        if(!fetching){
            ele = this.renderDetail(detail);
        }
        return (
            <div className="container">
                {ele}
            </div>
        );
    }
}
