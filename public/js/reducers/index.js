/**
 * reducer
 */

"use strict";

import {ARTICLE_LIST,LOGIN_SUCCESS,REGISTER_SUCCESS} from "../constants";

const initialState = {
    isLogined: false,
    page: 1,
    user: {},
    list: []
};

export default function reducer(state = initialState, action) {
    let res = state;
    switch (action.type) {
        case ARTICLE_LIST:
            state = Object.assign({}, res, {
                list: action.list,
                page: state.page++
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
    return state;
}