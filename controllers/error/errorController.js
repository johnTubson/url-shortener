const AppError = require("../../utils/error");

function handleCastErrorDB(error) {
	const message = `Invalid ${error.path}: ${error.value}.`;
	const castError = new AppError(message, 400, error, true);
	return castError;
}

function handleValidationErrorDB(error) {
	let message = Object.values(error.errors)
		.map(obj => obj.message)
		.join(". ")
		.replaceAll('"', "");

	const ValError = new AppError(message, 400, error, true);
	return ValError;
}

function handleDuplicateFieldsDB(error) {
	const value = error.errmsg.match(/(["'])(\\?.)*?\1/)[0];
	const message = `${value} already exists. Please use another value`;
	const DupError = new AppError(message, 400, error, true);
	return DupError;
}

function handleErrorDev(err, req, res) {
	console.log(err);
	res.status(500).json(err);
}

function handleErrorProd(err, req, res) {
	let error = Object.create(err);

	//Major non-handled Application errors
	if (error.name === "CastError") error = handleCastErrorDB(error);
	if (error.name === "ValidationError") error = handleValidationErrorDB(error);
	if (error.code === 11000) error = handleDuplicateFieldsDB(error);

	// Log all errors
	console.log(error);

	if (error.isOperational) {
		res.status(error.statusCode).json({ error: { message: error.message } });
		return;
	} else {
		// Critical Error: Notify Admin
		console.log(error);
		res.status(500).send("An error occured");
		return;
	}
}

async function centralErrorHandler(err, req, res, next) {
	if (process.env.NODE_ENV === "development") {
		handleErrorDev(err, req, res);
		return;
	} else if (process.env.NODE_ENV === "production") {
		handleErrorProd(err, req, res);
		return;
	}
}

async function error404Handler(req, res, next) {
	res.status(404).json({ error: { message: "Invalid access point" } });
	return;
}

module.exports = {
	centralErrorHandler,
	error404Handler,
};
