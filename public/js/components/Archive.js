/**
 * 分类
 */

"use strict";

import React,{Component} from "react";
import {Route,Link} from "react-router";
import {requestMethods,requestUrls} from "../networkAPI";

export default class Archive extends Component {

    constructor(props) {
        super(props);
        this.state = {
            archives: []
        };
    }

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
                <ul>
                    {this.renderArchivesByDate(renderData)}
                </ul>
            );
        }
    }

    render() {
        const {archives} = this.state;
        return (
            <div>
                {this.renderArchives()}
            </div>
        );
    }
}
