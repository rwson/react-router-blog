/**
 * 用户相关控制器
 */

"use strict";

require("mongoose-pagination");
var Post = require("../modles").Post;

module.exports = {

    /**
     * 保存文章
     * @param data
     * @param callback
     */
    save: function (data, callback) {
        var post = new Post(data);
        post.save(callback);
    },

    /**
     * 按页查询数据
     * @param page      查询页码
     * @param size      每页要输出多少
     * @param callback  回调函数
     */
    "fetch": function (page, size, callback) {
        var finalSize = size;
        if (!finalSize) {
            finalSize = 10;
        }
        Post.find().paginate(page, finalSize, callback);
    },

    /**
     * 查询所有文章
     * @param callback  回调函数
     */
    "fetchAll": function (callback) {
        Post.find({}, {
            "day": 1,
            "title": 1
        }).sort({
            "day": -1
        }).exec(callback);
    },

    /**
     * 根据_id查询用户
     * @param _id       ObjectId,用来查询用户
     * @param callback  回调函数
     */
    "findArticleById": function (_id, callback) {
        Post.findOne({
            "_id": _id
        }, callback);
    },

    /**
     * 获取分类列表
     * @param callback  回调函数
     */
    "getArchives": function (callback) {
        Post.find({}, {
            "day": 1,
            "title": 1
        }).sort({
            "day": -1
        }).exec(callback);
    },

    /**
     * 获取指定的分类
     * @param archive   分类名称
     * @param callback
     */
    "getArchive": function (archive, callback) {
        var findObj = {};
        if (archive.indexOf("年") > -1 && archive.indexOf("月") > -1) {
            findObj = {
                "day.year-month": archive
            };
        } else if (archive.indexOf("年") > -1 && archive.indexOf("月") == -1) {
            findObj = {
                "day.year": archive
            };
        }

        Post.find(findObj, {
            "day": 1,
            "title": 1
        }).sort({
            "day": -1
        }).exec(callback);
    },

    /**
     * 获取文章标签
     * @param callback  回调函数
     */
    getTags: function (callback) {
        Post.find({}, {
            "tags": 1,
            "day": 1,
            "title": 1
        }).sort({
            "day": -1
        }).exec(callback);
    },

    /**
     * 获取文章标签
     * @param tag       标签名
     * @param callback  回调函数
     */
    getTag: function (tag, callback) {
        Post.find({
            "tags": tag
        }, {
            "day": 1,
            "title": 1
        }).sort({
            "day": -1
        }).exec(callback);
    },

    /**
     * 获取文章类别
     * @param callback
     */
    getCategory: function (callback) {
        Post.find({}, {
            "name": 1,
            "day": 1,
            "title": 1,
            "categorys": 1
        }).sort({
            "day": -1
        }).exec(callback);
    },

    /**
     * 根据id删除一篇文章
     * @param id        被删除文章的id
     * @param callback  回调函数
     */
    "deleteById": function (id, callback) {
        Post.findByIdAndRemove(id,callback);
    }

};
