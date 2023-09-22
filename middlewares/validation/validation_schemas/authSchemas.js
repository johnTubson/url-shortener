const Joi = require("joi");

const email = Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } });
const password = Joi.string().min(8).max(250).required();
const first_name = Joi.string().min(1).max(30).required();
const last_name = Joi.string().min(1).max(30).required();
const token = Joi.string.min(30).required();

const registrationSchema = Joi.object({
	first_name,
	last_name,
	email,
	password,
});

const loginSchema = Joi.object({
	email,
	password,
});

// resetPasswordSchema
const resetPasswordSchema = Joi.object({
	token,
});

// forgotPasswordSchema
const forgotPasswordSchema = Joi.object({
	email,
});

// changePasswordSchema
const changePasswordSchema = Joi.object({
	old_password: password,
	password,
});
module.exports = { registrationSchema, loginSchema, resetPasswordSchema, forgotPasswordSchema, changePasswordSchema };
