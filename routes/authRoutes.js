const Router = require("express").Router();
const {
	createUserLocal,
	LocalLogin,
	forgotPassword,
	resetPassword,
	changePassword,
	renderResetPassword,
} = require("../controllers/auth/authController");
const protectRoute = require("../middlewares/authentication/authenticate");
const validateUser = require("../middlewares/validation/userValidation");

Router.route("/signup").post(createUserLocal);
Router.route("/login").post(LocalLogin());
Router.route("/resetPassword").get(renderResetPassword).post(resetPassword);
Router.route("/forgotPassword").post(forgotPassword);
Router.route("/changePassword").post(protectRoute, changePassword);

module.exports = Router;
