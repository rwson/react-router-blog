/**
 * 发布新文章
 */

"use strict";

$(function () {

    var titleFiled = $("#title-filed"),     //  文章标题的输入域
        tagsFiled = $("#tags-filed"),       //  文章标签的输入域
        categoryFiled = $("#category"),     //  分类
        emptyBtn = $("#empty"),             //  清除按钮
        saveBtn = $("#save"),               //  保存按钮
        tipsModal = $("#tips"),             //  消息提示框
        tipsCon = $("#tips-content"),       //  消息提示内容
        tagShow = $("#tag-show"),           //  显示标签的地方
        cateShow = $("#cate-show"),         //  显示标签的地方
        tags = [],                          //  标签数组
        categorys = [];                     //  分类数组

    //  初始化编辑器
    var editor = editormd("editormd", {
        id: "editormd",
        path: "../editor.md/lib/",
        width: "90%",
        height: 740,
        codeFold: true,
        saveHTMLToTextarea: true,
        emoji: true,
        imageUpload: true,
        imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
        imageUploadURL: "/upload/file",
        crossDomainUpload: true
    });

    //  删除一个标签
    $(document).on("click", "em.delete-tag", function (ev) {
        var id = $(this).parents(".tag-item").attr("id");
        tags = tags.filter(function (item) {
            return item["_id"] !== id;
        });
        $("#" + id).remove();
    });

    //  删除一个分类
    $(document).on("click", "em.delete-cate", function (ev) {
        var id = $(this).parents(".tag-item").attr("id");
        categorys = categorys.filter(function (item) {
            return item["_id"] !== id;
        });
        $("#" + id).remove();
    });

    //  标签
    tagsFiled.keyup(function (ev) {
        if (ev.keyCode == 13) {
            var val = $(this).val();
            if (val.trim().length) {
                //  已有标签个数验证
                if (tags.length == 5) {
                    tipsCon.text("").text("最多支持5个标签,删除一个继续添加!");
                    tipsModal.modal();
                    return;
                }

                //  添加新标签
                var id = _getRandomId();
                tagShow.append("<span class='btn btn-default tag-item' id='" + id + "'>" + val + "<em class='delete-tag' title='删除'>&times;</em></span>");
                tags.push({
                    "_id": id,
                    "name": val
                });
                $(this).val("");
                return false;
            } else {
                //  没有输入内容就按下回车
                tipsCon.text("").text("请先输入标签名!");
                tipsModal.modal();
            }
        }
    });

    //  分类
    categoryFiled.keyup(function (ev) {
        if (ev.keyCode == 13) {
            var val = $(this).val();
            if (val.trim().length) {
                //  已有标签个数验证
                if (categorys.length == 5) {
                    tipsCon.text("").text("最多支持5个分类,删除一个继续添加!");
                    tipsModal.modal();
                    return;
                }

                //  添加新标签
                var id = _getRandomId();
                cateShow.append("<span class='btn btn-default tag-item' id='" + id + "'>" + val + "<em class='delete-cate' title='删除'>&times;</em></span>");
                categorys.push({
                    "_id": id,
                    "name": val
                });
                $(this).val("");
                return false;
            } else {
                //  没有输入内容就按下回车
                tipsCon.text("").text("请先输入分类名!");
                tipsModal.modal();
            }
        }
    });

    //  清空所编辑的内容
    emptyBtn.click(function () {
        editor.setValue("");
        tags = [];
        tagShow.empty();
        categoryFiled.val("");
        titleFiled.val("");
        tagsFiled.val("");
    });

    //  保存按钮点击
    saveBtn.click(function () {
        var postTags = tags.map(function (item) {
            return item["name"];
        });
        var date = new Date();
        var data = {
            "day": date.getFullYear() + "-" + _toDouble(parseInt(date.getMonth() + 1)) + "-" + _toDouble(date.getDate()),
            "title": titleFiled.val().trim(),
            "tags": postTags,
            "categorys": [categoryFiled.val().trim()],
            "post": editor.getHTML()
        };

        $.ajax({
            "url": "/post/article",
            "method": "POST",
            "data": data,
            "success": function (res) {
                //  添加成功
                tipsCon.text(res.message);
                tipsModal.modal();
                tipsModal.find(".btn-default").click(function(){
                    editor.setValue("");
                    tags = [];
                    tagShow.empty();
                    categoryFiled.val("");
                    titleFiled.val("");
                    tagsFiled.val("");
                });
            },
            "error": function (err) {
                //  添加失败
                tipsCon.text(err.message);
                tipsModal.modal();
            }
        });
    });

    /**
     * 生成随机id
     * @returns {string}
     * @private
     */
    function _getRandomId() {
        return Math.random().toString(16).substr(2);
    }

    /**
     * 一位数字转换成2位
     * @param num
     * @returns {*}
     * @private
     */
    function _toDouble(num) {
        return num > 9 ? num : "0" + num;
    }

});
