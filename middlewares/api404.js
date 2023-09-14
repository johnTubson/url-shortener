const AppError = require("../utils/error");

async function api404(req, res, next) {
	return next(new AppError("Specified resource not found", 404));
}

exports = module.exports = api404;
exports.api404 = api404;
