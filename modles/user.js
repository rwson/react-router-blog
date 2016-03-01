/**
 * 用户类操作相关
 */

var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    User = new Schema({
        name:String,
        password:String,
        email:String,
        head:String,
        mobile:String
    });

module.exports = User;
