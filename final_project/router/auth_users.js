const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
	let registeredUsers = users.filter((user) => {
		return user.username === username.toLowerCase().trim();
	});
	if (registeredUsers.length === 0) {
		return true;
	}
	return false;
};

const authenticatedUser = (username, password) => {
	let validUsers = users.filter((user) => {
		return user.username === username && user.password === password;
	});
	if (validUsers.length > 0) {
		return true;
	}
	return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (!username || !password) {
		return res.status(404).json({ message: "Error logging in" });
	}

	if (authenticatedUser(username, password)) {
		let accessToken = jwt.sign(
			{
				username,
			},
			"access",
			{ expiresIn: 60 * 60 }
		);

		req.session.authorization = {
			accessToken,
			username,
		};
		return res.status(200).send("User successfully logged in");
	} else {
		return res
			.status(208)
			.json({ message: "Invalid Login. Check username and password" });
	}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
	const isbn = req.params.isbn;
	const { username, iat } = req.user;
	if (isbn in books) {
		books[isbn].reviews[username] = {
			date: new Date(iat * 1000),
			description: req.body.review,
		};
		return res.status(201).json({ message: "Review added correctly" });
	}
	return res.status(404).json({ message: "Book wasn't found" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
	const isbn = req.params.isbn;
	const { username } = req.user;
	if (isbn in books && username in books[isbn].reviews) {
		delete books[isbn].reviews[username];
		return res.status(201).json({ message: "Review deleted" });
	}
	return res.status(404).json({ message: "Not found" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
