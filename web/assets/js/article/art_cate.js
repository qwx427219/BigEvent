$(function() {
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.msg)
                }

                var htmlStr = template('tpl-table', res)

                $('tbody').html(htmlStr)
            }
        })
    }

    initArtCateList()

    var indexAdd = null
    $('.btnAddCate').on('click', function() {
        indexAdd = layui.layer.open({
            type: 1,
            title: '添加文章分类',
            content: $('#dialog-add').html(),
            area: ['500px', '250px']
        })
    })

    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.msg)
                }
                layui.layer.close(indexAdd)
                initArtCateList()
            }
        })
    })

    var indexEdit = null
    $('tbody').on('click', '.btnEditCate', function(e) {
        indexEdit = layui.layer.open({
            type: 1,
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
            area: ['500px', '250px']
        })

        var values = $(this).parent().siblings('td')
        $('#form-edit [name=name]').attr('value', values[0].innerHTML)
        $('#form-edit [name=alias]').attr('value', values[1].innerHTML)
        $('#form-edit [name=id]').attr('value', $(this).attr('data-id'))
    })

    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.msg)
                }

                layui.layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    $('tbody').on('click', '.btnDelCate', function(e) {
        var id = $(this).attr('data-id')

        layui.layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: `/my/article/deletecate/${id}`,
                success: function(res) {
                    layui.layer.msg(res.msg)

                    if (res.status !== 0) {
                        return
                    }

                    layui.layer.close(index)
                    initArtCateList()
                }
            })

        });


    })
})