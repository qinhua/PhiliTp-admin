$(function () {
    var $dom = $(document), isPosting = false
    //console.log(window.PhiToken)
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

    /*表单状态*/
    $('.login-form input[type="text"], .login-form input[type="password"]').on('focus', function () {
        $(this).removeClass('input-error')
    })

    /*登录*/
    var login = function () {
        var $this = $('#btn-login')
        if (isPosting) {
            layer.msg('请勿重复提交');
            return false
        }
        var $signName = $("#signin-name"), $signPsw = $("#signin-password")
        /*验证*/
        if (!$signName.val() || !$signPsw.val()) {
            if (!$signName.val()) {
                $signName.addClass('input-error')
            }
            if (!$signPsw.val()) {
                $signPsw.addClass('input-error')
            }
            return false
        } else {
            $signName.add($signPsw).removeClass('input-error')
        }

        $.ajax({
            url: Config.host + Config.api.login,
            headers: {token: window.PhiToken || ''},
            data: {
                'requestapp': JSON.stringify({
                    _r: window.sign(1),
                    phone: $signName.val(),
                    passwd: $signPsw.val()
                })
            },
            type: 'POST',
            timeout: 3000,
            dataType: 'JSON',
            beforeSend: function () {
                isPosting = true
                $this.button('loading')
            },
            success: function (res) {
                isPosting = false
                if (res.success) {
                    window.cookies.set('PhiliUsr', JSON.stringify({
                        name: $signName.val(),
                        psw: $signPsw.val(),
                        token: res.data.token
                    }))
                    $this.button('reset')
                    setTimeout(function () {
                        location.href = 'index.html'
                    }, 300)
                } else {
                    $this.button('reset')
                    layer.msg(res.message || '登录失败，请稍后再试')
                }
            },
            error: function (res) {
                isPosting = false
                $this.button('reset')
                layer.msg(res.message || '登录失败，请稍后再试')
            }
        })
    }
    $dom.on('click', '#btn-login', function (e) {
        login()
    })
    window.addEventListener('keydown', function (e) {
        if (e.keyCode == '13') {
            login()
        }
    })
})