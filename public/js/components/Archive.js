/**
 * 分类
 */

"use strict";

import React,{Component} from "react";
import {Route,Link} from "react-router";

import Bottom from "./Bottom";
import Loading from "./Loading";
import {requestMethods,requestUrls} from "../networkAPI";

export default class Archive extends Component {

    /**
     * 构造器
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            archives: []
        };
    }

    /**
     * 组件即将被实例化完成,请求具体的目录
     */
    componentWillMount() {
        this.setState({
            isFetching: true
        });
        requestMethods.GetRequest({
            url: requestUrls.getArchives,
            success: (res) => {
                this.setState({
                    isFetching: false,
                    archives: res.archives
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
     * 渲染目录
     * @param data
     * @returns {XML}
     */
    renderArchivesByDate(data) {
        const keys = Object.keys(data);
        return keys.map((item) => {
            let curData = data[item];
            let curKeys = Object.keys(curData);
            return (
                <div className="archive archive-year box" key={item}>
                    <h4 className="archive-title">
                        <Link className="link-unstyled" to={`/archives/${item}`}>{item}</Link>
                    </h4>
                    {curKeys.map((key) => {
                        let curRend = curData[key];
                        return (
                            <ul className="archive-posts archive-month" key={key}>
                                <h5 className="archive-title">
                                    <Link className="link-unstyled" to={`/archives/${key}`}>{key}</Link>
                                </h5>
                                {curRend.map((rend) => {
                                    return (
                                        <li className="archive-post archive-day" key={rend["_id"]}>
                                            <Link className="archive-post-title"
                                                  to={`/article/detail/${rend["_id"]}`}>{rend["title"]}</Link>
                                            <span className="archive-post-date"> - {rend["day"]["day"]}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        );
                    })}
                </div>
            );
        });
    }

    /**
     * 组织数据,并且调用渲染分类的相关方法
     * @returns {XML}
     */
    renderArchives() {
        const {archives} = this.state;
        let renderData = {};
        if (archives.length) {
            archives.forEach((item) => {
                let year = item["day"]["year"];
                let yearMonth = item["day"]["year-month"];
                if (!renderData[year]) {
                    renderData[year] = {};
                    if (!renderData[year][yearMonth]) {
                        renderData[year][yearMonth] = [];
                        renderData[year][yearMonth].push(item);
                    } else {
                        renderData[year][yearMonth].push(item);
                    }
                } else {
                    if (!renderData[year][yearMonth]) {
                        renderData[year][yearMonth] = [];
                        renderData[year][yearMonth].push(item);
                    } else {
                        renderData[year][yearMonth].push(item);
                    }
                }
            });
            return (
                <section className="boxes">
                    {this.renderArchivesByDate(renderData)}
                </section>
            );
        }
    }

    /**
     * 渲染组件布局
     * @returns {XML}
     */
    render() {
        const {isFetching} = this.state;
        let ele = (
            <div id="main" data-behavior="1">
            <div id="archives" className="main-content-wrap">
                {this.renderArchives()}
            </div>
        </div>);
        if(isFetching){
            ele = <Loading />;
        }
        return ele;
    }
}

