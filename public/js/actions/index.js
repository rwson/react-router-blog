"use strict";

import {ARTICLE_LIST,LOGIN_SUCCESS,REQUEST_FAIL,REGISTER_SUCCESS,NEXT_PAGE,PREV_PAGE,JUMP_PAGE} from "../constants";
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
                totalPage: res.total,
                page: curPage
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

export function publishArticle() {
}
