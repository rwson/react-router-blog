/**
 * 页面首页文章列表
 */

"use strict";

import React,{Component,PropTypes} from "react";
import {bindActionCreators} from "redux";
import {Route,Link} from "react-router";
import {connect} from "react-redux";
import * as Actions from "../actions";

class Main extends Component {
    constructor(props, context) {
        super(props, context);
    }

    componentWillMount() {
        const {GetArticleList,page} = this.props;
        GetArticleList(page);
    }

    rendLoginAndPost() {
        const {isLogined} = this.props;
        if (!isLogined) {
            return (
                <span>快去<Link to="/reg">注册</Link>或<Link to="/login">登录</Link>发表吧!</span>
            );
        }
    }

    rendTags(tags) {
        return tags.join("").length ? (
            <div>
                <h5>标签</h5>
                {
                    tags.map((tag) => {
                        return tag ? (
                            <Link to={"/tags/" + tag} key={tag}>{tag}</Link>
                        ) : "";
                    })
                }
            </div>
        ) : "";

    }

    rendList(list) {
        return (list && list.length) ? list.map((item) => {
            return (
                <div className="post-contents" key={item["_id"]}>
                    <h2>
                        <Link
                            to={"/u/" + item["name"] + "/" + item["time"]["day"] + "/" + item["title"]}>{item["title"]}</Link>
                        <Link to={"/u/" + item["name"]}><img src={item["head"]} alt="头像"/></Link>
                    </h2>
                    <p>
                        作者:<Link to={"/u/" + item["name"]}>{item["name"]}</Link>|日期:{item["time"]["minutes"]}
                    </p>
                    {this.rendTags(item["tags"])}
                    <p>{item["post"]}</p>

                    <p className="info">阅读:{item["pv"]} | 评论:{item["comments"].length}</p>
                </div>
            )
        }) :
            (
                <p>啊哦,暂时没有记录啊!
                    {this.rendLoginAndPost()}
                </p>
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
        list: state.reducers.list,
        isLogined: state.reducers.isLogined
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);