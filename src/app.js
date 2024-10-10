require('dotenv').config()
const express = require('express')
const app = express()
const routers = require('./routers/routers')

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use('/',routers)

module.exports = app