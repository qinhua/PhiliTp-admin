$(function () {
    var $dom = $(document)

    var theData = {
        authToken: '',
    }

    /*流水数据*/
    var getList = function (page) {
        me.loadData(Config.host + Config.api.statisList, {
            'requestapp': JSON.stringify({
                _r: window.sign(1),
                createTime: $('#t-createTime').val()
            })
        }, 'POST', 'JSON', null, null, function (res) {
            if (res.success) {
                $('#table-box').html(template('render-table', {
                    data: res.data
                }))
            } else {
                layer.msg(res.message || '获取失败！')
            }
        }, function (res) {
            layer.msg(res.message || '获取失败！')
            $('#table-box').html(template('render-table', {
                data: [{
                    id: 1,
                    payAmount: 120,
                    finishAmount: 118,
                    waitAmount: 2,
                    totalAmount: 12500,
                    totalIncome: 1995,
                    createTime: 1496070000000
                }]
            }))
        })
    }
    getList()

    /*时间选择*/
    laydate.render({
        elem: '.ipt-time',
        // lang: 'en'
    });
    $("ul.dropdown-menu").on("click", "[data-stopPropagation]", function (e) {
        e.stopPropagation();
    });
    $('.dropdown-toggle').dropdown()

    $dom.on('change', 'select', function () {
        var $this = $(this)
        $this.val() ? $this.addClass('on') : $this.removeClass('on')
    })
    /*下载报表*/
    $dom.on('click', '#btn-download', function () {
        $('.table').tableExport({
            filename: '订单数据',
            format: 'csv'
        })
    })
    /*刷新*/
    $dom.on('click', '#btn-refresh', function () {
        getList()
    })

    /*搜索*/
    $dom.on('click', '.ipt-search', function () {
        getList()
    })

    /*注销*/
    $dom.on('click', '.log-out', function () {
        me.cookies.del('PhiliUsr')
        setTimeout(function () {
            location.href = 'login.html'
        }, 200)
    })
})