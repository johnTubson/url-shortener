require("dotenv").config();
const express = require("express");
require("express-async-errors");
const requestUrlMiddleware = require("./utils/requestUrl");
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");
const linkRoutes = require("./routes/linkRoutes");
const staticRoutes = require("./routes/staticRoutes");
const { centralErrorHandler, error404Handler } = require("./controllers/error/errorController");
const passport = require("./controllers/auth/passport");

const PORT = process.env.PORT;

const app = express();

// EXPRESS MIDDLEWARES
app.use("/favicon.ico", express.static("public/favicon.ico"));
app.use(express.json());
app.use(express.static("public"));
app.use(requestUrlMiddleware);
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		saveUninitialized: false,
		resave: false,
		cookie: {
			maxAge: 3 * 24 * 60 * 60 * 100,
			secure: process.env.NODE_ENV === "production" ? true : false,
			httpOnly: true,
		},
	})
);
app.use(passport.session());

// ROUTES
app.use("/api/v1/link", linkRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/", staticRoutes);

//ERROR HANDLING
app.use(error404Handler);
app.use(centralErrorHandler);

//SERVER INITIALIZATION
app.listen(PORT, () => {
	console.log(`Server started successfully on port ${PORT}`);
});
