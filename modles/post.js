/**
 * 发表类相关
 */

var mongodb = require('./db'),
    markdown = require('markdown').markdown;
//	引入markdown模块

/**
 * Post类
 * @param {[type]} name  [description]
 * @param {[type]} head  [description]
 * @param {[type]} title [description]
 * @param {[type]} tags  [description]
 * @param {[type]} post  [description]
 */
function Post(name, head, title, tags, post) {
    this.name = name;
    this.head = head;
    this.title = title;
    this.tags = tags;
    this.post = post;
}

/**
 * 存储文章的相关信息
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Post.prototype.save = function (callback) {
    var date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth() + 1 < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1),
        day = date.getDate() < 9 ? "0" + date.getDate() : date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes() < 9 ? "0" + date.getMinutes() : date.getMinutes(),

        time = {
            'date': date,
            'year': year,
            'month': year + "-" + month,
            'day': year + "-" + month + "-" + day,
            'minutes': year + "-" + month + "-" + day + " " + hour + ":" + minute
        },
    //	存储各种时间格式

        post = {
            'name': this.name,
            'head': this.head,
            'time': time,
            'title': this.title,
            'post': this.post,
            'tags': this.tags,
            'reprint_info': {},
            'comments': [],
            'pv': 0
        };
    //	要存储的文档格式

    mongodb.open(function (err, db) {
        //	打开数据库

        if (err) {
            return callback(err);
        }
        //	打开失败

        db.collection('posts', function (err, collection) {
            //	读取posts集合

            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.insert(post, {
                'safe': true
            }, function (err) {
                //	插入数据

                mongodb.close();

                if (err) {
                    return callback(err);
                }
                //	插入失败,返回err

                callback(null);

            });

        });

    });
};


/**
 * 读取所有文章及相关信息
 * @param  {[type]}   name     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Post.getAll = function (name, callback) {

    mongodb.open(function (err, db) {

        //	打开数据库
        if (err) {
            return callback(err);
        }

        db.collection('posts', function (err, collection) {
            //	读取posts集合

            if (err) {
                mongodb.close();
                return callback(err);
            }

            var query = {};

            if (name) {
                query.name = name;
            }

            collection.find(query).sort({
                'time': -1
            }).toArray(function (err, docs) {
                //	根据query查询文章

                mongodb.close();
                if (err) {
                    return callback(err);
                }
                //	读取失败,返回err

                docs.forEach(function (doc, index) {
                    doc.post = markdown.toHTML(doc.post);
                });
                //	添加markdown模块

                callback(null, docs);
                //	读取成功,用数组形式返回查询结果

            });

        });

    });
};

/**
 * 分页实现,一次获取10篇文章
 * @param  {[type]}   name     [description]
 * @param  {[type]}   page     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Post.getTen = function (name, page, callback) {
    mongodb.open(function (err, db) {
        //  打开数据库

        if (err) {
            return callback(err);
        }
        //  打开失败

        db.collection('posts', function (err, collection) {
            //  查询posts表

            if (err) {
                mongodb.close();
                return callback(err);
            }
            //  查询失败

            var query = {};

            if (name) {
                query.name = name;
            }

            collection.count(query, function (err, total) {
                //  count查询,返回特定的文档数total

                collection.find(query, {
                    'skip': (page - 1) * 10,
                    'limit': 10
                }).sort({
                    'time': -1
                }).toArray(function (err, docs) {
                    //  跳过前几页的多少个10条,查询本页的10条,并且按时间降序排序

                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    //  查询失败

                    docs.forEach(function (doc) {
                        doc.post = markdown.toHTML(doc.post);
                    });

                    callback(null, docs, total);
                });

            });

        });

    });
};

/**
 * 获取一篇文章
 * @param  {[type]}   name     [description]
 * @param  {[type]}   day      [description]
 * @param  {[type]}   title    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Post.getOne = function (name, day, title, callback) {
    mongodb.open(function (err, db) {
        //	打开数据库

        if (err) {
            return callback(err);
        }
        //	数据库打开失败

        db.collection('posts', function (err, collection) {
            //	读取posts集合

            if (err) {
                mongodb.close();
                return callback(err);
            }
            //	读取失败

            collection.findOne({
                'name': name,
                'title': title,
                'time.day': day
            }, function (err, doc) {
                //	根据用户名、发表日期及文章名进行

                if (err) {
                    return callback(err);
                }
                //	读取失败

                if (doc) {
                    collection.update({
                        'name': name,
                        'title': title,
                        'time.day': day
                    }, {
                        '$inc': {
                            'pv': 1
                        }
                    }, function (err) {
                        //  每次取得该文章(每次访问)访问量加1

                        mongodb.close();
                        if (err) {
                            return callback(err);
                        }
                    });

                    doc.post = markdown.toHTML(doc.post);
                    doc.comments.forEach(function (comment) {
                        //  循环评论

                        if (comment.content) {
                            comment.content = markdown.toHTML(comment.content);
                        }
                        //  评论内容存在,用markdown转成HTML格式

                    });
                }
                //	解析markdown为html

                callback(null, doc);
                //	返回查到的文章

            });
        });
    });
};

/**
 * 返回之前发表或者最后一次编辑提交的内容
 * @param  {[type]}   name     [description]
 * @param  {[type]}   day      [description]
 * @param  {[type]}   title    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Post.edit = function (name, day, title, callback) {
    mongodb.open(function (err, db) {
        //	打开数据库

        if (err) {
            return callback(err);
        }
        //	打开失败

        db.collection('posts', function (err, collection) {
            //	读取posts表

            if (err) {
                mongodb.close();
                return callback(err);
            }
            //	读取失败

            collection.findOne({
                'name': name,
                'time.day': day,
                'title': title
            }, function (err, doc) {

                mongodb.close();
                if (err) {
                    return callback(err);
                }
                //	读取失败

                callback(null, doc);
                //	把查询到数据返回给回调函数
            });

        });

    });
};

/**
 * 把文章更新到数据库
 * @param  {[type]}   name     [description]
 * @param  {[type]}   day      [description]
 * @param  {[type]}   title    [description]
 * @param  {[type]}   post     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Post.update = function (name, day, title, post, callback) {
    mongodb.open(function (err, db) {
        //	打开数据库

        if (err) {
            return callback(err);
        }
        //	打开失败,并且返回错误信息

        db.collection('posts', function (err, collection) {
            //	读取posts表

            if (err) {
                mongodb.close();
                return callback(err);
            }
            //	读取失败

            collection.update({
                'title': title,
                'name': name,
                'time.day': day
            }, {
                $set: {
                    'post': post
                }
            }, function (err) {
                //	更新对应的文章

                if (err) {
                    return callback(err);
                }
                //	更新失败

                callback(null);
            });

        });

    });
};

/**
 * 从数据库中删除一篇文章
 * @param  {[type]}   name     [description]
 * @param  {[type]}   day      [description]
 * @param  {[type]}   title    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Post.remove = function (name, day, title, callback) {
    mongodb.open(function (err, db) {
        //	打开数据库

        if (err) {
            return callback(err);
        }
        //	打开失败

        db.collection('posts', function (err, collection) {
            //	读取posts表

            console.log('卧槽!打开数据库!要删东西了嘛!');

            if (err) {
                mongodb.close();
                return callback(err);
            }
            //	读取失败

            collection.findOne({
                'name': name,
                'time.day': day,
                'title': title
            }, function (err, doc) {
                //  找到该文章   

                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                //  查找失败

                var reprint_from;
                if (doc.reprint_info.reprint_from) {
                    reprint_from = doc.reprint_info.reprint_from;
                }
                //  如果有reprint_from,即该文章是转载来的

                if (reprint_from) {
                    collection.update({
                        'name': reprint_from.name,
                        'time.day': reprint_from.day,
                        'title': reprint_from.title
                    }, {
                        '$pull': {
                            'reprint_info.reprint_to': {
                                'name': name,
                                'day': day,
                                'title': title
                            }
                        }
                    }, function (err) {
                        //  更新原文中的转载信息,$pull用于删除数组中的特定项

                        if (err) {
                            mongodb.close();
                            return callback(err);
                        }
                        //  更新失败

                    });
                }
                collection.remove({
                    'name': name,
                    'time.day': day,
                    'title': title
                }, {
                    'w': 1
                }, function (err) {
                    //  根据用户名,日期,标题删除一篇文章

                    mongodb.close();

                    if (err) {
                        return callback(err);
                    }
                    //  删除失败

                    callback(null);
                    //  删除成功
                });

            });
        });
    });
};

/**
 * 返回所有文章的存档信息
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Post.getArchive = function (callback) {
    mongodb.open(function (err, db) {
        //  打开数据库

        if (err) {
            return callback(err);
        }
        //  打开失败

        db.collection('posts', function (err, collection) {
            //  读取posts表

            if (err) {
                mongodb.close();
                return callback(err);
            }
            //  读取失败

            collection.find({}, {
                'name': 1,
                'time': 1,
                'title': 1
            }).sort({
                'time': -1
            }).toArray(function (err, docs) {
                //  返回只包含name、time、title属性的温度组成的数组

                mongodb.close();

                if (err) {
                    callback(err);
                }

                callback(null, docs);

            });
        });

    });
};

/**
 * 获取所有的分类标签
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Post.getTags = function (callback) {
    mongodb.open(function (err, db) {
        //  打开数据库

        if (err) {
            return callback(err);
        }
        //  打开失败

        db.collection('posts', function (err, collection) {
            //  查询posts表

            if (err) {
                mongodb.close();
                return callback(err);
            }
            //  查询失败

            collection.distinct('tags', function (err, docs) {
                //  distinct用来找出指定建的所有不同值

                mongodb.close();

                if (err) {
                    return callback(err);
                }
                //  获取失败

                callback(null, docs);

            });

        });

    });
};

/**
 * 获取指定的分类标签
 * @param  {[type]}   tag      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Post.getTag = function (tag, callback) {
    mongodb.open(function (err, db) {
        //  打开数据库

        db.collection('posts', function (err, collection) {
            //  查询posts表

            if (err) {
                mongodb.close();
                return callback(err);
            }
            //  查询失败

            collection.find({
                'tags': tag
            }, {
                'name': 1,
                'time': 1,
                'title': 1
            }).toArray(function (err, docs) {
                //  查询所有tags里面只包含tag的标签,并且返回由name、time、title组成的对象数组

                mongodb.close();

                if (err) {
                    return callback(err);
                }
                //  查询失败

                callback(null, docs);
            });

        });

    });
};

/**
 * 根据条件搜索
 * @param  {[type]}   keyword  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Post.search = function (keyword, callback) {
    mongodb.open(function (err, db) {
        //  打开数据库

        db.collection('posts', function (err, collection) {
            //  查询posts表

            if (err) {
                mongodb.close();
                return callback(err);
            }
            //  查询失败

            var pattern = new RegExp("^.*" + keyword + ".*$", "i");
            //  组装搜索正则

            collection.find({
                'title': pattern
            }, {
                'time': 1,
                'title': 1,
                'name': 1
            }).sort({
                'time': -1
            }).toArray(function (err, docs) {
                //  根据关键字找出标题中是否含有此字符(串),按时间降序取出相应的数据

                mongodb.close();
                if (err) {
                    return callback(err);
                }
                //  检索失败

                callback(null, docs);
            });

        });

    });
};

/**
 * 转载一篇文章
 * @param  {[type]}   reprint_from [description]
 * @param  {[type]}   reprint_to   [description]
 * @param  {Function} callback     [description]
 * @return {[type]}                [description]
 */
