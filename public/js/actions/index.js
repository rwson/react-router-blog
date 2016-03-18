"use strict";

import {ARTICLE_LIST,REQUEST_FAIL,START_FETCH} from "../constants";
import {requestMethods,requestUrls} from "../networkAPI";

export function GetArticleList(page) {
    var curPage = page;
    if (!curPage) {
        curPage = 1;
    }
    return dispatch => requestMethods.GetRequest({
        url: `${requestUrls.articleList}/${curPage}`,
        success: (res) => {
            alert(222);
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

export function startGetList() {
    return {
        type:START_FETCH
    };
}
