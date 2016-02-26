/**
 * 用户类操作相关
 */

var mongodb = require("./db"),
    crypto = require("crypto"),
    settings = require("../settings.js"),
    fs = require("fs"),
    avatarDir = settings.avatarDir,
    staticPath = settings.staticPath,
    avatarArr = [],
    avatarLength = 0;

/**
 * 生成指定范围的随机数
 * @param min
 * @param max
 * @returns {number}
 * @private
 */
function _random(min,max){
    return Math.floor((max - min) * Math.random() + min);
}

fs.readdir(avatarDir, function (err, data) {
    data.forEach(function (item) {
        if (item.match(/\.jpg$/g) !== null) {
            avatarArr.push(avatarDir.replace(staticPath,"") + "/" + item);
        }
    });
    avatarLength = avatarArr.length;
});
//  读取头像目录

/**
 * user类
 * @param {[type]} user [description]
 */
function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
}

/**
 * 存储用户信息
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
User.prototype.save = function (callback) {
    var md5 = crypto.createHash("md5"),
        emailMd5 = md5.update(this.email.toLowerCase()).digest("hex"),
        head = avatarArr[_random(0,avatarLength - 1)],
        user = {
            "name": this.name,
            "password": this.password,
            "email": this.email,
            "head":head
        };

    //	打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
            //	如果连接失败,返回失败
        }

        db.collection("users", function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
                //	错误就返回错误信息
            }

            collection.insert(user, {
                safe: true
            }, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, user["ops"]);
            });

        });

    });
};

/**
 * 注册时判断用户名是否存在
 * @param  {[type]}   name     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
User.get = function (name, callback) {

    mongodb.open(function (err, db) {
    //  打开数据库
    
        if (err) {
            return callback(err);
        }//	错误返回错误信息

        db.collection("users", function (err, collection) {
        //  读取users表    

            if (err) {
                mongodb.close();
                return callback(err);
                //	错误就返回错误信息
            }

            collection.findOne({
                name: name
            }, function (err, user) {
            //  根据用户名查表    

                mongodb.close();
                if (err) {
                    return callback(err);
                }
                //  查询失败

                var cUser = user;
                if(user instanceof Array){
                    cUser = user[0];
                }
                //  如果返回的user是数组类型,就手动改成对象类型

                callback(null, cUser);

            });

        });

    });
};

/**
 * 更新某个用户的信息
 * @param  {[type]}   name     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
User.update = function(name,callback){
    mongodb.open(function(err,db){
        //  打开数据库

        if(err){
            return callback(err);
        }
        //  打开失败

    });
};

module.exports = User;