const express = require('express');
const router = express.Router();

var selectSingleUserQuery = "SELECT * FROM users WHERE id=?";
var insertUserQuery       = "INSERT INTO users (email, user_name, user_password) VALUES (?,?,?)";
var updateUserQuery       = "UPDATE users SET email=?, user_name=?, user_password=? WHERE id=?";
var deleteUserQuery       = "DELETE FROM users WHERE id=?";

// Get a single User (by Id) from database
function getSingleUSer(id, callback) {
    
    console.log('Showing details for User ' + id);
    
    db.query(selectSingleUSerQuery, [id], 
        function (err, result) {
            callback(err, JSON.parse(JSON.stringify(result)));
        }
    );    
}

// Insert new User into database
function insertUser(user) {

    console.log('Inserting new User...');
    
    db.query(insertUserQuery, [user.email, user.username, user.password], (err, results, fields) => {
        if (err) {
          return console.error(err.message);
        }
        // log result
        //console.log('Rows inserted [' + results.affectedRows + ']');
        if (results.affectedRows==1) {
            user.id = results.insertId;
            console.log('User inserted with id: ' + user.id);
        } else {
            console.log('Unable to insert User');
        }
    });
}

// Update the User (by Id) in the database
function updateUser(user) {
    
    console.log('Updating User ' + user.id + "...");

    db.query(updateUserQuery, [user.email, user.username, user.password, user.id], (err, results, fields) => {
        if (err) {
          return console.error(err.message);
        }
        // log result
        //console.log('Rows updated [' + results.affectedRows + ']');
        if (results.affectedRows==1) {
            console.log('User ' + user.id + " updated");
        } else {
            console.log('Unable to update User ' + user.id);
        }
      });
}

// Delete the User (by Id)
function deleteUser(id) {

    console.log('Deleting User ' + id + "...");
       
    db.query(deleteUserQuery, [id], (err, results, fields) => {
        if (err) {
          return console.error(err.message);
        }
        // log result
        console.log('Rows updated [' + results.affectedRows + ']');
        if (results.affectedRows==1) {
            console.log('User ' + id + " deleted");
        } else {
            console.log('Unable to delete User ' + id);
        }
      });
}

// Add User Route
router.get('/register', function (req, res) {
    res.render('register_user', {
        title: 'Register User'
    });
})

// Load Edit User form
router.get('/edit/:id', function(req, res) {
    
    //console.log ('Get details for user ' + req.params.id);
    getSingleUser(req.params.id, function (err, userResult){
        if (err) throw err;
        //console.log (userResult);
        res.render('edit_user', {
            title: 'Edit User', 
            user: userResult[0]
        });
     })
});

// Add Submit POST Route
router.post('/register', function(req,res) {

    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();

    // Get Errors
    let errors = req.validationErrors();

    if (errors) {
        res.render('register_user', {
            title: 'Register User',
            errors: errors
        });
    } else {
        let User = require ('../models/user');
        var user = new User(null, req.body.email, req.body.username, req.body.password);
     
        // Save the new user to database
        insertUser (user);
        req.flash('success', 'User added');
        res.redirect('/');
    }    
})

// Update Submit POST Route
router.post('/edit/:id', function(req,res) {
  
    let User = require ('../models/user');
    var user = new User(req.params.id, req.body.username, req.body.email, req.body.password);
    //console.log (user);
 
    // Update the user in the database
    updateUser (user);
    req.flash('success', 'User Updated');
    res.redirect('/');
})

// Delete User
router.delete('/:id', function(req,res){
    
    deleteUser(req.params.id);
    res.send('Success');
});

// Get Single User
router.get('/:id', function(req, res) {
    
    //console.log ('Get details for user ' + req.params.id);
    getSingleUser(req.params.id, function (err, userResult){
        if (err) throw err;
        //console.log (userResult);
        res.render('show_user', {
            title: 'Hello KnowledgeBase', 
            article: userResult[0]
        });
     })
});

module.exports = router;