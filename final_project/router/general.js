const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;

public_users.post("/register", (req,res) => {
    users.push({"username":req.query.username,"password":req.query.password});
    res.send("The user" + (' ')+ (req.query.username) + " Has been added!")
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let filtered_users = Object.values(books).filter((book) => book.isbn === isbn);
    res.send(filtered_users);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let filtered_users = Object.values(books).filter((book) => book.author === author);
    res.send(filtered_users);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let filtered_users = Object.values(books).filter((book) => book.title === title);
    res.send(filtered_users);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const reviews = req.params.reviews;
    let filtered_users = Object.values(books).filter((book) => book.reviews === reviews);
    res.send(filtered_users);
});



//task 10 callback of getting booklist  :
//const req = axios.get("https://wenchenchena-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/");
//task 11 callback of ISBN : 
//const req = axios.get("https://wenchenchena-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/1");
//task 12 callback of author:
//const req = axios.get("https://wenchenchena-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author/Hans Christian Andersen");
//task 13 callback of tittle:
const req = axios.get("https://wenchenchena-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/title/Pride and Prejudice");
console.log(req);
req.then(resp => {
    let courseDetails = resp.data;
    console.log(JSON.stringify(courseDetails,null,4))
})
.catch(err => {
    console.log(err.toString())
    //This will console log the error withe the code. eg. Error: Request failed with status code 404
});

module.exports.general = public_users;
