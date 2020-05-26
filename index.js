const express=require('express')
const bodyparser=require('body-parser')
const bcrypt=require('bcrypt')

const encrypting=require('./encrypting')
const login=require('./login')
const message=require('./message')

const app=express()
app.use(bodyparser.json())



app.post('/signup',(req,res)=>{
    let hash = bcrypt.hashSync(req.body.password, 10)
    let body={
        email:req.body.email,
        password:hash,
        phone:req.body.phone
    }
    login.postingdata(body,res)
})

app.post('/login',(req,res)=>{
    login.loginuser(req.body,res)
})

app.post('/upload/message',(req,res)=>{
    let encrypttext=encrypting.encrypt(req.body.message)
    let body={
        message:encrypttext,
        sent_by:req.body.sender,
        received_by:req.body.receiver
    }
    message.postmessage(body,res)
})

app.get('/get/message/:name',(req,res)=>{
    message.getmessage(req.params.name,res)
})
const port=4000 || process.env.PORT

app.listen(port,()=>{
    console.log(`The application is running on port ${port}`)
})