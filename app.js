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
var selectSingleArticleQuery = "SELECT * FROM articles WHERE id=?";
var insertArticleQuery  = "INSERT INTO articles (title, author, body) VALUES (?,?,?)";

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
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set public folder
app.use (express.static(path.join(__dirname, 'public')));

function getArticles(callback) {    
    db.query(selectArticlesQuery,
        function (err, result) {
           callback(err, JSON.parse(JSON.stringify(result)));
        }
    );    
}

function getSingleArticle(callback) {    
    db.query(selectSingleArticleQuery,
        function (err, result) {
            callback(err, JSON.parse(JSON.stringify(result)));
        }
    );    
}

function insertArticle(article) {
    
    db.query(insertArticleQuery, [article.title, article.author, article.body], (err, results, fields) => {
        if (err) {
          return console.error(err.message);
        }
        
        // log insert result
        console.log('Rows inserted [' + results.affectedRows + ']');
        article.id = results.insertId;
        console.log('Article saved to database with id ',article.id);
      });
}

// Home Route
app.get('/', function (req, res) {
    getArticles(function (err, articleResult){ 
        if (err) throw err;
        res.render('index', {title: 'Hello KnowledgeBase', articles: articleResult});
     })
})

// Get Single Article
app.get('/article/:id', function(req, res) {
    console.log ('Get details for ' + req.params.id);
    getSingleArticle(req.params.id);
});

// Add Article Route
app.get('/articles/add', function (req, res) {
    res.render('add_article', {
        title: 'Add Article'
    });
})

// Add Submit POST Route
app.post('/articles/add', function(req,res) {
  
    let Article = require ('./models/article');   
    var article = new Article(req.body.title,req.body.author,req.body.body);
 
    // Save the new article to database
    insertArticle (article);
    res.redirect('/');
})

// Start server
app.listen(3000, function() {
    console.log('Server started on port 3000...')
})