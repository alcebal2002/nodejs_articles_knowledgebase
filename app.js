const express = require ('express');
const path = require ('path');
const mysql = require('mysql');
const bodyParser = require ('body-parser');

// init app
const app = express();

// Connect to database
// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'local_user',
    password: 'local_password',
    database: 'articles'
});

var selectArticlesQuery = "SELECT * FROM articles";

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set ('view engine', 'pug');

// Body parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

function getArticles(callback) {    
    db.query(selectArticlesQuery,
        function (err, result) {
            //here we return the results of the query
            callback(err, JSON.parse(JSON.stringify(result)));
        }
    );    
}

// Home Route
app.get('/', function (req, res) {

/*
    let articles = [
        {
            id: 1,
            title: 'Article One',
            author: 'Alberto Ceballos',
            body: 'This is Article One'
        },
        {
            id: 2,
            title: 'Article Two',
            author: 'David Ceballos',
            body: 'This is Article Two'
        },
        {
            id: 3,
            title: 'Article Three',
            author: 'Mikel Ceballos',
            body: 'This is Article Three'
        }
    ]
*/

    getArticles(function (err, articleResult){ 
        if (err) throw err;
        res.render('index', {title: 'Hello KnowledgeBase', articles: articleResult});
     })
})

// Add Article Route
app.get('/articles/add', function (req, res) {
    res.render('add_article', {
        title: 'Add Article'
    });
})

// Add Submit POST Route
app.post('/articles/add', function(req,res) {
  
    let Article = require ('./models/article');
    
    var article = new Article(99,req.body.title,req.body.author,req.body.body);
    console.log(article);
    
    // Save the new article to database

    res.redirect('/');
})

// Start server
app.listen(3000, function() {
    console.log('Server started on port 3000...')
})