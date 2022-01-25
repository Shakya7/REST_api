const viewsController=require("../controllers/viewsController");
const authController=require("../controllers/authController");
const express=require("express");

const router=express.Router();

router.route("/").get(viewsController.getAllMovies);
router.route("/tour/:id").get(authController.protect,viewsController.getMovie);
router.route("/login").get(viewsController.getLoginPage);

module.exports=router;