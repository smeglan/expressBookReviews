const axios = require("axios");

require("dotenv").config();
//const baseURL = process.env.URL || "http://192.168.0.2:5000"; //you can use your local IP

const baseURL = "http://192.168.0.2:5000";

//Get all books
const getBooksCallback = () => {
	return axios.get(`${baseURL}/`);
};
getBooksCallback().then(response => console.log(response.data));

//Get book by ISBN
const getBookByISBN = (isbn) => {
	axios.get(`${baseURL}/isbn/${isbn}`).then(response => console.log(response.data));
};
getBookByISBN(1);

//Get book by author
const getBookByAuthor = async (author) => {
	const response = await axios.get(`${baseURL}/author/${author}`);
	console.log(response.data)
};
getBookByAuthor("Samuel")

//Get book by title
const getBookByTitle = async (title) => {
	const response = await axios.get(`${baseURL}/title/${title}`);
	console.log(response.data)
};
getBookByTitle("The Divine Comedy");