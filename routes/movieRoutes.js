const express=require("express");
const app=require("../app");
const movieController=require("../controllers/movieController");

const router=express.Router();

router.route("/").get(movieController.getAllMovies).post(movieController.createMovie);
router.route("/stats").get(movieController.getMovieStats);
router.route("/ratingsGTE3.7").get(movieController.getMoviesWithMoreScreenTiming);
router.route("/top5").get(movieController.aliasMovies,movieController.getAllMovies);
router.route("/:id").get(movieController.getMovie).patch(movieController.updateMovie).delete(movieController.deleteMovie);


module.exports=router;