Post.reprint = function (reprint_from, reprint_to, callback) {
    mongodb.open(function (err, db) {
        //  打开数据库

        if (err) {
            return callback(err);
        }
        //  打开失败

        db.collection('posts', function (err, collection) {
            //  查询posts表

            if (err) {
                mongodb.close();
                return callback(err);
            }
            //  打开失败

            collection.findOne({
                'name': reprint_from.name,
                'time.day': reprint_from.day,
                'title': reprint_from.title
            }, function (err, doc) {
                //  查找原来的文档信息

                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                //  查找失败

                var date = new Date(),
                    time = {
                        'date': date,
                        'year': date.getFullYear(),
                        'month': date.getFullYear() + "-" + (date.getMonth() + 1),
                        'day': date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
                        'minutes': date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes())
                    };
                delete doc._id;
                //  删除_id,因为_id是唯一的

                doc.name = reprint_to.name;
                doc.head = reprint_to.head;
                doc.time = time;
                doc.title = doc.title.search(/[转载]/ > -1) ? doc.title : "[转载]" + doc.title;
                doc.comments = [];
                doc.reprint_info = {
                    'reprint_from': reprint_from
                };
                doc.pv = 0;
                //  组装副本数据,用做插入数据库

                collection.update({
                    'name': reprint_from.name,
                    'time.day': reprint_from.day,
                    'title': reprint_from.title
                }, {
                    '$push': {
                        'reprint_info.reprint_to': {
                            'name': doc.name,
                            'day': time.day,
                            'title': doc.title
                        }
                    }
                }, function (err) {
                    //  更新原来文档中reprint_info中的reprint_to属性

                    if (err) {
                        mongodb.close();
                        return callback(err);
                    }
                    //  更新失败

                    collection.insert(doc, {
                        'safe': true
                    }, function (err, post) {
                        //  将生成的副本重新插入数据库,并且返回存储后的文档

                        mongodb.close();

                        if (err) {
                            return callback(err);
                        }
                        //  转载失败

                        callback(null, post[0]);

                    });
                });

            });

        });

    });
};

module.exports = Post;