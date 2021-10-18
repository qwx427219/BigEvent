const joi = require('joi')

const title = joi.string().required()
const cate_id = joi.number().integer().min(1).required()
const content = joi.string().required().allow('')
const state = joi.string().valid('草稿', '已发布').required()

const pagenum = joi.number().integer().min(0).required()
const pagesize = joi.number().integer().min(1).required()
const cate_id_optional = joi.number().integer().min(1).optional()
const state_optional = joi.string().valid('草稿', '已发布').optional()

const id = joi.number().integer().min(1).required()

exports.add_article_schema = {
    body: {
        title,
        cate_id,
        content,
        state
    }
}

exports.list_article_schema = {
    query: {
        pagenum,
        pagesize,
        cate_id: cate_id_optional,
        state: state_optional
    }
}

exports.del_article_schema = {
    params: {
        id
    }
}

exports.eidt_article_schema = {
    body: {
        id,
        title,
        cate_id,
        content,
        state
    }
}