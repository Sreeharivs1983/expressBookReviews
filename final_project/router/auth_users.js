const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//code to check is the username is valid
 let user = users.find(user => user.username === username);
  if (user) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//code to check if username and password match the one we have in records.
 let validUser = users.find(user => 
      user.username === username && user.password === password
  );
  if (validUser) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {

    const username = req.body.username;
    const password = req.body.password;
  
    if (!authenticatedUser(username, password)) {
      return res.status(403).json({ message: "Invalid Login" });
    }
  
    let accessToken = jwt.sign(
      { data: username },
      "access",
      { expiresIn: 60 * 60 }
    );
  
    req.session.authorization = { accessToken };
  
    return res.status(200).json({
      message: "User successfully logged in",
      token: accessToken
    });
  
  });

// Add or Modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const review = req.query.review;
  
    if (!req.user || !req.user.data) {
      return res.status(403).json({ message: "User not authenticated properly" });
    }
  
    const username = req.user.data;
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!review) {
      return res.status(400).json({ message: "Review text missing" });
    }
  
    books[isbn].reviews[username] = review;
  
    return res.status(200).json({ message: "Review added/updated successfully" });
  
  });


// 🔥 NEW TASK 9 – Delete a Book Review
regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;

    if (!req.user || !req.user.data) {
      return res.status(403).json({ message: "User not authenticated properly" });
    }

    const username = req.user.data;

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: "No review found for this user" });
    }

    delete books[isbn].reviews[username];

    return res.status(200).json({ message: "Review deleted successfully" });

});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;