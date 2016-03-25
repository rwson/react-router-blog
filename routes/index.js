"use strict";

var Post = require("../controller").Post;
var fs = require("fs");

module.exports = function (app) {

    /**
     * 首页
     */
    app.get("/", function (req, res) {
        res.render("index");
    });

    /**
     * 发布新的文章页面路由
     */
    app.get("/post/new", function (req, res) {
        res.render("post");
    });

    /**
     * 管理控制台页面路由
     */
    app.get("/manage", function (req, res) {
        res.render("manage");
    });

    /**
     * 请求文章列表
     */
    app.get("/articles/list/:page", function (req, res) {
        var page = req.params.page;
        var size = 10;
        Post.fetch(page, size, function (err, docs, totals) {
            if (err) {
                res.send(500, {
                    "status": "error",
                    "message": "server error",
                    "error": err
                });
                return;
            }
            res.send(200, {
                "status": "success",
                "data": docs,
                "total": Math.ceil(totals / size)
            });
        });
    });

    /**
     * 文章详细
     */
    app.get("/articles/detail/:id", function (req, res) {
        var id = req.params.id;

        Post.findArticleById(id, function (err, post) {
            if (err) {
                res.send(500, {
                    "status": "error",
                    "message": "server error",
                    "error": err
                });
                return;
            }

            res.send(200, {
                "status": "success",
                "detail": post,
                "user": req.session.user
            });
        });
    });

    /**
     * 获取分类
     */
    app.get("/allCategory", function (req, res) {
        Post.getCategory(function (err, category) {
            //  从数据库获取对应标签的文章
            if (err) {
                res.send(500, {
                    "status": "error",
                    "message": "server error",
                    "error": err
                });
                return;
            }
            //  读取失败

            res.send(200, {
                "status": "success",
                "category": category
            });
        });
    });

    /**
     * 获取文章分类标签
     */
    app.get("/allTags", function (req, res) {
        Post.getTags(function (err, tags) {
            //  从数据库获取对应标签的文章
            if (err) {
                res.send(500, {
                    "status": "error",
                    "message": "server error",
                    "error": err
                });
                return;
            }
            //  读取失败

            res.send(200, {
                "status": "success",
                "tags": tags
            });
        });
    });

    /**
     * 获取指定标签下的文章
     */
    app.get("/tag/articles/:tag", function (req, res) {

        Post.getTag(req.params.tag, function (err, posts) {
            //  从数据库获取该标签对应的标签

            if (err) {
                res.send(500, {
                    "status": "error",
                    "message": "server error",
                    "error": err
                });
                return;
            }
            //  查询失败

            res.send(200, {
                "status": "success",
                "article": posts
            });
        });
    });

    /**
     * 获取所有的归档
     */
    app.get("/archives", function (req, res) {

        Post.getArchives(function (err, docs) {
            if (err) {
                res.send(500, {
                    "status": "error",
                    "message": "server error",
                    "error": err
                });
                return;
            }

            res.send(200, {
                "status": "success",
                "archives": docs
            });
        });
    });

    /**
     * 查询指定归档下的文章
     */
    app.get("/archives/article/:archive", function (req, res) {
        Post.getArchive(req.params.archive, function (err, articles) {
            if (err) {
                res.send(500, {
                    "status": "error",
                    "message": "server error",
                    "error": err
                });
                return;
            }
            res.send(200, {
                "status": "success",
                "articles": articles
            });
        });
    });

    /**
     * 管理控制台获取所有文章
     */
    app.get("/articles/all", function (req, res) {
        Post.fetchAll(function (err, list) {
            if (err) {
                res.send(500, {
                    "ex": err
                });
                return;
            }
            res.send(200, {
                "list": list
            });
        });
    });

    /**
     * 发布一篇文章
     */
    app.post("/post/article", function (req, res) {

        var obj = req.body;

        var publicDate = obj["day"];
        obj.day = _returnDateObject(publicDate);

        Post.save(obj, function (err, response) {
            if (err) {
                res.send(500, {
                    "err": err,
                    "message": "服务器内部错误!请重试!"
                });
                return;
            }
            res.send(200, {
                "message": "文章新增成功!"
            });
        });
    });

    /**
     * 上传文件
     */
    app.post("/upload/file", function (req, res) {
        var file = req.files["editormd-image-file"];
        res.send(200, {
            "success": 1,
            "url": file.path.replace("public", "")
        });
    });

    /**
     * 删除指定文章
     */
    app.post("/article/delete/:id", function (req, res) {
        var id = req.params.id;
        Post.deleteById(id, function (err) {
            if (err) {
                res.send(500, {
                    "ex": err
                });
                return;
            }
            res.send(200, {
                "message": "删除成功!"
            });
        });
    });
};

/**
 * 读取某个目录下的文件,并以数组的形式返回
 * @param  {[type]} fs  [description]
 * @param  {[type]} dir [description]
 * @return {[type]}     [description]
 */
function _rendFileList(fs, dir) {
    var arr = [];
    //  定义空数组用于返回

    fs.readdir(dir, function (err, files) {
        if (err) {
            console.log("error:\n" + err);
            return;
        }
        //err 为错误,files文件名列表包含文件夹与文件

        files.forEach(function (file) {
            arr.push(dir + file);
        });
    });

    return arr;
}

/**
 * url先加密,防止出现url中文无法被正确解析的情况
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function _encodeUrl(data) {
    var arr = [];
    data.forEach(function (item, index, array) {
        arr.push(item["encode"] ? encodeURIComponent(item["param"]) : item["param"]);
        //	如果encode参数为true,就是需要编码,否则就不需要编码
    });
    return arr.join("/");
}

/**
 * 输出指定时间的字符串
 * @param day   时间
 * @returns {{date: Date, year: string, month: string, year-month: string, day: string, hour: string, minute: string, second: string}}
 * @private
 */
function _returnDateObject(day) {
    var date = new Date(day);
    var year = date.getFullYear();
    var month = _toDouble(_monthPlusOne(date.getMonth()));
    var day = _toDouble(date.getDate());
    var hour = _toDouble(date.getHours());
    var minute = _toDouble(date.getMinutes());
    var second = _toDouble(date.getSeconds());

    return {
        "date": date,
        "year": year + "年",
        "month": month + "月",
        "year-month": year + "年" + month + "月",
        "day": year + "年" + month + "月" + day + "日",
        "hour": year + "年" + month + "月" + day + "日" + " " + hour,
        "minute": year + "年" + month + "月" + day + "日" + " " + hour + ":" + minute,
        "second": year + "年" + month + "月" + day + "日" + " " + hour + ":" + minute + ":" + second
    };
}

/**
 * 月份+1
 * @param month 月份
 * @returns {*}
 * @private
 */
function _monthPlusOne(month) {
    return parseInt(month + 1);
}

/**
 * 一位数转2位数
 * @param num
 * @returns {*}
 * @private
 */
function _toDouble(num) {
    return num > 9 ? num : ("0" + num);
}
