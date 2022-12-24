const users = require('../users.json')

function findUser(a,m){
    const userFound = users.filter(e=>{return (e.alias === (a) || e.email === (m))})
    return userFound
}

function findUsers(ip){
    const usersFound = users.filter(e=>{return (e.userStatus.filter(e=>{return e.ip.filter(el=>{return el.id === ip})}))})
    return usersFound 
}

function findUserByIp(ip){
    const userFound = users.filter(e=>{return (e.userStatus.find(e=>{return e.ip.find(e=>{return (e.id === ip) && (e.onlineState === true)})}))}).at(0)
    return userFound
}

function findUserState(ip){
    const userFound = users.filter(e=>{return (e.userStatus.find(e=>{return e.ip.find(e=>{return (e.id === ip)})}))})
    return userFound
}

module.exports = {
    findUser,
    findUserByIp,
    findUserState,
    findUsers
}