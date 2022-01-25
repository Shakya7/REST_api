const User=require("../models/userModel");
const jwt=require("jsonwebtoken");
const sendEmail=require("../utils/email");
const crypto=require("crypto");


exports.signup=async (req,res)=>{
    try{
    const newUser=await User.create(/*{
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm
    }*/
        req.body
    );
    const token=jwt.sign({id:newUser._id,name:newUser.name},process.env.SECRET,{expiresIn:process.env.JWT_EXPIRES});
    res.status(201).json({
        status:"success",
        token,
        data:{
            user:newUser
        }
    })
    }catch(err){
        res.status(404).json({
            status:"fail",
            message:err
        })
    }
}

exports.login=async (req,res)=>{
    try{
    const {email,password}=req.body;
    const user=await User.findOne({
        email:email
    }).select("+password");
    console.log(user);
    if(!user)
        throw "Please enter a valid email";
    const correct=await user.compareNormalPwithHashedP(password,user.password);
    //console.log(correct)
    if(!correct) 
        throw "Please provide valid password";   
    const token= jwt.sign({id:user._id,name:user.name},process.env.SECRET,{expiresIn:process.env.JWT_EXPIRES}); 
    const cookieOptions={
        expires:new Date(Date.now()+process.env.COOKIE_EXPIRES*24*60*60*1000),
        httpOnly:true
    }
    res.cookie("jwt",token,cookieOptions);
    res.status(200).json({
        status:"success",
        token,
        message:"You have logged in successfully"
    })
    }catch(err){
        res.status(400).json({
            status:"fail",
            message: err
        })
    }    
}

exports.protect=async(req,res,next)=>{
    try{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
        token=req.headers.authorization.split(" ")[1];
    else if(req.cookies.jwt)   
        token=req.cookies.jwt;
    //If token is there at all
    console.log(token);    
    if(!token)
        return next("You are not logged in");
    //If token valid
    const decoded=jwt.verify(token,process.env.SECRET);
    console.log(decoded);
    //If user present at all
    const user=await User.findById({_id:decoded.id});
    console.log(user);
    if(!user)
        return next("User is not there in DB");
    //If password changed after token is issued
    if(user.changePasswordAfter(decoded.iat))
        return next("Password is changed after token is issued");
    req.user=user;
    next();
    }catch(err){
        res.status(400).json({
            status:"fail",
            message: err
        })
    }
}

exports.restrictTo=function(...roles){
    return (req,res,next)=>{
        if(!roles.includes(req.user.role))
            return next("Access denied");
        next();    
    }
}

exports.forgotPass=async(req,res,next)=>{
    const {email}=req.body;
    const user=await User.findOne({email});
    const token=user.createPasswordResetToken();
    await user.save({validateBeforeSave:false});

    const resetURL=`${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${token}`;
    const message=`Forgot your password? Go to ${resetURL} and change the password`;
    try{
        await sendEmail({
            email:user.email,
            subject:"Your Reset Token",
            message
        });
        res.status(200).json({
            status:"success",
            message:"Token sent to email"
        });
    }catch(err){
        this.passwordResetToken=undefined;
        this.passwordResetExpires=undefined;
        await user.save({validateBeforeSave:false});
        res.status(500).json({
            status:'fail',
            message:err
        })
    }
}

exports.resetPassword=async(req,res,next)=>{
    try{
    const hashedToken=crypto.createHash("sha256").update(req.params.token).digest("hex");
    console.log(hashedToken);
    const user=await User.findOne({passwordResetToken:hashedToken,passwordResetExpires:{$gte:Date.now()}});
    console.log(user);
    if(!user)
        return next("Token expired or invalid token provided");
    user.password=req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;
    user.passwordResetToken=undefined;
    user.passwordResetExpires=undefined;
    await user.save(); 
    
    const token=jwt.sign({id:user._id,name:user.name},process.env.SECRET,{expiresIn:process.env.JWT_EXPIRES});
    res.status(201).json({
        status:"success",
        token,
        message:"Password has been reset"
    })
    }catch(err){
        res.status(400).json({
            status:"fail9",
            message: err
        });
    }

}

exports.updatePassword=async(req,res,next)=>{
    try{
    const user=await User.findById(req.user.id).select("+password");
    if(!await user.compareNormalPwithHashedP(req.body.currentPassword,user.password))
        return next("Invalid password");
    user.password=req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;  
    await user.save();
    const token=jwt.sign({id:user._id,name:user.name},process.env.SECRET,{expiresIn:process.env.JWT_EXPIRES});
    res.status(201).json({
        status:"success",
        message:"password has been updated",
        user,
        token
    });
    }catch(err){
        res.status(400).json({
            status:"fail",
            message: err
        });
    }
}