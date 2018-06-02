/* eslint-disable */
/**
 * Created by Chin on 2018/06/02
 */
(function (global, factory) {

    "use strict";

    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ?
            factory(global, true) :
            function (w) {
                if (!w.document) {
                    throw new Error("myKit requires a window with a document");
                }
                return factory(w);
            };
    } else {
        factory(global);
    }

    // Pass this if window is not defined yet
})(typeof window !== "undefined" ? window : this, function (window, noGlobal) {
    //"use strict";
    var myKit = {
        localName: '',
        isPosting: false, //重复提交标识
        hideLoading: function () {
            $('.p-loading').hide();
            $('.container').show();
        },
        // 当前环境：无需手动修改
        envir: (window.location.href.indexOf('http://localhost') !== -1 || window.location.href.indexOf('http://192.168') !== -1) ? 'dev' : 'prod',
        // api请求前缀：无需手动修改
        apiBegin: {
            dev: {
                host: '//192.168.0.91'
            },
            prod: {
                host: '//xxxx'
            }
        },
        // post接口：无需手动修改
        apiEnd: {
            /**
             * 提交数据
             */
            create: '/api/open/h5/clue/save.htm',
            /**
             * 获取验证码
             */
            getSms: '/api/open/h5/clue/send-sms-code.htm'
        },

        config: {
            needPos: true,
            // 分享参数配置
            share: {
                pyq: '朋友圈标题',
                title: '分享标题',
                description: '分享描述',
                imageUrl: '',
                iconUrl: '',
                url: ''
            },
            template: {
                loadingMask: '<div class="tip-con"><div class="line-scale"><div></div><div></div><div></div><div></div><div></div></div><p>处理中…</p></div>',
                loading: '<div class="loader"><div class="loader-inner ball-beat"><div></div><div></div><div></div></div></div>',
                loadMore: '<div class="loadMore">加载更多…</div>',
                viewMore: '<div class="viewMore"><div class="wrp vmore"><span>查看更多</span></div></div>',
                slideMore: '<p class="slideMore">上滑显示更多 ▲</p>',
                noData: '<div class="noData">这里啥都没有-_-!</div>',
                noMoreData: '<div class="noMoreData">已无更多</div>',
                login: [
                    '<div class="status-inner">',
                    '    <div class="com-login"></div>',
                    '    <span class="btn btn-close"></span>',
                    '</div>'
                ].join("")
            },
            carContent: []
        },

        /**
         * 数据加载
         * @param url 接口地址
         * @param params 参数
         * @param method get or post
         * @param dataType json or jsonp
         * @param async true or false
         * @param beforeCb beforeSend callback
         * @param successCb successCb callback
         * @param errCb errCb callback
         * @param timeOut ajax timeout
         */
        loadData: function (url, params, method, dataType, async, beforeCb, successCb, errCb, timeOut) {
            $.ajax({
                type: method || 'GET',
                url: url,
                async: async || true,
                cache: false,
                timeout: timeOut || 3000,
                //data: $.extend(params || '', {
                //  _r: typeof sign != "undefined" ? sign(1) : ''
                //}),
                data: params || '',
                dataType: dataType || 'JSON',
                beforeSend: function () {
                    beforeCb && beforeCb();
                },
                success: function (data) {
                    successCb && successCb(data);
                },
                error: function (err) {
                    if (err && err.status == 200) {
                        successCb && successCb(err);
                        return
                    }
                    errCb && errCb(err);
                }
            });
        },
        /**
         * 点击加载更多
         * @param ele 触发元素
         * @param listEle 列表元素
         * @param cb 加载方法
         * @param pageSize 分页大小
         */
        loadMore: function (ele, listEle, cb, pageSize) {
            $(document).on("click", $(ele), function () {
                var curPage = ($(listEle).find("li").length) / pageSize;
                if (curPage >= 1) {
                    cb(curPage + 1);
                }
                //else {
                //    $(".loadMore").remove();
                //    $(listEle).append(myKit.config.template.noMoreData);
                //}
            })
        },

        /**
         * 节流函数
         * @param event 触发的事件(选填)
         * @param func 高频操作
         * @param wait 间隔时间
         * @param immediate 是否立即执行
         * @param ele 容器
         */
        throttle: function (event, func, wait, immediate, ele) {
            function delayFun() {
                var timeout;
                return function () {
                    var context = this, args = arguments;
                    var later = function () {
                        timeout = null;
                        if (!immediate) func.apply(context, args);
                    };
                    var callNow = immediate && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                    if (callNow) func.apply(context, args);
                };
            };

            // 用法
            var myEfficientFn = delayFun(func, 250);
            if (event) {
                (ele ? document.querySelector(ele) : window).addEventListener(event, myEfficientFn);
            } else {
                myEfficientFn()
            }
        },

        /**
         * 摇一摇
         * @param thresholds
         * @param direction
         * @param callback
         */
        shake: function (thresholds, direction, callback) {
            var threshold = thresholds;
            var last_update = 0,
                lastArr = [];
            var x = 0,
                y = 0,
                z = 0,
                last_x = 0,
                last_y = 0,
                last_z = 0;

            var deviceMotionHandler = function (eventData) {
                //eventData.cancelBubble();
                var acceleration = eventData.accelerationIncludingGravity;
                var curTime = new Date().getTime();
                if ((curTime - last_update) > 100) {
                    var diffTime = curTime - last_update;
                    last_update = curTime;
                    x = acceleration.x;
                    y = acceleration.y;
                    z = acceleration.z;
                    var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;

                    if (speed > threshold) {
                        //alert("摇动了");
                        if (callback) {
                            delay ? setTimeout(function () {
                                callback();
                            }, delay) : callback();
                        }
                    }
                    // last_x = x;
                    // last_y = y;
                    // last_z = z;
                    lastArr[x, y, z];
                }
            };
            //绑定摇动事件
            this.loadEvent = function () {
                if (window.DeviceMotionEvent) {
                    window.addEventListener('devicemotion', deviceMotionHandler, false);
                }
            };
            //移除摇动事件
            this.detachEvent = function () {
                window.removeEventListener('devicemotion');
            };
            this.getLastData = function () {
                return lastArr;
            };
        },
        /**
         * 移动端hover效果
         * @param targetId 目标id
         * @param hoverCls hover类
         */
        hover: function (targetId, hoverCls) {
            var curObj = document.querySelector(targetId);
            curObj.addEventListener('touchstart', function () {
                this.className += hoverCls;
            }, false);
            curObj.addEventListener('touchend', function () {
                this.className = '';
            }, false);
        },
        //移动端click事件，若有input点击事件请勿使用
        attachClick: function () {
            if (typeof FastClick !== 'undefined' && myKit.envir === 'prod') {
                FastClick.attach(document.body);
            }
        },
        //表单验证
        chineseName: /^[\u4e00-\u9fa5]{2,4}$/,
        mobilePhone: /^(13|14|15|16|17|18|19)\d{9}$/,
        isHan: /^[\u4E00-\u9FA5]$/,
        isEnglish: /^[a-zA-Z]$/,
        hasHan: /[\u4E00-\u9FA5]/g,
        hasEnglish: /[a-zA-Z]/g,
        idNumber: /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/,
        checkStr: function (str) {
            if (escape(str).indexOf("%u") != -1)
                alert("不能含有汉字");
            else if (str.match(/\D/) != null) {
                alert('不能含有字母');
            }
        },
        checkPhone: function (str) {
            str = str.trim();
            var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
            var isMob = /^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
            return (isPhone.test(str) || isMob.test(str)) ? true : false;
        },
        isOnline: navigator.onLine,
        isDev: window.location.href.indexOf('http://localhost') !== -1 || window.location.href.indexOf('http://192.168') !== -1,
        isWeixin: !!window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i),
        isWeibo: !!window.navigator.userAgent.toLowerCase().match(/WeiBo/i),
        isQq: !!window.navigator.userAgent.toLowerCase().match(/QQ/i),
        isIos: (window.navigator.userAgent.toLowerCase().match(/iphone|ipad|ipod/i)) ? true : false,
        isAndroid: (window.navigator.userAgent.toLowerCase().match(/android/i)) ? true : false,
        isIosOrAndroid: (window.navigator.userAgent.toLowerCase().match(/iphone|ipad|ipod/i)) ? "ios" : (window.navigator.userAgent.toLowerCase().match(/android/i) ? "android" : "others"),
        //来自移动端还是PC端
        isFrom: function () {
            var userAgentInfo = navigator.userAgent;
            var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
            var flag = false;
            var v = 0;
            var source = '';
            for (v; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                source = "mobile";
            } else {
                source = "web";
            }
            return source;
        },
        isOnlineEvt: function () {
            window.addEventListener('load', function () {
                var status = document.getElementById("status");

                function updateOnlineStatus(event) {
                    var condition = navigator.onLine ? "online" : "offline";

                    status.className = condition;
                    status.innerHTML = condition.toUpperCase();

                    log.insertAdjacentHTML("beforeend", "Event: " + event.type + "; Status: " + condition);
                }

                window.addEventListener('online', updateOnlineStatus);
                window.addEventListener('offline', updateOnlineStatus);
            });
        },
        isWindow: function (obj) {
            return obj != null && obj === obj.window;
        },
        isObject: function (obj) {
            return typeof obj === "object";
        },
        isEmptyObject: function (o) {
            for (var p in o) {
                if (p !== undefined) {
                    return false;
                }
            }
            return true;
        },
        isNumber: function (nums) {
            return !isNaN(Number(nums));
        },
        isArray: function (sources) {
            return '[object Array]' == Object.prototype.toString.call(sources);
        },
        isDate: function (sources) {
            return {}.toString.call(sources) === "[object Date]" && sources.toString() !== 'Invalid Date' && !isNaN(sources);
        },
        isElement: function (sources) {
            return !!(sources && sources.nodeName && sources.nodeType == 1);
        },
        isFunction: function (sources) {
            return '[object Function]' == Object.prototype.toString.call(sources);
        },
        isNumber: function (sources) {
            return '[object Number]' == Object.prototype.toString.call(sources) && isFinite(sources);
        },
        isObject: function (sources) {
            return '[object Object]' == Object.prototype.toString.call(sources);
        },
        isString: function (sources) {
            return '[object String]' == Object.prototype.toString.call(sources);
        },
        isBoolean: function (sources) {
            return typeof sources === 'boolean';
        },
        isLeapYear: function (year) {
            return new Date(year).isLeapYear();
        },
        // 判断是否为隐私模式
        isPrivacyMode: function () {
            var testV = +new Date();
            var result = false;
            try {
                localStorage.setItem('checkStealth', testV);
                if (localStorage.getItem('checkStealth') != testV) {
                    result = true;
                }
            } catch (e) {
                result = true;
            }
            return result;
        },

        /**
         * 混淆字符串
         * @param str 字符串
         * @param mixStr 混淆字符
         * @param start 起点
         * @param end 终点
         */
        mixStr: function (str, mixStr, start, end) {
            mixStr = mixStr || "***";
            return str.replace(str.slice(start, end), mixStr)
        },
        /**
         * 设置标题
         * @param str
         */
        setTitle: function (str) {
            setTimeout(function () {
                document.title = str || '';
            }, 300)
        },
        url: {
            prefix: location.protocol + "//",
            host: location.host,
            baseUrl: location.protocol + "//" + location.host + location.pathname,
            paramStr: location.search,
            hash: location.hash
        },
        reload: function (force) {
            location.reload(force || true)
        },
        // 获取地址栏hash
        getHash: function () {
            var hash = {};
            var HrefHasgParams = window.location.hash && window.location.hash.replace(/^\#/, '').split('&');

            for (var i = 0, len = HrefHasgParams.length; i < len; i++) {
                var sps = HrefHasgParams[i].split('=');
                hash[decodeURIComponent(sps[0])] = sps[1] ? decodeURIComponent(sps[1]) : '';
            }

            return hash;
        },

        // 获取当前url的文件名，比如 www.xxx.com/path/abc.html?a=1&b=2 中的  abc
        getURLFile: function () {
            var href = window.location.href;
            return /\.html\??/.test(href) ? href.match(/\/([^/]+)\.html/)[1] : 'index';
        },

        /**
         * 获取地址栏参数
         * @returns obj
         */
        getURLParams: function () {
            var params = {};
            window.location.href.replace(/[#|?&]+([^=#|&]+)=([^#|&]*)/gi, function (m, key, value) {
                params[key] = decodeURIComponent(value);
            });
            return params;
        },

        /**
         * 获取本地存储的参数
         * @returns obj
         */
        getLocalParams: function () {
            var paramsLocal = "bps" + myKit.config.topicId;
            var bp = myKit.locals.get(paramsLocal) || {};
            var urlParams = myKit.getURLParams();
            var p;
            if (urlParams._version || urlParams._appName || urlParams._platform) {
                for (p in urlParams) {
                    if (urlParams.hasOwnProperty(p)) {
                        bp[p] = decodeURIComponent(urlParams[p]);
                    }
                }
                myKit.locals.set(paramsLocal, bp);
            }
            return bp;
        },

        // 对象转参数字符串
        param: function (obj, prefix) {
            var retData = [];
            for (var e in obj) {
                if (typeof obj[e] === 'object')
                    for (var i = 0; i < obj[e].length; i++)
                        retData.push(e + '=' + encodeURIComponent(obj[e][i]));
                else
                    retData.push(e + '=' + encodeURIComponent(obj[e]));
            }
            return ( prefix || '' ) + retData.join('&');
        },
        /**
         * url编码
         * @param param
         * @param key
         * @param encode
         * @returns {string}
         */
        urlEncode: function (param, key, encode) {
            if (param == null) return '';
            var paramStr = '';
            var t = typeof(param);
            if (t == 'string' || t == 'number' || t == 'boolean') {
                paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
            } else {
                for (var i in param) {
                    var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                    paramStr += myKit.urlEncode(param[i], k, encode);
                }
            }
            return paramStr;
        },
        /**
         * url解码
         * @param url
         * @returns {string}
         */
        urlDecode: function (url) {
            return decodeURIComponent(url);
        },

        // 获取浏览历史
        getHistory: function (callback) {
            // window.addEventListener('popstate', function(e) {
            callback ? callback() : null;
            return history.state;
            // }, false)
        },
        // 不刷新改变url地址
        setUrl: function (params, title, page) {
            var currentState = history.state;
            window.history.pushState(params, title, page);
        },
        // 重置url地址
        resetUrl: function (title, page) {
            var currentState = history.state;
            window.history.replaceState(null, title, page);
        },

        /**
         * 打开页面
         * @param url 地址
         * @param params 参数(默认传递地址上的参数，为-1时不传递任何参数)
         */
        jumpTo: function (url, params, delay) {
            var paramStr = '';
            if (params !== -1) {
                var urlParams = myKit.getURLParams();
                params = params ? $.extend(urlParams, params) : urlParams;
                paramStr = $.param(params) || '';
            } else {
                paramStr = '';
            }
            setTimeout(function () {
                window.location = url + (paramStr ? '?' : '') + paramStr;
            }, delay || 0)
        },
        // 返回某一页
        pageBack: function (pageNum, isRefresh) {
            if (history.length > 1) {
                isRefresh ? self.location = document.referrer : null;
                pageNum ? history.go(pageNum) : history.go(-1);
            }
        },
        openWin: function (url, title, h, w, t, l, tool, menu, scro, resize, loc, sta) {
            window.open(url, title, "height=" + h || 0 + ", width=" + w || 0 + ", top=" + h || 0 + "t, left=" + l || 0 + "+,toolbar=" + tool || 'no' + ", menubar=" + menu || 'no' + ", scrollbars=" + scro || 'no' + ", resizable=resize" + ", location=" + loc || 'no' + ", status=" + sta || 'no');
        },
        mesAray: ['提交中，请稍等', '提交成功', '提交失败, 请稍后再试', '请勿重复提交', '获取失败！'],
        /**
         * 模态提示
         * @param msg 等于'ko'时为关闭
         * @param autoHide 等于-1时不自动关闭
         */
        lightPop: function (msg, autoHide, cb) {
            if (msg === "ko") {
                document.querySelector('#j-fixedTip').style.display = "none";
                return false;
            }
            var lightTimeOut = null; //弹出提示层
            var fixedTip = document.querySelector('#j-fixedTip');
            var poper = document.createElement("div");
            poper.id = "j-fixedTip";
            poper.className = "fixedTip";
            poper.innerHTML = msg;
            fixedTip ? fixedTip.innerHTML = msg : document.body.appendChild(poper);
            document.querySelector('#j-fixedTip').style.display = "block";
            clearTimeout(lightTimeOut);
            cb ? cb() : null;
            if (autoHide === -1) return false;
            lightTimeOut = setTimeout(function () {
                document.querySelector('#j-fixedTip').style.display = "none";
            }, 2000);
        },

        //获取用户设备信息/默认参数
        getInfo: {
            navi: function () {
                var navis = {
                    appCodeName: navigator.appCodeName,
                    appName: navigator.appName,
                    appVersion: navigator.appVersion,
                    browserLanguage: navigator.language,
                    cookieEnabled: navigator.cookieEnabled,
                    platform: navigator.platform,
                    systemLanguage: navigator.systemLanguage,
                    userAgent: navigator.userAgent,
                    online: navigator.onLine,
                    product: navigator.product,
                    vendor: navigator.vendor
                };
                return navis;
            }
            ,
            scr: function () {
                var scrs = {
                    width: screen.width,
                    height: screen.height
                };
                return scrs;
            }
            ,
            storeBp: function () {
                var token = "bps" + myKit.config.topicId;
                localStorage.setItem(token, JSON.stringify(myKit.getURLParams()));
            }
            ,
            baseParas: function (obj) {
                var bp = {};
                var token = "bps" + myKit.config.topicId;
                var urlParams = JSON.parse(localStorage.getItem(token));
                for (var p in urlParams) {
                    if (urlParams.hasOwnProperty(p)) {
                        bp[p] = decodeURIComponent(urlParams[p]);
                    }
                }
                return bp;
            }
        }
        ,
        //ajax请求
        ajaxs: function (type, url, data, callback01, callback02, callback03, callback04) {
            $.ajax({
                type: type, //请求方式
                url: url, //请求的url地址
                dataType: "json", //返回格式为json
                async: true, //请求是否异步，默认为异步
                data: data, //参数值
                beforeSend: function () {
                    //请求前的处理
                    callback01();
                },
                success: function (req) {
                    //请求成功时处理
                    callback02(req);
                },
                complete: function (req) {
                    //请求完成的处理
                    callback03();
                },
                error: function (req) {
                    //请求出错处理
                    callback04(req);
                }
            });
        }
        ,
        //ajaxDef---jquery Deferred
        deferrsed: function (type, url, callback) {
            var getData = function () {
                return $.Deferred(function (dtd) {
                    myKit.ajaxs(type, url, data, 0, function () {
                        dtd.resolve(data);
                    }, 0, function () {
                        dtd.reject(data);
                    })
                    return dtd.promise();
                });
            };

            getData().then(function (dtd) {
                callback ? callback() : null;
            })
        }
        ,
        //判断手机横竖屏状态：
        checkOrientation: function (callback01, callback02) {
            window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function () {
                if (window.orientation === 180 || window.orientation === 0) {
                    //alert('竖屏状态！');
                    callback01();
                }
                if (window.orientation === 90 || window.orientation === -90) {
                    //alert('横屏状态！');
                    callback02();
                }
            }, false);
        }
        ,
        //强制禁用屏幕旋转
        lockOrientation: function () {
            $(document).ready(function () {
                function reorient(e) {
                    var portrait = (window.orientation % 180 == 0);
                    $("body > div").css("-webkit-transform", !portrait ? "rotate(-90deg)" : "");
                }

                window.onorientationchange = reorient;
                window.setTimeout(reorient, 0);
            })
        }
        ,
        // 强制横屏展示（触发重新计算）
        forceOrientation: function () {
            var evt = "onorientationchange" in window ? "orientationchange" : "resize";
            window.addEventListener(evt, function () {
                var width = document.documentElement.clientWidth;
                var height = document.documentElement.clientHeight;
                var $print = $('#print');
                if (width > height) {
                    $print.width(width);
                    $print.height(height);
                    $print.css('top', 0);
                    $print.css('left', 0);
                    $print.css('transform', 'none');
                    $print.css('transform-origin', '50% 50%');
                }
                else {
                    $print.width(height);
                    $print.height(width);
                    $print.css('top', (height - width) / 2);
                    $print.css('left', 0 - (height - width) / 2);
                    $print.css('transform', 'rotate(90deg)');
                    $print.css('transform-origin', '50% 50%');
                }

            }, false);
        },

        /**
         * 验证码按钮
         * @param time
         * @param ele
         */
        verCodeBtn: function (time, ele, cb) {
            var timer = null;
            var secs = parseInt(time) || 60;
            var btn = typeof ele !== "string" ? ele : $(ele);
            btn.addClass("disabled").prop("disabled", true);
            myKit.lightPop("已发送，注意查收短信！");
            !function beginCount() {
                if (secs >= 0) {
                    btn.text(secs + 'S后再次获取');
                    secs--;
                }
                timer = setTimeout(function () {
                    beginCount();
                    if (secs < 0) {
                        btn.removeClass("disabled").text('获取验证码').prop("disabled", false);
                        cb ? cb() : null;
                        clearTimeout(timer);
                        return;
                    }
                }, 1000);
            }();
            //静态版
            //btn.addClass("disabled").text('1分钟后再次获取').prop("disabled", true);
            //myKit.lightPop("已发送，注意查收短信！");
            //setTimeout(function () {
            //    btn.removeClass("disabled").text('获取验证码').prop("disabled", false);
            //}, secs * 1000);
        }
        ,
        /*显示网易验证码*/
        //<script src="//cstaticdun.126.net/load.min.js"></script>
        showNetCaptcha: function (cb) {
            myKit.closePop();
            myKit.showPop('', 'pop-capcha');

            window.initNECaptcha({
                captchaId: '6f92317b6e7d4f4faa77a360d65826c5',
                element: '.pop-capcha .content',
                mode: 'embed',
                width: 300,
                onReady: function (instance) {
                    // 验证码一切准备就绪，此时可正常使用验证码的相关功能
                },
                onVerify: function (err, data) {
                    cb && cb(err, data);
                }
            }, function (instance) {
            }, function (err) {
            });
        }
        ,

        /**
         * 显示/关闭弹窗
         */
        showPop: function (msg, cls, popHeight, cb, closeCb) {
            var popStr = '<div id="pop" class="pop ' + (cls || '') + '">' +
                '<div class="pop-out"><div class="pop-in fadeInUp"><div' + (popHeight ? 'style="max-height: ' + popHeight + 'px;' : '') + ' class="content ' + (popHeight ? 'overflow' : '') + '">' + msg + '</div><span class="js-closepop iconClose"><i>×</i></span></div></div></div>';
            $('body').append(popStr);
            $('html,body').addClass('disable-scroll');
            var $pop = $('#pop');
            $pop.addClass('on');
            cb && cb();
            $(document).on('click', '#pop .js-closepop, #pop .btn-close, #pop .btn-cancel', function (e) {
                e.stopPropagation();
                $('#pop').remove();
                $('html,body').removeClass('disable-scroll');
                closeCb && closeCb();
            });
        }
        ,
        closePop: function (cb) {
            $('#pop').remove();
            $('html,body').removeClass('disable-scroll');
            cb && cb();
        },

        /**
         * 显示/关闭模态框
         * @param pop
         * @param mask
         * @constructor
         */
        AlertPop: function (pop, mask) {
            this.closeAlert = function () {
                pop.removeClass("alert-show");
                mask.fadeOut(100);
            };
            this.showAlert = function () {
                pop.addClass("alert-show");
                mask.fadeIn(100);
            };
        }
        ,
        /**
         * 滑动到某处
         * @param config{ele:滚动元素，value:scrollTop值,time:过度时间}
         */
        scroll: function (config) {
            var sets = $.extend({
                ele: "html,body",
                value: 0,
                time: 0
            }, config)
            $(sets.ele).animate({
                scrollTop: sets.value
            }, sets.time);
        }
        ,
        /**
         * 返回顶部
         * @param trigger,触发元素
         */
        back2Top: function (trigger) {
            var clientH = document.documentElement.clientHeight || document.body.clientHeight, scrollTop;
            if (!trigger) {
                var ele = document.createElement("div");
                ele.id = "back2Top";
                document.body.appendChild(ele);
                trigger = ele;
            }
            document.addEventListener('scroll', function (e) {
                setTimeout(function () {
                    e.stopPropagation();
                    scrollTop = document.body.scrollTop || document.querySelector('html').scrollTop;
                    if (scrollTop + clientH > clientH + 300) {
                        //trigger.style.display='block';
                        trigger.classList.add("roll-in");
                    } else {
                        //trigger.style.display='none';
                        trigger.classList.remove("roll-in");
                    }
                }, 180)
            }, false);
            trigger.addEventListener('click', function (e) {
                $("html,body").animate({
                    scrollTop: 0
                }, 300);
            }, false);
        }
        ,

        /**
         * 滚动显示/隐藏按钮
         * @param trigger,触发元素
         */
        scrollReveal: function (trigger, target) {
            var clientH = document.documentElement.clientHeight || document.body.clientHeight,
                docH = $(document).height(), scrollTop, targetPos;
            trigger = (typeof trigger === 'string') ? $(trigger) : trigger;
            target ? (typeof target === 'string' ? targetPos = $(target).offset().top : target.offset().top) : null;
            trigger.addClass('');
            document.addEventListener('scroll', function (e) {
                e.stopPropagation();
                setTimeout(function () {
                    e.preventDefault();
                    scrollTop = document.body.scrollTop || document.querySelector('html').scrollTop;
                    if (!target) {
                        if (scrollTop > 100) {
                            trigger.addClass("fade-in");
                        } else {
                            trigger.removeClass("fade-in");
                        }
                    } else {
                        if (scrollTop > Math.abs(docH - targetPos) + 50) {
                            trigger.addClass("fade-in");
                        } else {
                            trigger.removeClass("fade-in");
                        }
                    }
                }, 250)
            }, false);
        }
        ,

        //swiper通用配置
        /*
         * <div class="swiper-container">
         <div class="swiper-wrapper">
         <div class="swiper-slide">Slide 1</div>
         <div class="swiper-slide">Slide 2</div>
         <div class="swiper-slide">Slide 3</div>
         </div>
         <!-- 如果需要分页器 -->
         <div class="swiper-pagination"></div>

         <!-- 如果需要导航按钮 -->
         <div class="swiper-button-prev"></div>
         <div class="swiper-button-next"></div>

         <!-- 如果需要滚动条 -->
         <div class="swiper-scrollbar"></div>
         </div>
         * */
        swiper: {
            common: function (targetCls, direction) {
                if (typeof Swiper != 'undefined') {
                    return new Swiper(targetCls || '.swiper-container', {
                        // Optional parameters
                        initialSlide: 1,
                        //wrapperClass:'swiper-wrapper',
                        iOSEdgeSwipeDetection: true,
                        mousewheelControl: true,
                        //touchAngle: 45,
                        //threshold: 100,
                        autoplay: 2000,
                        //autoplayDisableOnInteraction : false,
                        preventClicks: false,
                        direction: direction ? 'vertical' : 'horizontal',
                        autoResize: true,
                        uniqueNavElements: true,
                        /*onlyExternal: true,
                         grabCursor: true,
                         loop: true,
                         effect: 'coverflow',
                         slidesPerView: 2,//最多展示数
                         centeredSlides: true,//居中
                         spaceBetween: 180,//间距
                         coverflow: {
                         rotate: -0.5,
                         depth: 20,
                         modifier: 10,//可见的数量
                         slideShadows: false//是否启用阴影
                         },*/

                        /*// 如果需要分页器
                         pagination: {
                         el: '.swiper-pagination',
                         clickable: true
                         },
                         // 如果需要前进后退按钮
                         navigation: {
                         nextEl: '.swiper-button-next',
                         prevEl: '.swiper-button-prev',
                         },
                         // 如果需要滚动条
                         scrollbar: {
                         el: '.swiper-scrollbar',
                         },*/

                        /*onInit: function (swiper) {
                         var $page = $(swiper.slides[0]).find('.container');
                         $page.addClass('page-animate');
                         // 进场
                         setTimeout(function () {
                         pagesFn.page1 && pagesFn.page1.In && pagesFn.page1.In($page, 0, swiper);
                         }, 1);
                         },
                         onSlideChangeEnd: function (swiper) {
                         //if (mySwiper.isEnd) {
                         //    $btnTry.add($btnNext).hide();
                         //} else {
                         //    $btnTry.add($btnNext).show();
                         //}
                         },
                         onReachEnd: function (swiper) {
                         //$btnTry.add($btnNext).hide();
                         }*/
                    })
                }
            }
            ,
            marquee: function (targetCls, direction) {
                if (typeof Swiper != 'undefined') {
                    return new Swiper(targetCls || '.swiper-container', {
                        // Optional parameters
                        initialSlide: 0,
                        //wrapperClass:'swiper-wrapper',
                        //iOSEdgeSwipeDetection: true,
                        //mousewheelControl: true,
                        autoplay: 1500,
                        autoplayDisableOnInteraction: false,
                        //threshold: 100,
                        preventClicks: false,
                        onlyExternal: true,
                        direction: direction ? 'horizontal' : 'vertical',
                        autoResize: true,
                        uniqueNavElements: true,
                        loop: true,
                        //spaceBetween: 180
                    });
                }
            }
        }
        ,

        Arr: {
            /**
             * 简单数组排序
             * @param a
             * @param b
             * @returns {number}
             */
            //01.简单数组正序排列
            sortNumAray: function (a, b) {
                if (a < b) {
                    return -1; // a排在b的前面
                } else if (a > b) {
                    return 1; // a排在b的后面
                } else {
                    return 0; // a和b的位置保持不变
                }
            }
            ,
            // 生成从1到指定值的数组
            generateArr: function (num) {
                var tmp = [];
                return (function () {
                    tmp.unshift(num);
                    num--;
                    if (num > 0) {
                        arguments.callee();
                    }
                    return tmp;
                }())
            }
            ,
            //02.数组随机排序
            rndArr: function (arr) {
                return arr.sort(function () {
                    return Math.random() > 0.5 ? -1 : 1;
                });
            }
            ,
            shuffle: function (arr) {
                for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x) ;
                return arr;
            }
            ,
            //03.随机从数组中取出一项
            getRnm: function (arr) {
                return arr[Math.floor(Math.random() * arr.length)];
            }
            ,
            //04.数组去重
            uniqueArr: function (arr) {
                //排序数组，形成队列
                arr.sort(this.sortNumAray);

                //排序后，队尾向前对比，如果相同，删除队尾，依次类推
                function loop(Index) {
                    if (Index >= 1) {
                        if (arr[Index] === arr[Index - 1]) {
                            arr.splice(Index, 1);
                        }
                        loop(Index - 1);
                    }
                }

                loop(arr.length - 1);
                return arr;
            }
            ,
            liteArr: function (arr) {
                var tmp = [];
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (tmp.indexOf(arr[i]) === -1) {
                        tmp.unshift(arr[i])
                    }
                }
                return tmp;
            }
            ,
            // 05.拷贝数组
            copyArr: function (arr, start, end) {
                if (start) {
                    return arr.slice(start || 0, end);
                } else {
                    return arr.concat();
                }
            }
            ,
            // 对象转数组
            toArray: function (obj) {
                var retData = [];
                for (var i = 0; i < obj.length; i++) {
                    retData.push(obj[i]);
                }
                return retData;
            }
        }
        ,

        Obj: {
            // 拷贝对象
            copy: function (obj, filter) {
                var b = {};
                for (var i in a) {
                    if (filter) {
                        if (obj.hasOwnProperty(filter)) {
                            b[i] = a[i];
                            delete b.filter;
                        }
                    }
                    b[i] = a[i];
                }
                return b;
            }
            ,
            // 扩展对象
            extend: function (obj, extData) {
                if (extData) {
                    for (var attr in extData) {
                        obj[attr] = extData[attr];
                    }
                }
            }
        }
        ,

        // 格式化json
        formatJson: function (json) {
            var i = 0,
                il = 0,
                tab = "    ",
                newJson = "",
                indentLevel = 0,
                inString = false,
                currentChar = null;

            for (i = 0, il = json.length; i < il; i += 1) {
                currentChar = json.charAt(i);

                switch (currentChar) {
                    case '{':
                    case '[':
                        if (!inString) {
                            newJson += currentChar + "\n" + repeat(tab, indentLevel + 1);
                            indentLevel += 1;
                        } else {
                            newJson += currentChar;
                        }
                        break;
                    case '}':
                    case ']':
                        if (!inString) {
                            indentLevel -= 1;
                            newJson += "\n" + repeat(tab, indentLevel) + currentChar;
                        } else {
                            newJson += currentChar;
                        }
                        break;
                    case ',':
                        if (!inString) {
                            newJson += ",\n" + repeat(tab, indentLevel);
                        } else {
                            newJson += currentChar;
                        }
                        break;
                    case ':':
                        if (!inString) {
                            newJson += ": ";
                        } else {
                            newJson += currentChar;
                        }
                        break;
                    case ' ':
                    case "\n":
                    case "\t":
                        if (inString) {
                            newJson += currentChar;
                        }
                        break;
                    case '"':
                        if (i > 0 && json.charAt(i - 1) !== '\\') {
                            inString = !inString;
                        }
                        newJson += currentChar;
                        break;
                    default:
                        newJson += currentChar;
                        break;
                }
            }
            return newJson;
        }
        ,

        /**
         * 随机数
         */
        Rdn: {
            //01.生成从1到任意值的数字
            rdnTo: function (end) {
                return parseInt(Math.random() * end + 1)
            }
            ,
            //02.生成从任意值到任意值的数字(start:起点，end:重点，isFloat:是否小数，fixNum:小数位)
            rdnBetween: function (start, end, isFloat, fixNum) {
                if (!isFloat) {
                    return Math.floor(Math.random() * (end - start) + start);
                } else {
                    return (Math.random() * (end - start) + start).toFixed(fixNum || 2);
                }
            },
            //03.从数组中随机取出一些数（arr：原数组，len：需要取的个数）
            rdnFromArr: function (arr, len) {
                var tmpArr = [];
                if (len > 1) {
                    var copys = arr.slice(0);
                    for (var i = 0; i < len; i++) {
                        var rdm = myKit.Rdn.rdnBetween(0, copys.length);
                        tmpArr.push(copys[rdm]);
                        copys.splice(rdm, 1);
                    }
                } else {
                    tmpArr = arr[myKit.Rdn.rdnBetween(0, arr.length)]
                }
                return myKit.isArray(tmpArr) ? tmpArr.sort() : tmpArr;
            }
            ,
            //04.生成从任意值开始的指定个数字
            rdnCustom: function (start, lens) {
                var arr = [];
                //给原始数组arr赋值
                for (var i = 0; i < lens; i++) {
                    arr[i] = i + start;
                }
                arr.sort(function () {
                    return 0.5 - Math.random();
                });
                return arr;
            }
            ,

            /**
             * 生成随机增长的数字
             * @returns {string}
             */
            rdnCountUp: function (baseNum, ratio, limit, cb) {
                var curNum, lastNum = parseInt(myKit.locals.get("meLstAniNum") || baseNum);
                if (limit && (lastNum >= limit || 2000000)) {
                    lastNum = 12000;
                }
                curNum = parseInt(lastNum + Math.random() * ratio);
                myKit.locals.set("meLstAniNum", curNum);
                cb ? cb() : null;
                return curNum;
            }
            ,
            /**
             * 生成随机颜色
             * @returns {string}
             */
            rdmColor: function () {
                return "#" +
                    (function (color) {
                        return (color += "0123456789abcdef" [Math.floor(Math.random() * 16)]) && (color.length == 6) ? color : arguments.callee(color);
                    })("");
            }
            ,
            /**
             * 生成随机字符串
             * @param len 长度
             * @returns {string}
             */
            rdmStr: function (len) {
                len = len || 32;
                var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';//默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
                var maxPos = $chars.length;
                var pwd = '';
                for (var i = 0; i < len; i++) {
                    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
                }
                return pwd;
            },
            /**
             * 生成随时间递增/递减的数字
             * @param startTime 起始时间
             * @param isUp 是否递增(默认true)
             * @param threshold 阈值
             * @returns {number}
             */
            getFakeCount: function (startTime, isUp, threshold) {
                threshold = threshold || 200;
                isUp = isUp || true;
                if (startTime) {
                    var start = new Date(startTime) || new Date();
                    var curTime = new Date();
                    return isUp ? Math.abs(parseInt((curTime.getTime() + start.getTime()) / threshold)) : Math.abs(parseInt((curTime.getTime() - start.getTime()) / threshold));
                } else {
                    console.error("need a startPoint")
                }
            }
            ,
            /**
             * 生成随机报名数
             * @param timeInterval 时间间隔：如20，30等
             * @param storageName localStorage名称
             * @param pubTime 活动时间
             * @returns {number}
             */
            genSignUpNum: function (timeInterval, storageName, pubTime) {
                var localTime = JSON.parse(localStorage.getItem(storageName));
                var tempTimeAray = new Date().getTime();

                var min = parseInt((new Date().getTime() - pubTime) / 6000);
                //间隔timeRange分钟数更新一次数据
                var timeRange = timeInterval;
                //生成一个随机数
                var ranNum = myKit.Rdn.rdnBetween(timeRange - 2, timeRange + 6);
                //最终的数字
                var increase = 0;

                //如果用户第二次进入页面：对比上次记录的时间和当前时间的差，如果大于随机数，则更新页面人数
                if (localTime) {
                    var oldMin = parseInt((parseInt(localTime) - pubTime) / 6000);
                    var newMin = parseInt((new Date().getTime() - parseInt(localTime)) / 6000);

                    //如果localStorage记录的时间早于pubTime，则重新修改loc
                    if (oldMin < 0 || newMin < 0) {
                        localStorage.setItem(storageName, JSON.stringify(tempTimeAray));
                    }

                    if (newMin > ranNum) {
                        increase = parseInt(min / timeRange);
                        localStorage.setItem(storageName, JSON.stringify(tempTimeAray));
                    } else {
                        increase = parseInt(oldMin / timeRange);
                    }
                } else {
                    increase = parseInt(min / timeRange);
                    localStorage.setItem(storageName, JSON.stringify(tempTimeAray));
                }

                //报名人数
                return increase;
            }
        }
        ,

        // 生成guid
        guid: function () {
            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }

            return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
        }
        ,

        formatTime: function (timeStr, fmt) {
            fmt = fmt || "yyyy-MM-dd HH:mm:ss";
            return new Date(timeStr).format(fmt);
        }
        ,
        //开发模式下
        devTest: function (cb) {
            ((window.location.href.indexOf('http://localhost') !== -1 || window.location.href.indexOf('http://192.168') !== -1) && cb) ? cb() : null;
        }
        ,

        /**
         * 本地存储LocalStorage
         */
        locals: {
            set: function (name, data) {
                if (typeof data === "object") {
                    localStorage.setItem(name, JSON.stringify(data));
                } else {
                    localStorage.setItem(name, data);
                }
            }
            ,
            get: function (name, isObj) {
                var ld = localStorage.getItem(name);
                return isObj ? ((ld && ld !== "{}") ? JSON.parse(ld) : '') : ((ld && ld !== "{}") ? ld : "");
            }
            ,
            remove: function (name) {
                localStorage.removeItem(name);
            }
            ,
            clear: function () {
                localStorage.clear();
            }
            ,
            //检查是否有指定字段
            check: function (name, callback01, callback02) {
                var vals = localStorage.getItem(name);
                if (!vals) {
                    // 有记录
                    callback01 ? callback01() : null;
                } else {
                    // 无记录
                    callback02 ? callback02() : null;
                }
            }
        }
        ,
        /**
         * 本地存储SessionStorage
         */
        sessions: {
            set: function (name, data) {
                if (typeof data === "object") {
                    sessionStorage.setItem(name, JSON.stringify(data));
                } else {
                    sessionStorage.setItem(name, data);
                }
            }
            ,
            get: function (name, isObj) {
                var ld = sessionStorage.getItem(name);
                return isObj ? ((ld && ld !== "{}") ? JSON.parse(ld) : '') : ((ld && ld !== "{}") ? ld : "");
            }
            ,
            remove: function (name) {
                sessionStorage.removeItem(name);
            }
            ,
            clear: function () {
                sessionStorage.clear();
            }
            ,
            //检查是否有指定字段
            check: function (name, callback01, callback02) {
                var vals = sessionStorage.getItem(name);
                if (!vals) {
                    // 有记录
                    callback01 ? callback01() : null;
                } else {
                    // 无记录
                    callback02 ? callback02() : null;
                }
            }
        }
        ,
        /**
         * 本地存储Cookies
         */
        cookies: {
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
        ,

        /**
         * 清除本地缓存
         * <div class="btn flush-button" onclick="me.flush()">清理缓存</div>
         */
        btnFlush: function () {
            var btn = document.createElement('div');
            btn.className = 'btn flush-button';
            //btn.innerHTML = '清理缓存';
            document.body.appendChild(btn)
            btn.onclick = function () {
                myKit.locals.clear();
                myKit.sessions.clear();
                document.cookie = ''
                myKit.lightPop('ok！已清理');
            }
        }
        ,

        /**
         * 返回按钮(<button class="btn backButton" type="button"></button><a href="" class="btn btn-rule">活动规则</a>)
         * @param cls 样式名【c_white：白色箭头;c_black:黑色箭头;b_white:白色背景黑色箭头;b_black:黑色背景白色箭头;hasText:返回文字(仅无背景);
         * @param template 自定义模板
         * @param isRender 是否渲染，传入布尔值
         * @param beforeCb 返回前的回调
         */
        btnBack: function (cls, template, isRender, beforeCb) {
            if (isRender !== 0 && isRender !== -1 && isRender !== false) {
                var bar = document.createElement('div');
                bar.className = 'topBar' + (cls ? ' ' + cls : '');
                bar.innerHTML = template || '<button class="btn backButton" type="button"></button>';
                document.body.appendChild(bar);
                document.querySelector('.backButton').addEventListener('click', function () {
                    beforeCb ? beforeCb() : null;
                    window.history.go(-1);
                }, false)
            }
        }
        ,

        /**
         * App下载
         * @param conf 配置
         */
        appBar: function (conf) {
            var str;
            var config = {
                render: true,//是否渲染
                position: 'top',
                bgColor: '#fff',
                title: 'App名称',
                description: 'App的描述文字',
                icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAMAUExURSeb553T9ZnR9DCf6DKh6SSa5zCg6f///yOZ5iKZ5qjY9g+Q5LHb9iab5yWa5x6X5iaa5+73/R+X5kSq606u7ODx/COZ5yCY5hyW5vD5/fz9/hiU5iSZ5x2W5mm67u33/S6f6BmV5nfA7yGY5mG27Sib54jJ8u32/f7//0Ko6/3+/9ru+yqc5/D4/RmU5bfd9uv2/SKY5xaU5hSS5R2X5hCR5UWp6yOa5ySb51Gv7DOh6D6m6ma67/X7/iGZ5mO37jei6Sid6Pz+/xeU5Sue6Mvn+RqW5t/w/Cye58zn+ZXO9DSi6T+m6S+g6TGg6EOp6liz7Syf6GS47p/V9PL5/cbm+P7+/6LV9Uqs60er6ySa5ma57hKR5fz9//b7/jym6iud6OXz/DGg6V207er1/ZTO8zGf6Dmk6XjB8Fu07bLd9vn8/mS47ez2/fb7/rff9/P5/vr9/svm+fn8/xqV5UCn6k2s64nK8avX9un1/Or2+0yt68vo+iKZ52m77z2m6Sea51Cu68/p+W+97/T6/l+17eX0/JDN80aq6mC27R+Y5vL6/XXA8YDF8W2+7yec57vf99zu+6DU9rXc9nrD8e73/rbd9i2e6MHj+Eaq61ax7Ljf+J3S9Oj2/Xa/8OPy/HO/70Ws6o3K8iCY57zg+JfP9Nvv+2i67t3v+zCg6Dqm6oTH8fr8/nbB8ILG8aDS9LHc93O+7+j0/BuV5srn+VKv7F637ZvS9YvK8qDV9qfW9RaT5sPk+arY9czo+YfK8Umq6orI8T6l6pnS82i47anX9R+Z5tnu+q/Z9UKo6iOa5jaj6JLM8tHq+YbG8Z/T9RGQ5Saa5mC47s7n+Viy7Fay7c/p+nG+777i+KXX9HnB8JnQ9CGa5+Hx+yWa5huX5pnP85zS8/j7/0mt69nt+73h+IrL8sjl+H3E8f///tXt+vv9/7Pd9/7+/sTk95HN84XJ8Y7M8wmO5Nft+5HL84PJ8XC+7zul6ez3/aTV9Q6P5Nfr+uXx+9vw+43K8ly17XzPWLkAAATsSURBVHja7ZhpVBNXFIBDyzhJ60zGsc1ETUhiEqAUgjTsVLYAQkWpUhQI56ggKIsKVKzYWjes1BWrFeuCrbZa96K4FC12t5Tu1e523+2+r6eNvJdkksxoJx48/XG/P5lz77x537yXue/NyGQAAAAAAAAAAAAAAAAAAAAAAAD/c+QIBcUP0go5D4VXE8IjK7+4/o39EIEU4w6uygjsx6PUYDvI0a6sudUjO8pmUXOUv/2b5x0J6OXhQncPdPb1dwXwePGt18u6CSU+gRiz0iMb0BZUmRvN+qkQfoLEvD9a45qVivGkF7qW3YeeNfZmFYFfeWcPrFvUrFD50z+V1hWKL7K6kHUJXH4Z6cvJoa1zkcAVAtmCmjTCH4OkL1yXSLmAAEmWj4oSFSAjVuilG1DZJ3iXr9BcQIBckhElKkCSa6WPAaPv4A3xLKW3QFjEtJCQkGmDnKd83b6Ucguk92Z1053ZO04nSx6BXP4d2H0Emr5vG+rg08+cCgVFSrfAsFvaHcmpmxYOx9nxqaqLmAGSfK41zktAd0+W0kHWeyt0+Jx2i1tgxATbuazhnQ8+RIHGDVppAnRiAV9gfSznJTDgKjyrJfnVKPIARbgErh6ISiQTnxmGIovUEgUe9/gTpadkiQnIP5qEIlW/cj4CsrhXarHeTklzQE1cjtqdTUe/wRQtIiB76VoUyZwV7StAJQ5AkRv0KmkzsAa1u79+T+/vJ3mcmIAVC9QLCci0w1Akv0eSADGvCbXb9xMawuqxBhEBJu7B8wgwzRH+jAAVbseTf6jhAJ4DghYWMB7G9/h7qcJXQPMCrgWPhUspRcTIZ1Czv1Jtf6Kjjd2soIDm6efxkhGsZHwE6O4t+E5Mkp4CVRIuL50VWUdQLWmyWzzrQJGaZVnlkLKOs7j2pBzk14GZjqw2I+jMOBRY+OhSKWXYnIK9a8K5w43o8Og2hi+w55t1kZGRr02+CT/n5H59lFtg+Po1kZEtZ3RNzuf4XiJeygCkzkbNalNpOg0P4owGzmMxGlznINRVKVZvUPIWo9BzyTp3HamaMFfKDHDd+K97XM/IDE+hSrfMbjvPari5Rs6Ir4ZvFNFSdkXM/LG44c/ZlEy79zc8B1paVOC2G98lxPcDb+bRjJQB0PR04pZUTEzMH8m40GxM4kQEJu3rZgjRHdGrU6fQ0naFXB4un2ROTldXTiZ+kkdUGnwF5sypz195a4aCkQkIjGtsbHni9thwQlr/zMtPCk5k3e7reAK1ny82mUynEhKae+I5Z41xCWzeW2YyLT61YEHuSCKZlrgV0SSWC++r+icaeXVgoEGtVmuVSk7lnl93HdhlQ1mjipG8G2RjtwsLbK+cKbQY8RBYjKQz33incP9kXbD1UggUj16COxzkZDqup1U7oy6BANt8Eu/m7UGIHfYtrjnoewGKxevA4OPHhmB+eARV1ZuPWvteQKX/Fl2j+jvX8mFpm4zXgzFsnwtEF36Jd4P3uWLbrvkRxf7+51hfC1DaHeiVMOzjOHfQNgOPytaYvhZQlTpfv9/mvUxZt+JgR/ZEnA9LEBR4CGXvLvJXQD4luH8vs0/zKiibsB9FyxuoX9BRZ4NAhS3Wr0XZTbuK/f0sQtiuRCh50VVsCQpaNTIDOooR+v5jZiwoW6Ixwyc2AAAAAAAAAAAAAAAAAACA/8K/gIEyIOxymV8AAAAASUVORK5CYII=',
                url: '//www.baidu.com',
                buttonText: '打开',
                appInfo: null,//捆绑需要的参数
                isOpenNativePage: false,//是否需要打开App原生页面
                beforeCb: null,
                onClick: null//点击按钮
            }
            if (conf) {
                for (var attr in conf) {
                    config[attr] = conf[attr];
                }
            }
            if (config.render) {
                config.beforeCb ? config.beforeCb() : null;
                str = '<div class="appBar' + (config.position === 'bottom' ? ' bottom' : '') + '"' + (config.bgColor ? ' style="background-color:' + config.bgColor + ';' : '') + '"><div class="a-wrap">' +
                    '<img src="' + config.icon + '" alt="">' +
                    '<div class="wrp"><h3>' + config.title + '</h3>' +
                    '<p>' + config.description + '</p></div></div><button class="btn" id="btn-openApp" type="button">' + config.buttonText + '</button></div>';
                document.body.innerHTML += str;
                document.getElementById("btn-openApp").addEventListener('click', function () {
                    if (config.onClick) {
                        config.onClick();
                    } else {
                        if (config.appInfo) {
                            if (!config.isOpenNativePage) {
                                window.location = config.appInfo.appUrl;
                            } else {
                                if (me.isIos && !me.isWeixin) {
                                    /*目前只在ios下有效*/
                                    window.location = config.appInfo.nativeUrl;
                                }
                            }
                        } else {
                            config.url ? window.location = config.url : alert('请指定appUrl');
                        }
                    }
                }, false)
            }
        },

        /**
         * 隐藏的分享信息
         */
        shareInfo: function () {
            var str = '<div class="share-info">' +
                '<h1>' + myKit.config.share.title + '</h1>' +
                '<p>' + myKit.config.share.description + '</p>' +
                '<img src="' + myKit.config.share.iconUrl + '" alt="' + myKit.config.share.title + '"></div>';
            document.body.insertAdjacentHTML('afterbegin', str);
        }
        ,
        /**
         * web中浏览时提示
         * @param txt 文案(默认为非微信中时显示)
         * @param flag 判断依据
         */
        isWebTip: function (txt, flag) {
            var str = '';
            if (flag !== undefined && flag) {
                str = '<div class="isWebTip"><i></i>&nbsp;' + (txt || '部分功能可能无法使用，建议在微信中打开') + '</div>';
            } else {
                if (!myKit.isWeixin) {
                    str = '<div class="isWebTip"><i></i>&nbsp;' + (txt || '部分功能可能无法使用，建议在微信中打开') + '</div>';
                }
            }
            document.body.insertAdjacentHTML('afterbegin', str);
        },

        // 计算时间消耗
        timeCost: function (cb, alias) {
            console.time(alias);
            cb ? cb() : null;
            console.timeEnd(alias);
        }
        ,
        //时间戳转时间
        getLocalTime: function (nS) {
            return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
        }
        ,
        // 字节
        byte: function (data) {
            if (typeof data === 'number') {
                if (data < 1024) {
                    return data + 'B';
                } else if (data >= 1024 && data < 1048576) {
                    data = data / 1024;
                    return data.toFixed(2) + 'KB';
                } else if (data >= 1048576 && data < 1073741824) {
                    data = data / 1048576;
                    return data.toFixed(2) + 'MB';
                } else if (data >= 1073741824 && data < 1099511627776) {
                    data = data / 1073741824;
                    return data.toFixed(2) + 'GB';
                } else {
                    data = data / 1099511627776;
                    return data.toFixed(2) + 'TB';
                }
            } else {
                return data;
            }
        }
        ,
        //1476012477000 to 2016 19:27:57
        formatDate: function (now, isHans, level) {
            level = level || 3;
            var data = new Date(now);
            var year = data.getFullYear();
            var month = data.getMonth() < 10 ? "0" + (data.getMonth() + 1) : data.getMonth() + 1;
            var date = data.getDate() < 10 ? "0" + data.getDate() : data.getDate();
            var hour = data.getHours();
            var minute = data.getMinutes() < 10 ? "0" + data.getMinutes() : data.getMinutes();
            var second = data.getSeconds() < 10 ? "0" + data.getSeconds() : data.getSeconds();
            if (level === 1) {
                return isHans ? year + "年" + month + "月" + date + "日" : year + "-" + month + "-" + date;
            }
            if (level === 2) {
                return isHans ? year + "年" + month + "月" + date + "日" + " " + hour + "点" + minute + "分" : year + "-" + month + "-" + date + " " + hour + ":" + minute;
            }
            if (level === 3) {
                return isHans ? year + "年" + month + "月" + date + "日" + " " + hour + "点" + minute + "分" + second + "秒" : year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
            }
        }
        ,
        //获取年-月-日
        getDates: function (data) {
            var timeObj = {};
            var y = data.getFullYear();
            var m = data.getMonth() + 1;
            var d = data.getDate();
            var w = data.getDay();
            switch (w) {
                case 1:
                    w = "星期一";
                    break;
                case 2:
                    w = "星期二";
                    break;
                case 3:
                    w = "星期三";
                    break;
                case 4:
                    w = "星期四";
                    break;
                case 5:
                    w = "星期五";
                    break;
                case 6:
                    w = "星期六";
                    break;
                case 7:
                    w = "星期日";
                    break;
            }
            var h = data.getHours();
            var mi = data.getMinutes() < 10 ? "0" + data.getMinutes() : data.getMinutes();
            var s = data.getSeconds() < 10 ? "0" + data.getSeconds() : data.getSeconds();
            timeObj = {
                year: y,
                month: m,
                day: d,
                week: w,
                hour: h,
                minute: mi,
                second: s
            }
            return timeObj;
        }
        ,

        /**
         * 比较当前时间和指定时间
         * @param d1
         * @returns {boolean}
         */
        compareCurrentDate: function (d1) {
            var timeNow = new Date().getTime();
            return timeNow > new Date(d1).getTime();
        }
        ,
        /**
         * 定时刷新判断
         * @param endTime 结束时间点
         * @param cb 回调函数
         * @param interval 刷新间隔
         * @returns {boolean}
         */
        keepFresh: function (endTime, cb, interval) {
            var timer = null;
            timer = setInterval(function () {
                if (myKit.compareCurrentDate(endTime)) {
                    cb ? cb() : null;
                    clearInterval(timer)
                }
            }, interval || 1000)
        }
        ,
        /**
         * 比较两个/多个日期大小,当前时间是否在某个范围内
         * @param d1
         * @param d2
         * @returns {boolean}
         */
        compareDate: function (d1, d2) {
            var timeA = new Date(d1.replace(/-/g, "\/"));
            var timeB = new Date(d2.replace(/-/g, "\/"));
            var timeNow = new Date();
            if (timeNow > timeA && timeNow < timeB) {
                return true;
            }
            return false;
        }
        ,
        /**
         * 倒计时（距开始，距结束）
         * @param target 截止时间
         * @param box 时间容器
         * @param msd 毫秒数
         * @param obj 时分秒父级元素
         */
        //单个倒计时
        getRCount: function (target, box) {
            //console.log(arguments);//最好直接传入数字类型
            var t, d, h, m, s;
            //var $days = $(".days");
            //var $hours = $(".hours");
            //var $mins = $(".mins");
            //var $secs = $(".secs");
            //var $counter = $(".counter");
            var timer = null;
            var EndTime;
            var NowTime = new Date(); //标准时间格式'
            //判断传过来的是否是数字
            if (typeof target != "number") {
                if (target.indexOf("-") > -1) {
                    target = target.replace(/-/g, '/'); //替换为斜杠以便兼容
                    EndTime = new Date(target);
                } else {
                    EndTime = new Date(parseInt(target));
                }
            } else {
                EndTime = new Date(target);
            }
            //console.log(EndTime, NowTime);

            var timeCon = document.getElementById(box);
            t = EndTime.getTime() - NowTime.getTime();
            d = Math.floor(t / 1000 / 60 / 60 / 24);
            h = Math.floor(t / 1000 / 60 / 60 % 24);
            m = Math.floor(t / 1000 / 60 % 60);
            s = Math.floor(t / 1000 % 60);
            h = h >= 10 ? h : '0' + h;
            m = m >= 10 ? m : '0' + m;
            s = s >= 10 ? s : '0' + s;
            if (t > 0) {
                timeCon.innerHTML = d + "天" + h + "小时" + m + "分" + s + "秒";
            } else if (t === 0) {
                timeCon.innerHTML = "正点";
            } else {
                //timeCon.innerHTML = "已过去" + Math.abs(d) + "天" + Math.abs(h) + "小时" + Math.abs(m) + "分" + Math.abs(s) + "秒";
                timeCon.innerHTML = "已结束";
                clearTimeout(timer);
                return; //此处记得使用return停止函数体
            }
            timer = setTimeout(function () {
                myKit.getRCount(target, box)
            }, 1000);
        }
        ,
        //传入毫秒数时
        getMsCount: function (msd) {
            //console.log(arguments);//最好直接传入数字类型
            var t, d, h, m, s;
            var $days = $(".days");
            var $hours = $(".hours");
            var $mins = $(".mins");
            var $secs = $(".secs");
            //var $counter = $(".counter");
            var timer;
            t = msd;
            d = Math.floor(t / 1000 / 60 / 60 / 24);
            h = Math.floor(t / 1000 / 60 / 60 % 24);
            m = Math.floor(t / 1000 / 60 % 60);
            s = Math.floor(t / 1000 % 60);
            h = h >= 10 ? h : '0' + h;
            m = m >= 10 ? m : '0' + m;
            s = s >= 10 ? s : '0' + s;
            if (t > 0) {
                //timeCon.innerHTML = d + "天" + h + "小时" + m + "分" + s + "秒";
                $days.text(d + "天");
                $hours.text(h);
                $mins.text(m);
                $secs.text(s);
            } else if (t === 0) {
                //timeCon.innerHTML = "正点";
            } else {
                //timeCon.innerHTML = "已过去" + Math.abs(d) + "天" + Math.abs(h) + "小时" + Math.abs(m) + "分" + Math.abs(s) + "秒";
                $(".right").hide();
                //过期一天后变为-预约下一期
                if (d < 0 && Math.abs(d) > 1) {
                    $(".btn-operate").attr("data-text", "预约下期").text("预约下期");
                }
                //过期后变为-提交线索
                $(".btn-operate").attr("data-text", "提交线索");
                clearTimeout(timer);
                return; //一定要return才能停止
            }
            msd -= 1000;
            timer = setTimeout(function () {
                myKit.getMsCount(msd)
            }, 1000);
        }
        ,
        /**
         * 一个页面多个倒计时
         * @param target 时间码
         * @param obj 对应的计时器元素的jq对象
         * @param isMillis 是否是毫秒
         * <ol class="counter">
         <li class="days">05</li>
         <li class="hours">05</li>
         <li class="mins">12</li>
         <li class="secs">10</li>
         </ol>
         */
        getMRCount: function (target, obj, isMillis, timeoutCb) {
            var t, d, h, m, s;
            var $days = obj.find(".days");
            var $hours = obj.find(".hours");
            var $mins = obj.find(".mins");
            var $secs = obj.find(".secs");
            //var $counter = $(".counter");
            var timer;
            if (isMillis) {
                //判断传过来的是否是数字
                if (typeof target != "number") {
                    target = Number(target);
                }
                t = target;
                d = Math.floor(t / 1000 / 60 / 60 / 24);
                h = Math.floor(t / 1000 / 60 / 60 % 24);
                m = Math.floor(t / 1000 / 60 % 60);
                s = Math.floor(t / 1000 % 60);
                h = h >= 10 ? h : '0' + h;
                m = m >= 10 ? m : '0' + m;
                s = s >= 10 ? s : '0' + s;
                if (t > 0) {
                    //timeCon.innerHTML = d + "天" + h + "小时" + m + "分" + s + "秒";
                    $days.text(d);
                    $hours.text(h);
                    $mins.text(m);
                    $secs.text(s);
                } else if (t === 0) {
                    //timeCon.innerHTML = "正点";
                } else {
                    obj.html('<div class="isEnd">- 活动已结束 -</div>');
                    // alert("计时结束！");
                    //timeCon.innerHTML = "已过去" + Math.abs(d) + "天" + Math.abs(h) + "小时" + Math.abs(m) + "分" + Math.abs(s) + "秒";
                    //$(".right").hide();
                    ////过期一天后变为-预约下一期
                    //if (d < 0 && Math.abs(d) > 1) {
                    //    $(".btn-operate").attr("data-text", "预约下期").text("预约下期");
                    //}
                    ////过期后变为-提交线索
                    //$(".btn-operate").attr("data-text", "提交线索");
                    clearTimeout(timer);
                    timeoutCb ? timeoutCb() : null;
                    return; //一定要return才能停止
                }
                target -= 1000;
            } else {
                var BeginTime, EndTime;
                var NowTime = new Date(); //标准时间格式'
                //BeginTime = new Date(start);
                //判断传过来的是否是数字
                if (typeof target != "number") {
                    if (target.indexOf("-") > -1) {
                        target = target.replace(/-/g, '/'); //替换为斜杠以便兼容
                        EndTime = new Date(target);
                    } else {
                        EndTime = new Date(parseInt(target));
                    }
                } else {
                    EndTime = target;
                }
                t = EndTime - NowTime.getTime();
                d = Math.floor(t / 1000 / 60 / 60 / 24);
                h = Math.floor(t / 1000 / 60 / 60 % 24);
                m = Math.floor(t / 1000 / 60 % 60);
                s = Math.floor(t / 1000 % 60);
                h = h >= 10 ? h : '0' + h;
                m = m >= 10 ? m : '0' + m;
                s = s >= 10 ? s : '0' + s;
                if (t > 0) {
                    //timeCon.innerHTML = d + "天" + h + "小时" + m + "分" + s + "秒";
                    $days.text(d);
                    $hours.text(h);
                    $mins.text(m);
                    $secs.text(s);
                } else if (t === 0) {
                    //timeCon.innerHTML = "正点";
                } else {
                    //timeCon.innerHTML = "已过去" + Math.abs(d) + "天" + Math.abs(h) + "小时" + Math.abs(m) + "分" + Math.abs(s) + "秒";
                    obj.html('<div class="isEnd">- 活动已结束 -</div>');
                    clearTimeout(timer);
                    timeoutCb ? timeoutCb() : null;
                    return; //一定要return才能停止
                }
            }

            timer = setTimeout(function () {
                isMillis ? myKit.getMRCount(target, obj, 1, timeoutCb) : myKit.getMRCount(target, obj, timeoutCb);
            }, 1000);
        }
        ,

        /**
         * 还剩多长时间+倒计时函数
         * @param 目标时间
         * @returns {*}
         */
        timePast: function (o) {
            var rules = /^[\d]{4}-[\d]{1,2}-[\d]{1,2}( [\d]{1,2}:[\d]{1,2}(:[\d]{1,2})?)?$/ig,
                str = '', //结果字符串
                conn, s;
            var result; //"-"分割结果
            var hans = ["天前", "小时前", "分钟前", "秒前"];
            var gaps = ""; //时间差
            if (!o.match(rules)) {
                alert('参数格式为"2012-01-01 01:01:01",\r其中[]内的内容可省略');
                return false;
            }
            var sec = (new Date(o.replace(/-/ig, '/')).getTime() - new Date().getTime()) / 1000;
            if (sec > 0) {
                conn = '还有';
            } else {
                conn = '已过去';
                sec *= -1;
            }
            s = {
                '天': sec / 24 / 3600,
                '小时': sec / 3600 % 24,
                '分': sec / 60 % 60,
                '秒': sec % 60
            };
            for (i in s) {
                //if (Math.floor(s[i]) > 0) str += Math.floor(s[i]) + i;
                if (Math.floor(s[i]) >= 0) str += Math.floor(s[i]) + "-";
            }
            if (Math.floor(sec) == 0) {
                str = '0秒';
            }
            //document.getElementById('show').innerHTML = '距离<u>' + o + '</u>' + conn + '<u>' + str + '</u>';

            //如需倒计时需开启倒计时
            //setTimeout(function () {
            //count_down(o)
            //}, 1000);
            //几天前/几小时前/几分钟前/几秒前
            result = str.slice(0, -1).split("-");
            for (var j = 0, len = result.length; j < len; j++) {
                if (result[j] != "0") {
                    gaps = result[j] + hans[j];
                    return gaps;
                }
            }
            //return result;
        }
        ,
        /**
         * 时间转为秒
         * @param time 时间(00:00:00)
         * @returns {string} 时间戳（单位：秒）
         */
        timeToSec: function (time) {
            var s = '';
            var hour = time.split(':')[0];
            var min = time.split(':')[1];
            var sec = time.split(':')[2];
            s = Number(hour * 3600) + Number(min * 60) + Number(sec);
            return s;
        }
        ,
        /**
         *
         * @param timeStamp
         * @returns {*}
         */
        niceTime: function (timeStamp) {
            var date = new Date(timeStamp);
            var now = new Date();

            var deltaTime = (now.getTime() - date.getTime()) / 1000;
            if (deltaTime < 60) {
                return '刚刚';
            } else if (deltaTime < 3600) {
                return parseInt(deltaTime / 60) + '分钟前';
            } else if (deltaTime < 3600 * 24) {
                return parseInt(deltaTime / 3600) + '小时前';
            }
            /*else if ( this.date(date) == this.date(now) ) {
             return this.date(date, 'HH:mm');
             } */
            else if (date.getFullYear() == now.getFullYear()) {
                return myKit.formatTime(timeStamp, 'MM-dd HH:mm');
            } else {
                return myKit.formatTime(timeStamp);
            }
        }
        ,

        /**
         * 简单验证码倒计时
         * @param obj
         * @param time
         */
        counter: function (obj, time) {
            var initTime = time;

            function timer() {
                if (initTime < 0) {
                    obj.prop("disabled", false);
                    obj.html("获取验证码");
                    initTime = time;
                } else {
                    obj.prop("disabled", true);
                    obj.html("重新发送(" + initTime + ")");
                    initTime--;
                    setTimeout(timer, 1000);
                }
            }

            timer();
        }
        ,
        /*获取相隔多少天*/
        getDayDiff: function (startDate, endDate) {
            var startTime = typeof startDate === "string" ? new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime() : startDate.getTime();
            var endTime = typeof endDate === "string" ? new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime() : endDate.getTime();
            var dates = Math.floor(Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24));
            return dates;
        }
        ,

        // 活动是否过期
        isActEnd: function () {
            var now = new Date().getTime(); //取今天的日期
            var end = new Date(endTime).getTime();
            if (now > end) {
                return true;
            }
            return false;
        }
        ,

        /**
         * 加减控件
         * @param conf 配置
         * @param cb 普通回调
         * @param addCb 增加回调
         * @param minCb 减少回调
         * @param iptCb 输入回调
         * htmlStr: <div class="vx-number">
         <span class="vx_add">+</span>
         <input class="vx_ipt" type="number" id="reserveNumber" value="1">
         <span class="vx_minus">-</span>
         </div>
         */
        vNumber: function (conf, cb, addCb, minCb, iptCb) {
            var $vadd = document.querySelector('.vx-number .vx_add')
            var $vminus = document.querySelector('.vx-number .vx_minus')
            var $vipt = document.querySelector('.vx-number .vx_ipt')
            var config = {
                min: 1,
                max: 50,
                step: 1,
                amount: 0
            }
            if (conf) {
                for (var attr in conf) {
                    config[attr] = conf[attr];
                }
            }
            /*限定区间*/
            config.amount = config.amount < config.min ? config.min : config.amount;
            config.amount = config.amount > config.max ? config.max : config.amount;
            $vipt.value = config.amount;

            $vadd.addEventListener('click', function (e) {
                e.cancelable && !e.defaultPrevented ? e.preventDefault() : null;
                if (config.amount > config.max) {
                    me.lightPop('最大为' + config.max);
                    $vipt.value = config.max;
                    return false;
                }
                config.amount += config.step;
                $vipt.value = config.amount;
                config.amount = parseInt($vipt.value);
                addCb ? addCb(config.amount) : null;
                cb ? cb() : null;
            }, false)
            $vminus.addEventListener('click', function (e) {
                e.cancelable && !e.defaultPrevented ? e.preventDefault() : null;
                if (config.amount <= config.min) {
                    me.lightPop('最小为' + config.min);
                    $vipt.value = config.min;
                    return false;
                }
                config.amount -= config.step;
                $vipt.value = config.amount;
                config.amount = parseInt($vipt.value);
                minCb ? minCb(config.amount) : null;
                cb ? cb() : null;
            }, false)
            $vipt.addEventListener('input', function (e) {
                e.cancelable && !e.defaultPrevented ? e.preventDefault() : null;
                setTimeout(function () {
                    config.amount = parseInt($vipt.value);
                    $vipt.value = config.amount;
                    iptCb ? iptCb(config.amount) : null;
                    cb ? cb() : null;
                    if (config.amount < config.min) {
                        me.lightPop('最小为' + config.min);
                        $vipt.value = config.min;
                        return false;
                    }
                    if (config.amount > config.max) {
                        me.lightPop('最大为' + config.max);
                        $vipt.value = config.max;
                        return false;
                    }
                }, 120)
            }, false)
        }
        ,

        // 小数乘法
        floatMulti: function (num1, num2) {
            return num1 * 10000 * num2 / 10000;
        }
        ,
        // 禁止滑动
        cancleScroll: function (obj) {
            //document.addEventListener('touchmove', function (e) {
            //    e.preventDefault();
            //    return false;
            //}, false);
            obj.on("touchmove", function (e) {
                e.preventDefault();
                return false;
            });
        }
        ,
        /**
         * 可编辑div聚焦并移到最后
         * @param that
         */
        selLast: function (that) {
            var range = document.createRange();
            var len = that.childNodes.length;
            range.setStart(that, len);
            range.setEnd(that, len);
            getSelection().addRange(range);
            that.focus();
        }
        ,
        //获取鼠标当前坐标
        mouseCoords: function (ev) {
            if (ev.pageX || ev.pageY) {
                return {
                    x: ev.pageX,
                    y: ev.pageY
                };
            }
            return {
                x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
                y: ev.clientY + document.body.scrollTop - document.body.clientTop
            };
        }
        ,
        /**
         *
         * @param obj
         * @param styleName
         * @returns {*}
         */
        //获取样式值
        getStyle: function (obj, styleName) {
            return window.getComputedStyle(obj, null).styleName || obj.currentStyle.styleName
        }
        ,
        /**
         * 获取js对象长度
         * @param o
         * @returns {*}
         */
        getObjLen: function (o) {
            var t = typeof o;
            if (t == 'string') {
                return o.length;
            } else if (t == 'object') {
                var n = 0;
                for (var i in o) {
                    n++;
                }
                return n;
            }
            return false;
        }
        ,
        //过滤对象中自带属性
        exceptOwnProperty: function (obj) {
            if (obj && myKit.isObject(obj)) {
                var tmpObj = {}
                for (var i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        tmpObj[i] = obj[i]
                    }
                }
                return tmpObj;
            }
        }
        ,
        /**
         * Changes XML to JSON
         * @param xml
         * @returns {{}}
         */
        xmlToJson: function (xml) {
            // Create the return object
            var obj = {};
            if (xml.nodeType == 1) { // element
                // do attributes
                if (xml.attributes.length > 0) {
                    obj["@attributes"] = {};
                    for (var j = 0; j < xml.attributes.length; j++) {
                        var attribute = xml.attributes.item(j);
                        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                    }
                }
            } else if (xml.nodeType == 3) { // text
                obj = xml.nodeValue;
            }
            // do children
            if (xml.hasChildNodes()) {
                for (var i = 0; i < xml.childNodes.length; i++) {
                    var item = xml.childNodes.item(i);
                    var nodeName = item.nodeName;
                    if (typeof(obj[nodeName]) == "undefined") {
                        obj[nodeName] = xmlToJson(item);
                    } else {
                        if (typeof(obj[nodeName].length) == "undefined") {
                            var old = obj[nodeName];
                            obj[nodeName] = [];
                            obj[nodeName].push(old);
                        }
                        obj[nodeName].push(myKit.xmlToJson(item));
                    }
                }
            }
            return obj;
        }
        ,
        /**
         * 延迟执行
         * @param func
         * @param time
         */
        timeOut: function (func, time) {
            setTimeout(func, time)
        }
        ,

        //------ 字符串操作
        //去除字符串空格
        trimStr: function (str, is_global) {
            var result;
            result = str.replace(/(^\s+)|(\s+$)/g, "");
            if (is_global) {
                result = result.replace(/\s/g, "");
            }
            return result;
        }
        ,
        //将数字/字符转换为配速格式(2'55'')
        toPace: function (data) {
            data = (typeof data === 'number' ? data + "" : data).split(".");
            if (data.length > 1) {
                return data[0] + "'" + data[1] + "\"";
            } else {
                return data[0] + "'";
            }
        }
        ,
        //字符串中指定位置插入字符
        insertStr: function (str, flg, sn) {
            var newstr = "";
            for (var i = 0; i < str.length; i += sn) {
                var tmp = str.substring(i, i + sn);
                newstr += tmp + flg;
            }
            return newstr;
        }
        ,
        //删除指定位置的字符 x-删除的位置 num--删除字符的个数
        delStr: function (str, x, num) {
            return str.substring(0, x) + str.substring(x + num, str.length);
        }
        ,
        /**
         * 超过指定字数显示 “点点点”
         * @param str 字符
         * @param len 显示的字符个数
         * @param start 插入的起点，默认值 3
         * @param end 插入的终点，默认值同start
         * @returns {string|*}
         */
        ellipsis: function (str, len, start, end) {
            start = start || 0;
            str = (typeof(str)) != "String" ? str + '' : str;
            if (str.length > len) {
                start ? (str = str.substr(0, start) + "…" + str.substr(str.length - (start || end))) : str = (str.substr(0, len) + "…");
            }
            return str;
        }
        ,

        //------ 数字操作
        //保留n位小数,(默认保留2位)
        toWan: function (val, n) {
            var num = n || 2;
            val = typeof val != "Number" ? parseInt(val) : val;
            return val >= 10000 ? (val / 10000).toFixed(num) : val;
        }
        ,
        /**数字前面自动补充数字或字符
         * num--传入的数字，--需要补充的内容，n--需要的字符长度
         */
        prefixNum: function (num, pre, n) {
            return parseInt((Array(n).join(pre) + num).slice(-n));
        }
        ,
        /**
         * 数字格式转换成千分位分隔（1234567.00转换为1,234,567.00）
         *@param num
         */
        numToThousand: function (num, fixNum) {
            if ((num + "").trim() == "") {
                return "";
            }
            if (isNaN(num)) {
                return "";
            }
            if (fixNum) {
                num = num.toFixed(fixNum);
            }
            num = num + "";
            if (/^.*\..*$/.test(num)) {
                var pointIndex = num.lastIndexOf(".");
                var intPart = num.substring(0, pointIndex);
                var pointPart = num.substring(pointIndex + 1, num.length);
                intPart = intPart + "";
                var re = /(-?\d+)(\d{3})/
                while (re.test(intPart)) {
                    intPart = intPart.replace(re, "$1,$2")
                }
                num = intPart + "." + pointPart;
            } else {
                num = num + "";
                var re = /(-?\d+)(\d{3})/
                while (re.test(num)) {
                    num = num.replace(re, "$1,$2")
                }
            }
            return num;
        }
        ,
        /**
         * 千分位字符转换成数字格式（1,234,567.00转换为1234567.00）
         *@param str
         */
        thousandToNum: function (str) {
            var num = $.trim(str);
            var ss = num.toString();
            if (ss.length == 0) {
                return "0";
            }
            return ss.replace(/,/g, "");
        }
        ,
        /**
         *数字格式转换成大写中文
         * @param num
         * @returns {string}
         */
        numToChinese: function (num) {
            var AA = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖");
            var BB = new Array("", "拾", "百", "千", "万", "亿", "", "");
            var CC = new Array("角", "分", "");

            var a = ("" + num).replace(/(^0*)/g, "").split("."),
                k = 0,
                re = "";

            for (var i = a[0].length - 1; i >= 0; i--) {
                switch (k) {
                    case 0:
                        re = BB[7] + re;
                        break;
                    case 4:
                        if (!new RegExp("0{4}//d{" + (a[0].length - i - 1) + "}$").test(a[0]))
                            re = BB[4] + re;
                        break;
                    case 8:
                        re = BB[5] + re;
                        BB[7] = BB[5];
                        k = 0;
                        break;
                }
                if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re;
                if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
                k++;
            }
            if (re.trim().length > 0) {
                re += "元";
            }
            if (a.length > 1) { //加上小数部分(如果有小数部分)
                re += BB[6];
                for (var i = 0; i < 2; i++) {
                    re += AA[a[1].charAt(i)] + CC[i];
                }
                ;
            }

            return re;
        }
        ,

        /**
         *纯js评分
         */
        rate: function (score) {
            var rate = score || 0;
            return '★★★★★☆☆☆☆☆'.slice(5 - rate, 10 - rate)
        }
        ,
        /**
         * 移动端模拟hover
         * @param obj 对象
         * @param classFocus 高亮类名
         */
        mHover: function (obj, classFocus) {
            var curClass = obj.attr("class") || "";
            obj.on("touchstart", function (e) {
                e.preventDefault();
                obj.attr("class", curClass + "classFocus");
            })
            obj.on("touchend", function (e) {
                e.preventDefault();
                obj.attr("class", curClass);
            })
        }
        ,

        /**
         * 播放音频
         * @param audioSrc 音频地址
         * @param idName 元素id
         * @param toggleEle 音乐开关元素（默认空,会持续检查音乐状态，若有开关，记得加上开关元素）
         * @param autoPlay 是否自动播放，默认关闭
         * @param loop 是否循环，默认关闭
         * @param isCheckStatus 是否检查播放状态，默认检查
         */
        playAudio: function (audioSrc, idName, toggleEle, autoPlay, loop, isCheckStatus) {
            var mediaA = document.createElement('audio');
            mediaA.src = audioSrc;
            mediaA.preload = true;
            // mediaA.volume = 0.0;
            // mediaA.muted = true; //是否静音（可用于预先播放加载音频）
            mediaA.id = idName || 'bgm';
            (loop === undefined && !loop) ? null : mediaA.loop = 'true';
            (autoPlay === undefined || !autoPlay) ? null : mediaA.autoplay = 'true';
            document.body.appendChild(mediaA);
            mediaA.load();
            if (autoPlay === undefined || !autoPlay) {
            } else {
                if (myKit.isWeixin) {
                    try {
                        document.addEventListener("WeixinJSBridgeReady", function () {
                            mediaA.play();
                        }, false)
                    } catch (e) {
                        mediaA.play();
                    }
                } else {
                    mediaA.play()
                }
            }
            //isCheckStatus !== undefined && !isCheckStatus ? mediaA.play() : myKit.toggleSound("#" + mediaA.id, toggleEle);
        }
        ,

        /**
         * 音频关闭/开启
         * @param ele 音乐开关元素
         * @param audioEle 音乐元素
         */
        switchAudio: function (ele, audioEle) {
            var music = $(audioEle)[0]; //获取ID;
            $(ele).on('click', function () {
                var $this = $(this);
                if ($this.hasClass('off')) {
                    $this.removeClass('off');
                    music.play();
                } else {
                    $this.addClass('off');
                    music.pause();
                }
            });
        }
        ,

        /**
         * fix自动播放音频
         * @param audio 音乐元素
         * @param toggleEle 音乐开关元素
         */
        toggleSound: function (audio, toggleEle) {
            var music = $(audio)[0]; //获取ID
            if (music.paused) { //判读是否播放
                music.play();
                $(toggleEle).removeClass("off");
                $(document).on("touchstart", function () {
                    toggleEle ? ($(toggleEle).hasClass("off") ? null : music.play()) : music.play(); //若有开关就判断，没有就播放
                })
            } else {
                music.pause();
                $(toggleEle).addClass("off");
            }
        }
        ,

        /**
         * 配置化播放音频
         * @param audio 音乐元素
         * @param isClose 是否关闭音乐
         * @param isMute 是否静音
         * @param cb cb
         */
        swSound: function (audio, isClose, isMute, cb) {
            try {
                var that = document.querySelector(audio);
                !isMute ? that.muted = false : null;
                var isPlaying = that.paused ? false : true; //判读是否播放
                (isClose === undefined || !isClose) ? (isPlaying ? (that.pause(), that.play()) : that.play()) : that.pause();
                cb ? cb(that) : null;
            } catch (e) {
                console.log(e)
            }
        }
        ,

        //iScroll无法点击问题修复
        iScrollClick: function () {
            if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
            if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent));
            if (/Silk/i.test(navigator.userAgent)) return false;
            if (/Android/i.test(navigator.userAgent)) {
                var s = navigator.userAgent.substr(navigator.userAgent.indexOf('Android') + 8, 3);
                return parseFloat(s[0] + s[3]) < 44 ? false : true
            }
        }
        ,

        storeUser: function (key, obj) {
            myKit.locals.set(key, obj);
        }
        ,
        readUser: function (key, ele1, ele2) {
            var data = myKit.locals.get(key); //获取本地用户信息
            if (data !== null) {
                data = JSON.parse(data);
                $(ele1).val(data.n);
                $(ele2).val(data.p);
            }
        }
        ,

        //判断是否支持touch事件
        hasTouch: function () {
            var touchObj = {};
            touchObj.isSupportTouch = "ontouchend" in document ? true : false;
            touchObj.isEvent = touchObj.isSupportTouch ? "touchstart" : "click";
            return touchObj.isEvent;
        }
        ,
        //强制禁用整屏滚动
        switchScroll: function (status) {
            (status === -1) ? $("html,body").removeClass("disable-scroll") : $("html,body").addClass("disable-scroll");
        }
        ,
        //requestAnimationFrame动画
        theRaf: {
            activeRaf: function () {
                var lastTime = 0;
                var vendors = ['ms', 'moz', 'webkit', 'o'];
                for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
                }

                if (!window.requestAnimationFrame)
                    window.requestAnimationFrame = function (callback, element) {
                        var currTime = new Date().getTime();
                        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                        var id = window.setTimeout(function () {
                                callback(currTime + timeToCall);
                            },
                            timeToCall);
                        lastTime = currTime + timeToCall;
                        return id;
                    };

                if (!window.cancelAnimationFrame)
                    window.cancelAnimationFrame = function (id) {
                        clearTimeout(id);
                        return;
                    };
            }
        }
        ,

        //记录用户表单数据
        storeUser: function (key, obj) {
            myKit.locals.set(key, obj);
        }
        ,
        readUser: function (key, ele1, ele2) {
            var data = myKit.locals.get(key); //获取本地用户信息
            if (data !== null) {
                data = JSON.parse(data);
                $(ele1).val(data.n);
                $(ele2).val(data.p);
            }
        }
        ,
        // 错误捕获
        trySth: function (func, errCb) {
            try {
                func ? func() : null
            } catch (e) {
                errCb ? errCb() : null
                console.log(e)
            }
        }
        ,
        /**
         * 移动端控制台
         * @param type [默认为Eruda; 1为Vconsole]
         * @param config
         */
        debug: function (type, config) {
            var script = document.createElement('script');
            if (type) {
                script.src = "//cdn.jsdelivr.net/npm/eruda";
                document.body.appendChild(script);
                script.onload = function () {
                    eruda.init(config)
                }
            } else {
                script.src = "//res.wx.qq.com/mmbizwap/zh_CN/htmledition/js/vconsole/3.0.0/vconsole.min.js";
                document.body.appendChild(script);
                script.onload = function () {
                    var vConsole = new VConsole(config);
                }
            }
        }
        ,
        // 图片加载出错时
        imgError: function (picEle, defaultSrc, callback) {
            $(picEle).on("error", function () {
                var $this = $(this);
                $this.onerror = null;
                defaultSrc ? $this.attr("src", defaultSrc) : $this.attr("src", 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABXUExURQAAAM/Pz83Nzc3Nzc3Nzc3Nzc/Pz8/Pz8/Pz83Nzc3NzczMzMzMzMzMzM3NzczMzMzMzM3NzczMzM3Nzc3Nzc3Nzc7Ozs3NzczMzMzMzMzMzM/Pz83NzT7Ia2sAAAAcdFJOUwAw72CAwCBAEH/Qv/DPkKBQ37Cf4HA/j29fr08g7cIeAAAE9klEQVR42uVbaZerIAx1YXNf6tY+///vfO1MUVBQQIEPky+dc0a9MbkJIYYgMJJwSMbsLcU8N5/fRzKEgSMZkg+sSJosGSyDh9Mrmo8lS6yZAo3NrCTNaEEHMhWzhhQTuvflH7O2PJBX+I+88C3wONs/OocVwHjxdIgxKGEuYOR1Fcju7dOyJpJr6zLdOYJcw39uoq6NTzxL6oq/I5quhD1v/TRWeh0SQz4ijINy4twONFiNAEeIxMz7GQev6UvCqZAZMAFHF+B/PdExTKh1b08Y/UtDJhNg7gYm+OCFxB4ydHyY4ef9tTiOcwMikHXdSS8ndLTmpoJo45d35PJSU4MVP6+DW6TOdTRg8G8rK8JUQ4PHfe5n3kpdgxWfBIENDU6iEdjBf8uySILD/GsNPwgWGxwUKSSyh796IZKTi65/uQV8RoPijAC5pa1FmB/nt5A6qQ4syUIx8RsWd+bfYxsLndBTAtrcXEJ5LNIIyJFNBQilAZImitju/rqmxYGMH9B2ewFK0lF2yM8797liE2D7EbCNBN4Erc0UuOFhJzABtUsfOJBYYILKnQHe8jVBuzcAcNNni3e5oHdqgMUEYLsKODLAEgjNdhlErhQgm2W3lCRBnMhF4Fn5xbsirOVp2EhWAXDQAZPnWIEAyYoQcVlwT0F7CgQ5mwq+OFXgUIGKzfxQVohZVACzldH3KuJSgYAJPCytxGwqAFfiA+lCjLBcBEW1/GIkfTlwRAGrgtfc08goYFfWTPD7V+cYn+5VEWsLp9LSVFQ7KwYlLASOl+JNVQJWUwRewqClUehcAUK5B/1EIY2+RYHAkwKRbwXmYP6zCsA/rwAFTn0r4DkKOt8KQP+puPS9GAGHvRHhclx7qgeWOsRXSbZwj2yaBa6kWMqAzrggCIfps/ufhsE4CnO2PNUDT7LoyvwU43mDqpQ8BVNNzZOYcHCzU1aCTyTzZNFIdDkYMx0j1Zvrg4my6Km5FKGNMgqvn50M0yEdCqRsm7JS4t7ZNN8cKbGRa9F824SRgg9qDj+tQIxxDPj5qUjFlBEXep2qD2IGB3JTTXHL/Ov8QfWaBZhGZavouB9/7VyNKg0NNo1KxVbt6v9UmLXWaZEzHmxbtbQuPN6iL1+25dct0yInfALbpkivclupYOCFJC8VCoKdSYAKAWIlmtYKF6FdWDYHJmjUPivRhys8iiX9+Tcb+uBKMcUcKCr6aEVvk7Pgq3V3nq26kwqHNKIaDJ0QHKuPFuATrog/XNLUIPt0C+CPKK0X5e+1EnciyUdqNOuWBYaSyWZpgJuPp7X0Kz0dLYistquOxiRiFwMM2VG8Q/v44HBOBeW28U/GeN5rkl38ZT2XLqd29+jLqGQaeJEFP0d+FCgUxvlsvv9DaaDRvv3Vth8W8VPiAz9s/OKv+yk/+OPsFR8V1/Bf0zV85phOa4JfXjkkwx/TMYq/3xphND3iMR7PEKgvX1FicshlYno5ZicF1u2ovgp8Jwua2bBmjwpFOsf3EN9IM07/iJ8LydQ6geS5OSF2ZUy035zhez3PDrs9N8fzrh7TIeXuNOf4T6IE+TfuOqjV9eSHKkEvLkuSYVieHQ5D8sgEHTx4T/ERVmZHPqv7ah9U5vrw95Z+JE510NPeQuWJyk4NvSvtHb7u2zN0CGxPh2PQSizRQeCs5MYY/DRN3qqkn98SYMMX/w90XFCLB1Ja+QAAAABJRU5ErkJggg==');
                // console.log('图片出错,调用默认图片');
                callback ? callback() : null;
            })
        }
        ,
        /**
         * 图片上传
         */
        webUploader: function (config, successCb, errCb) {
            var $dom = $(document), isUploading = 0;
            if (window.WebUploader) {
                /**
                 * 图片上传
                 */
                var $list = $("#fileList"),
                    thumbnailWidth = 40,
                    thumbnailHeight = 40;
                var uploader = WebUploader.create($.extend({

                    // 选完文件后，是否自动上传。
                    auto: true,

                    prepareNextFile: true,

                    chunked: true, // 分片上传大文件

                    chunkRetry: 10, // 如果某个分片由于网络问题出错，允许自动重传多少次？

                    // swf文件路径
                    swf: 'webuploader/Uploader.swf',

                    // 文件接收服务端。
                    server: myKit.config.imgApi || '',

                    // 选择文件的按钮。可选。
                    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                    pick: "#btn-picker",
                    fileNumLimit: 9,
                    // 只允许选择图片文件。
                    accept: {
                        title: 'Images',
                        extensions: 'gif,jpg,jpeg,bmp,png',
                        mimeTypes: 'image/*,text/plain,application/msword,application/octet-stream,application/vnd.ms-excel,application/x-shockwave-flash'
                    }
                }, config || {}));
                // 当有文件添加进来的时候
                uploader.on('fileQueued', function (file) {
                    var $li = $(
                        '<div id="' + file.id + '" class="file-item thumbnail">' +
                        '<img>' +
                        '<div class="info">' + file.name + '</div>' +
                        '</div>'
                        ),
                        $img = $li.find('img');

                    // $list为容器jQuery实例
                    if ($img.length > 5) {
                        myKit.lightPop("最多5张图！")
                    } else {
                        $list.append($li);
                    }

                    // 创建缩略图
                    // 如果为非图片文件，可以不用调用此方法。
                    // thumbnailWidth x thumbnailHeight 为 100 x 100
                    uploader.makeThumb(file, function (error, src) {
                        if (error) {
                            $img.replaceWith('<span>不能预览</span>');
                            return;
                        }
                        $img.attr('src', src);
                    }, thumbnailWidth, thumbnailHeight);
                });

                //移除已上传图片
                $dom.on("click", ".file-item", function (e) {
                    e.preventDefault();
                    $(this).remove();
                })

                // 文件上传过程中创建进度条实时显示。
                uploader.on('uploadProgress', function (file, percentage) {
                    //if (theData.imgList.length > 2) {
                    //    myKit.showPop("<div>最多九张图</div>", '.noMorePic');
                    //    //myKit.lightPop("最多9张图！")
                    //    return false;
                    //} else {
                    isUploading = 1;
                    myKit.lightPop("上传中…", -1);
                    var $li = $('#' + file.id),
                        $percent = $li.find('.progress span');

                    // 避免重复创建
                    if (!$percent.length) {
                        $percent = $('<p class="progress"><span></span></p>')
                            .appendTo($li)
                            .find('span');
                    }

                    $percent.css('width', percentage * 100 + '%');
                    //}
                });

                // 文件上传成功，给item添加成功class, 用样式标记上传成功。
                uploader.on('uploadSuccess', function (file, obj) {
                    isUploading = 0;
                    myKit.lightPop("上传成功");
                    theData.imgList.push(obj.data[0]);
                    //console.log(theData.imgList);
                    $('#' + file.id).addClass('upload-state-done');
                });

                // 文件上传失败，显示上传出错。
                uploader.on('uploadError', function (file) {
                    myKit.lightPop("上传出错");
                    isUploading = 0;
                    var $li = $('#' + file.id),
                        $error = $li.find('div.error');

                    // 避免重复创建
                    if (!$error.length) {
                        $error = $('<div class="error"></div>').appendTo($li);
                    }

                    $error.text('上传失败');
                    errCb ? errCb() : null;
                });

                // 完成上传完了，成功或者失败，先删除进度条。
                uploader.on('uploadComplete', function (file) {
                    theData.isUploading = 0;
                    $('#' + file.id).find('.progress').remove();
                });
            } else {
                console.error(">>>>> 请先引入webUploader!");
            }
        }
        ,

        /**
         * 复制文本
         * @param sourceEle,复制按钮，默认'.btn-copy'
         * @param successCb，成功回调
         * @param errCb，失败回调
         */
        // <button type="button" class="btn btn-copy" data-clipboard-action="copy" data-clipboard-text="文本信息">复制</button>
        // <button type="button" class="btn btn-copy" data-clipboard-action="copy" data-clipboard-target="#txt">复制</button>
        copyText: function (sourceEle, successCb, errCb) {
            if (typeof Clipboard !== 'undefined') {
                var clipboard = new Clipboard(sourceEle || '.btn-copy');
                clipboard.on('success', function (e) {
                    me.lightPop('已复制');
                    //console.info('Action:', e.action);
                    //console.info('Trigger:', e.trigger);
                    console.info('Text:', e.text);
                    successCb ? successCb() : null;
                    e.clearSelection();
                });

                clipboard.on('error', function (e) {
                    me.lightPop('暂不支持一键复制，请手动复制！')
                    //console.error('Action:', e.action);
                    //console.error('Trigger:', e.trigger);
                    errCb ? errCb() : null;
                });
                //}
            } else {
                console.error('请先加载clipboard.js')
            }
        }
        ,

        /*base64 转 blob*/
        dataURI2Blob: function (dataURI, type) {
            var binary = atob(dataURI.split(',')[1]);
            var array = [];
            for (var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], {type: type});
        }
        ,

        /*表单上传base64*/
        uploadBase64: function (base64Data, cb) {
            var $Blob = myKit.dataURI2Blob(base64Data, 'image/png');
            var formData = new FormData();
            formData.append("files", $Blob, "file_" + Date.parse(new Date()) + ".png");

            //XMLHttpRequest 上传文件
            var request = new XMLHttpRequest();
            request.open("POST", me.config.imgApi || "");
            request.onreadystatechange = function () {
                if (request.readyState == 4) {
                    if (request.status == 200) {
                        console.log("上传成功");
                        var fileUrl = request.response ? JSON.parse(request.response).data[0].url : '';
                        cb ? cb(fileUrl) : null;
                    } else {
                        console.error("上传失败,检查上传地址是否正确");
                    }
                }
            }
            request.send(formData);
        }
        ,

        /**
         * html转图片
         * @param config:{source:内容容器类名或Id,fileName:'保存的文件名'，format:保存的格式，autoDownload:是否自动下载，showImage:是否显示图片}
         * @param cb
         */
        html2Img: function (config, cb) {
            if (typeof html2canvas !== 'undefined' || typeof Canvas2Image !== 'undefined') {
                $.extend({
                    fileName: 'share',
                    format: 'png',
                    autoDownload: false,
                    showImage: false
                }, config);
                if (!config.source) {
                    console.error('请指定转换元素Id或类名');
                    return false;
                }
                // 保存文件
                var saveFile = function (data, filename) {
                    var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
                    save_link.href = data;
                    save_link.download = filename;
                    var event = document.createEvent('MouseEvents');
                    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    save_link.dispatchEvent(event);
                };
                var sourceEle = (typeof config.source === 'string') ? document.querySelector(config.source) : config.source;
                html2canvas(sourceEle).then(function (canvas) {
                    /*默认为原生的保存，不带格式名，将会提示用户保存PNG图片*/
                    //Canvas2Image.saveAsPNG(canvas);
                    var imgSrc = Canvas2Image.saveAsPNG(canvas, true).getAttribute('src');
                    config.autoDownload ? saveFile(imgSrc, config.fileName + '.' + config.format) : null;
                    config.showImage ? document.body.appendChild(canvas) : null;
                    cb ? cb(imgSrc) : null;
                })
            } else {
                console.error('请先加载html2canvas和canvas2img');
            }
        }
        ,

        /*
         * 图片懒加载(blazy.js)
         * 图片：<img class="b-lazy" src="img/placeholder.jpg" data-src="image.jpg" alt="">
         * 背景图：<div class="b-lazy" data-src="background-image.jpg"></div>
         * */
        lazyImg: function (conf) {
            if (typeof Blazy !== 'undefined') {
                var config = {
                    src: "data-src",
                    selector: ".b-lazy",
                    container: false,
                    srcset: "data-srcset",
                    successClass: "b-loaded",
                    errorClass: "b-error",
                    success: function (ele) {
                        // Image has loaded
                        // Do your business here
                    },
                    error: function (ele, msg) {
                        if (msg === 'missing') {
                            // console.log(arguments)
                            // Data-src is missing
                        }
                        else if (msg === 'invalid') {
                            // Data-src is invalid
                        }
                    }
                }
                if (conf) {
                    for (var attr in conf) {
                        config[attr] = conf[attr];
                    }
                }
                return new Blazy(config);
            } else {
                console.error('请先加载blazy.js');
            }
        }
    }
    window.myKit = window.me = myKit;
    me.curEvt = myKit.hasTouch(),//click or touchstart

        window.requestAnimFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (run) {
                    window.setTimeout(run, 16);
                };
        })();

    // 时间格式化
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours() % 12,
            "H+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    // 判断闰年
    Date.prototype.isLeapYear = function () {
        return (0 == this.getYear() % 4 && ((this.getYear() % 100 != 0) || (this.getYear() % 400 == 0)));
    }
    //移除数组中的指定值
    Array.prototype.removeByValue = function (val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) {
                this.splice(i, 1);
                break;
            }
        }
    }
    //最小值
    Array.prototype.min = function () {
        var min = this[0];
        var len = this.length;
        for (var i = 1; i < len; i++) {
            if (this[i] < min) {
                min = this[i];
            }
        }
        return min;
    }
    //最大值
    Array.prototype.max = function () {
        var max = this[0];
        var len = this.length;
        for (var i = 1; i < len; i++) {
            if (this[i] > max) {
                max = this[i];
            }
        }
        return max;
    }

    //小数加法，用来得到精确的减法结果
    //调用：accAdd(arg1,arg2)
    //返回值：arg1加arg2的精确结果
    function accAdd(arg1, arg2) {
        console.log(arguments)
        var r1, r2, m;
        try {
            r1 = arg1.toString().split(".")[1].length
        } catch (e) {
            r1 = 0
        }
        try {
            r2 = arg2.toString().split(".")[1].length
        } catch (e) {
            r2 = 0
        }
        m = Math.pow(10, Math.max(r1, r2))
        return (arg1 * m + arg2 * m) / m
    }

    //给Number类型增加一个add方法
    Number.prototype.add = function (arg1, arg2) {
        return accAdd(arg1, arg2);
    }

    //减法函数，用来得到精确的减法结果
    //调用：accSub(arg1,arg2)
    //返回值：arg1减去arg2的精确结果
    function accSub(arg1, arg2) {
        console.log(arguments)
        var r1, r2, m, n;
        try {
            r1 = arg1.toString().split(".")[1].length
        } catch (e) {
            r1 = 0
        }
        try {
            r2 = arg2.toString().split(".")[1].length
        } catch (e) {
            r2 = 0
        }
        m = Math.pow(10, Math.max(r1, r2));
        n = (r1 >= r2) ? r1 : r2;
        return ((arg1 * m - arg2 * m) / m).toFixed(n);
    }

    //给Number类型增加一个sub方法
    Number.prototype.sub = function (arg1, arg2) {
        return accSub(arg1, arg2);
    }

    // 扩展jquery（内滚动不影响外滚动）eq:$(ele).scrollUnique();
    $.fn.scrollUnique = function () {
        return $(this).each(function () {
            var eventType = 'mousewheel';
            if (document.mozHidden !== undefined) {
                eventType = 'DOMMouseScroll';
            }
            $(this).on(eventType, function (event) {
                // 一些数据
                var scrollTop = this.scrollTop,
                    scrollHeight = this.scrollHeight,
                    height = this.clientHeight;

                var delta = (event.originalEvent.wheelDelta) ? event.originalEvent.wheelDelta : -(event.originalEvent.detail || 0);

                if ((delta > 0 && scrollTop <= delta) || (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)) {
                    // IE浏览器下滚动会跨越边界直接影响父级滚动，因此，临界时候手动边界滚动定位
                    this.scrollTop = delta > 0 ? 0 : scrollHeight;
                    // 向上滚 || 向下滚
                    event.preventDefault();
                }
            });
        });
    };

    //------- 定义 && 导出 --------------------------
    if (typeof define === "function" && define.amd) {
        define("myKit", ['jquery'], function ($) {
            return myKit;
        });
    }

    // Map over myKit/me in case of overwrite
    var _myKit = window.myKit,
        _me = window.me;

    myKit.noConflict = function (deep) {
        if (window.me === myKit) {
            window.me = _me;
        }

        if (deep && window.myKit === myKit) {
            window.myKit = _myKit;
        }
        return myKit;
    };

    if (!noGlobal) {
        window.myKit = window.me = myKit;
    }
    return window.me || window.myKit;
})
