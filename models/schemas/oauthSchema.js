const mongoose = require("mongoose");

const oauthSchema = new mongoose.Schema({
	provider: {
		type: String,
		required: true,
	},
	id: {
		type: String,
		required: true,
	},
});

exports = module.exports = oauthSchema;

exports.oauthSchema = oauthSchema;
