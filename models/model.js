const linkSchema = require("./schemas/linkSchema");
const userSchema = require("./schemas/userSchema");
const db_connection = require("../dbConnection");

const User = db_connection.model("User", userSchema);

const Link = db_connection.model("Link", linkSchema);

module.exports = { User, Link };
