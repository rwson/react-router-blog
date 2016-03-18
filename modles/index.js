/**
 * 暴露各个数据库的数据模型
 */

"use strict";

var settings = require("../settings"),
    mongoose = require("mongoose");

//  开发环境和发布环境的数据库连接
if(!settings.env || settings.env === "dev"){
    mongoose.connect(settings.devDatabase.host + settings.devDatabase.db);
} else if(settings.env === "public"){
    mongoose.connect(settings.pubDatabase.host + settings.pubDatabase.db);
}

exports.User = mongoose.model("User",require("./user"));
exports.Post = mongoose.model("Post",require("./post"));
exports.Commet = mongoose.model("Comment",require("./comment"));
