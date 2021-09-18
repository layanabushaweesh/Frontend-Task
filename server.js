'use strict';
// env var
require('dotenv').config();

//app depandancies
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');

//app setup
const app = express();
const PORT = process.env.PORT || 3000;

//midelwar
app.use(cors());
app.use('/public', express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));


//routs
app.get('/', renderHome )
app.get('/seaarch', renderSearch)
app.post('/searchbook', renderData)


//call back function of routs

function renderHome (req, res) {
  // this function render home page
  res.render('index');
}

function renderSearch (req, res) {
  //this function render search page
  res.render('search');
}

function renderData(req, res) {
  //this function get the data from google books API according what the user search and render showbook page
  const searchWord = req.body.search
  const searchTA = req.body.searchTA
  const url = `https://www.googleapis.com/books/v1/volumes?langRestrict=en&q=${searchWord}+in${searchTA}:`;
  superagent.get(url).then((data) => {
    // console.log(data.body);
    const bookData = data.body.items;
    const NewBook = bookData.map(item => {
      return new Books(item.volumeInfo )
    });
    res.render('showbook', { books: NewBook });
  }).catch(error =>{console.log(error)})
}

// constructor function => it help to format my data
function Books(data) {
  this.title = data.title
  this.author = data.authors
  this.description = data.description
  this.thumbnail = data.imageLinks.thumbnail;
  
}

//app start
app.listen(PORT, () => console.log(`listinig port ${PORT}`));

//testing unit
app.get('/hello', (req, res) => {
  res.render('index');
});
// testing to catch all error
app.use('*', (req, res) => {
res.status(404).send('sorry page not found :(');
});