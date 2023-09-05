const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { Strategy: LocalStrategy } = require("passport-local");
const { User } = require("../../models/model");
const { createUserOAuth } = require("../user/userController");

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.GOOGLE_CALLBACK_URL,
			scope: ["profile", "email"],
			state: true,
		},
		async function (accessToken, refreshToken, profile, cb) {
			try {
				const foundUser = await User.findOne({ email: profile.email });
				if (!foundUser) return cb(null, createUserOAuth(profile));
				if (foundUser.auth_type === "local") return cb(null, false, { message: "User registered using natively" });
				return cb(null, foundUser);
			} catch (err) {
				return cb(err, null);
			}
		}
	)
);

passport.use(
	new LocalStrategy({ usernameField: "email" }, async function verify(username, password, cb) {
		const user = await User.findOne({ email: username }).select("+password");
		if (!user) return cb(err, null, { message: "Invalid Email or Password" });
		if (user.auth_type === "oauth") return cb(null, false, { message: "User registered using oauth" });
		const authenticatedUser = await user.comparePassword(password, user.password);
		if (!authenticatedUser) return cb(err, false, { message: "Invalid Email or Password" });
		return cb(null, user);
	})
);

passport.serializeUser((user, done) => {
	process.nextTick(() =>
		done(null, {
			_id: user._id,
			email: user.email,
			auth_type: user.auth_type,
			first_name: user.first_name,
		})
	);
});

passport.deserializeUser((user, done) => {
	process.nextTick(() => done(null, user));
});

module.exports = passport;
