/**
 * 文章管理
 */

"use strict";

$(function () {

    var list = $("#list");

    $.ajax({
        "url": "/articles/all",
        "method": "GET",
        "success": function (res) {
            res.list.forEach(function (item) {
                list.append("<li>" + item["title"] + " | <a href='javascript:;' class='delete' id='" + item["_id"] + "'>删除</a></li>");
            });
        }
    });

    $(document).on("click", "a.delete", function () {
        var id = $(this).attr("id");
        var res = confirm("真的要删除这篇文章么?");
        if (res) {
            $.ajax({
                "url":"/article/delete/" + id,
                "method":"POST",
                "success":function(res){
                    alert(res.message);
                    location.reload();
                },
                "error":function(err){
                    alert("删除失败,请重试!");
                }
            });
        }
    });

});
