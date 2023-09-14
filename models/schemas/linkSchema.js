const mongoose = require("mongoose");

const linkSchema = mongoose.Schema({
	short_url: {
		type: String,
		required: true,
		minLength: 1,
		index: true,
		unique: true,
		maxLength: 1024,
	},
	original_url: {
		type: String,
		required: true,
		unique: true,
		minLength: 1,
		maxLength: 1024,
	},
	link_id: {
		type: BigInt,
		required: true,
		unique: true,
		minLength: 1,
		maxLength: 1024,
	},
	timestamp: {
		type: BigInt,
		required: true,
	},
	views: {
		type: Number,
		default: 0,
	},
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
});

module.exports = linkSchema;
