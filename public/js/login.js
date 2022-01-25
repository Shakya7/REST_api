//const authController=require("../../controllers/authController");
//import axios from "axios";

const loginDetails=async function(email,password){
    try{
    /*const res=axios.post("127.0.0.1:4500/api/v1/users/login",{
       email,
       password 
    })    
    console.log(res);*/
    //alert(email, password);
    const res=await axios({
        method:"POST",
        url:"http://127.0.0.1:4500/api/v1/users/login",
        data:{
            email,
            password
        },
        /*headers:{
            "accept":
            "abc":"22344"
        }*/
    });
    console.log(res);
    }catch(err){
        console.log(err)
    }
}


const submitBttn=document.getElementById("submit");
console.log(submitBttn)
submitBttn.addEventListener("click",(el)=>{
    el.preventDefault();
    console.log("Hello");
    const password=document.getElementById("password_ip").value;
    const email=document.getElementById("email_ip").value;
    console.log(password, email);
    loginDetails(email,password);
})