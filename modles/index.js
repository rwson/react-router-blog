/**
 * 暴露各个数据库的数据模型
 */

"use strict";

var settings = require("../settings"),
    mongoose = require("mongoose"),
    env = settings.env;

//  开发环境和发布环境的数据库连接
mongoose.connect(settings[env].host + settings[env].db);

exports.Post = mongoose.model("Post",require("./post"));
