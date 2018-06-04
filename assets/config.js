/**
 * Created by Chin on 2018/6/1.
 */
window.sign = function (a) {
    var c = Math.abs(parseInt(new Date().getTime() * Math.random() * 10000)).toString();
    var d = 0;
    for (var b = 0; b < c.length; b++) {
        d += parseInt(c[b])
    }
    var e = function (f) {
        return function (g, h) {
            return (0 >= (h - "" + g.length)) ? g : (f[h] || (f[h] = Array(h + 1).join(0))) + g
        }
    }([]);
    d += c.length;
    d = e(d, 3 - d.toString().length);
    return a.toString() + c + d
}
window.cookies = {
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
window.PhiToken = window.cookies.get('PhiliUsr', true).token
console.log(window.PhiToken)
var Config = {
    name: '菲律宾电话充值管理后台',
    host: 'http://www.youni.club',
    api: {
        login: '/admin/login',
        logOut: '',
        orderList: '/order/list',
        statisList: '',
        getRate: '/feeRate/get',
        updateRate: '/feeRate/set',
        tagList: '/TelCostConfig/getConfig',
        addTag: '/TelCostConfig/add',
        updateTag: '',
        delTag: '/TelCostConfig/del'
    }
}

/*artTemplate扩展*/
if (typeof template !== 'undefined') {
    template.defaults.imports.dateFormat = function (time, format) {
        if (time) {
            var ctime = new Date(time);
            format = format || "yyyy-MM-dd HH:mm:ss";
            var o = {
                "M+": ctime.getMonth() + 1,
                "d+": ctime.getDate(),
                "h+": ctime.getHours() % 12,
                "H+": ctime.getHours(),
                "m+": ctime.getMinutes(),
                "s+": ctime.getSeconds(),
                "q+": Math.floor((ctime.getMonth() + 3) / 3),
                "S": ctime.getMilliseconds()
            };
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (ctime.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(format))
                        format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return format;
            }
        } else {
            return ''
        }

    }
    template.defaults.imports.timestamp = function (value) {
        return value * 1000
    }
}
