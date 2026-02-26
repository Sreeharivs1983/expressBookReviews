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
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
  
    if (!authenticatedUser(username, password)) {
      return res.status(403).json({ message: "Invalid Login. Check username and password" });
    }
  
    let accessToken = jwt.sign(
      {
        data: username
      },
      "access",
      { expiresIn: 60 * 60 }
    );
  
    req.session.authorization = {
      accessToken
    };
  
    return res.status(200).json({
      message: "User successfully logged in",
      token: accessToken
    });
  
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
