/**
 * 数据库相关设置
 */

var settings = require('../settings'),
    Db = require('mongodb').Db,
    Server = require('mongodb').Server;

module.exports = new Db(settings.db, new Server(settings.host, 27017), {'safe': true});
//	设置数据库名,数据库地址、端口,创建一个数据库连接实例