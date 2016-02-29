/**
 * 封装http请求方法,直接调用
 */

"use strict";

import * as util from "../util";

//  http请求头参数配置
const httpDefault = {
    "mode": "cors",
    "credentials": "include",
    "headers": {
        "Accept": "application/json",
        "Content-Type": "application/json; charset=utf-8"
    }
};

//  失败与成功的状态
const successStatus = "success";
const errorStatus = "error" || "fail";

/**
 * 根据ajax返回运行相关回调方法
 * @param res   ajax返回处理后的结果
 * @param opts  配置参数
 * @private
 */
function _runCallbacks(res, opts) {
    if (res.status == successStatus) {
        util.getProType(opts.success) == "function" && opts.success(res);
    } else if (res.status == errorStatus) {
        util.getProType(opts.error) == "function" && opts.error(res);
    }
}

//  http请求前缀
const prefUri = "/";

//  http请求路径
export const requestUrls = {
    "articleList": `${prefUri}article/list`,
    "articleDetail": `${prefUri}article/detail`,
    "register": `${prefUri}register`,
    "login": `${prefUri}login`,
    "checkLogin":`${prefUri}checkLogin`,
    "logout": `${prefUri}logout`,
    "tags": `${prefUri}allTags`,
    "tag": `${prefUri}tag/articles`,
    "postArticle": `${prefUri}postArticle`,
    "updateArticle": `${prefUri}updateArticle`,
    "deleteArticle": `${prefUri}deleteArticle`,
    "getArchives": `${prefUri}archives`,
    "getUserInfo":`${prefUri}getUserInfo`
};

//  POST、GET、DELETE请求方法配置
export const requestMethods = ({

    /**
     * POST请求
     * @param opts  相关配置参数
     */
    "PostRequest": (opts) => {
        fetch(opts.url, {
            ...httpDefault,
            "method": "POST",
            "body": JSON.stringify(opts.body)
        }).then((res) => {
            return res.json();
        }).then((res) => {
            _runCallbacks(res, opts);
        }).catch((ex) => {
            throw ex;
        });
    },

    /**
     * GET请求
     * @param opts  相关配置参数
     */
    "GetRequest": (opts) => {
        fetch(opts.url, {
            ...httpDefault,
            "method": "GET"
        }).then((res) => {
            return res.json();
        }).then((res) => {
            _runCallbacks(res, opts);
        }).catch((ex) => {
            throw  ex;
        });
    },

    /**
     * DELETE请求
     * @param opts  相关配置参数
     */
    "DeleteRequest": (opts) => {
        fetch(opts.url, {
            ...httpDefault,
            "method": "DELETE",
            "body": JSON.stringify(opts.body)
        }).then((res) => {
            return res.json();
        }).then((res) => {
            _runCallbacks(res, opts);
        }).catch((ex) => {
            throw ex;
        });
    }
});