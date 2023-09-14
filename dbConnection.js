const mongoose = require("mongoose");

const mongoOptions = {
	autoIndex: true,
	poolSize: 10,
	connectTimeoutMS: 10000,
	socketTimeoutMS: 30000,
};

const db = mongoose.createConnection(process.env.MONGODB_URL);

db.on("open", () => {
	console.log(`Mongoose connection open to ${JSON.stringify(process.env.MONGODB_URL)}`);
});
db.on("error", err => {
	console.log(`Mongoose connection error: ${err} with connection info ${JSON.stringify(process.env.MONGODB_URL)}`);
	process.exit(0);
});

module.exports = db;
