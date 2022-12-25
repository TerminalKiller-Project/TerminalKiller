const express = require('express')
const server = express.Router()
const users = require('../../users.json')
const fs = require('fs');
const { findUser, findUserByIp, findUsers } = require('../../Functions/users');

server.get('/', (req,res)=>{
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const usersFound = findUsers(ip)
  return res.status(200).send(usersFound)
})

server.post('/create', async (req,res,next)=>{
    const {alias, email, contraseña} = req.body;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userFound = findUser(alias, email)
    if (!alias || !email || !contraseña || userFound.length>0) return res.status(404).json({error : 'Error'});
    try {
        const newUser = {"userStatus":[{"ip":[{"id":ip,"onlineState":false}]}],"alias":alias,"email":email,"contraseña":contraseña}
        const usersList = [...users, newUser]
        const usersToJson = JSON.stringify(usersList)

        fs.writeFile("users.json", usersToJson, (err) => {
          if (err)
            console.log(err);
          else {
            console.log("File written successfully\n");
            console.log("The written has the following contents:");
            console.log(fs.readFileSync("users.json", "utf8"));
          }
        });
        return res.status(200).json("Usuario creado con éxito.")
    }catch(error){
        next(error);
    }
})

server.get('/loggedaccount', async (req, res, next)=>{
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const user = await findUserByIp(ip)
  const log = await user? user.userStatus.at(0).ip.at(0).onlineState : false
  res.status(200).json([user, log])
})

server.post('/login',(req,res,next)=>{
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const {userName, contraseña} = req.body.at(0);
  const user = findUser(userName, userName)
  if(user.at(0).contraseña === contraseña){
    users.filter(e=> e.alias===user.at(0).alias).at(0).userStatus.filter(e=> e.ip.find(e=>e.id === ip)).at(0).ip.at(0).onlineState = true
    const usersToJson = JSON.stringify(users)

    fs.writeFile("users.json", usersToJson, (err) => {
        if (err)
          console.log(err);
        else {
          console.log("File written successfully\n");
          console.log("The written has the following contents:");
          console.log(fs.readFileSync("users.json", "utf8"));
        }
      }
    )
    return res.status(200).json({state:true, current:user.at(0).alias})
  }
})

server.post('/logout', (req,res)=>{
  const {userName} = req.body;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const user = findUser(userName, userName)
  users.filter(e=> e.alias===user.at(0).alias).at(0).userStatus.filter(e=> e.ip.find(e=>e.id === ip)).at(0).ip.at(0).onlineState = false
  const usersToJson = JSON.stringify(users)

  fs.writeFile("users.json", usersToJson, (err) => {
      if (err) console.log(err);
      else console.log("Log Out");
    }
  )
  res.status(200).json({state:false, current:''})
})



module.exports = server