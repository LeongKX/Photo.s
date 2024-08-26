const jwt = require("jsonwebtoken");
require("dotenv").config();
const { SECRET_KEY } = process.env;
//THIS MIDDLEWARE IS USED TO CHECK IF THE ONE REQUESTING IS AN ADMIN

module.exports = (req, res, next) => {
	//Bearer TokenHere1238192397821312312
	const token = req.headers.authorization.split(" ")[1];
	if (!token) return res.status(401).json({ msg: "Unauthorized!" });
	try {
		const decoded = jwt.verify(token, SECRET_KEY);
		if (decoded.data.isAdmin) {
			next();
		} else {
			return res.status(401).json({ msg: "You are not an admin!" });
		}
	} catch (e) {
		return res.status(401).json({ error: e.message });
	}
};
