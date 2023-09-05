const AppError = require("../../utils/error");

async function protectRoute(req, res, next) {
	if (req.isAuthenticated && req.isAuthenticated()) {
		return next();
	}
	if (req.session) req.session.returnTo = req.originalUrl || req.url;
	return next(new AppError("Authentication required", 401));
}

module.exports = protectRoute;
