/**
 * 暴露各个数据库的数据模型
 */

"use strict";

var settings = require("../settings"),
    mongoose = require("mongoose"),
    env = settings.env;

//  开发环境和发布环境的数据库连接
mongoose.connect(settings[env].host + settings[env].db);

exports.User = mongoose.model("User",require("./user"));
exports.Post = mongoose.model("Post",require("./post"));
exports.Commet = mongoose.model("Comment",require("./comment"));
