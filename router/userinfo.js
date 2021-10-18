const express = require('express')
const userinfoHandler = require('../router_handler/userinfo')
const expressJOI = require('@escook/express-joi')
const { update_userinfo_schema, update_password_schema, update_avatar_schema } = require('../schema/user')

const router = express.Router()

router.get('/userinfo', userinfoHandler.getUserInfo)
router.post('/userinfo', expressJOI(update_userinfo_schema), userinfoHandler.updateUserInfo)
router.post('/updatepwd', expressJOI(update_password_schema), userinfoHandler.updatePwd)
router.post('/update/avatar', expressJOI(update_avatar_schema), userinfoHandler.updateAvatar)

module.exports = router