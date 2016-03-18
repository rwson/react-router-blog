/**
 * 用户相关控制器
 */

"use strict";

var User = require("../modles").User,
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
            avatarArr.push(avatarDir.replace(staticPath, "") + "/" + item);
        }
    });
    avatarLength = avatarArr.length - 1;
});
//  读取头像目录

exports.User = {

    /**
     * 根据_id查询用户
     * @param _id       ObjectId,用来查询用户
     * @param callback  回调函数
     */
    "findUserById": function (_id, callback) {
        User.findOne({
            "_id": _id
        }, callback);
    },

    /**
     * 用户注册
     * @param opts      传过来的用户信息
     * @param callback  回调方法
     */
    "register": function (opts,callback) {
        var user = new User,
        md5 = crypto.createHash("md5");

        user.name = name;
        user.password = md5.update(opts.password).digest("hex");
        user.head = avatarArr[_random(0, avatarLength)];
        user.mobile = opts.mobile || "";
        user.email = opts.email || "";

        user.save(callback);
    }

};

/**
 * 获取指定范围内的随机数
 * @param min   下界
 * @param max   上界
 * @returns {number}
 * @private
 */
function _random(min, max) {
    return Math.floor((max - min) * Math.random() + min);
}