const dotenv=require("dotenv");
const express=require("express");
const app=express();
const movieRouter=require("./routes/movieRoutes");
const userRouter=require("./routes/userRoutes");
const rateLimit=require("express-rate-limit");
const path=require("path");
const viewRouter=require("./routes/viewsRoutes");
const cookieParser=require("cookie-parser");

dotenv.config({path:"./config.env"});

app.set("view engine","pug");
app.set("views",path.join(__dirname,"views"));

//MIDDLEWARES
app.use(express.json());                              //-----> M1
 app.use(cookieParser());
app.use(express.static(path.join(__dirname,"public"))); //-----> M2
app.use((req,res,next)=>{                             //-----> M3
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
app.use((req,res,next)=>{
    console.log(req.cookies);
    next();
})

app.get("/footer",(req,res)=>{
    res.status(200).render("testA",{
        abc:"eeer",
        title:"Tours page",
        aaaa:"2234"
    })
})
const rateLimiter=rateLimit({
    max:100,
    windowMs:60*60*1000,
    message:"Too many requests from this IP"
});
app.use("/api",rateLimiter);

app.use("/",viewRouter);
app.use("/api/v1/movies",movieRouter);
app.use("/api/v1/users",userRouter);



module.exports=app;