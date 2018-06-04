$(function () {
    var $dom = $(document)

    /*获取费率数据*/
    var getRate = function (cb) {
        me.loadData(Config.host + Config.api.getRate, {
            'requestapp': JSON.stringify({
                _r: me.sign(1)
            })
        }, 'POST', 'JSON', null, null, function (res) {
            layer.closeAll()
            if (res.success) {
                $('.rates-box').html(template('render-rates', {
                    data: res.data
                }))
            } else {
                layer.msg(res.message || '获取失败！')
            }
        }, function (res) {
            layer.msg(res.message || '获取失败！')
            $('.rates-box').html(template('render-rates', {
                data: {
                    "id": 1,
                    "rmb": 100,
                    "forex": 300,
                    "status": 0,
                    "createTime": "2018-06-02 19:56:02",
                    "updateTime": "2018-06-02 19:56:02"
                }
            }))
        })
    }
    /*更新费率*/
    $dom.on('click', '.btn-editR', function () {
        if (me.isPosting) return false
        var $this = $(this), $parent = $this.parent()/*, cid = $this.attr('data-id')*/
        if ($this.text() === '编辑') {
            $parent.addClass('active')
            $parent.find('input').prop('disabled', false)
            $this.text('保存')
        } else {
            me.loadData(Config.host + Config.api.updateRate, {
                'requestapp': JSON.stringify({
                    _r: me.sign(1),
                    serviceRate: $('#serviceRate').val(),
                    timeRate: $('#timeRate').text()
                })
            }, 'POST', 'JSON', null, function () {
                me.isPosting = true
                var index = layer.load(2, {
                    shade: [0.1, '#fff'] //0.1透明度的白色背景
                })
            }, function (res) {
                me.isPosting = false
                if (res.success) {
                    getRate()
                    getTags()
                } else {
                    layer.msg(res.message || '更新失败！')
                }
            }, function (res) {
                me.isPosting = false
                layer.closeAll()
                layer.msg(res.message || '更新失败！')
                /*$parent.removeClass('active')
                 $parent.find('input').prop('disabled', true)
                 $this.text('编辑')*/
            })
        }
    })

    /*获取标签*/
    var getTags = function (cb) {
        me.loadData(Config.host + Config.api.tagList, {
            'requestapp': JSON.stringify({
                _r: me.sign(1),
                userId: ''
            })
        }, 'POST', 'JSON', null, null, function (res) {
            me.isPosting = false
            layer.closeAll()
            if (res.success) {
                $('.tags-box').html(template('render-tags', {
                    data: res.data
                }))
            } else {
                layer.msg(res.message || '标签获取失败！')
            }
        }, function (res) {
            $('.tags-box').html(template('render-tags', {
                data: [{id: 1, peso: 100, rmb: 8}, {
                    id: 2,
                    forex: 150,
                    rmb: 11
                }, {id: 3, forex: 200, rmb: 16}, {id: 4, forex: 250, rmb: 17}, {id: 5, forex: 350, rmb: 26}]
            }))
            layer.msg(res.message || '标签获取失败！')
        })
    }

    /*添加标签*/
    $dom.on('click', '.btn-saveTag', function () {
        if (me.isPosting) return false
        var price = $('#tagPrice').val()
        if (!price) {
            layer.msg('请填写充值金额！')
            return false;
        }
        me.loadData(Config.host + Config.api.addTag, {
            'requestapp': JSON.stringify({
                _r: me.sign(1),
                forex: price
            })
        }, 'POST', 'JSON', null, function () {
            me.isPosting = true
            var index = layer.load(2, {
                shade: [0.1, '#fff'] //0.1透明度的白色背景
            })
        }, function (res) {
            me.isPosting = false
            layer.closeAll()
            $('#modalTags').modal('hide')
            if (res.success) {
                getTags()
            } else {
                layer.msg(res.message || '添加失败！')
            }
        }, function (res) {
            me.isPosting = false
            layer.closeAll()
            layer.msg(res.message || '添加失败！')
        })
    })

    /*更新标签*/
    $dom.on('click', '.btn-editT', function () {
        if (me.isPosting) return false
        var $this = $(this), cid = $this.attr('data-id'), $parent = $this.parent()
        if ($this.text() === '编辑') {
            // $('.f-tag').removeClass('active').find('.btn-editT').text('编辑')
            $parent.addClass('active')
            $parent.find('input').prop('disabled', false)
            $this.text('保存')
        } else {
            me.loadData(Config.host + Config.api.updateTag, {
                _r: me.sign(1),
                id: cid,
                value: $parent.find('#peso').val()
            }, 'POST', 'JSON', null, function () {
                me.isPosting = true
                var index = layer.load(2, {
                    shade: [0.1, '#fff'] //0.1透明度的白色背景
                })
            }, function (res) {
                me.isPosting = false
                layer.closeAll()
                if (res.success) {
                    getTags()
                } else {
                    layer.msg(res.message || '更新失败！')
                }
            }, function (res) {
                me.isPosting = false
                layer.closeAll()
                layer.msg(res.message || '更新失败！')
                /*$parent.removeClass('active')
                 $parent.find('input').prop('disabled', true)
                 $this.text('编辑')*/
            })
        }
    })

    /*删除标签*/
    $dom.on('click', '.f-tag .close', function () {
        if (me.isPosting) return false
        var $this = $(this), cid = $this.attr('data-id'), $parent = $this.parent()
        layer.confirm('确定删除该标签？', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            me.loadData(Config.host + Config.api.delTag, {
                'requestapp': JSON.stringify({
                    _r: me.sign(1),
                    id: cid
                })
            }, 'POST', 'JSON', null, function () {
                me.isPosting = true
                layer.closeAll()
                var index = layer.load(2, {
                    shade: [0.1, '#fff'] //0.1透明度的白色背景
                })
            }, function (res) {
                me.isPosting = false
                layer.closeAll()
                if (res.success) {
                    $parent.remove()
                    // getTags()
                } else {
                    layer.msg(res.message || '删除失败！')
                }
            }, function (res) {
                me.isPosting = false
                layer.closeAll()
                layer.msg(res.message || '删除失败！')
            })
        }, function () {
        })
    })
    getRate()
    getTags()

    /*注销*/
    $dom.on('click', '.log-out', function () {
        me.cookies.del('PhiliUsr')
        setTimeout(function () {
            location.href = 'login.html'
        }, 200)
    })
})