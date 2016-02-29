/**
 * 分类
 */

"use strict";

import React,{Component} from "react";
import {Route,Link} from "react-router";
import {requestMethods,requestUrls} from "../networkAPI";

export default class Archive extends Component {

    /**
     * 构造器
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            archives: []
        };
    }

    /**
     * 组件即将被实例化完成,请求具体的目录
     */
    componentWillMount() {
        requestMethods.GetRequest({
            url: requestUrls.getArchives,
            success: (res) => {
                this.setState({
                    archives: res.archives
                });
            },
            error: (ex) => {
                alert("请求失败");
                console.log(ex);
            }
        });
    }

    /**
     * 渲染目录
     * @param data
     * @returns {XML}
     */
    renderArchivesByDate(data){
        for(let item in data){
            let curData = data[item];
            return (
                <li key={item}>
                    <h1 className="public-date">{item}</h1>
                    {curData.map((item) => {
                        return (
                            <p key={item["_id"]}>
                                <Link
                                    to={"/u/" + item["name"] + "/" + item["time"]["day"] + "/" + item["title"]}>{item["title"] + " - " + item["name"]}</Link>
                            </p>
                        );
                    })}
                </li>
            );
        }
    }

    /**
     * 组织数据,并且调用渲染分类的相关方法
     * @returns {XML}
     */
    renderArchives() {
        const {archives} = this.state;
        let renderData = {};
        archives.forEach((item) => {
            let date = item["time"]["date"].substr(0,10);
            if (!renderData[date]) {
                renderData[date] = [];
            }
            renderData[date].push(item);
        });
        if (archives.length) {
            return (
            <div className="panel panel-default">
                <div className="panel-heading">Panel heading without title</div>
                <div className="panel-body">
                    Panel content
                </div>
                {this.renderArchivesByDate(renderData)}
            </div>
            );
        }
    }

    /**
     * 渲染组件布局
     * @returns {XML}
     */
    render() {
        const {archives} = this.state;
        return (
            <div>
                {this.renderArchives()}
            </div>
        );
    }
}
