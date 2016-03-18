/**
 * 页面首页文章列表
 */

"use strict";

import React,{Component,PropTypes} from "react";
import classnames from "classnames";
import {bindActionCreators} from "redux";
import {Route,Link} from "react-router";
import {connect} from "react-redux";
import * as Actions from "../actions";
import Bottom from "./Bottom";

class Main extends Component {

    /**
     * 构造器
     * @param props
     * @param context
     */
    constructor(props, context) {
        super(props, context);
    }

    /**
     * 组件即将被初始化完成,请求数据
     */
    componentWillMount() {
        const {GetArticleList,page} = this.props;
        GetArticleList(page);
    }

    /**
     * 如果没有文章,根据是否登录显示相关信息
     * @returns {XML}
     */
    rendLoginAndPost() {
        const {isLogined} = this.props;
        if (!isLogined) {
            return (
                <span>快去<Link to="/reg">注册</Link>或<Link to="/login">登录</Link>发表文章吧!</span>
            );
        } else if (isLogined) {
            return (
                <span>快去<Link to="/login">登录</Link>发表文章吧!</span>
            );
        }
    }

    /**
     * 上一页
     */
    handlePrevPage() {
        const {GetArticleList,page} = this.props;
        let targetPage = page - 1 == 0 ? 1 : page - 1;
        GetArticleList(targetPage);
    }

    /**
     * 下一页
     */
    handleNextPage() {
        const {GetArticleList,page} = this.props;
        let targetPage = page + 1 == 0 ? 1 : page + 1;
        GetArticleList(targetPage);
    }

    /**
     * 渲染分页数据
     * @returns {XML}
     */
    renderPagenation() {
        const {page,totalPage} = this.props;
        const self = this;

        /**
         * 渲染分页按钮的class,以对象的形式返回
         * @returns {{last: string, next: string}}
         */
        function renderPageClasses() {
            let last = "post-action-btn btn btn--default";
            let next = "post-action-btn btn btn--default";
            if (page == totalPage && totalPage > 1) {
                last = "post-action-btn btn btn--default";
                next = "post-action-btn btn btn--disabled";
            }
            if (page == 1 && totalPage > 1) {
                last = "post-action-btn btn btn--disabled";
                next = "post-action-btn btn btn--default";
            }
            if (totalPage == 1) {
                last = "post-action-btn btn btn--disabled";
                next = "post-action-btn btn btn--disabled";
            }
            return {
                "last": last,
                "next": next
            };
        }

        return (
            <div className="post-actions-wrap">
                <nav>
                    <ul className="post-actions post-action-nav">
                        <li className="post-action">
                            <Link className={renderPageClasses()["last"]} to=""
                                  onClick={this.handlePrevPage.bind(this)}>
                                <i className="fa fa-angle-left"></i>
                                <span className="hide-xs hide-sm text-small icon-ml">上一页</span>
                            </Link>
                        </li>
                        <li className="post-action post-action-nav">
                            <Link className={renderPageClasses()["next"]} to=""
                                  onClick={this.handleNextPage.bind(this)}>
                                <span className="hide-xs hide-sm text-small icon-mr">下一页</span>
                                <i className="fa fa-angle-right"></i>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }

    /**
     * 渲染文章列表
     * @param list  文章列表
     * @returns {*}
     */
    rendList(list) {
        return (list && list.length) && list.map((item) => {
                let link = `/article/detail/${item["_id"]}`;
                return (
                    <article className="post" itemScope="" key={item["_id"]}>
                        <div className="post-wrap">
                            <div className="post-header">
                                <h1 className="post-title" itemProp="headline">
                                    <Link className="link-unstyled" to={link}>{item["title"]}</Link>
                                </h1>
                                <div className="post-meta">
                                    <time itemProp="datePublished" content={item["day"]["date"]}>
                                        {item["day"]["date"].substr(0, 10)}
                                    </time>
                                </div>
                            </div>
                            <div className="post-excerpt" itemProp="articleBody">
                                <p>
                                    <div className="show-preview" dangerouslySetInnerHTML={{"__html": item["post"].length ? item["post"] : "<p>暂无内容</p>"}}>
                                    </div>
                                    <br/>
                                    <Link to={link} className="post-excerpt_link link ">继续阅读 »</Link>
                                </p>
                            </div>
                        </div>
                    </article>
                )
            });
    }

    /**
     * 渲染组件布局
     * @returns {XML}
     */
    render() {
        const {list} = this.props;
        return (
            <div id="main" data-behavior="1">
                <section className="post-group main-content-wrap">
                    {this.rendList(list)}
                    {this.renderPagenation()}
                </section>
            </div>
        );
    }
}


Main.propTypes = {
    GetArticleList: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired
};

function mapStateToProps(state) {
    return {
        page: state.reducers.page,
        totalPage: state.reducers.totalPage,
        list: state.reducers.list,
        isLogined: state.reducers.isLogined
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);