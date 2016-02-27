/**
 * 404 Not Found
 */

"use strict";

import React,{Component} from "react";

export default class NotFound extends Component{

    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="not-found">
                <h1>Not Found</h1>
            </div>
        );
    }

}