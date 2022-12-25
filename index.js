require('dotenv')

const express = require('express');
const morgan = require('morgan');
const server = express();

const terminal = require('./Routes/server/terminal.js');
const users = require('./Routes/server/users.js');
const posts = require('./Routes/apps/posts.js');

server.use((req, res, next)=>{
    console.log(req.headers.origin)
    const corsList = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://192.168.100.16:3000'
    ];
    if(corsList.includes(req.headers.origin)){   
        res.header('Access-Control-Allow-Origin', (req.headers.origin));
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested, Content-Type, Accept');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        next();
    }
});

server.use(morgan('dev'))
server.use(express.json())
server.use('/terminal', terminal)
server.use('/users', users)
server.use('/posts', posts)

server.listen(10000, () => console.log(`Server status: online`))