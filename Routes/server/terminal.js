const express = require('express')
const server = express.Router()

server.get('/status',(req,res)=>{
    console.log(req.body)
    res.status(200).json({server:{status: 200, state:"Online"}})
})

module.exports = server