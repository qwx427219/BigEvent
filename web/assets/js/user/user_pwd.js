$(function() {
    layui.form.verify({
        pwd: [/^[\S]{6,12}$/, '密码长度必须在6~12位，且不能包含空格'],
        newpwd: function(value) {
            var oldPwd = $('.layui-form [name=oldPwd]').val()
            if (oldPwd == value) {
                return '新密码不能和旧密码相同'
            }
        },
        repwd: function(value) {
            var newPwd = $('.layui-form [name=newPwd]').val()
            if (newPwd != value) {
                return '新密码与确认新密码输入不一致'
            }
        }
    })

    $('.layui-form').on('submit', function(e) {
        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                layui.layer.msg(res.msg)

                if (res.status !== 0) return

                $('.layui-form')[0].reset()
            }
        })
    })
})