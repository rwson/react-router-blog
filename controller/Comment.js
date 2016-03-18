/**
 * 用户相关控制器
 */

"use strict";

var UserTable = require("../modles").User,
    crypto = require("crypto"),
    settings = require("../settings.js"),
    fs = require("fs"),
    avatarDir = settings.avatarDir,
    staticPath = settings.staticPath,
    avatarArr = [],
    avatarLength = 0;

fs.readdir(avatarDir, function (err, data) {
    data.forEach(function (item) {
        if (item.match(/\.jpg$/g) !== null) {
            avatarArr.push(avatarDir.replace(staticPath,"") + "/" + item);
        }
    });
    avatarLength = avatarArr.length;
});
//  读取头像目录

exports.User = {

    /**
     * 根据_id查询用户
     * @param _id       ObjectId,用来查询用户
     * @param callback  回调函数
     */
    "findUserById":function(_id,callback){
        UserTable.findOne({
            "_id":_id
        },callback);
    },

    "register":function(){
        UserTable.save();
    }

};