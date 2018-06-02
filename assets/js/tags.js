$(function () {
    var $dom = $(document)

    var theData = {
        authToken: '',
    }

    /*获取费率数据*/
    var getRate = function (cb) {
    }
    /*更新费率数据*/
    var updateRate = function (cb) {
    }

    /*获取标签*/
    var getTags = function (cb) {
    }

    /*添加标签*/
    var addTags = function (cb) {
    }

    /*更新标签*/
    var updateTags = function (cb) {
    }

    /*删除标签*/
    var delTags = function (cb) {
    }

    $("ul.dropdown-menu").on("click", "[data-stopPropagation]", function (e) {
        e.stopPropagation();
    });
    $('.dropdown-toggle').dropdown()


    /*搜索*/
    $dom.on('click', '.ipt-search', function () {

    })

    /*注销*/
    $dom.on('click', '.log-out', function () {
        me.cookies.del('PhiliUsr')
        setTimeout(function () {
            location.href = 'login.html'
        }, 200)
    })
})