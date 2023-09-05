const Joi = require("joi");
const AppError = require("../../utils/error");

function validateUser() {
	return async function newUserForm(req, res, next) {
		const object = req.body;
		const schema = Joi.object({
			first_name: Joi.string().min(1).max(30).required(),
			last_name: Joi.string().min(1).max(30).required(),
			email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
			password: Joi.string().min(3).max(30).required(),
			confirm_password: Joi.valid(object.password).messages({ "any.only": "Passwords must match" }).required(),
		});
		try {
			await schema.validateAsync(object, { allowUnknown: true });
			next();
		} catch (err) {
			console.log(err);
			next(new AppError(err.message, 422, err));
		}
	};
}

module.exports = validateUser;
