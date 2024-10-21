const express=require('express');
const dotenv=require('dotenv').config();
const app=express();
const userRoutes=require('./routes/userRoutes')
const User=require('./models/user')
const candidate=require('./models/candidate')
const candidateRoutes=require('./routes/candidateRoutes')
const db=require('./db')

const bodyParser=require('body-parser');


app.use(bodyParser.json());//req body
app.use('/user',userRoutes);
app.use('/candidate',candidateRoutes);

app.use('/',function(req,res){
    res.send('Welcome to the Voting Appplication')
})

const port=process.env.PORT || 3000;

app.listen(port,(req,res)=>{
    console.log(`App is running at port http://localhost:${port}`)
})