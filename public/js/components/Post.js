/**
 * 文章发表
 */

"use strict";

import React,{Component,PropTypes} from "react";
import {Route,Link} from "react-router";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as Actions from "../actions";

class Post extends Component {
    constructor(props) {
        super(props);
    }

    handleChange(type, ev) {
        let target = ev.target;
        if (type == "username") {
            this.setState({
                "username": target.value
            });
        } else if (type == "password") {
            this.setState({
                "password": target.value
            });
        }
    }

    /**
     * 渲染组件布局
     * @returns {XML}
     */
    render() {
        return (
            <div>
                <h1>Post</h1>
            </div>
        );
    }
}

Post.propTypes = {
    publishArticle: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(null, mapDispatchToProps)(Post);
