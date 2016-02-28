/**
 * 文章发表
 */

"use strict";

import React,{Component,PropTypes} from "react";
import {Route,Link} from "react-router";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as Actions from "../actions";

import {Editor, EditorState} from 'draft-js';

//import BlogEditor from "./BlogEditor";

class MyEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {editorState: EditorState.createEmpty()};
        this.onChange = (editorState) => this.setState({editorState});
    }
    render() {
        const {editorState} = this.state;
        return <Editor editorState={editorState} onChange={this.onChange} />;
    }
}

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
            <MyEditor />
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
