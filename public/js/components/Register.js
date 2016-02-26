/**
 * 注册
 */

"use strict";

import React,{Component,PropTypes} from "react";
import {Route,Link} from "react-router";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as Actions from "../actions";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "username": "",
            "password": "",
            "email":""
        }
    }

    handleRegister(ev) {
        const e = ev || event;
        const {Register} = this.props;
        const {username,password,email} = this.state;
        Register(username, password,email);
        this.props.history.push("/");
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
        } else if(type == "email"){
            this.setState({
                "email": target.value
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
                <div>
                    邮&nbsp;&nbsp;&nbsp;箱:&nbsp;&nbsp;
                    <input type="text" name="email" onChange={this.handleChange.bind(this,"email")}/>
                </div>
                <button onClick={this.handleRegister.bind(this)}>注  册</button>
            </div>
        );
    }
}

Register.propTypes = {
    Register: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(null, mapDispatchToProps)(Register);

