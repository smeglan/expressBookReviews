const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (username && password) {
		if (isValid(username)) {
			users.push({ username: username.toLowerCase().trim(), password: password });
			return res
				.status(201)
				.json({ message: "User successfully registred. Now you can login" });
		} else {
			return res.status(404).json({ message: "User already exists!" });
		}
	}
	return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
	return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
	const requestBook = books[req.params.isbn];
	if (requestBook) {
		return res.status(200).json(requestBook);
	}
	return res.status(404).json({ message: "Not found" });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
	searchedAuthor = req.params.author.toLowerCase();
	foundBooks = [];
	for (const key in books) {
		if (books[key].author.toLowerCase().search(searchedAuthor) !== -1) {
			foundBooks.push(books[key]);
		}
	}
	if (foundBooks.length > 0) {
		return res.status(201).json({ books: foundBooks });
	}
	return res.status(404).json({ message: "Not found" });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
	searchedTitle = req.params.title.toLowerCase();
	foundBooks = [];
	for (const key in books) {
		if (books[key].title.toLowerCase().search(searchedTitle) !== -1) {
			foundBooks.push(books[key]);
		}
	}
	if (foundBooks.length > 0) {
		return res.status(201).json({ books: foundBooks });
	}
	return res.status(404).json({ message: "Not found" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
	const requestBook = books[req.params.isbn];
	if (requestBook) {
		return res.status(200).json(requestBook.reviews);
	}
	return res.status(404).json({ message: "Not found" });
});

module.exports.general = public_users;
