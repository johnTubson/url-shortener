const Joi = require("joi");
const AppError = require("../../utils/error");
const {
	registrationSchema,
	loginSchema,
	resetPasswordSchema,
	forgotPasswordSchema,
	changePasswordSchema,
} = require("../validation/validation_schemas/authSchemas");

exports.localRegistration = async (req, res, next) => {
	const object = req.body;
	const schema = registrationSchema;
	try {
		await schema.validateAsync(object);
		next();
	} catch (err) {
		console.log(err);
		next(new AppError(err.message, 422, err));
	}
};

exports.localLogin = async (req, res, next) => {
	const object = req.body;
	const schema = loginSchema;
	try {
		await schema.validateAsync(object);
		next();
	} catch (err) {
		console.log(err);
		next(new AppError(err.message, 401, err));
	}
};

exports.resetPassword = async (req, res, next) => {
	const object = req.query;
	const schema = resetPasswordSchema;
	try {
		await schema.validateAsync(object, { allowUnknown: true });
		next();
	} catch (err) {
		console.log(err);
		next(new AppError(err.message, 400, err));
	}
};

exports.forgotPassword = async (req, res, next) => {
	const object = req.body;
	const schema = forgotPasswordSchema;
	try {
		await schema.validateAsync(object);
		next();
	} catch (err) {
		console.log(err);
		next(new AppError(err.message, 400, err));
	}
};

exports.changePassword = async (req, res, next) => {
	const object = req.body;
	const schema = changePasswordSchema;
	try {
		await schema.validateAsync(object);
		next();
	} catch (err) {
		console.log(err);
		next(new AppError(err.message, 401, err));
	}
};
