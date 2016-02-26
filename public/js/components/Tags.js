/**
 * 标签
 */

"use strict";

import React,{Component} from "react";
import {Route,Link} from "react-router";
import {requestMethods,requestUrls} from "../networkAPI";

export default class Tags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tags:[]
        };
    }

    componentWillMount(){
        requestMethods.GetRequest({
            url:requestUrls.tags,
            success:(res) => {
                this.setState({
                    tags:res.tags
                });
            },
            error:(ex) => {
                alert("请求失败");
                console.log(ex);
            }
        });
    }

    render(){
        const {tags} = this.state;
        return (
            <div>
                <ul>
                    {tags.map((item) => {
                        if(!!tags){
                            return (
                                <li><Link to={"/tag/" + item}>{item}</Link></li>
                            )
                        }
                    })}
                </ul>
            </div>
        );
    }
}
