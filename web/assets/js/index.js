$(function() {
    getUserInfo()

    $('#btnLogout').on('click', function() {
        layui.layer.confirm('确定要退出吗？', {
            icon: 3,
            title: '提示',
            btn: ['确定', '取消']
        }, function(index) {
            localStorage.removeItem('token')
            location.href = '/login.html'
            layui.layer.close(index)
        });
    })
})

function getUserInfo() {
    $('.layui-nav-img').hide()
    $.ajax({
        url: '/my/userinfo',
        method: 'GET',
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.msg)
            }
            renderAvatar(res.data)
        }
    })
}

function renderAvatar(user) {
    // 欢迎用户
    var name = user.nickname || user.username
    $('#welcome').html(`欢迎 ${name}`)

    // 用户头像渲染
    if (user.user_pic) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
        $('.layui-nav-img').hide()
    }
}

function setNavSelected(origin, current) {
    $(origin).addClass('layui-this')
    $(current).removeClass('layui-this')
}