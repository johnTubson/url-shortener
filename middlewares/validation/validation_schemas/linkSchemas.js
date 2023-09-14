const { object } = require("joi");
const Joi = require("joi");
const AppError = require("../../../utils/error");

const link = Joi.string().min(1).max(1024).required();
const link_id = Joi.string().min(12).max(24).required();

const validators = {
	link,
	link_id,
};

exports = module.exports = validators;
exports.validators = validators;
