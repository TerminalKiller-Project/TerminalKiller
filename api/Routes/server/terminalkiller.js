const express = require('express')
const server = express.Router()

server.get('/admin/log',(req,res)=>{
    if (tale) return res.send('TerminalKiller Project')
    res.status(400).send("Error")
})

module.exports = server