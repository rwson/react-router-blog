/**
 * 文章详情
 */

"use strict";

import React,{Component} from "react";
import {Route,Link} from "react-router";
import {requestMethods,requestUrls} from "../networkAPI";

export default class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "detail": {}
        };
    }

    componentDidMount() {
        this.fetchDetail();
    }

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

    renderBottomInfo(detail) {
        if (Object.keys(detail).length > 1) {
            return (
                <div className="bottom-info">
                    <div className="author-info">
                        <p>发布人:{detail["name"]}</p>
                        <p>发布时间:{detail["time"]["day"]}</p>
                    </div>
                    <div className="article-info"></div>
                </div>
            );
        }
    }

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
            </div>
        );
    }
}
