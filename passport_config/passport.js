const LocalStrategy = require('passport-local').Strategy;
const User = require ('../models/user');
const bcrypt = require('bcryptjs');

// Load environment specific properties based on [env] startup parameter
// eg. npm start env=development or nodemon app.js env=development
const environment = require ('../config/environments');
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader(environment);

module.exports = function(passport) {
    // Local Strategy
    passport.use(new LocalStrategy(function(username, password, done) {
        // Match Username
        console.log('Matching Username [' + username + ']...');
    
        db.query(properties.get('queries.users.selectByUsername'), [username],  
            function (err, result) {
                if (err) throw err;
                if (!result.length > 0) {
                    console.log('Username [' + username + '] not found');
                    return done(null, false, {message: 'User not found'});
                } else {
                    console.log('Username [' + username + '] found');
                    var user = new User(result[0].id,
                        result[0].name,
                        result[0].email, 
                        result[0].username,
                        result[0].password);

                    // Match Password
                    console.log('Matching Password for [' + username + ']...');
                    bcrypt.compare(password, user.password,function(err, isMatch){
                        if (err) throw err;
                        if (isMatch) {
                            console.log('Password matched for [' + username + ']');
                            return done(null, user);
                        } else {
                            console.log('Password not matching for [' + username + ']');
                            return done(null, false, {message: 'Wrong password'});
                        }
                    });
                }
            }
        );
    }));

    passport.serializeUser (function(user, done) {
        done (null, user.id);
    });

    passport.deserializeUser (function (id, done) {
        db.query(properties.get('queries.users.selectById'), [id], 
            function (err, result) {
                if (err) return console.error(err.message);
                if (!result.length > 0) {
                    done(null, false, {message: 'Unable to get User [' + id + ']'});
                } else {
                    var user = new User(result[0].id,
                                        result[0].name,
                                        result[0].email, 
                                        result[0].username,
                                        result[0].password);
                    done (err, user);
                }
            }
        );
    });
}