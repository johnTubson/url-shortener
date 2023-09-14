const customDateEpoch = () => BigInt(Date.now() - Date.parse("2023-01-01"));

let timestamp = customDateEpoch();

// introduce locking
let lock;
let idCounter = 0;
let maxID = 4095;
let maxServers = 1023;

function genID() {
	let id;
	if (timestamp === customDateEpoch() && idCounter <= maxID) {
		id = generateId(timestamp, idCounter++);
	} else if (timestamp !== customDateEpoch()) {
		id = genIDLock();
	} else if (idCounter > maxID) {
		// hold up request until the next millisecond
		while (timestamp === customDateEpoch()) {
			//hold up
		}
		id = genIDLock();
	}

	return id;
}

function genIDLock() {
	if (!lock) {
		lock = true;
		timestamp = customDateEpoch();
		idCounter = 0;
		id = generateId(timestamp, idCounter++);
		lock = undefined;
	} else {
		while (lock) {}
		id = generateId(timestamp, idCounter++);
	}
	return id;
}

function generateId(timestamp, idCounter) {
	let serverId = Math.floor(Math.random() * maxServers);
	let id = 0n << 64n;
	// generate a mask of zeroes
	let timestampMask = BigInt(2 ** 42 - 1) >> 42n;
	id = ((timestampMask | timestamp) << 22n) | id;
	id = (((1023n >> 10n) | BigInt(serverId)) << 12n) | id;
	id = (4095n >> 12n) | BigInt(idCounter) | id;
	//64bit --> server 10 bit, idCounter 12 bit, timestamp 42 bit
	return id;
}

const map = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789";

function shortIDgen() {
	let link_id = BigInt(genID());
	let id = link_id;
	const arr = [];
	while (id) {
		// 1000/50 => 20 r 0 ; 20/50 => 0 r 20
		let mod = id % 58n;
		arr.push(map[mod]);
		id = id / 58n;
	}
	arr.reverse();
	let short_url = arr.join("");
	// Generate a mask of ones at position 1 through 42 with the rest 22 bits getting filled by zeroes
	let timestampMask = BigInt(2 ** 42 - 1) << 22n;
	let timestamp = link_id & timestampMask;
	timestamp >>= 22n;
	return { link_id, short_url, timestamp };
}

exports = module.exports = shortIDgen;
exports.shortIDgen = shortIDgen;
