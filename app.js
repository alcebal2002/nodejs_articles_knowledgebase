const express = require ('express');
const path = require ('path');

// init app
const app = express();

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set ('view engine', 'pug');

// Home Route
app.get('/', function (req, res) {
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
    res.render('index', {
        title: 'Hello KnowledgeBase',
        articles: articles
    });
})

// Add Article Route
app.get('/articles/add', function (req, res) {
    res.render('add_article', {
        title: 'Add Article'
    });
})

// Start server
app.listen(3000, function() {
    console.log('Server started on port 3000...')
})