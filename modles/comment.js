/**
 * 评论库
 */

var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Comment = new Schema({
        name: String,			//	被评论文章标题
        day: String,		    //	被评论文章发布时间
        title: String,          //  标题
        comment: Object         //  评论对象(评论者提交的一些信息)
    });

module.exports = Comment;
