const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// =========================
// EXISTING TASKS (DO NOT REMOVE)
// =========================

// Register new user
public_users.post("/register", (req,res) => {

    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
  
    if (isValid(username)) {
      return res.status(404).json({ message: "User already exists!" });
    }
  
    users.push({ username: username, password: password });
  
    return res.status(200).json({ message: "User successfully registered. Now you can login" });
  
});

// Get the book list available in the shop (SYNC - Task 1)
public_users.get('/', function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN (SYNC - Task 2)
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      return res.send(JSON.stringify(book, null, 4));
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author (SYNC - Task 3)
public_users.get('/author/:author', function (req, res) {

    const author = req.params.author;
    const bookKeys = Object.keys(books);
    const matchedBooks = {};
  
    bookKeys.forEach(key => {
      if (books[key].author === author) {
        matchedBooks[key] = books[key];
      }
    });
  
    if (Object.keys(matchedBooks).length > 0) {
      return res.send(JSON.stringify(matchedBooks, null, 4));
    } else {
      return res.status(404).json({ message: "No books found for this author" });
    }
});

// Get all books based on title (SYNC - Task 4)
public_users.get('/title/:title', function (req, res) {

    const title = req.params.title;
    const bookKeys = Object.keys(books);
    const matchedBooks = {};
  
    bookKeys.forEach(key => {
      if (books[key].title === title) {
        matchedBooks[key] = books[key];
      }
    });
  
    if (Object.keys(matchedBooks).length > 0) {
      return res.send(JSON.stringify(matchedBooks, null, 4));
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      return res.send(JSON.stringify(book.reviews, null, 4));
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
});


// =========================
// TASKS 10-13 (ASYNC VERSION)
// =========================


// 🔥 Task 10 – Async Get All Books
public_users.get('/async/books', async function (req, res) {

  try {

    const response = await new Promise((resolve, reject) => {
      resolve(books);
    });

    return res.status(200).json(response);

  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }

});


// 🔥 Task 11 – Async Get by ISBN
public_users.get('/async/isbn/:isbn', async function (req, res) {

  try {

    const isbn = req.params.isbn;

    const response = await new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    });

    return res.status(200).json(response);

  } catch (error) {
    return res.status(404).json({ message: error });
  }

});


// 🔥 Task 12 – Async Get by Author
public_users.get('/async/author/:author', async function (req, res) {

  try {

    const author = req.params.author;

    const response = await new Promise((resolve, reject) => {

      const bookKeys = Object.keys(books);
      const matchedBooks = {};

      bookKeys.forEach(key => {
        if (books[key].author === author) {
          matchedBooks[key] = books[key];
        }
      });

      if (Object.keys(matchedBooks).length > 0) {
        resolve(matchedBooks);
      } else {
        reject("No books found for this author");
      }

    });

    return res.status(200).json(response);

  } catch (error) {
    return res.status(404).json({ message: error });
  }

});


// 🔥 Task 13 – Async Get by Title
public_users.get('/async/title/:title', async function (req, res) {

  try {

    const title = req.params.title;

    const response = await new Promise((resolve, reject) => {

      const bookKeys = Object.keys(books);
      const matchedBooks = {};

      bookKeys.forEach(key => {
        if (books[key].title === title) {
          matchedBooks[key] = books[key];
        }
      });

      if (Object.keys(matchedBooks).length > 0) {
        resolve(matchedBooks);
      } else {
        reject("No books found with this title");
      }

    });

    return res.status(200).json(response);

  } catch (error) {
    return res.status(404).json({ message: error });
  }

});


module.exports.general = public_users;