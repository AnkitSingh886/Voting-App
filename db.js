//MongoDB Connection
const mongoose=require('mongoose')
const mongolocalUrl=process.env.mongolocalUrl

mongoose.connect(mongolocalUrl);

const db=mongoose.connection;

db.on('connected',(req,res)=>{
    console.log('mongodb connection succesfull')
})
db.on('disconnected',(req,res)=>{
    console.log(' error mongodb connection not succesfull')
})
db.on('error',(err)=>{
    console.log(err)
})

module.exports=db