const dotenv=require("dotenv");
const express=require("express");
const app=express();
const movieRouter=require("./routes/movieRoutes");
const userRouter=require("./routes/userRoutes");
const rateLimit=require("express-rate-limit");

dotenv.config({path:"./config.env"});

//MIDDLEWARES
app.use(express.json());                              //-----> M1
app.use((req,res,next)=>{                             //-----> M2
    console.log("Going through the middleware...");
    res.abc="New property";
    req.asc="SSS"
    next();
})
/*app.get("/get",(req,res)=>{
    res.status(200).json({
        status:"success",
        data:[res.abc,req.asc]     //REQ, RES props set in the M2 are consistent
    })
})*/

const rateLimiter=rateLimit({
    max:100,
    windowMs:60*60*1000,
    message:"Too many requests from this IP"
});
app.use("/api",rateLimiter);


app.use("/api/v1/movies",movieRouter);
app.use("/api/v1/users",userRouter);



module.exports=app;