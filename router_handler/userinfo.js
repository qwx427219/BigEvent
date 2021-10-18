const db = require('../db/index')

const bcrypt = require('bcryptjs')

// 获取用户基本信息 处理函数
exports.getUserInfo = async(req, res) => {
    const sql = 'select id, username, nickname, email, user_pic from en_users where id = ?'

    let results = []
    try {
        results = await db.queryByPromisify(sql, req.user.id)

        if (results.length !== 1) {
            return res.cc('获取用户信息失败')
        }
    } catch (e) {
        return res.cc(e)
    }

    res.send({
        status: 0,
        msg: '获取用户信息成功',
        data: results[0]
    })
}

// 更新用户基本信息 处理函数
exports.updateUserInfo = async(req, res) => {
    const sql = 'update en_users set ? where id = ?'

    try {
        const result = await db.queryByPromisify(sql, [req.body, req.body.id])

        if (result.affectedRows !== 1) {
            return res.cc('更新用户信息失败')
        }

    } catch (e) {
        res.cc(e)
    }

    res.cc('更新用户信息成功', 0)
}

// 更新用户密码 处理函数
exports.updatePwd = async(req, res) => {
    // 查询用户是否存在，并获取数据库中旧密码
    const sql = 'select * from  en_users where id = ?'

    let results = []
    try {
        results = await db.queryByPromisify(sql, req.user.id)

        if (results.length !== 1) {
            return res.cc('重置密码失败')
        }
    } catch (e) {
        return res.cc('重置密码失败')
    }

    const oldPwdStored = results[0].password

    // 对比用户输入的旧密码和数据库中旧密码
    const compareResult = bcrypt.compareSync(req.body.oldPwd, oldPwdStored)

    if (!compareResult) {
        return res.cc('旧密码不正确')
    }

    // 用新密码替换掉数据库中的旧密码
    const newPwdEncrypted = bcrypt.hashSync(req.body.newPwd, 10)

    const sqlUpdate = 'update en_users set password = ? where id = ?'

    let resultUpdate = []
    try {
        resultUpdate = await db.queryByPromisify(sqlUpdate, [newPwdEncrypted, req.user.id])

        if (resultUpdate.affectedRows !== 1) {
            return res.cc('重置密码失败')
        }
    } catch (error) {
        return res.cc('重置密码失败')
    }

    res.send({
        status: 0,
        msg: '重置密码成功'
    })
}

// 更新用户头像 处理函数
exports.updateAvatar = async(req, res) => {
    const sql = 'update en_users set user_pic = ? where id = ?'

    let result = null
    try {
        result = await db.queryByPromisify(sql, [req.body.avatar, req.user.id])

        if (result.affectedRows !== 1) {
            return res.cc('更新用户头像失败')
        }
    } catch (e) {
        return res.cc('更新用户头像失败')
    }

    res.send({
        status: 0,
        msg: '更新用户头像成功'
    })
}