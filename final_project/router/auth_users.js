const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let validUser = users.find((user) => user.username === username);
    return Boolean(validUser);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validUser = users.find((user) => user.username === username && user.password === password);
    return Boolean(validUser);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if (!authenticatedUser(username, password)) {
        return res.status(403).json({ message: "Invalid Login. Check username and password" });
    }
    let accessToken = jwt.sign({
        data: password
    }, 'secret_key', { expiresIn: 60 * 60 });
    req.session.authorization = {
        accessToken, username
    };
    res.status(200).send("User logged in successfully!");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    const { username } = req.session.authorization;
    if (!username) {
        return res.status(404).json({ message: "Invalid login" });
    }
    if (!isValid(username)) {
        return res.status(403).json({ message: "Invalid username" });
    }
    const { review } = req.query;
    if (!review) {
        return res.status(404).json({ message: "Invalid payload" });
    }
    const { isbn } = req.params
    const bookbyIsbn = books[isbn]
    if(!bookbyIsbn){
        return res.status(404).json({ message: "Invalid ISBN" });
    }
    const { reviews } = bookbyIsbn
    reviews[username] = review
    res.status(200).json(bookbyIsbn)
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { username } = req.session.authorization;
    if (!username) {
        return res.status(404).json({ message: "Invalid login" });
    }
    if (!isValid(username)) {
        return res.status(403).json({ message: "Invalid username" });
    }
    const { isbn } = req.params
    const bookbyIsbn = books[isbn]
    if(!bookbyIsbn){
        return res.status(404).json({ message: "Invalid ISBN" });
    }
    const { reviews } = bookbyIsbn
    reviews[username] = undefined
    res.status(200).json(bookbyIsbn)
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
