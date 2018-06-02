$(function () {
    var $dom = $(document)

    var theData = {
        authToken: '',
    }

    /*全部订单*/
    var getList = function (page) {
    }

    /*时间选择*/
    laydate.render({
        elem: '.ipt-time',
        // lang: 'en'
    });
    $("ul.dropdown-menu").on("click", "[data-stopPropagation]", function (e) {
        e.stopPropagation();
    });
    $('.dropdown-toggle').dropdown()

    /*下载报表*/
    $dom.on('change', 'select', function () {
        var $this = $(this)
        $this.val() ? $this.addClass('on') : $this.removeClass('on')
    })
    $dom.on('click', '#btn-download', function () {
        $('.table').tableExport({
            filename: '订单数据',
            format: 'csv'
        });
    })

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