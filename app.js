const express = require ('express');
const path = require ('path');
const mysql = require('mysql');
const bodyParser = require ('body-parser');
const expressValidator = require ('express-validator');
const flash = require ('connect-flash');
const session = require ('express-session');

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

var selectArticlesQuery      = "SELECT * FROM articles";
var selectSingleArticleQuery = "SELECT * FROM articles WHERE id=?";
var insertArticleQuery       = "INSERT INTO articles (title, author, body) VALUES (?,?,?)";
var updateArticleQuery       = "UPDATE articles SET title=?, author=?, body=? WHERE id=?";
var deleteArticleQuery       = "DELETE FROM articles WHERE id=?";

// connect to database
db.connect((err) => {
    console.log('Connecting to database...');
    if (err) {
        console.log('Error connecting to database');
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

// Express-Session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
    //cookie: { secure: true }
}));

// Express-Messages middleware
app.use(require('connect-flash')());
app.use(function(req,res,next){
    res.locals.messages = require ('express-messages')(req,res);
    next();
});

// Express-Validator middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split ('.'),
        root = namespace.shift(),
        formParam = root;
        
        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Get all the Articles from database
function getArticles(callback) {

    console.log('Listing All Articles');

    db.query(selectArticlesQuery,
        function (err, result) {
           callback(err, JSON.parse(JSON.stringify(result)));
        }
    );    
}

// Get a single Article (by Id) from database
function getSingleArticle(id, callback) {
    
    console.log('Showing details for Article ' + id);
    
    db.query(selectSingleArticleQuery, [id], 
        function (err, result) {
            callback(err, JSON.parse(JSON.stringify(result)));
        }
    );    
}

// Insert new Article into database
function insertArticle(article) {

    console.log('Inserting new Article');
    
    db.query(insertArticleQuery, [article.title, article.author, article.body], (err, results, fields) => {
        if (err) {
          return console.error(err.message);
        }
        // log result
        //console.log('Rows inserted [' + results.affectedRows + ']');
        if (results.affectedRows==1) {
            article.id = results.insertId;
            console.log('Article inserted with id: ' + article.id);
        } else {
            console.log('Unable to insert Article');
        }
    });
}

// Update the Article (by Id) in the database
function updateArticle(article) {
    
    console.log('Updating Article ' + article.id + "...");

    db.query(updateArticleQuery, [article.title, article.author, article.body, article.id], (err, results, fields) => {
        if (err) {
          return console.error(err.message);
        }
        // log result
        //console.log('Rows updated [' + results.affectedRows + ']');
        if (results.affectedRows==1) {
            console.log('Article ' + article.id + " updated");
        } else {
            console.log('Unable to update Article ' + article.id);
        }
      });
}

// Delete the Article (by Id)
function deleteArticle(id) {

    console.log('Deleting Article ' + id + "...");
       
    db.query(deleteArticleQuery, [id], (err, results, fields) => {
        if (err) {
          return console.error(err.message);
        }
        // log result
        console.log('Rows updated [' + results.affectedRows + ']');
        if (results.affectedRows==1) {
            console.log('Article ' + id + " deleted");
        } else {
            console.log('Unable to delete Article ' + id);
        }
      });
}

// Home Route
app.get('/', function (req, res) {
    getArticles(function (err, articleResult){ 
        if (err) throw err;
        res.render('index', {
            title: 'Hello KnowledgeBase', 
            articles: articleResult
        });
     })
})

// Get Single Article
app.get('/article/:id', function(req, res) {
    
    //console.log ('Get details for article ' + req.params.id);
    getSingleArticle(req.params.id, function (err, articleResult){
        if (err) throw err;
        //console.log (articleResult);
        res.render('show_article', {
            title: 'Hello KnowledgeBase', 
            article: articleResult[0]
        });
     })
});

// Add Article Route
app.get('/articles/add', function (req, res) {
    res.render('add_article', {
        title: 'Add Article'
    });
})

// Load Edit Article form
app.get('/articles/edit/:id', function(req, res) {
    
    //console.log ('Get details for article ' + req.params.id);
    getSingleArticle(req.params.id, function (err, articleResult){
        if (err) throw err;
        //console.log (articleResult);
        res.render('edit_article', {
            title: 'Edit Article', 
            article: articleResult[0]
        });
     })
});

// Add Submit POST Route
app.post('/articles/add', function(req,res) {

    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    // Get Errors
    let errors = req.validationErrors();

    if (errors) {
        res.render('add_article', {
            title: 'Add Article',
            errors: errors
        });
    } else {
        let Article = require ('./models/article');
        var article = new Article(null,req.body.title, req.body.author, req.body.body);
     
        // Save the new article to database
        insertArticle (article);
        req.flash('success', 'Article added');
        res.redirect('/');
    }    
})

// Update Submit POST Route
app.post('/articles/edit/:id', function(req,res) {
  
    let Article = require ('./models/article');
    var article = new Article(req.params.id, req.body.title, req.body.author, req.body.body);
    //console.log (article);
 
    // Update the article in the database
    updateArticle (article);
    req.flash('success', 'Article Updated');
    res.redirect('/');
})

// Delete Article
app.delete('/article/:id', function(req,res){
    
    deleteArticle(req.params.id);
    res.send('Success');
});

// Start server
app.listen(3000, function() {
    console.log('Server started on port 3000...')
})