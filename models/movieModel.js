const mongoose=require("mongoose");

const movieSchema= new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        unique:true,
        required:[true, "There must be movie name"],
    },
    length:{
        type:Number,
        required:[true, "Movie must have a length"]
    },
    director:{
        type:String,

    },
    actors:[String],
    rating:{
        type:Number,
        default:3.5,
        //select:false
    }

},{
    //toJSON:{virtuals:true},
    //toObject:{virtuals:true}
});

//PRE,POST "SAVE" MIDDLEWARE
movieSchema.pre("save",function(next){
    //console.log(this);
    //this.director="ABCX"
    next();
})
movieSchema.pre("save",function(next){
    console.log("This is the second pre middleware");
    next();
})
movieSchema.post("save",function(doc,next){
    console.log(doc);
    console.log("This is the post middleware");
    next();
})

//PRE,POST "QUERY" MIDDLEWARE
movieSchema.pre(/^find/,function(next){
    console.log(this);
    this.find({rating:{$gte:3.7}});
    this.sort("-rating");
    next();
})

const Movie=mongoose.model("Movie",movieSchema);
module.exports=Movie;