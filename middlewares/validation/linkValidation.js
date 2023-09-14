const validators = require("./validation_schemas/linkSchemas");

const validatorList = Object.keys(validators);

class Validator {
	constructor() {
		this.middleware = [];
	}

	body(bodyArray) {
		if (!Array.isArray(bodyArray)) throw new Error("Expects an array of properties to be validated");
		const check = bodyArray.forEach(elem => {
			if (!validatorList.includes(elem)) return false;
		});
		if (check.includes(false)) throw new Error("Property validator not yet defined");

		this._execute("body", bodyArray);
	}

	params(paramArray) {
		if (!Array.isArray(paramArray)) throw new Error("Expects an array of properties to be validated");
		const check = paramArray.forEach(elem => {
			if (!validatorList.includes(elem)) return false;
		});
		if (check.includes(false)) throw new Error("Property validator not yet defined");

		this._execute("params", paramArray);
	}

	query(queryArray) {
		if (!Array.isArray(queryArray)) throw new Error("Expects an array of properties to be validated");
		const check = queryArray.forEach(elem => {
			if (!validatorList.includes(elem)) return false;
		});
		if (check.includes(false)) throw new Error("Property validator not yet defined");

		this._execute("query", queryArray);
	}

	_execute(medium, prop) {
		async function validationMiddleware(req, res, next) {
			let completed = 0;
			const error = {};
			// wrap each task and push to tasks array
			const tasks = prop.map(elem => {
				return async cb => {
					try {
						await validators[elem].validateAsync(req[medium][elem]);
						return cb();
					} catch (err) {
						error[elem] = err;
					} finally {
						++completed;
					}
				};
			});
			function finish() {
				if (error) {
					const msg = Object.values(error)
						.map(err => err.message)
						.join(" /n");
					return next(new AppError(msg, 400, error));
				}
				return next();
			}
			// execute each task and call finish() when done
			tasks.forEach(task => {
				task(() => {
					if (completed === tasks.length) finish();
				});
			});
		}

		this.middleware.push(validationMiddleware);
	}

	exec() {
		return this.middleware.pop();
	}

	execArray() {
		return this.middleware;
	}
}

exports = module.exports = Validator;
exports.Validator = Validator;
