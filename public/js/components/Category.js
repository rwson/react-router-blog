/**
 * 归档
 */

"use strict";

import React,{Component} from "react";
import {Route,Link} from "react-router";
import Bottom from "./Bottom";
import Loading from "./Loading";
import {requestMethods,requestUrls} from "../networkAPI";

export default class Category extends Component {

    /**
     * 构造器
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            fetching: false,
            category: []
        };
    }

    /**
     * 组件即将被实例化完成,请求具体的目录
     */
    componentWillMount() {
        this.setState({
            fetching: true
        });
        requestMethods.GetRequest({
            url: requestUrls.getCategory,
            success: (res) => {
                this.setState({
                    category: res.category,
                    fetching: false
                });
            },
            error: (ex) => {
                alert("请求失败");
                this.setState({
                    fetching: false
                });
                console.log(ex);
            }
        });
    }

    /**
     * 渲染目录
     * @param data  用来渲染的数据
     * @returns {XML}
     */
    renderCatagorysByData(data) {
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
     * 组织数据,并且调用渲染分类的相关方法
     * @returns {XML}
     */
    renderCategory() {
        const {category} = this.state;
        let renderData = {
            "topCategory": [],
            "articles": {}
        };
        if (category.length) {
            category.forEach((item) => {
                item.categorys.forEach((cate) => {
                    if (renderData["topCategory"].indexOf(cate) == -1) {
                        renderData["topCategory"].push(cate);
                    }
                    if (!renderData["articles"][cate]) {
                        renderData["articles"][cate] = [];
                        renderData["articles"][cate].push(item);
                    } else {
                        renderData["articles"][cate].push(item);
                    }
                });
            });
            return (
                <ul className="archive-list">
                    <section>
                        {renderData["topCategory"].map((item) => {
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
                        {this.renderCatagorysByData(renderData)}
                    </section>
                </ul>
            );
        }
    }

    /**
     * 渲染组件布局
     * @returns {XML}
     */
    render() {
        const {fetching} = this.state;
        let ele = <div id="main" data-behavior="1">
            <div id="categories-archives" className="main-content-wrap">
                {this.renderCategory()}
            </div>
            <Bottom />
        </div>;
        if(fetching){
            ele = <Loading />;
        }
        return ele;
    }
}

