$(function() {
    layui.form.verify({
        nickname: [/^[\S]{1,6}$/, '用户昵称只能是1~6个字符，且不能包含空格']
    })


    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.msg)
                }
                /* $('.layui-form [name=username]').attr('value', res.data.username)
                $('.layui-form [name=nickname]').attr('value', res.data.nickname)
                $('.layui-form [name=email]').attr('value', res.data.email) */

                layui.form.val('formUserInfo', res.data)
            }
        })

    }

    initUserInfo()

    $('#btnReset').on('click', function(e) {
        e.preventDefault()
        initUserInfo()
    })

    $('.layui-form').on('submit', function(e) {
        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                layui.layer.msg(res.msg)

                if (res.status !== 0) return

                window.parent.getUserInfo()
            }
        })
    })
})