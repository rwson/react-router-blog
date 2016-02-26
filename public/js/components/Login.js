/**
 * 登录
 */

"use strict";

import React,{Component,PropTypes} from "react";
import {Route,Link} from "react-router";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as Actions from "../actions";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "username": "",
            "password": ""
        }
    }

    handleLogin(ev) {
        const e = ev || event;
        const {Login} = this.props;
        const {username,password} = this.state;
        Login(username, password);
        e.preventDefault();
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
                <div>
                    用户名:&nbsp;&nbsp;
                    <input type="text" name="name" onChange={this.handleChange.bind(this,"username")}/>
                </div>
                <div>
                    密&nbsp;&nbsp;&nbsp;码:&nbsp;&nbsp;
                    <input type="password" name="password" onChange={this.handleChange.bind(this,"password")}/>
                </div>
                <button onClick={this.handleLogin.bind(this)}>登  录</button>
            </div>
        );
    }
}

Login.propTypes = {
    Login: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(null, mapDispatchToProps)(Login);
