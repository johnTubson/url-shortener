const Router = require("express").Router();
const {
	createUserLocal,
	LocalLogin,
	forgotPassword,
	resetPassword,
	changePassword,
	renderResetPassword,
} = require("../controllers/auth/authController");
const api404 = require("../middlewares/api404");
const protectRoute = require("../middlewares/authentication/authenticate");
const authValidator = require("../middlewares/validation/authValidation");

Router.route("/signup").post(authValidator.localRegistration, createUserLocal);
Router.route("/login").post(authValidator.localLogin, LocalLogin());
Router.route("/resetPassword").post(authValidator.resetPassword, resetPassword);
Router.route("/forgotPassword").post(authValidator.forgotPassword, forgotPassword);
Router.route("/changePassword").post(authValidator.changePassword, protectRoute, changePassword);

Router.use(api404);

module.exports = Router;
