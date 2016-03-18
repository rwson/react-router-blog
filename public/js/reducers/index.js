/**
 * reducer
 */

"use strict";

import {ARTICLE_LIST,START_FETCH,REQUEST_FAIL} from "../constants";

const initialState = {
    isFetching: false,  //  是否登录
    page: 1,            //  当前页码
    totalPage: 1,       //  总页码
    list: []            //  首页文章数据
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case ARTICLE_LIST:
            alert(111);
            state = Object.assign({}, res, {
                list: action.list,
                page: action.page,
                isFetching: false,
                totalPage: action.totalPage
            });
            break;
        case START_FETCH:
            state = Object.assign({}, res, {
                isFetching: true
            });
            break;
        case REQUEST_FAIL:
            state = Object.assign({}, res, {
                isFetching: false
            });
            break;
    }
    let res = state;
    return state;
}