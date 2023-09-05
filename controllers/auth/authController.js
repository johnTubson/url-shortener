const { User } = require("../../models/model");
const AppError = require("../../utils/error");
const passport = require("./passport");
const crypto = require("node:crypto");
const Email = require("../../utils/email");

// create user
async function createUserLocal(req, res, next) {
	// input should have been santized and cleaned
	const { first_name, last_name, email, password } = req.body;
	const new_user = new User({
		first_name: first_name,
		last_name: last_name,
		email: email,
		password: password,
		auth_type: "local",
	});
	await new_user.save();
	new_user.password = undefined;
	res.status(201).json(new_user);
}

async function createUserOAuth(profile) {
	const new_user = new User({
		first_name: profile.displayName,
		email: profile.email,
		auth_type: "oauth",
		oauth: {
			provider: profile.provider,
			id: profile.id,
		},
	});
	try {
		const authenticatedUser = await new_user.save();
		return authenticatedUser;
	} catch (err) {
		next(new AppError("Error saving oauth credentials", 401));
	}
}

function LocalLogin() {
	return [
		passport.authenticate("local", { failureRedirect: "/login" }),
		async function (req, res, next) {
			return res.status(200).json({
				message: "Login successful",
				redirect: req.session?.returnTo ? req.session?.returnTo : null,
			});
		},
	];
}

async function forgotPassword(req, res, next) {
	const { email } = req.body;
	const user = await User.findOne({ email: email });
	if (!user || !user.auth_type === "local") return next(new AppError("No account with the provided email found", 400));
	const token = await user.createPasswordResetToken();
	await user.save({ validateModifiedOnly: true });
	let url;
	process.env.NODE_ENV === "production"
		? (url = `${req.protocol}://${req.hostname}/resetpassword/?token=${token}`)
		: (url = `${req.protocol}://${req.hostname}:${process.env.PORT}/resetpassword/?token=${token}`);
	const resetEmail = new Email(user, url);
	await resetEmail.sendResetToken();
	// send mail with token asynchronously
	res.status(201).json({ message: "Email containing reset token successfully sent" });
}

async function resetPassword(req, res, next) {
	const resetToken = crypto.createHash("sha256").update(req.query.token).digest("hex");
	const user = await User.findOne({ passwordResetToken: resetToken });
	if (!user) return next(new AppError("Invalid token or token has expired, please try again", 401));
	const validToken = await user.compareResetToken(resetToken);
	if (!validToken) return next(new AppError("Invalid token or token has expired, please try again", 401));
	user.password = req.body.password;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();
	res.status(201).json({ message: "Password successfully resetted" });
}

async function renderResetPassword(req, res, next) {
	///
}

async function changePassword(req, res, next) {
	const { old_password, password } = req.body;
	const user = await User.findOne({ _id: req.user._id });
	if (!user || !user.auth_type === "local") return next(new AppError("Error updating password", 400));
	const passwordCompare = await user.comparePassword(password, old_password);
	if (!passwordCompare) return next(new AppError("Password doesn't match", 400));
	user.password = password;
	await user.save();
	//destroy session
	req.session.destroy();
	res.status(201).json({ message: "Password successfully changed" });
}

module.exports = {
	createUserLocal,
	createUserOAuth,
	LocalLogin,
	forgotPassword,
	resetPassword,
	changePassword,
	renderResetPassword,
};
