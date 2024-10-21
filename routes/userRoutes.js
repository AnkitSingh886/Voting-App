const mongoose = require('mongoose')
const express=require('express')
const User = require('./../models/user')
const router = express.Router();

const {jwtAuthMiddleware,generateToken} = require('./../jwt')

router.post('/signup',async function (req, res) {
    try {
        const data = req.body;
        const newUser = new User(data);

        const response = await newUser.save();

        if (!response) {
            res.status(404).json({ error: "Invalid format" })
        }
        const payload = {
            id: response.id
        }
        const token = generateToken(payload);
        console.log("Token is", token)
        res.status(404).json({ response: response, token: token })
    }
    catch (err) {
        console.log(err);
        res.status(404).json({ error:"some error occured during signup"});
    }
});

router.post('/login',async function (req, res) {
    try {
        const {aadharnumber,password} = req.body;
        const data = await User.findOne({ aadharnumber:aadharnumber});
        if (!data || !(data.comparePassword(password))) {
            return res.send(404).json({ error: "Invalid username" })
        }
        const payload = {
            id: data.id
        }
        const token = generateToken(payload);
        res.send({ token })
    }
    catch (err) {
        console.log(err);
        res.status(404).json({ error: "some error occured" })
    }
});

router.get('/profile',jwtAuthMiddleware,async function (req, res) {
    try {
        const userData = req.user;//ye ahmein jwt wale file se mil rha hai
        const userid = userData.id
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ error: "Incorrect token" })
        }
        res.send({ user })
    }
    catch (err) {
        console.log(err);
        res.status(404).json({ error: "some error occured" })
    }
});

router.put('/profile/password',jwtAuthMiddleware,async function(req,res){
   try{
    const userId=req.user.id;
    const {oldPassword,newPassword}=req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Both currentPassword and newPassword are required' });
    }

    // Find the user by userID
    const user = await User.findById(userId);

    if(!user ||!(await user.comparePassword(oldPassword))){
        return res.send(404).json({ error: "Invalid password" })
    }
    user.password=newPassword;
    await user.save();
    console.log("password changed successfully")
    res.status(200).json({message:"password changed successfully"})
   }
   catch(err){
    console.log(err);
    res.status(404).json({ error: "some error occured" })
   }
})

module.exports=router




