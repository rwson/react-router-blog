/**
 * 数据库等配置
 */

module.exports = {
    "env": "develop",
    "develop": {
        "port": 3000,
        "db": "blog",
        "host": "mongodb://localhost:27017/"
    },
    "public": {
        "port": 80,
        "db": "blog",
        "host": "mongodb://127.0.0.1:27017/"
    },
    "cookieSecret": "myblog",
    "avatarDir": "./public/image/faces",
    "staticPath": "./public",
    "postImagePath": "./public/image/posts",
    "admin": {
        "username": "rwson",
        "password": "s87654321"
    }
};