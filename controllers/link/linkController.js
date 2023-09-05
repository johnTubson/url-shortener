const { User, Link } = require("../../models/model");
const { generateLink, getLinkPath } = require("./linkFunctions");
const AppError = require("../../utils/error");

async function createLink(req, res, next) {
	// escape link
	const url = req.body.link;
	const result = await Link.findOne({ original_url: url });
	if (result) return res.status(400).json({ result, message: "Link already shortened" });

	const shortUrl = await generateLink(url);
	const link = new Link({
		short_url: shortUrl,
		original_url: url,
		user_id: req.user._id,
	});
	await link.save();
	res.status(200).json(link);
}

async function userLinks(req, res, next) {
	const links = await Link.find({ user_id: req.user._id });
	res.status(200).json(links);
}

///////////// INDIVIDUAL LINKS CONTROL ///////////////////

async function getLink(req, res, next) {
	const url = req.body.link;
	const link = await User.findOne({ short_url: url });
	if (!link) return next(new AppError("Link not found", 404));
	res.status(200).json(link);
}

async function patchLink(req, res, next) {
	const link_id = req.params.id;
	const link = Link.findById(link_id);
	if (!link) return next(new AppError("Link not found", 400));
	// request body must have been cleaned
	Object.keys(req.body).forEach(el => {
		link[el] = req.body[el];
	});
	await link.save();
	res.status(200).json(link);
}

async function deleteLink(req, res, next) {
	const link_id = req.params.id;
	const link = Link.findByIdAndDelete(link_id);
	if (!link) return next(new AppError("Link not found", 400));
	res.status(201).send("Link deleted successfully");
}

async function redirectLink(req, res, next) {
	// domain.com/65788484 -- extract 65788484
	const path = await getLinkPath(req.requestUrl);
	const link = await Link.findOneAndUpdate({ short_url: path }, { $inc: { views: 1 } }, { new: true });
	if (!link) return next(new AppError("Link not found", 404));

	res.redirect(301, link.original_url);
}

module.exports = { createLink, userLinks, getLink, redirectLink, patchLink, deleteLink };
