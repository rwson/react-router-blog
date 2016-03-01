/**
 * 数据库等配置
 */

module.exports = {
    "env": "dev",
    "devDatabase": {
        "db": "blog",
        "host": "mongodb://127.0.0.1:27017/"
    },
    "pubDatabase": {
        "db": "blog",
        "host": "mongodb://137.4.3.2:27017/"
    },
    "cookieSecret": "myblog",
    "avatarDir": "./public/images/faces",
    "staticPath": "./public",
    "admin": {
        "username": "rwson",
        "password": "s87654321"
    }
};