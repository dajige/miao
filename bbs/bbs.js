const express = require('express')
const CookieParser = require('cookie-parser')
const fs = require('fs')
const port = 8080
const app = express()
const users = JSON.parse(fs.readFileSync('./users.json'))
app.use((req,res,next)=>{ 
  console.log(req.method,req.url)
  next( )
})
app.use(express.urlencoded({extended:true}))
app.use(CookieParser('123'))
app.get('/',(req,res,next)=>{
   if(req.signedCookies.loginName){
    res.end(`
    <div><a href="/">homepage</a></div>
    <div>welcome,${req.signedCookies.loginName}</div>
    <div><a href="/logout">Logout</a></div>
    `)
   }else{
     res.end(`
     <div><a href="/">homepage</a></div>
     <div><a href="/register">Register</a></div>
     <div><a href="/login">Login</a></div>
     `)
   }

})
app.get('/register',(req,res,next)=>{
  res.type('html')
  res.end(`
  <h1>Register</h1>
  <form action="/Register" method="post">
  <div>name:<input type="text" name ="name"></div>
  <div>email:<input type="email" name ="email"></div>
  <div>password:<input type="password" name ="password"></div>
  <div>password:<input type="password" name ="password1"></div>
  <button>sunmit</button>
  </form>
  `)
})
app.post('/register',(req,res,next)=>{
var reginfo = req.body
if(reginfo.password !== reginfo.password1){
  res.end('two password not equal')
}
  if(users.some(it=>it.name == reginfo.name)){
    res.end('username already exists')
  }
  if(users.some(it=>it.email == reginfo.emali)){
    res.end('email already exists')
  }


  var user = {
    name:reginfo.name,
    email:reginfo.email,
    password:reginfo.password
  }
  users.push(user)
  res.end('register success')
  fs.writeFileSync('./users.json',JSON.stringify(users,null,2))
})
app.get('/login',(req,res,next)=>{
  res.end(`
  <h1>Login</h1>
  <form action="/login" method="post">
  <div>name:<input type="text" name ="name"></div>
  <div>password:<input type="password" name ="password"></div>
  <button>sunmit</button>
  </form>
  `)
})
app.post('/login',(req,res,next)=>{
  var loginingo = req.body
  var target = users.find(it => it.name ==loginingo.name&&it.password == loginingo.password)
  if(target){
res.cookie('loginName',target.name,{
  maxAge:8640000, 
  signed:true,
})
res.end('login sucess')
  }else{
    res.end('username or password incorrect')
  }
}) 
app.get('/logout',(req,res,next)=>{
  res.clearCookie('loginName')
  res.redirect('/')
})
 app.listen(port,()=>{
  console.log('listening on',port)
})