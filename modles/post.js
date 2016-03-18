/**
 * 文章库
 */

var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Post = new Schema({
        day: Object,
        title: String,
        tags: Array,
        categorys: Array,
        post: String
    });

module.exports = Post;
