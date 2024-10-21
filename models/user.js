const mongoose=require('mongoose');
const bcrypt=require('bcrypt')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String
    },
    mobile:{
        type:String
    },
    aadharnumber:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['voter','admin'],
        default:'voter'
    },
    isVoted:{
        type:Boolean,
        default:true
    }
});

userSchema.pre('save',async function(next){
    const User=this;
    try{
    if(!User.isModified('password')){
        return next();
    }
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(User.password,salt);
    User.password=hashedPassword;
    next();
}
catch(err){
    console.log('not able to verify')
    return next(err);
}
});
 userSchema.methods.comparePassword=async function(currentPassword){
    try{
        const isMatch=await bcrypt.compare(currentPassword,this.password);
        return isMatch;
    }
        catch(err){
            throw err;
        }
}
const User=mongoose.model('User',userSchema)
module.exports=User