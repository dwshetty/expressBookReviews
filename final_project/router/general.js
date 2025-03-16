const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    //Write your code here
    const { username, password } = req.body;
    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User registered successfully!" });
        } else {
            return res.status(404).json({ message: "Username already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register - username &/ password are not provided." });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    //Write your code here
    try {
        const booksData = await getBooks()
        res.send(JSON.stringify(booksData, null, 4));
    } catch (error) {
        console.error(error)
        return res.status(500).send(error.message);
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    //Write your code here
    try {
        const { isbn } = req.params
        const booksData = await getBooks()
        const bookbyIsbn = booksData[isbn]
        if(!bookbyIsbn){
            return res.status(404).json({ message: "Invalid ISBN" });
        }
        res.status(200).send(bookbyIsbn)
    } catch (error) {
        console.error(error)
        return res.status(500).send(error.message);
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    //Write your code here
    try {
        const { author } = req.params
        const booksData = await getBooks()
        const bookList = Object.values(booksData)
        const bookbyAuthor = bookList.find(book => book.author === author)
        if(!bookbyAuthor){
            return res.status(404).json({ message: "Invalid Author" });
        }
        res.status(200).send(bookbyAuthor)
    } catch (error) {
        console.error(error)
        return res.status(500).send(error.message);
    }
});

const getBooks = () => new Promise((resolve, reject) => {
    resolve(books);
})

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
    try {
        const { title } = req.params
        const booksData = await getBooks()
        const bookList = Object.values(booksData)
        const bookbyTitle = bookList.find(book => book.title === title)
        if(!bookbyTitle){
            return res.status(404).json({ message: "Invalid Title" });
        }
        res.status(200).send(bookbyTitle)
    } catch (error) {
        console.error(error)
        return res.status(500).send(error.message);
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const { isbn } = req.params
    const bookbyIsbn = books[isbn]
    if(!bookbyIsbn){
        return res.status(404).json({ message: "Invalid ISBN" });
    }
    res.status(200).send(bookbyIsbn.reviews)
});

module.exports.general = public_users;
