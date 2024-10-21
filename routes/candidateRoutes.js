 const express=require('express')
const Candidate = require('./../models/candidate')
const User = require('./../models/user')

const router = express.Router();
const {jwtAuthMiddleware,generateToken} = require('./../jwt')
const checkAdminrole=async function(userId){
    const user=await User.findById(userId);
    if(user.role==='admin'){
        return true;
    }
    return false;
}

router.post('/',jwtAuthMiddleware,async function (req, res) {
   
    try {
        if(!(await checkAdminrole(req.user.id))){
            return res.status(403).json({message:'user is not admin'})
        }
        const data = req.body;
        const newCandidate = new Candidate(data);
        const response = await newCandidate.save();
        console.log('candidate added successfully')
        res.status(200).json({response:response})
    }
    catch (err) {
        console.log(err);
        res.status(403).json({ error: "some error occured during signup"})
    }
});

router.put('/:candidateId',jwtAuthMiddleware,async function(req,res){
   try{
    if(!(await checkAdminrole(req.user.id))){
        return res.status(404).json({error:'user is not admin'})
    }
    const candidateId=req.params.candidateId;
    const updatedCandidate=req.body;
    const candidate=await Candidate.findByIdAndUpdate(candidateId,updatedCandidate);
    if(!candidate){
        res.status(404).json({ error: "candidate not found"})
  
    }
    console.log('candidate updated succesfully');
    res.status(200).json({candidate})

}
   catch(err){
    console.log(err);
    res.status(404).json({ error: "some error occured" })
   }
})
router.delete('/:candidateId',jwtAuthMiddleware,async function(req,res){
    try{
     if(!(await checkAdminrole(req.user.id))){
         return res.status(404).json({error:'user is not admin'})
     }
     const candidateId=req.params.candidateId;
     const candidate=await Candidate.findByIdAndDelete(candidateId);
     if(!candidate){
         res.status(404).json({ error: "candidate not found"})
     }
     console.log('candidate deleted successfully')
     res.status(200).json({candidate})
 }
    catch(err){
     console.log(err);
     res.status(404).json({ error: "some error occured" })
    }
 })

router.post('/vote/:candidateId',jwtAuthMiddleware,async function(req,res){
    const userId=req.user.id;
    try{
        const user=await User.findById(userId);
        if(!user){
            return res.status(403).json({message:'user not found'}) 
        }
        if(user.isVoted){
            return res.status(403).json({message:'user has already voted'})
        }
    if(!(user.role==='voter')){
        return res.status(403).json({message:'Admin dont have permission to vote'})
    }
    const candidateId=req.params.candidateId;
    const candidate=await Candidate.findById(candidateId);
    if(!candidate){
        return res.status(403).json({message:'candidate not found'})
    }
    candidate.votes.push({user:userId})
    candidate.voteCount++;
   
    await candidate.save();

    user.isVoted=true;
    await user.save();
    console.log('voted succesfully')
    res.status(200).json({message:' vote recorded succesfully'})
}
catch(err){
    console.log(err);
    res.status(404).json({ error: "some error occured" })
   }
})

router.get('/vote/count',async function(req,res){
    try{
        const candidates=await Candidate.find().sort({voteCount:'desc'});

        const voteRecord=candidates.map((data)=>{
            return {
                name:data.name,
                party:data.party,
                count:data.voteCount
            }
        })
        console.log('vote count retrieved succesfully');
        res.status(200).json({voteRecord});
    }
    catch(err){
        console.log(err);
        res.status(404).json({ error: "some error occured" })
    }
})

module.exports=router




