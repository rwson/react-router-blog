"use strict";

import {ARTICLE_LIST,LOGIN_SUCCESS,REQUEST_FAIL,REGISTER_SUCCESS} from "../constants";
import {requestMethods,requestUrls} from "../networkAPI";

export function GetArticleList(page) {
    var curPage = page;
    if (!curPage) {
        curPage = 1;
    }
    return dispatch => requestMethods.GetRequest({
        url: `${requestUrls.articleList}/${curPage}`,
        success: (res) => {
            return dispatch({
                type: ARTICLE_LIST,
                list: res.data,
                totalPage:res.total
            });
        },
        error: (ex) => {
            return dispatch({
                type: REQUEST_FAIL,
                ex: ex
            });
        }
    });
}

export function Login(username, password) {
    return dispatch => requestMethods.PostRequest({
        url: requestUrls.login,
        body: {
            username: username,
            password: password
        },
        success: (res) => {
            return dispatch({
                type: LOGIN_SUCCESS,
                user: res.user
            });
        },
        error: (ex) => {
            return dispatch({
                type: REQUEST_FAIL,
                ex: ex
            });
        }
    });
}

export function CheckLogin(){
    return dispatch => requestMethods.PostRequest({
        url:requestUrls.checkLogin,
        success:(res) => {
            return dispatch({
                type: LOGIN_SUCCESS,
                user: res.user
            });
        },
        error:(ex) => {
            return dispatch({
                type: REQUEST_FAIL,
                ex:ex
            });
        }
    });
}

export function logOut(){
    return dispatch => requestMethods.PostRequest({
        url:requestUrls.logout,
        success:(res) => {
            return dispatch({
                type: LOGIN_SUCCESS,
                user: res.user
            });
        },
        error:(ex) => {
            return dispatch({
                type: REQUEST_FAIL,
                ex:ex
            });
        }
    });
}

export function Register(username, password, email) {
    return dispatch => requestMethods.PostRequest({
        url: requestUrls.register,
        body: {
            username: username,
            password: password,
            email: email
        },
        success: (user) => {
            return dispatch({
                type: REGISTER_SUCCESS,
                user: user
            });
        },
        error: (ex) => {
            return dispatch({
                type: REQUEST_FAIL,
                ex: ex
            });
        }
    });
}

export function publishArticle(){
}
