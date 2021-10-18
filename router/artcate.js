const express = require('express')

const router = express.Router()

const { getArticleCates, addArticleCates, deleteArticleById, getArticleCateById, updateCateById } = require('../router_handler/artcate')

const expressJOI = require('@escook/express-joi')

const { add_cates_schema, operateCate_by_id_schema, update_cate_schema } = require('../schema/artcate')

router.get('/cates', getArticleCates)
router.get('/cates/:id', expressJOI(operateCate_by_id_schema), getArticleCateById)
router.post('/addcates', expressJOI(add_cates_schema), addArticleCates)
router.get('/deletecate/:id', expressJOI(operateCate_by_id_schema), deleteArticleById)
router.post('/updatecate', expressJOI(update_cate_schema), updateCateById)

module.exports = router