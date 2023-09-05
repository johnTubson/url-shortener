// import { customAlphabet } from "nanoid/async";
const customAlphabet = require("nanoid/async").customAlphabet;
const URL = require("url").URL;

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const nanoid = customAlphabet(alphabet, 7);

async function generateLink() {
	return await nanoid();
}

async function getLinkPath(link) {
	console.log(link);
	const url = new URL(link);
	return url.pathname.split("/")[1];
}

module.exports = { generateLink, getLinkPath };
