// const app = require("express")();
const express = require("express");
const app = express();
const config = require("./config/development");
const bodyParser = require('body-parser');
const _ = require('lodash');
const slug = require('slug'); 

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use((req, res, next) => {
    console.log(`${req.url} --> ${req.method} --> ${Date.now()}`);
    next();
})

// endpoint = url + method

let USERS = require("./mock-data/users");

// Controller
const getUsers = (req, res, next) => {
    req.users = USERS;
    next();
};

// Controller
const sendUsers = (req, res, next) => {
    res.status(200);
    res.json(req.users);
};

const addUser = (req, res, next) => {
    const user = req.body;
    USERS.push(user);
    req.users = USERS;
    next();
}

const deleteUser = (req, res, next) => {
    const index = req.params.index;
    req.users = USERS.filter((user, number) => number !== Number(index));
    next();
}

const updateUser = (req, res, next) => {
    const index = req.params.index;
    const updatedData = req.body;
    req.users = USERS.map((user, number) => 
        number === Number(index)
        ? _.merge(user, updatedData)
        : user
    );
    next();
}

const getBooks = (req, res, next) => {
    const index = req.params.index;
    req.books = USERS[index].books;
    next();
};

const getBooksByTitle = (req, res, next) => {
    const index = req.params.index;
    const title = req.params.title;
    req.books = USERS[index].books;
    req.books = req.books.find(book => slug(book.title) === title)
    next();
};

const addBook = (req, res, next) => {
    const index = req.params.index;
    const book = req.body;
    req.books = USERS[index].books;
    req.books.push(book);
    next();
};

const deleteBook = (req, res, next) => {
    const index = req.params.index;
    const title = req.params.title;
    req.books = USERS[index].books;
    req.books = req.books.filter(book => slug(book.title) !== title)
    next();
};

const updateBook = (req, res, next) => {
    const index = req.params.index;
    const title = req.params.title;
    const updatedData = req.body;
    req.books = USERS[index].books;
    req.books = req.books.filter(book => 
        slug(book.title) === title
        ? _.merge(book, updatedData)
        : book
    )
    next();
};

const sendBooks = (req, res, next) => {
    res.status(200);
    res.json(req.books);
}

// Users
app.get("/users/", getUsers, sendUsers);
app.post("/users/", addUser, sendUsers);
app.delete("/users/:index/", deleteUser, sendUsers);
app.put("/users/:index/", updateUser, sendUsers); // (Lodash) _.merge

// Books
app.get("/users/:index/books", getBooks, sendBooks);
app.post("/users/:index/books", addBook, sendBooks);
app.put("/users/:index/books/:title", updateBook, sendBooks);
app.delete("/users/:index/books/:title", deleteBook, sendBooks);
// *
app.get("/users/:index/books/:title", getBooksByTitle, sendBooks);

// app.post("/users/")
// app.put("/users/")
// app.delete("/users/")
// app.all("/users/")

// Not Found Error
app.use((req, res, next) => {
    const error = new Error("Not Found!");
    next(error);
})

// All errors
app.use((err, req, res, next) => {
    res.status(500);
    res.json({
        error: err.message,
        stack: err.stack
    })
})

app.listen(config.port);