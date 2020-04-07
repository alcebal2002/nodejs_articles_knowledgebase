const LocalStrategy = require('passport-local').Strategy;
const User = require ('../models/user');
const bcrypt = require('bcryptjs');

// Load environment specific properties based on [env] startup parameter
// eg. npm start env=development or nodemon app.js env=development
const environment = require ('../config/environments');
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader(environment);

// Get the password for a Username from database
function getUserPassword(username, callback) {

    console.log('Getting password for user ' + username);
    
    db.query(properties.get('queries.users.getPassword'), [username], 
        function (err, result) {
            callback(err, result[0].user_password);
        }
    );
}

module.exports = function(passport) {
    // Local Strategy
    passport.use(new LocalStrategy(function(username, password, done) {
        // Match Username
        console.log('Matching Username...');
    
        db.query(properties.get('queries.users.matchUsername'), [username], function (err, result) {
                if (err) throw err;
                if (!result) {
                    return done(null, false, {message: 'User not found'});
                }
            }
        );                

        // Match Password
        console.log('Matching Password...');
/*
        getUserPassword (username, function (err, userPassword) {
            if (err) throw err;
            console.log ('The password is ' + userPassword);
            return userPassword;
        });
*/
        bcrypt.compare(password, 
            function() {
                console.log('Getting password for user ' + username);
                db.query(properties.get('queries.users.getPassword'), [username], 
                function (err, result) {
                    if (err) throw err;
                    return result[0].user_password;
                })
            },function(err, isMatch){
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Wrong password'});
                }
            }
        );
    }));

    passport.serializeUser (function(user, done) {
        done (null, user.id);
    });

    passport.deserializeUser (function (id, done) {
        User.findById (id, function (err, user) {
            done (err, user);
        });
    });
}