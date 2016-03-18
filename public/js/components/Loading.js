/**
 * 加载动画
 */

"use strict";

import React,{Component} from "react";

export default class Loading extends Component {

    render() {
        return (
            <div id="main" className="loading-area" data-behavior="1">
                <div className="spinner">
                    <div className="double-bounce1"></div>
                    <div className="double-bounce2"></div>
                </div>
            </div>
        );
    }

}