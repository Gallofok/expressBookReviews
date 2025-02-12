const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
    username: "John",
    password: "1",
},
{
    username: "Weak",
    password: "2",
},

];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = Object.values(users).filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password)=>{ 
    let validusers = Object.values(users).filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.query.username
    const review = req.query.review
    let target_books = Object.values(books).filter((book) => book.isbn === isbn);
    if (target_books.length > 0) {
        let tarbook = target_books[0]
        tarbook.reviews[username] = review;

        res.send(`${review} by ${username} of ${tarbook.isbn}  added.`);
    }
    else{
        res.send("Unable to find this book!");
    }
});

//deleate a keyreview by someone

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.query.username
    let target_books = Object.values(books).filter((book) => book.isbn === isbn);
    
    if (target_books.length > 0 ) {
        let tarbook = target_books[0];
        let allreviews = tarbook.reviews;
        let tarview =  Object.keys(allreviews);
        
        if (tarview.includes(username)){
            res.send(`reviews by ${username} of ${tarbook.isbn}  deleated.`);
            delete tarbook.reviews.username;    
        }
        else{
            res.send("Unable to find this review !");
        }
        
    }
    else{
        res.send("Unable to find this book !");
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
