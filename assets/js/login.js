var cookies = {
    set: function (name, value, expireHours) {
        var cookieString;
        if (typeof value === "object") {
            cookieString = name + "=" + JSON.stringify(value);
        } else {
            cookieString = name + "=" + escape(value);
        }
        //判断是否设置过期时间
        if (expireHours > 0) {
            var date = new Date();
            date.setTime(date.getTime + expireHours * 3600 * 1000);
            cookieString = cookieString + "; expire=" + date.toGMTString();
        }
        document.cookie = cookieString;
    }
    ,
    get: function (name, isObj) {
        if (document.cookie.length > 0) {
            var c_start, c_end, lc = document.cookie;
            if (name && lc.indexOf("v2xss") === -1) {
                c_start = lc.indexOf(name + "=");
                if (c_start !== -1) {
                    c_start = c_start + name.length + 1;
                    c_end = lc.indexOf(";", c_start);
                    if (c_end === -1) c_end = lc.length;
                    var llc = decodeURIComponent(lc.substring(c_start, c_end));
                    console.log(llc)
                    return isObj ? ((llc && llc !== "{}") ? JSON.parse(llc) : '') : ((llc && llc !== "{}") || "");
                }
            } else {
                return unescape(lc);
            }
        }
        return ""
    }
    ,
    del: function (name) {
        var date = new Date();
        date.setTime(date.getTime() - 10000);
        document.cookie = name + "=v2xss; expire=" + date.toGMTString();
    }
    ,
    //检查是否有指定cookie
    check: function (name, callback01, callback02) {
        var strs = myKit.cookies.get(name);
        if (strs != null && strs != "") {
            // 有记录
            console.log("存在记录为：" + name + "的cookie");
            callback01 ? callback01() : null;
        } else {
            // 无记录
            console.log("不存在记录为：" + name + "的cookie");
            callback02 ? callback02() : null;
        }
    }
}
$(function () {
    var $dom = $(document)
    $.backstretch("assets/img/1.jpg");
    /*$(".foo").backstretch([
        "path/to/image.jpg",
        "path/to/image2.jpg",
        "path/to/image3.jpg"
    ], {duration: 4000});*/
    /*忘记密码*/
    /*$dom.on('click', '.forgetPsw', function (e) {
        $('#myModal').on('shown.bs.modal', function () {
            $('#myInput').focus()
        })
    })*/

    /*表单验证*/
    $('.login-form input[type="text"], .login-form input[type="password"]').on('focus', function () {
        $(this).removeClass('input-error')
    })
    /*数据提交*/
    $('.login-form').on('submit', function (e) {
        cookies.set('PhiliUsr', JSON.stringify({name: $(".signin-name").val(), psw: $(".signin-password").val()}))
        // cookies.get('PhiliUsr',true)
        $(this).find('input[type="text"], input[type="password"]').each(function () {
            if (!$(this).val()) {
                e.preventDefault();
                $(this).addClass('input-error');
            }
            else {
                $(this).removeClass('input-error');
            }
        })
    })
})