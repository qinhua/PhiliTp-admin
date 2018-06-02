!function () {
    var $dom, urlParam = me.getURLParams()


    var theData = {
        authToken: '',
    }

    // 01.全部订单
    var renderIndex = function () {
    }
    // 02.流水统计
    var renderStatistic = function () {
    }
    // 03.充值标签
    var renderTags = function () {
    }


    $(function () {

        // 页面路由
        var pages = ['index.html'], curPage = pages[0]
        // console.log(curPage)
        var renderPage = function () {
            for (var i = 0; i < pages.length; i++) {
                var cur = pages[i]
                if (location.pathname.indexOf(cur) > -1) {
                    curPage = cur
                }
            }
            // console.info(curPage)
            switch (curPage) {
                case 'index.html':
                    renderIndex()
                    break
                case 'statistic.html':
                    renderStatistic()
                    break
                case 'tags.html':
                    renderTags()
                    break
                default:
                    renderIndex()
            }
        }

        /* 登录检测 */
        var needLogin = me.locals.get('philiUsr')

        if (!needLogin) {
            setTimeout(function(){
                alert('请先登录')
                location.href=''
            },500)
        } else {
            renderPage()
        }
    })
}()