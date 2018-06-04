$(function () {
    var $dom = $(document)

    var theData = {
        authToken: '',
    }

    /*流水数据*/
    var getList = function (page) {
        me.loadData(Config.host + Config.api.orderList, {
            'requestapp': JSON.stringify({
                _r: window.sign(1),
                createTime: $('#t-createTime').val(),
                pageSize: $('#pageSize').text().trim().replace(/条\/\页/g, ''),
                page: page
            })
        }, 'POST', 'JSON', null, null, function (res) {
            if (res.success) {
                var resD = res.data
                $('#table-box').html(template('render-table', {
                    data: res.data
                }))
                renderPagination(page, resD.count)
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

    /*分页功能*/
    function renderPagination(page, pageCount) {
        var options = {
            bootstrapMajorVersion: 3,
            currentPage: page,
            numberOfPages: 5,
            totalPages: pageCount || 10,
            onPageClicked: function (event, originalEvent, type, page) {
                var cPage, lastPage = parseInt($('.pagination .active a').text())
                switch (type) {
                    case 'first':
                        cPage = 1
                        break
                    case 'prev':
                        cPage = lastPage - 1
                        break
                    case 'next':
                        cPage = lastPage + 1
                        break
                    case 'last':
                        cPage = pageCount
                        break
                    default:
                        cPage = page
                }
                getList(page)
            },
            /*onPageChanged: function () {
             },*/
        }
        $('.pagination').bootstrapPaginator(options);
    }

    $dom.on('click', '.pageDropDown li', function (e) {
        $('#pageSize').text($(this).text())
        getList()
    })
    $dom.on('click', '.pagination li', function () {
        var $this = $(this)
        getList($this.text())
        $this.addClass('active').siblings('li').removeClass('active')
    })
    $dom.on('click', '.userPageGo', function () {
        var val = $('#userPageNumber').val()
        getList(val)
    })

    /*注销*/
    $dom.on('click', '.log-out', function () {
        me.cookies.del('PhiliUsr')
        setTimeout(function () {
            location.href = 'login.html'
        }, 200)
    })
})