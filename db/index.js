const mysql = require('mysql')
const { promisify } = require('util')

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'my_db_01'
})

queryByPromisify = promisify(db.query).bind(db)

db.queryByPromisify = queryByPromisify

module.exports = db