const mongoose = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const oauthSchema = require("../schemas/oauthSchema");
const util = require("node:util");
const randomBytes = util.promisify(crypto.randomBytes);

const userSchema = mongoose.Schema({
	first_name: {
		type: String,
		required: [true, "Please provide a name"],
		minLength: 1,
		maxLength: 255,
	},
	last_name: {
		type: String,
		minLength: 1,
		maxLength: 255,
	},
	email: {
		type: String,
		validate: {
			validator: async function (v) {
				const schema = Joi.string().email().messages({
					"string.email": `"A valid email is required"`,
				});
				return schema.validateAsync(v);
			},
			message: props => `${props.value} is not a valid email`,
		},
		required: [true, "A valid email is required"],
		unique: true,
		lowercase: true,
	},
	password: {
		type: String,
		required: [
			function () {
				return this.auth_type === "local";
			},
			"Password is required",
		],
		select: false,
	},
	passwordResetToken: {
		type: String,
	},
	passwordResetExpires: {
		type: Date,
	},
	active: {
		type: Boolean,
		default: true,
	},
	auth_type: {
		type: String,
		enum: ["local", "oauth"],
		required: true,
	},
	oauth: {
		type: oauthSchema,
		required: [
			function () {
				return this.auth_type === "oauth";
			},
			"Oauth credentials not provided",
		],
	},
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	this.password = await bcrypt.hash(this.password, 12);
	return next();
});

userSchema.methods.comparePassword = async function (password, user_password) {
	try {
		await bcrypt.compare(password, user_password);
		return true;
	} catch (err) {
		return false;
	}
};

userSchema.methods.createPasswordResetToken = async function () {
	//
	const token = await randomBytes(32);
	const resetToken = token.toString("hex");
	this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
	this.passwordResetExpires = Date.now() + 15 * 60 * 100;
	return resetToken;
};

userSchema.methods.compareResetToken = async function (resetToken) {
	//
	const savedToken = this.passwordResetToken;
	if (!savedToken) return false;
	if (resetToken.length !== savedToken) return false;
	let request = 0;
	if (this.passwordResetExpires < Date.now()) return false;
	for (let i = 0; i < resetToken.length; i++) {
		request += resetToken[i] ^ savedToken[i];
	}
	if (request) return false;
	this.passwordResetExpires = undefined;
	return true;
};

module.exports = userSchema;
