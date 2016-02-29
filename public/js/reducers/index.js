/**
 * reducer
 */

"use strict";

import {ARTICLE_LIST,LOGIN_SUCCESS,REGISTER_SUCCESS} from "../constants";

const initialState = {
    isLogined: false,   //  是否登录
    isAdmin:false,      //  是否为管理员
    page: 1,            //  当前页码
    totalPage: 1,       //  总页码
    user: {},           //  用户对象
    list: []            //  首页文章数据
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case ARTICLE_LIST:
            state = Object.assign({}, res, {
                list: action.list,
                page: action.page,
                totalPage: action.totalPage
            });
            break;
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            state = Object.assign({}, res, {
                isLogined: true,
                user: action.user
            });
            break;
    }
    let res = state;
    return state;
}