const mysql = require('mysql2')
require('dotenv').config();
const pool = mysql.createPool({
    host: process.env.ESHOP_DB_HOST,
    user: process.env.ESHOP_DB_USER,
    password: process.env.ESHOP_DB_PASSWORD,
    database: process.env.ESHOP_DB_SCHEMA,
    multipleStatements: true
})

// const pool = mysql.createPool({
//     host: "e-shop-cloud.cmurfyujqei1.us-east-1.rds.amazonaws.com",
//     user: "admin",
//     password: "Test1234",
//     database: "eshop",
//     multipleStatements: true
// })

module.exports = pool.promise();