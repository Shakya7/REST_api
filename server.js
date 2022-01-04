const app=require("./app");
const mongoose=require("mongoose");

//DB_CONNECTION_process
const DB=process.env.DB_CONN.replace("<password>",process.env.PASSWORD).replace("myFirstDatabase",process.env.DB_NAME);
mongoose.connect(DB).then(connection=>{
    console.log("DB connection to NodeJS is established successfully.")
})



//App listening to requests
app.listen(process.env.PORT,()=>{
    console.log("SERVER STARTED! Listening to server requests...");
})


