const axios = require("axios");
const express = require("express");
const consumer_router = express.Router();

require("dotenv").config();
const baseURL = process.env.URL || "http://192.168.0.2:5000"; //you can use your local IP

//Get all books
const getBooks = async () => {
	return axios.get(`${baseURL}/`);
};

//Get book by ISBN
const getBookByISBN = async (isbn) => {
	return axios.get(`${baseURL}/isbn/${isbn}`);
};

//Get book by author
const getBookByAuthor = async (author) => {
	return axios.get(`${baseURL}/author/${author}`);
};

//Get book by title
const getBookByTitle = async (title) => {
	return axios.get(`${baseURL}/title/${title}`);
};

consumer_router.get("/:isbn&:author&:title", async (req, res) => {
	const { isbn, author, title } = req.params;
	const promises = [];
	try {
		promises.push(getBooks());
		promises.push(getBookByISBN(isbn));
		promises.push(getBookByAuthor(author));
		promises.push(getBookByTitle(title));
		const responses = await Promise.all(promises);
		let data = "";
		for (const response of responses) {
			const item = `
            ->${response.config.url}
            ${JSON.stringify(response.data)}
            `;
			data = data + item;
		}
		const message = `
        ----------------------------------------------------------------------------
        Promises executed:
        ${data}
        ----------------------------------------------------------------------------
        `;
		res.status(200).send(message);
	} catch (error) {
		res.status(501).send(error);
	}
});
module.exports = consumer_router;
