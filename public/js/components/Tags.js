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

    renderTags(){
        const {tags} = this.state;
        if(tags.length){
            return (
                <ul>
                    {tags.map((item,index) => {
                        if(!!item){
                            return (
                                <li key={index}><Link to={"/tag/" + item}>{item}</Link></li>
                            )
                        }
                    })}
                </ul>
            );
        }
    }

    render(){

        return (
            <div>
                {this.renderTags()}
            </div>
        );
    }
}
