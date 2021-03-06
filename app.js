const express = require ('express');
const path = require ('path');
const mysql = require('mysql');
const bodyParser = require ('body-parser');
const expressValidator = require ('express-validator');
const flash = require ('connect-flash');
const session = require ('express-session');
const passport = require('passport');

// Load environment specific properties based on [env] startup parameter
// eg. npm start env=development or nodemon app.js env=development
const environment = require ('./config/environments');
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader(environment);

// init app
const app = express();

// Connect to database
// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection (properties.get('database.mysql.connectionString'));

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
    secret: properties.get('express.secret'),
    resave: properties.get('express.resave'),
    saveUninitialized: properties.get('express.saveUninitialized')
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

// Passport Config
require ('./passport_config/passport')(passport);
// Passport Middleware
app.use (passport.initialize());
app.use (passport.session());

app.get('*', function(req, res, next) {
    res.locals.user = req.user || null;
    next();
});

// Get all the Articles from database
function getArticles(callback) { 

    console.log('Listing All Articles');

    db.query(properties.get('queries.articles.selectAll'),
        function (err, result) {
           callback(err, JSON.parse(JSON.stringify(result)));
        }
    );    
}

// Home Route
app.get('/', function (req, res) {
    getArticles(function (err, articleResult){ 
        if (err) throw err;
        res.render('index', {
            title: properties.get('main.app.title'), 
            articles: articleResult
        });
    });
});

app.get('/test', function(req, res) {
/*
    console.log ('Step 1');

    function double(num, callback) {
        console.log('in double function before callback');
        setTimeout( function(){
            console.log('After timeout');
          }, 500 );
        callback(num*2);
        console.log('in double function after callback');
    }

    console.log ('Step 2');
    double(8, function(result){
        setTimeout( function(){
            console.log ('callback');
          }, 500 );
        
    });
    console.log ('Step 3');
*/
});

// Route Files
let articles_routes = require('./routes/articles_routes');
let users_routes = require('./routes/users_routes');
app.use('/articles', articles_routes);
app.use('/users', users_routes);

// Start server
app.listen(properties.get('main.app.port'), function() {
    console.log('Server started on port ' + properties.get('main.app.port') + '...')
})