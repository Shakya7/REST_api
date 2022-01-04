const dotenv=require("dotenv");
const express=require("express");
const app=express();
const movieRouter=require("./routes/movieRoutes");

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

app.use("/api/v1/movies",movieRouter);


module.exports=app;