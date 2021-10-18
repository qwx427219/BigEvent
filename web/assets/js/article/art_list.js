$(function() {
    var query = {
        pagenum: 1,
        pagesize: 5
    }

    initArticleList()
    initFilter()

    template.defaults.imports.dateFormat = function(date) {
        var dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    function initArticleList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: query,
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.msg)
                }

                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                renderPage(res.total)
            }
        })
    }

    function initFilter() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.msg)
                }

                var htmlStr = template('tpl-filter', res)
                $('[name=cate_id]').html(htmlStr)
                layui.form.render()
            }
        })
    }

    $('#form-filter').on('submit', function(e) {
        e.preventDefault()

        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        if (cate_id) {
            query.cate_id = cate_id
        } else {
            delete query.cate_id
        }

        if (state) {
            query.state = state
        } else {
            delete query.state
        }

        initArticleList()
    })

    function renderPage(total) {
        layui.laypage.render({
            elem: 'pageBox',
            count: total,
            limit: query.pagesize,
            curr: query.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function(obj, first) {
                query.pagenum = obj.curr
                query.pagesize = obj.limit

                /* 注意: jump回调有两种触发方式
                    1、当点击分页的页码时
                    2、当layui.laypage.render方法被调用时
                    如果是2方式触发，则可能出现死循环，initArticleList -> renderPage -> jump -> initArticleLis
                    所以需要判断jump是否是2触发的，排除该种方式触发产生的initArticleList调用
                    layui的jump回调函数的第二个参数first就是来提示jump的触发方式，如果first为true，则为2触发，否则为1触发
                */
                if (!first) {
                    initArticleList()
                }
            }
        })
    }

    $('tbody').on('click', '.btnDelArticle', function(e) {
        /* 注意：为什么给文章列表按钮定义时使用class，而不是id？
            因为每条文章列表后面的删除，编辑按钮都是同一个template模板产生的，
            所以如果使用id的话，就导致所有删除，编辑的按钮的id都相同，会产生id唯一性错误
            这里刚好需要计数删除按钮个数，来识别页码数据条数，
            所以没有唯一性要求的class选择器才是最好的
        */
        var len = $('.btnDelArticle').length
        var id = $(this).attr('data-id')

        layui.layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: `/my/article/delete/${id}`,
                success: function(res) {
                    if (res.status !== 0) {
                        return layui.layer.msg(res.msg)
                    }

                    if (len === 1) {
                        query.pagenum = query.pagenum === 1 ? 1 : query.pagenum - 1
                    }

                    initArticleList()
                }
            })
            layui.layer.close(index)
        })
    })

    $('tbody').on('click', '.btnEditArticle', function(e) {
        var id = $(this).attr('data-id')
        location.href = `/article/art_pub.html?id=${id}`
    })
})