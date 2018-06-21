$(function () {
    var $dom = $(document)

    template.defaults.imports.statusTxt = function (data) {
        var obj = {
            1: '充值中',
            2: '充值成功',
            3: '充值失败'
        }
        return obj[data]
    }
    template.defaults.imports.statusCls = function (data) {
        return 'sta' + data
    }

    /*全部订单*/
    var getList = function (page) {
        me.loadData(Config.host + Config.api.orderList, {
            'requestapp': JSON.stringify({
                _r: window.sign(1),
                status: $('#t-status').val(),
                createTime: $('#t-createTime').val(),
                phone: $('#t-phone').val(),
                pageSize: $('#pageSize').text().trim().replace(/条\/\页/g, ''),
                pageNo: page
            })
        }, 'POST', 'JSON', null, null, function (res) {
            if (res.success) {
                var resD = res.data
                $('#table-box').html(template('render-table', {
                    data: resD.itemList
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
                    orderNumber: "F445286576",
                    telephone: "905505765255",
                    vendor: "CGV",
                    value: 100,
                    status: 2,
                    createTime: 1496070000000,
                    updateTime: 1496246400000
                }, {
                    id: 1,
                    orderNumber: "F445286575",
                    telephone: "903521273254",
                    vendor: "CGV",
                    value: 150,
                    status: 1,
                    createTime: 1496070000000,
                    updateTime: 1496246400000
                }, {
                    id: 2,
                    orderNumber: "F445286574",
                    telephone: "906625356253",
                    vendor: "CGV",
                    value: 120,
                    status: 2,
                    createTime: 1496073600000,
                    updateTime: 1496246400000
                }, {
                    id: 3,
                    orderNumber: "F445286573",
                    telephone: "908652325252",
                    vendor: "CGV",
                    value: 50,
                    status: 3,
                    createTime: 1496073600000,
                    updateTime: 1496246400000
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
        //$('#userPageNumber').val($(this).text())
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