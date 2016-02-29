/**
 * 文章详情
 */

"use strict";

import React,{Component} from "react";
import {Route,Link} from "react-router";
import {requestMethods,requestUrls} from "../networkAPI";

export default class Detail extends Component {

    /**
     * 构造器
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            "detail": {}
        };
    }

    /**
     * 组件即将被实例化完成
     */
    componentDidMount() {
        this.fetchDetail();
    }

    /**
     * 查询文章详情
     */
    fetchDetail() {
        const {name,day,title} = this.props.params;
        requestMethods.GetRequest({
            url: `${requestUrls.articleDetail}/${name}/${day}/${title}`,
            success: (res) => {
                this.setState({
                    detail: res.detail
                });
            },
            error: (ex) => {
                alert("请求失败");
                console.log(ex);
            }
        });
    }

    /**
     * 选择文章的详细信息
     * @param detail    详细信息对象
     * @returns {XML}
     */
    renderBottomInfo(detail) {
        if (Object.keys(detail).length > 1) {
            return (
                <div className="bottom-info">
                    <div className="author-info">
                        <p>发布人:{detail["name"]}</p>

                        <p>发布时间:{detail["time"]["day"]}</p>
                    </div>
                </div>
            );
        }
    }

    /**
     * 渲染评论列表
     * @param comments  评论对象数组
     * @returns {XML}
     */
    renderComments(comments) {
        let elements;
        if (comments && !comments.length) {
            elements = (
                <p className="no-comment-tips">本文暂无评论,快来做第一个评论的人吧!</p>
            );
        } else {
            elements = (
                <p className="no-comment-tips">本文暂无评论,快来做第一个评论的人吧!</p>
            );
        }
        return elements;
    }

    /**
     * 渲染文章正文及标题
     * @param detail    文章对象
     * @returns {*}
     */
    renderDetail(detail) {
        let element;
        if (Object.keys(detail).length == 1) {
            element = (
                <div className="not-exits">
                    <h1>文章不存在!</h1>
                </div>
            );
        } else {
            element = (
                <div className="article-detail">
                    <h1 className="atricle-title">{detail["title"]}</h1>
                    <p className="article-content">{detail["post"] || "暂无内容"}</p>
                </div>
            );
        }
        return element;
    }

    /**
     * 渲染组件布局
     * @returns {XML}
     */
    render() {
        const {detail} = this.state;
        return (
            <div>
                {this.renderDetail(detail)}
                {this.renderBottomInfo(detail)}
                {this.renderComments(detail.comments)}
            </div>
        );
    }
}
