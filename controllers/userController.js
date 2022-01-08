const User=require("../models/userModel");

exports.getAllUsers=async (req,res)=>{
    try{
    const users=await User.find();
    res.status(200).json({
        status:"success",
        result:users.length,
        data:{
            users
        }
    })
    }catch(err){
        res.status(400).json({
            status:"fail",
            message:err
        })
    }
}
exports.changePassword=async (req,res)=>{
    try{
    const email=req.body.email;
    const user=await User.findOne({email:email}).select("+password");
    //console.log(user);
    if(!user)
        throw "Please enter valid email address"
    //user.passwordConfirm=undefined;
    user.password=req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;
    await user.save();
    res.status(200).json({
        data:{
            user
        }
    })
    }catch(err){
        res.status(400).json({
            message:err
        })
    }

}

exports.createUser=async (req,res)=>{
    res.status(500).json({
        status:"in-progress",
        message:"Functionality not defined yet"
    })
}
const filterObj=function(obj,arr){
    let newObj={};
    console.log(obj);
    Object.entries(obj).forEach(el=>{
  //if(arr.includes(el[]))
  //console.log(el[0]);
    if(arr.includes(el[0]))
        newObj[el[0]]=el[1];   
    });
    return newObj; 
}

exports.updateMe=async(req,res,next)=>{
    const filterObjects=filterObj(req.body,["email","name"]);
    console.log(filterObjects);
    const user=await User.findByIdAndUpdate(req.user._id,filterObjects,{new:true,runValidators:true});
    res.status(201).json({
       status:"success",
       data:{
           user
       }
    })
}
exports.deleteMe=async(req,res,next)=>{
    const user=await User.findByIdAndUpdate(req.user._id,{active:false});
    res.status(204).json({
        status:'success',
        data:null
    })
}