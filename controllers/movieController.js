const Tour=require("../models/movieModel");

exports.getAllMovies=async (req,res)=>{
    //console.log(req.query)
    //console.log(req.query.sort)
    try{
    
    //Shallow copying to exclude     
    let querySt={...req.query};
    const excludeFields=["limit","sort","page","select"];
    excludeFields.forEach(el=>delete querySt[el]);
    //console.log(querySt);

    let queryString=JSON.stringify(querySt);
    queryString=queryString.replace(/\b(gte|gt|lte|lt)\b/g,(match)=>`$${match}`);
    //console.log(queryString)

    let tours= await Tour.find(JSON.parse(queryString)).sort(req.query.sort?req.query.sort:null).select(req.query.select?req.query.select.split(",").join(" "):null).limit(req.query.limit?Number(req.query.limit):null);

    //if(req.query.sort)
        //tours= tours.sort(req.query.sort);
    //const tours=await Tour.find()   
    res.status(200).json({
        status:"success",
        //testData:[res.abc,req.asc],
        results:tours.length,
        data:{
            tours
        }
    })
    }catch(err){
        res.status(400).json({
            status:"fail",
            message:err
        })
    }
}

exports.getMovie=async (req,res)=>{
    try{
    const tour=await Tour.findById(req.params.id);
    res.status(200).json({
        status:"success",
        data:{
            tour
        }
    })
    }catch(err){
        res.status(400).json({
            status:"fail",
            message:err
        })
    }
}
exports.createMovie=async (req,res)=>{
    try{
    const tour=await Tour.create(req.body);
    res.status(201).json({
        status:"success",
        data:{
            tour
        }
    })
    }catch(err){
    res.status(400).json({
        status:"fail",
        message:err
    })
}    
}
exports.updateMovie=async (req,res)=>{
    try{const updatedTour=await Tour.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
    res.status(200).json({
        status:"success",
        data:{
            updatedTour
        }
    })
    }catch(err){
    res.status(400).json({
        status:"fail",
        message:err
    })
    }
}
exports.updateFields=async (req,res)=>{
    try{
    const tour=await Tour.findById(req.params.id);
    //console.log(tour);
    if(req.body.length)
        tour.length=req.body.length;
    await tour.save();
    res.status(201).json({
        status:"success",
        data:{
            tour
        }
    });
    }catch(err){
        res.status(400).json({
            status:"fail",
            message:err
        }) 
    }
}
exports.deleteMovie=async (req,res)=>{
    try{
    const deleteTour=await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status:"success",
        data:{
            deleteTour
        }
    })
    }catch(err){
    res.status(400).json({
        status:"fail",
        message:err
    })
}
}
exports.aliasMovies=(req,res,next)=>{
    req.query.sort="-length";
    req.query.limit="5";
    req.query.select="_id name,rating";
    console.log(req.query)
    next();
}
exports.getMoviesWithMoreScreenTiming=async (req,res)=>{
    try{
    const details=await Tour.aggregate([
        {
            $match:{
                rating:{$gte:3.7}
            }
        },
        {
            $sort:{
                rating: -1
            }
        }
    ]);
    res.status(200).json({
        status:"success",
        data:{
            details
        }
    });
    }catch(err){
        res.status(400).json({
            status:"fail",
            message:err
        })
    }
}
exports.getMovieStats=async (req,res)=>{
    try{
    const stats=await Tour.aggregate([
        {
            $group:{
                _id:"$length",
                numMovies:{$sum:1},
                avgRating:{$avg:"$rating"}
            }
        },{
            $sort:{
                avgPrice:-1
            }
        },
        {
            $match:{
                avgRating:{$gte:3.6}
            }
        },
        {
            $sort:{
                _id:-1
            }
        }
    ]);
    res.status(200).json({
        status:"success",
        data:{stats}
    });
    }catch(err){
        res.status(400).json({
            status:"fail",
            message:err
        })
    }
}