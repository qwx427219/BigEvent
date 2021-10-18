const express = require('express')

const router = express.Router()

const { addArticle, listArticle, delArticle, editArticle, queryArticleDetail } = require('../router_handler/article')

// 表单数据校验规则
const expressJOI = require('@escook/express-joi')
const { add_article_schema, list_article_schema, del_article_schema, eidt_article_schema } = require('../schema/article')

// 解析form-data表单数据
const multer = require('multer')
const path = require('path')
const upload = multer({ dest: path.join(__dirname, '../uploads') })

// 路由
router.post('/add', upload.single('cover_img'), expressJOI(add_article_schema), addArticle)
router.get('/list', expressJOI(list_article_schema), listArticle)
router.get('/delete/:id', expressJOI(del_article_schema), delArticle)
router.post('/edit', upload.single('cover_img'), expressJOI(eidt_article_schema), editArticle)
router.get('/:id', expressJOI(del_article_schema), queryArticleDetail)

module.exports = router