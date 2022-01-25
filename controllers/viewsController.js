const Movie=require("../models/movieModel");

exports.getAllMovies=async(req,res)=>{
    const movies=await Movie.find();
    res.status(200).render("overview",{
        status:"success",
        movies,
        title:"Home Page"
    })
}

exports.getMovie=async(req,res)=>{
    const movie=await Movie.findById(req.params.id);
    res.status(200).render("tour",{
        status:"success",
        movie,
        title:`${movie.name}`
    })

}
exports.getLoginPage=async(req,res)=>{
    res.status(200).render("login",{
        title:"Login Page"
    })
}