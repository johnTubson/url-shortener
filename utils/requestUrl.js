function requestUrl(req, res, next) {
	req.requestUrl = `${req.protocol}://${req.hostname}:${process.env.PORT}${req.originalUrl}`;
	return next();
}

exports = module.exports = requestUrl;

exports.requestUrl = requestUrl;
