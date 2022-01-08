const express=require("express");
const authController=require("../controllers/authController");
const userController=require("../controllers/userController");

const router=express.Router();

router.route("/").get(userController.getAllUsers).post(userController.createUser);
router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/changeP").patch(userController.changePassword);
router.route("/forgotpass").post(authController.forgotPass);
router.route("/resetPassword/:token").patch(authController.resetPassword);
router.route("/updatePassword").patch(authController.protect,authController.updatePassword);
router.route("/updateMe").patch(authController.protect,userController.updateMe);
router.route("/deleteMe").patch(authController.protect,userController.deleteMe);

module.exports=router;