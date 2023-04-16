const db = require('../db/index')
const path = require('path')

exports.addImg = async(req, res) => {
	if (!req.file || req.file.fieldname !== 'block_img') {
        return res.cc('博客图片必选')
    }
	
	res.send({
		location: path.join('/uploads', req.file.filename)
	})
}

exports.addArticle = async (req, res) => {
    // 手动校验上传的文件
    if (!req.file || req.file.fieldname !== 'cover_img') {
        return res.cc('文章封面必选')
    }

    const articleinfo = {
        ...req.body,
        pub_date: new Date(),
        author_id: req.user.id,
        cover_img: path.join('/uploads', req.file.filename)
    }

    const sql = 'insert into en_articles set ?'

    let result = null
    try {
        result = await db.queryByPromisify(sql, articleinfo)

        if (result.affectedRows !== 1) {
            return res.cc('发布文章失败')
        }
    } catch (e) {
        return res.cc(e)
    }

    res.send({
        status: 0,
        msg: '发布文章成功'
    })
}

exports.listArticle = async (req, res) => {
    const sql = `select a.id, a.title, a.pub_date, a.state, b.name as cate_name
                from en_articles as a,en_article_cate as b 
                where a.cate_id = b.id and a.cate_id = ifnull(?, a.cate_id)  and a.state = ifnull(?, a.state) and a.is_delete = 0  limit ?,?`

    let results = []
    try {
        results = await db.queryByPromisify(sql, [req.query.cate_id || null, req.query.state || null, (req.query.pagenum - 1) * req.query.pagesize, req.query.pagesize])
    } catch (e) {
        return res.cc(e)
    }

    // bugfix: 之前这里没有添加过滤条件 state和cate_id，导致 文章列表的分页pageBox中查询总数不正确
    const countSql = 'select count(*) as num from en_articles where is_delete = 0 and state = ifnull(?,state) and cate_id = ifnull(?,cate_id)'
    let total = null
    try {
        let [{ num }] = await db.queryByPromisify(countSql, [req.query.state || null, req.query.cate_id || null])
        total = num
    } catch (e) {
        return res.cc(e)
    }

    res.send({
        status: 0,
        msg: '获取文章列表成功',
        data: results,
        total
    })

}

exports.delArticle = async (req, res) => {
    const sql = 'update en_articles set is_delete = 1 where id = ?'

    try {
        let result = await db.queryByPromisify(sql, req.params.id)

        if (result.affectedRows !== 1) {
            return res.cc('删除文章失败')
        }
    } catch (e) {
        res.cc(e)
    }

    res.send({
        status: 0,
        msg: '删除文章成功'
    })
}

exports.editArticle = async (req, res) => {
    // 手动校验上传的文件
    if (!req.file || req.file.fieldname !== 'cover_img') {
        return res.cc('文章封面必选')
    }

    const sql = 'update en_articles set ? where id = ?'

    const articleinfo = {
        ...req.body,
        pub_date: new Date(),
        cover_img: path.join('/uploads', req.file.filename)
    }

    try {
        let result = await db.queryByPromisify(sql, [articleinfo, req.body.id])
        if (result.affectedRows !== 1) {
            res.cc('更新文章失败')
        }
    } catch (e) {
        return res.cc(e)
    }

    res.send({
        status: 0,
        msg: '更新文章成功'
    })
}

exports.queryArticleDetail = async (req, res) => {
    const sql = 'select * from en_articles where id = ?'

    let result = []
    try {
        result = await db.queryByPromisify(sql, req.params.id)
    } catch (e) {
        return res.cc(e)
    }

    res.send({
        status: 0,
        msg: '查询文章详情成功',
        data: result[0]
    })
}