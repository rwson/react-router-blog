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
        const {NextPage,GetArticleList,page} = this.props;
        let targetPage = page + 1 == 0 ? 1 : page + 1;
        GetArticleList(targetPage);
    }

    /**
     * 具体跳转到哪一页
     * @param num   要跳转的目标页
     */
    handlePage(num) {
        const {NextPage,GetArticleList,page} = this.props;
        GetArticleList(num);
    }

    /**
     * 渲染分页数据
     * @returns {XML}
     */
    renderPagenation() {
        const {page,totalPage} = this.props;
        const self = this;

        function renderPageLinks() {
            let links = [];
            links.push(<li className={classnames({
                    "disabled":page == 1
                })} key={+new Date()} aria-label="Previous" onClick={self.handlePrevPage.bind(self)}><Link
                to={""}>&laquo;</Link></li>);
            for (let i = 1; i <= totalPage; i++) {
                links.push(<li className={classnames({
                    "disabled":i == page
                })} key={i} onClick={self.handlePage.bind(self,i)}><Link to={""}>{i}</Link></li>);
            }
            links.push(<li className={classnames({
                    "disabled":page == totalPage
                })} key={+new Date() + 1} aria-label="Next" onClick={self.handleNextPage.bind(self)}><Link to={""}>&raquo;</Link>
            </li>);
            return links;
        }

        return (
            <nav>
                <ul className="pagination">
                    {renderPageLinks()}
                </ul>
            </nav>
        );
    }

    /**
     * 渲染该文章的标签
     * @param tags  标签数组,字符串数组
     * @returns {*}
     */
    rendTags(tags) {
        let tagsLength = tags.length - 1;
        let lastTag = tags[tagsLength];
        return tags.join("").length ? (

            <span className="public-info">
                <i className="fa fa-user"></i>
                {
                    tags.map((tag, index) => {
                        return tag ? (
                            <Link to={"/tags/" + tag}
                                  key={tag}>{tag + (index !== tagsLength && !!lastTag) ? "、" : ""}</Link>
                        ) : "";
                    })
                }
            </span>
        ) : "";

    }

    /**
     * 渲染文章列表
     * @param list  文章列表
     * @returns {*}
     */
    rendList(list) {
        return (list && list.length) ? list.map((item) => {
            return (
                <div className="post-contents" key={item["_id"]}>
                    <div className="panel panel-default">
                        <div className="panel-heading"><Link
                            to={"/u/" + item["name"] + "/" + item["time"]["day"] + "/" + item["title"]}>{item["title"]}</Link>
                        </div>
                        <div className="panel-body">
                            <p className="post-texts">{item["post"].substr(0, 30) || "暂无内容"}</p>
                        </div>
                        <div className="panel-footer">
                            <span className="public-info">
                                <i className="fa fa-calendar"></i>
                                {item["time"]["day"]}
                            </span>
                            <span className="public-info">
                                <i className="fa fa-user"></i>
                                {item["name"]}
                            </span>
                            {this.rendTags(item["tags"])}
                        </div>
                    </div>
                </div>
            )
        }) :
            (
                <div className="panel panel-default">
                    <div className="panel-heading">
                        啊哦,暂时没有记录啊!
                    </div>
                    <div className="panel-body">
                        {this.rendLoginAndPost()}
                    </div>
                </div>
            );
    }

    /**
     * 渲染组件布局
     * @returns {XML}
     */
    render() {
        const {list} = this.props;
        return (
            <div>
                {this.rendList(list)}
                {this.renderPagenation()}
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