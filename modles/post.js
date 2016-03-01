/**
 * 文章库
 */

var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Post = new Schema({
        name:String,
        day:String,
        title:String,
        tags:Array,
        post:String
    });

module.exports = Post;
