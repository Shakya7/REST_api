const express=require("express");
const app=require("../app");
const movieController=require("../controllers/movieController");
const authController=require("../controllers/authController");
const router=express.Router();

router.route("/").get(authController.protect,movieController.getAllMovies).post(movieController.createMovie);
router.route("/stats").get(movieController.getMovieStats);
router.route("/ratingsGTE3.7").get(movieController.getMoviesWithMoreScreenTiming);
router.route("/top5").get(movieController.aliasMovies,movieController.getAllMovies);
router.route("/:id").get(authController.protect,movieController.getMovie).patch(movieController.updateMovie).delete(authController.protect,authController.restrictTo("admin","lead-guide"),movieController.deleteMovie);


module.exports=router;
