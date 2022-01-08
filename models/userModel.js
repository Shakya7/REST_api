const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcryptjs");
const crypto=require("crypto");

const userSchema=new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
          // This only works on CREATE and SAVE!!!
          validator: function(el) {
            return el === this.password;
          },
          message: 'Passwords are not the same!'
        }
    },
    passwordChangedAt: {
        type: Date
        
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }

});

userSchema.methods.compareNormalPwithHashedP=async function(userPass,dbPassHashed){
    return await bcrypt.compare(userPass,dbPassHashed);
}

userSchema.methods.changePasswordAfter=function(iat){
    if(this.passwordChangedAt){
        //const changedP=parseInt(this.passwordChangedAt.getTime() /1000,10);
        console.log(parseInt(this.passwordChangedAt.getTime() /1000,10),iat);
        return iat<parseInt(this.passwordChangedAt.getTime() /1000,10);
    } 
    return false;    
}

userSchema.methods.createPasswordResetToken=function(){
    const resetToken=crypto.randomBytes(32).toString("hex");
    this.passwordResetToken=crypto.createHash("sha256").update(resetToken).digest("hex");
    this.passwordResetExpires=Date.now()+10*60*1000; //adding 10mins
    console.log({resetToken},this.passwordResetToken,this.passwordResetExpires);
    return resetToken;
}
userSchema.pre("save",async function(next){
    if(!this.isModified("password"))
        return next();
    this.passwordChangedAt=Date.now()-1000;
    next();    
})

userSchema.pre("save",async function(next){
    if(!this.isModified("password"))     //id password is changed
        return next();
    //this.password="sdsfdsdf";
    this.password=await bcrypt.hash(this.password,12);
    this.passwordConfirm=undefined;
    //console.log("Password is changed")
    next();
})
userSchema.pre(/^find/,function(next){
    this.find({active:{$ne:false}});
    next();
})

const User=mongoose.model("User",userSchema);

module.exports=User;