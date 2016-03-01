"use strict";

var crypto = require("crypto"),
    User = require("../modles/user.js"),
    Post = require("../modles/post.js"),
    Comment = require("../modles/comment.js");

module.exports = function (app) {

    /**
     * 请求文章列表
     */
    app.get("/article/list/:page", function (req, res) {
        var page = req.params.page;

        Post.getTen(null, page, function (err, posts, total) {
            //  从数据库中获取当前页对应的10条数据

            if (err) {
                res.send(500, {
                    "status": "error",
                    "data": []
                });
                return;
            }
            //  获取失败

            res.send(200, {
                "status": "success",
                "data": posts,
                "total":Math.ceil(total / 10)
            });
        });
    });

    /**
     * 文章详细
     */
    app.get("/article/detail/:id", function (req, res) {
        var id = req.params.id;

        Post.getOne(id, function (err, post) {
            //	从数据库查询一条记录

            if (err) {
                res.send(500, {
                    "status": "error",
                    "message": "server error",
                    "error":err
                });
                return;
            }
            //	查询失败

            res.send(200, {
                "status": "success",
                "detail": post,
                "user": req.session.user
            });
            //	渲染文章页面

        });
    });

    /**
     * 用户登录
     */
    app.post("/login", function (req, res) {
        var username = req.body.username,
            password = req.body.password,
            md5 = crypto.createHash("md5");

        password = md5.update(req.body.password).digest("hex");

        User.get(username, function (err, user) {

            if (!user || user == null) {
                res.send(401, {
                    "status": "error",
                    "message": "用户不存在"
                });
                return;
            }
            //	用户不存在的情况

            if (user && user.password != password) {
                res.send(401, {
                    "status": "error",
                    "message": "用户不存在"
                });
                return;
            }
            //	密码错误

            req.session.user = user;
            res.send(200, {
                "status": "success",
                "user": user
            });
        });

    });

    /**
     * 检查是否登录
     */
    app.post("/checkLogin", function (req, res) {
        if (!req.session.user) {
            res.send(401, {
                "status": "error",
                "message": "你还没登录"
            });
            return;
        }
        res.send(200, {
            "status": "success",
            "user": req.session.user
        });
    });

    /**
     * 注册提交
     */
    app.post("/register", function (req, res) {

        var username = req.body.username,
            password = req.body.password,
            email = req.body.email,
            md5 = crypto.createHash("md5");

        password = md5.update(password).digest("hex");

        var newUser = new User({
            name: username,
            password: password,
            email: email
        });

        User.get(username, function (err, user) {

            if (user) {
                res.send(401, {
                    "status": "error",
                    "message": "用户名已存在"
                });
                return;
            }
            //	用户名已经存在

            newUser.save(function (err, user) {

                if (err) {
                    res.send(500, {
                        "status": "error",
                        "message": "server error",
                        "error":err
                    });
                    return;
                }

                req.session.user = user;
                //	写入session

                res.send(200, {
                    "status": "success",
                    "user": user[0]
                });

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
                    "error":err
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
                res.send(500,{
                    "status": "error",
                    "message": "server error",
                    "error":err
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
     * 获取所有的分类
     */
    app.get("/archives", function (req, res) {
        Post.getArchive(function (err, posts) {
            //  从数据库中获取记录

            if (err) {
                res.send(500,{
                    "status": "error",
                    "message": "server error",
                    "error":err
                });
                return;
            }
            //  查询失败

            res.send(200,{
                "status":"success",
                "archives":posts
            });
        });
    });
    //  存档

    app.post("/post", _checkLogin);
    app.post("/post", function (req, res) {
        var currentUser = req.session.user[0],
            tags = [req.body.tag1, req.body.tag2, req.body.tag3],
        //  标签    
            post = new Post(currentUser.name, currentUser.head, req.body.title, tags, req.body.content);
        //  实例化post对象

        post.save(function (err) {
            if (err) {
                req.flash("error", err);
                return res.redirect("/");
            }
            //	保存失败

            req.flash("success", "发表成功!");
            res.redirect("/");
        });
    });
    //	发表文章

    app.post("/upload", _checkLogin);
    app.post("/upload", function (req, res) {
        for (var i in req.files) {
            //	遍历上传的文件序列

            var curFile = req.files[i];
            //	获取当前文件

            if (curFile.size == 0) {
                fs.unlinkSync(curFile.path);
            }
            //	同步方法删除一个文件
            else {
                var tPath = "./public/upload/" + curFile.name;
                fs.renameSync(curFile.path, tPath);
            }

            return res.redirect("/upload");
            //	文件上传完成,重定向到上传页面
        }
    });
    //	上传文件

    app.get("/search", function (req, res) {
        Post.search(req.query.keyword, function (err, posts) {
            //  从数据库中取得记录

            if (err) {
                req.flash("error", err);
                return res.redirect("/");
            }
            //  搜索失败

            res.render("search", {
                "title": req.query.keyword + "的搜索结果",
                "user": req.session.user[0],
                "posts": posts,
                "keyword": req.query.keyword,
                "success": req.flash("success").toString(),
                "error": req.flash("error").toString()
            });

        });
    });
    //  搜索

    app.get("/links", function (req, res) {
        res.render("links", {
            "title": "友情链接",
            "user": req.session.user[0],
            "success": req.flash("success").toString(),
            "error": req.flash("error").toString()
        });
    });
    //  友情链接

    app.get("/u/:name", function (req, res) {
        var page = req.query.p ? parseInt(req.query.p) : 1;
        //  判断是否为第一页

        User.get(req.params.name, function (err, user) {
            //  检测用户名是否存在

            if (!user) {
                req.flash("error", "用户不存在！");
                return res.redirect("/");
            }
            //  用户不存在

            Post.getTen(user.name, page, function (err, posts, total) {
                //  查询

                if (err) {
                    req.flash("error", err);
                    return res.redirect("/");
                }
                //  查询失败

                res.render("user", {
                    "title": user.name,
                    "posts": posts,
                    "page": page,
                    "isFirstPage": page == 1,
                    "isLastPage": ((page - 1) * 10 + posts.length) == total,
                    "user": req.session.user[0],
                    "success": req.flash("success").toString(),
                    "error": req.flash("error").toString()
                });
                //  渲染user页面

            });

        });
    });
    //	用户详情

    app.get("/usercenter/:name", function (req, res) {

        //  如果文件数组为空,就先读取待选头像下的文件列表

        res.render("usercenter", {
            "title": "个人中心",
            "avators": avatarArr,
            "user": req.session.user[0],
            "success": req.flash("success").toString(),
            "error": req.flash("error").toString()
        });

    });

    app.post("/u/:name/:day/:title", function (req, res) {
        var date = new Date(),
            time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " "
                + date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()),
            md5 = crypto.createHash("md5"),
            emailMd5 = md5.update(req.body.email.toLowerCase()).digest("hex"),
            head = "http://zh-tw.gravatar.com/avatar" + emailMd5 + "?s=48",
            comment = {
                "name": req.body.name,
                "head": head,
                "email": req.body.email,
                "website": req.body.website,
                "time": time,
                "content": req.body.content
            },
            newComment = new Comment(req.params.name, req.params.day, req.params.title, comment);
        //  实例化一个评论对象

        newComment.save(function (err) {
            //  将评论入库

            if (err) {
                req.flash("error", err);
                return res.redirect("back");
            }
            //  评论失败

            req.flash("success", "留言成功!");
            res.redirect("back");
            //  评论成功

        });
    });
    //  评论请求

    app.get("/edit/:name/:day/:title", _checkLogin);
    app.get("/edit/:name/:day/:title", function (req, res) {
        var curUser = req.session.user[0];
        Post.edit(curUser.name, req.params.day, req.params.title, function (err, post) {
            //	取得之前发布或编辑过的文章

            if (err) {
                req.flash("error", err);
                return res.redirect("back");
            }
            //	查询失败,返回错误信息并返回到之前页面

            res.render("edit", {
                "title": "编辑",
                "post": post,
                "user": curUser,
                "success": req.flash("success").toString(),
                "error": req.flash("error").toString()
            });

        });
    });
    //	编辑文章

    app.post("/edit/:name/:day/:title", _checkLogin);
    app.post("/edit/:name/:day/:title", function (req, res) {

        var opt = [
                {
                    "encode": true,
                    "param": req.params.name
                },
                {
                    "param": req.params.day
                },
                {
                    "encode": true,
                    "param": req.params.title
                }
            ],
            url = "/u/" + _encodeUrl(opt);
        //	拼接html,保存成功/失败后跳转

        var curUser = req.session.user[0];
        Post.update(curUser.name, req.params.day, req.params.title, req.body.content, function (err) {
            if (err) {
                req.flash("error", err);
                return res.redirect(url);
            }
            //	保存失败,返回之前的文章页

            console.log("保存成功!");
            req.flash("success", "保存成功!");
            res.redirect(url);
            //	修改成功,返回之前的文章页

        });
    });
    //	修改文章

    app.get("/remove/:name/:day/:title", _checkLogin);
    app.get("/remove/:name/:day/:title", function (req, res) {
        var curUser = req.session.user[0];
        Post.remove(curUser.name, req.params.day, req.params.title, function (err) {
            //	删除数据库里的记录

            if (err) {
                req.flash("error", err);
                return res.redirect("back");
            }
            //	删除失败

            req.flash("success", "删除成功!");
            res.redirect("/");

        });
    });
    //	删除指定的文章

    app.get("/reprint/:name/:day/:title", _checkLogin);
    app.get("/reprint/:name/:day/:title", function (req, res) {
        Post.edit(req.params.name, req.params.day, req.params.title, function (err, post) {
            //  调用edit返回markdown格式的文本,而不是getOne返回的HTML字符串

            if (err) {
                req.flash("error", err);
                return res.redirect("back");
            }
            //  查询失败

            var curUser = req.session.user[0],
                reprint_from = {
                    "name": post.name,
                    "day": post.time.day,
                    "title": post.title
                },
                reprint_to = {
                    "name": curUser.name,
                    "head": curUser.head
                },
            //  转载信息

                opt = [
                    {
                        "encode": true,
                        "param": post.name
                    },
                    {
                        "param": post.time.day
                    },
                    {
                        "encode": true,
                        "param": post.title
                    }
                ],
                url = "/u/" + _encodeUrl(opt);
            //  组装url,调用_encodeUrl解决中文无法解析问题

            Post.reprint(reprint_from, reprint_to, function (err, post) {
                //  调用转载方法

                if (err) {
                    req.flash("error", err);
                    return res.redirect("back");
                }
                //  转载失败,返回之前的页面

                req.flash("success", "转载成功!");
                res.redirect(url);

            });

        });
    });
    //  转载请求

    app.get("logout", _checkLogin);
    app.get("/logout", function (req, res) {
        req.session.user = null;
        req.flash("success", "退出成功");
        res.redirect("/");
    });
    //	登出

}

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
 * 如果未登录,返回登录页
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
function _checkLogin(req, res, next) {
    if (!req.session.user) {
        req.flash("error", "未登录！")
        res.redirect("/login");
    }
    next();
}

/**
 * 如果已经登录,返回之前页
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
function _checkNotLogin(req, res, next) {
    if (req.session.user) {
        res.send();
    }
    next();
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

