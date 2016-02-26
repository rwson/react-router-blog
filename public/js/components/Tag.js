/**
 * 某个具体的标签
 */

"use strict";

import React,{Component} from "react";
import {Route,Link} from "react-router";
import {requestMethods,requestUrls} from "../networkAPI";

export default class tag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            article: []
        };
    }

    componentWillMount() {
        const {tag} = this.props.params;
        requestMethods.GetRequest({
            url:`${requestUrls.tag}/${tag}`,
            success:(res) => {
                this.setState({
                    article:res.article
                });
            },
            error:(ex) => {
                console.log(ex);
            }
        });
    }

    render() {
        const {article} = this.state;
        return (
            <div>
                <ul>
                    {article.map((item) => {
                        return (
                            <li key={item["id"]}><Link to={"/u/" + item["name"] + "/" + item["time"]["day"] + "/" + item["title"]}>{item["title"]}</Link></li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}
