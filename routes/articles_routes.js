const express = require('express');
const router = express.Router();

var selectSingleArticleQuery = "SELECT * FROM articles WHERE id=?";
var insertArticleQuery       = "INSERT INTO articles (title, author, body) VALUES (?,?,?)";
var updateArticleQuery       = "UPDATE articles SET title=?, author=?, body=? WHERE id=?";
var deleteArticleQuery       = "DELETE FROM articles WHERE id=?";

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

    console.log('Inserting new Article...');
    
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

// Add Article Route
router.get('/add', function (req, res) {
    res.render('add_article', {
        title: 'Add Article'
    });
})

// Load Edit Article form
router.get('/edit/:id', function(req, res) {
    
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
router.post('/add', function(req,res) {

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
        let Article = require ('../models/article');
        var article = new Article(null,req.body.title, req.body.author, req.body.body);
     
        // Save the new article to database
        insertArticle (article);
        req.flash('success', 'Article added');
        res.redirect('/');
    }    
})

// Update Submit POST Route
router.post('/edit/:id', function(req,res) {
  
    let Article = require ('../models/article');
    var article = new Article(req.params.id, req.body.title, req.body.author, req.body.body);
    //console.log (article);
 
    // Update the article in the database
    updateArticle (article);
    req.flash('success', 'Article Updated');
    res.redirect('/');
})

// Delete Article
router.delete('/:id', function(req,res){
    
    deleteArticle(req.params.id);
    res.send('Success');
});

// Get Single Article
router.get('/:id', function(req, res) {
    
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

module.exports = router;