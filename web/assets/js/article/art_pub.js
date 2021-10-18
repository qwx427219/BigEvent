$(function() {
    var id = getUrlParam('id')

    initCate()
    initEditor() // 富文本编辑器的生成函数调用

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.msg)
                }

                var htmlStr = template('tpl-select', res)
                $('[name=cate_id]').html(htmlStr)

                layui.form.render()
            }
        })
    }

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');

    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 400 / 592,
        // 指定预览区域
        preview: '.img-preview'
    };

    // 1.3 创建裁剪区域
    $image.cropper(options);

    /* 绑定选择封面按钮 和 上传文件表单控件 */
    $('#btnChooseImage').on('click', function(e) {
        $('#coverFile').trigger('click')
    })

    /* 更换裁剪图片 */
    $('#coverFile').on('change', function(e) {
        var files = e.target.files

        if (files.length === 0) {
            return layui.layer.msg('请选择封面图片')
        }

        var newFileURL = URL.createObjectURL(files[0])

        $image.cropper('destroy').attr('src', newFileURL).cropper(options);
    })

    var art_state = '已发布'

    $('#btnSave').on('click', function(e) {
        art_state = '草稿'
    })

    $('#form-pub').on('submit', function(e) {
        e.preventDefault()

        var fd = new FormData($(this)[0])
        fd.append('state', art_state)

        // 将裁剪图片输出为文件
        $image.cropper('getCroppedCanvas', {
            // 创建一个画布
            width: 400,
            height: 200
        }).toBlob(function(blob) { // 将裁剪图片变为文件blob后的回调函数
            fd.append('cover_img', blob)

            if (id) {
                fd.append('id', id)
                publishArticle(fd, '/my/article/edit')
            } else {
                publishArticle(fd, '/my/article/add')
            }

        })


    })

    function publishArticle(fd, url) {
        $.ajax({
            method: 'POST',
            url: url,
            data: fd,
            /* 注意：如果向服务器发生FormDate数据格式的ajax请求，必须要带
                contentType和processData属性，且属性值一定设置为false
            */
            contentType: false,
            processData: false,
            success: function(res) {
                layui.layer.msg(res.msg)
                if (res.status !== 0) {
                    return
                }
                window.parent.setNavSelected('#article-list', '#article-pub')
                console.log(window.parent);
                location.href = '/article/art_list.html'
            }
        })
    }

    // 用文章旧数据渲染页面
    if (id) {
        $.ajax({
            method: 'GET',
            url: `/my/article/${id}`,
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.msg)
                }
                layui.form.val('formPublish', res.data)
                $image.cropper('destroy').attr('src', 'http://127.0.0.1:3007' + res.data.cover_img).cropper(options);
            }
        })
    }

    //获取url中的参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }
})