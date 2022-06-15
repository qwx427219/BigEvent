// 导入express模块
const express = require('express')

// 创建express的服务器实例
const app = express()

// 导入cors中间件，并将cors注册为全局中间件
const cors = require('cors')
app.use(cors())

// 托管静态资源
app.use('/uploads', express.static('./uploads'))
app.use(express.static('./web'))

// 配置解析表单数据的中间件, [注意]该中间件只能解析application/x-www-form-urlencoded格式的表单数据
app.use(express.urlencoded({ extended: false }))

// 封装res.send函数为cc函数，并设置为全局可用
app.use((req, res, next) => {
    res.cc = function (err, status = 1) {
        res.send({
            status,
            msg: err instanceof Error ? err.message : err
        })
    }
    next()
})

// 配置jwt解析
const expressJWT = require('express-jwt')
const config = require('./confg')
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

// 导入用户路由模块，并注册为全局中间件
const userRouter = require('./router/user')
app.use('/api', userRouter)

const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)

const artCateRouter = require('./router/artcate')
// bugfix:这里url前缀定义的不好，重新定义，和/my/article区别
app.use('/my/artcate', artCateRouter)

const articleRouter = require('./router/article')
app.use('/my/article', articleRouter)

// 配置全局错误级别中间件
const joi = require('joi')
app.use((err, req, res, next) => {
    if (err instanceof joi.ValidationError) {
        return res.cc(err)
    }
    if (err.name == 'UnauthorizedError') {
        return res.cc('身份认证失败')
    }
    res.cc(err)
})

// 指定服务器端口号，并启动服务器
app.listen(3007, () => {
    console.log('api server running at http://127.0.0.1:3007');
})