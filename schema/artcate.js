const joi = require('joi')

const name = joi.string().required()
const alias = joi.string().alphanum().required()
const id = joi.number().integer().min(1).required()

exports.add_cates_schema = {
    body: {
        name,
        alias
    }
}

exports.operateCate_by_id_schema = {
    params: {
        id
    }
}

exports.update_cate_schema = {
    body: {
        id,
        name,
        alias
    }
}