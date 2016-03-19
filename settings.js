/**
 * 数据库等配置
 */

module.exports = {
    "env": "public",
    "develop": {
        "port":3000,
        "db": "blog",
        "host": "mongodb://127.0.1.1:27017/"
    },
    "public": {
        "port":80,
        "db": "blog",
        "host": "mongodb://127.0.0.1:27017/"
    },
    "cookieSecret": "myblog",
    "avatarDir": "./public/image/faces",
    "staticPath": "./public",
    "admin": {
        "username": "rwson",
        "password": "s87654321"
    },
};