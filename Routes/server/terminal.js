const express = require('express')
const server = express.Router()

server.get('/status',(req,res)=>{
    res.status(200).res("OK")
})

module.exports = server